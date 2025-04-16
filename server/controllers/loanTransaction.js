import LoanTransactions from '../models/loanTransaction.js';
import Inventories from '../models/inventory.js';
import Meetings from '../models/meeting.js';
import { getStaffs } from '../utils/getStaffs.js';
import { createNotification } from './notification.js';
import { sendMail } from '../utils/sendMail.js';
import { getUserById } from '../utils/getUserById.js';
import { getChannel } from '../utils/rabbitmq.js';

const { CLIENT_URL } = process.env

// generate unique transaction_id
const generateTransactionId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month
    const day = String(now.getDate()).padStart(2, '0'); // Ensure two-digit day
    const timeStamp = now.getTime(); // Milliseconds since epoch
    return `INV/${year}${month}${day}/BUI/SOCCA/${timeStamp}`;
}

// foramt date DD/MM/YYYY
export const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

// Function to group items by their program
export const groupItemsByProgram = (borrowedItems) => {
    return borrowedItems.reduce((acc, item) => {
        if (!acc[item.item_program]) {
            acc[item.item_program] = [];
        }
        acc[item.item_program].push(item);
        return acc;
    }, {});
};

// Function to get staff members based on item program
export const getStaffsForProgram = async (req, program) => {
    const staffMembers = await getStaffs(req);
    return staffMembers.filter(staff => staff.personal_info.program === program);
};

// Schedule job to auto-cancel
export const processAutoCancel = async (loanTransactionId) => {
    try {
        const loanTransaction = await LoanTransactions.findById(loanTransactionId)

        if (!loanTransaction) {
            console.error(`LoanTransaction ID: ${loanTransactionId} not found.`);
            return;
        }

        if (loanTransaction.loan_status !== "Ready to Pickup") {
            console.warn(`LoanTransaction ID: ${loanTransactionId} is not in 'Ready to Pickup' status.`);
            return;
        }

        const borrowedItems = loanTransaction.borrowed_item;

        for (const item of borrowedItems) {
            try {
                const inventory = await Inventories.findById(item.inventory_id)

                if (!inventory) {
                    console.warn(`Inventory item ${item.inventory_id} not found.`);
                    continue;
                }

                if (inventory.draft === true) {
                    console.warn(`Cannot cancel. Item ${inventory.asset_name} is in draft status.`);
                    return;
                }

                inventory.total_items += item.quantity;
                await inventory.save();
            } catch (error) {
                console.error(`Error updating inventory ${item.inventory_id}:`, error);
            }
        }

        loanTransaction.loan_status = "Cancelled";
        await loanTransaction.save();

        await createNotification(
            loanTransaction.borrower_id,
            loanTransaction._id,
            `Your loan transaction with ID: ${loanTransaction.transaction_id} has been cancelled due to no meeting request.`
        );
    } catch (error) {
        console.error("Critical error in auto-cancel process:", error);
    }
};

// create loan transaction
export const createLoanTransaction = async (req, res) => {
    try {
        const { borrowed_item, purpose_of_loan, borrow_date, expected_return_date } = req.body;

        // input validation
        if (!borrowed_item || !Array.isArray(borrowed_item) || borrowed_item.length === 0 || !purpose_of_loan || !borrow_date || !expected_return_date) {
            return res.status(400).json({ message: "Please fill in all fields." });
        }

        // Handle borrow_date validation and formatting
        let formattedBorrowDate = new Date(borrow_date);
        let formattedReturnDate = new Date(expected_return_date);
        let today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(formattedBorrowDate.getTime()) || isNaN(formattedReturnDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format." });
        }

        if (formattedBorrowDate < today) {
            return res.status(400).json({ message: "Borrow date cannot be earlier than today." });
        }

        if (formattedReturnDate <= formattedBorrowDate) {
            return res.status(400).json({ message: "Return date must be after borrow date." });
        }

        const borrowedItems = [];
        // const userData = req.userData

        // Validasi setiap item
        for (const item of borrowed_item) {
            const { inventory_id, quantity } = item;

            if (!inventory_id || !quantity || quantity <= 0 || typeof quantity !== 'number') {
                return res.status(400).json({ message: "Please specify a valid inventory_id and quantity for each item." });
            }

            if (quantity > 5) {
                return res.status(400).json({ message: `Sorry, The quantity for each item cannot exceed 5.` });
            }

            const inventory = await Inventories.findById(inventory_id);
            if (!inventory) {
                return res.status(404).json({ message: `Inventory not found for id: ${inventory_id}.` });
            }

            if (inventory.draft === true) {
                return res.status(400).json({ message: `Sorry, Inventory ${inventory.asset_name} is not ready to loan.` });
            }

            if (inventory.total_items <= 0) {
                return res.status(400).json({ message: `Sorry, item ${inventory.asset_name} is not available for loan.` });
            }

            if (inventory.total_items < quantity) {
                return res.status(400).json({ message: `Sorry, insufficient items available for loan for ${inventory.asset_name}.` });
            }

            borrowedItems.push({
                inventory_id,
                quantity,
                is_consumable: inventory.is_consumable,
                item_program: inventory.item_program
            });

            inventory.total_items -= quantity;
            await inventory.save();
        }

        // Group items by their program
        const itemsByProgram = groupItemsByProgram(borrowedItems);

        // Create separate loan transactions for each program group
        const loanTransactions = await Promise.all(
            Object.entries(itemsByProgram).map(async ([program, items]) => {
                // Generate unique transaction ID
                const transactionId = generateTransactionId();

                // send notification to staff based on their program 
                const staffMembers = await getStaffsForProgram(req, program);
                const staffIds = staffMembers.map(staff => staff._id);

                const newLoanTransaction = await LoanTransactions.create({
                    transaction_id: transactionId,
                    borrower_id: req.user._id,
                    borrowed_item: items,
                    purpose_of_loan,
                    borrow_date: formattedBorrowDate,
                    expected_return_date: formattedReturnDate,
                    is_new: true
                });

                try {
                    await createNotification(staffIds, newLoanTransaction._id, `Loan request from ${req.user.personal_info.name} with Transaction ID: ${transactionId} is pending approval.`);
                } catch (notificationError) {
                    console.error(`Failed to create notification for staff members: ${notificationError.message}`);
                }

                // send email to specific user
                // const staffEmails = staffMembers
                //     .filter(staff => staff.personal_info.program === program)
                //     .map(staff => staff.personal_info.email);

                // const url = `${CLIENT_URL}/user-loan/detail-loan/${newLoanTransaction._id}`
                // const emailSubject = "New Loan Request Submitted"
                // const emailTitle = "Loan Transaction Request Created"
                // const emailText = `New Loan request from ${req.user.personal_info.name} with Transaction ID: ${transactionId} is pending approval.`
                // const btnEmailText = "View Loan Item Details"

                // sendMail(staffEmails, url, emailSubject, emailTitle, emailText, btnEmailText);

                return newLoanTransaction;
            })
        );

        res.json({
            message: "Loan items created successfully.",
            loanTransactions
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// mark transaction is new or not
export const markTransactionIsNew = async (req, res) => {
    try {
        const loanTransactionId = req.params.id
        const loanTransaction = await LoanTransactions.findByIdAndUpdate(loanTransactionId, { is_new: false }, { new: true })

        if (!loanTransaction) {
            return res.status(404).json({ message: "Loan Transaction not found." })
        }

        res.json({ loanTransaction })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// update loan status to ready to pickup
export const updateStatusToReadyToPickup = async (req, res) => {
    try {
        const loanTransactionId = req.params.id

        const loanTransaction = await LoanTransactions.findOneAndUpdate(
            { _id: loanTransactionId, loan_status: "Pending" },
            {
                loan_status: "Ready to Pickup",
                staff_id: req.user._id,
                pickup_time: new Date()
            },
            { new: true }
        );

        if (!loanTransaction) {
            return res.status(404).json({ message: "Loan transaction not found or not in Pending status." });
        }
        // const inventory = await Inventories.findById(loanTransaction.borrower_id)

        // Calculate expiry date (pickup_time + 3 days)
        const expiryDate = new Date(loanTransaction.pickup_time);
        // expiryDate.setMinutes(expiryDate.getMinutes() + 2);
        expiryDate.setDate(expiryDate.getDate() + 3); // 3 days
        const formattedExpiryDate = formatDate(expiryDate);

        // send notification to borrower
        await createNotification(loanTransaction.borrower_id, loanTransaction._id, `Your loan item with ID: ${loanTransaction.transaction_id} is ready to pickup. Please create a request meeting with our staff to pickup your loan item before ${formattedExpiryDate}.`);

        // send email to borrower
        // const borrowerInfo = await getUserById(req, loanTransaction.borrower_id);
        // const borrowerEmail = borrowerInfo.personal_info.email
        // const url = `${CLIENT_URL}/user-loan/detail/${loanTransaction._id}`
        // const emailSubject = "Your Loan is Ready to Pickup"
        // const emailTitle = "Loan Item Ready for Pickup"
        // const emailText = `Your loan item with ID: ${loanTransaction.transaction_id} is ready to pickup. Please create a request meeting with our staff to pickup your loan item before ${formattedExpiryDate}.`
        // const btnEmailText = "View Loan Item Details"

        // sendMail(borrowerEmail, url, emailSubject, emailTitle, emailText, btnEmailText);

        res.json({ message: "Loan status updated to ready to pickup.", loanTransaction });

        // send message to rabbitMQ for auto-cancel scheduling
        const channel = getChannel();
        if (!channel) {
            console.error("RabbitMQ channel is not available.");
            return;
        }
        const queue = "loan_auto_cancel"
        const uniqueRoutingKey = `loan_auto_cancel_${loanTransactionId}`;
        const delay = 3 * 24 * 60 * 60 * 1000; // 3 days
        const expires = delay + (1 * 60 * 60 * 1000); // 3 days + 1 hour
        const message = JSON.stringify({ loanTransactionId })

        await channel.assertExchange("loan_dlx", "direct", { durable: true });

        await channel.assertQueue(queue, {
            durable: true,
        });

        await channel.assertQueue(uniqueRoutingKey, {
            durable: true,
            arguments: {
                "x-message-ttl": delay,
                "x-dead-letter-exchange": "loan_dlx",
                "x-dead-letter-routing-key": queue,
                "x-expires": expires
            },
        });

        await channel.bindQueue(queue, "loan_dlx", queue);

        await channel.sendToQueue(uniqueRoutingKey, Buffer.from(message), { persistent: true });

        // console.log(`Scheduled auto-cancel for Loan Transaction ID: ${loanTransactionId} in 3 days`);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// staff confirms the handover of loan items to the borrower
export const staffConfirmHandover = async (req, res) => {
    try {
        const loanTransactionId = req.params.id;
        const { checkedItemIds } = req.body;

        // Validate checklist input
        if (!checkedItemIds || !Array.isArray(checkedItemIds) || checkedItemIds.length === 0) {
            return res.status(400).json({ message: "Checklist item data is required and must be an array." });
        }

        const loanTransaction = await LoanTransactions.findById(loanTransactionId);

        if (!loanTransaction) {
            return res.status(404).json({ message: "Loan transaction not found." });
        }

        // Validate loan status
        if (loanTransaction.loan_status !== "Ready to Pickup") {
            return res.status(400).json({ message: `Current transaction status is "${loanTransaction.loan_status}", cannot proceed with handover confirmation.` });
        }

        if (loanTransaction.borrowed_confirmed_date_by_staff) {
            return res.status(400).json({ message: "Items have already been confirmed for handover by staff." });
        }

        // handover item checklist
        let allItemsChecked = true;
        const itemIdsInTransaction = loanTransaction.borrowed_item.map(item => item._id.toString());

        // validate if all checkedItemIds exist in the transaction
        for (const checkedId of checkedItemIds) {
            if (!itemIdsInTransaction.includes(checkedId)) {
                return res.status(400).json({ message: "Please check all the items on the loan list" });
            }
        }

        // mark checked items
        loanTransaction.borrowed_item.forEach(item => {
            if (checkedItemIds.includes(item._id.toString())) {
                item.staff_checked_handover = true;
            }
            // check if all items have been checked
            if (!item.staff_checked_handover) {
                allItemsChecked = false;
            }
        });

        // ensure all items in the transaction are checked before confirmation
        if (!allItemsChecked) {
            return res.status(400).json({
                message: "Not all items in this transaction have been checked for handover.",
            });
        }

        const staffInfo = await getUserById(req, req.user._id)
        const stafffName = staffInfo.personal_info.name

        // If all items are checked, update staff confirmation date
        loanTransaction.borrow_confirmed_date_by_staff = new Date();
        loanTransaction.borrow_confirmed_by = stafffName;
        await loanTransaction.save();

        return res.json({ loanTransaction })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// update loan status to borrowed
export const updateStatusToBorrowed = async (req, res) => {
    try {
        const loanTransactionId = req.params.id;

        const loanTransaction = await LoanTransactions.findById(loanTransactionId);

        if (!loanTransaction) {
            return res.status(404).json({ message: "Loan transaction not found." });
        }

        if (loanTransaction.loan_status !== "Ready to Pickup") {
            return res.status(400).json({ message: "Transaction is not in Ready to Pickup status." });
        }

        let allItemsConsumable = true;
        let hasConsumableItem = false;

        for (const item of loanTransaction.borrowed_item) {
            const inventory = await Inventories.findById(item.inventory_id);

            if (inventory.draft === true) {
                return res.status(400).json({ message: `Cannot borrow item ${inventory.asset_name}. Inventory is in draft status.` });
            }

            if (item.is_consumable) {
                hasConsumableItem = true;
            } else {
                allItemsConsumable = false;
            }

            // inventory.total_items -= item.quantity;
            await inventory.save();
        }

        if (allItemsConsumable) {
            loanTransaction.loan_status = "Consumed";
        } else if (hasConsumableItem) {
            loanTransaction.loan_status = "Partially Consumed";
        } else {
            loanTransaction.loan_status = "Borrowed";
        }

        loanTransaction.staff_id = req.user._id;
        await loanTransaction.save();

        // Determine the notification message based on the loan status
        let borrowerMessage;
        let staffMessage;

        switch (loanTransaction.loan_status) {
            case "Consumed":
                staffMessage = `Loan transaction with ID: ${loanTransaction._id} has been updated to "Consumed" by ${req.user.personal_info.name}. All items are consumable.`;
                borrowerMessage = `Your loan request with ID: ${loanTransaction._id} has been updated to "Consumed" by ${req.user.personal_info.name}. All items are consumable.`;
                break;
            case "Partially Consumed":
                staffMessage = `Loan transaction with ID: ${loanTransaction._id} has been updated to "Partially Consumed" by ${req.user.personal_info.name}. Some items are consumable.`;
                borrowerMessage = `Your loan request with ID: ${loanTransaction._id} has been updated to "Partially Consumed" by ${req.user.personal_info.name}. Some items are consumable.`;
                break;
            case "Borrowed":
                staffMessage = `Loan transaction with ID: ${loanTransaction._id} has been updated to "Borrowed" by ${req.user.personal_info.name}.`;
                borrowerMessage = `Your Loan request with ID: ${loanTransaction._id} has been updated to "Borrowed" by ${req.user.personal_info.name}. All items are available for borrowing.`;
                break;
            default:
                borrowerMessage = `Your loan request with ID: ${loanTransaction._id} status has been updated.`;
                staffMessage = `Loan transaction with ID: ${loanTransaction._id} status has been updated.`;
        }

        // Send notification to user (borrower)
        try {
            await createNotification([loanTransaction.borrower_id], loanTransaction._id, borrowerMessage);
        } catch (notificationError) {
            console.error(`Failed to create notification for borrower: ${notificationError.message}`);
        }

        const staffMembers = await getStaffs(req);
        const staffIds = staffMembers.map(staff => staff._id);

        try {
            // Send notification to staff members
            await createNotification(staffIds, loanTransaction._id, staffMessage);
        } catch (notificationError) {
            console.error(`Failed to create notification for staff members: ${notificationError.message}`);
        }

        // send email notification to borrower
        const borrowerInfo = await getUserById(req, loanTransaction.borrower_id);
        const borrowerEmail = borrowerInfo.personal_info.email
        const url = `${CLIENT_URL}/user-loan/detail/${loanTransaction._id}`
        const emailSubject = "Your Loan status updated"
        const emailTitle = "Loan Item is updated"
        const emailText = `Hi ${borrowerInfo.personal_info.name}, Have you received your loan item with transaction ID: ${loanTransaction._id} from our staff? Please confirm through the link below. 😊👇`
        const btnEmailText = "Confirm loan item"

        sendMail(borrowerEmail, url, emailSubject, emailTitle, emailText, btnEmailText);

        res.json({ message: "Loan status updated and ready to borrow", loanTransaction });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// confirm borrowed loan item by borrower
export const confirmReceiveByBorrower = async (req, res) => {
    try {
        const loanTransactionId = req.params.id
        const { item_received } = req.body; //boolean
        const loanTransaction = await LoanTransactions.findById(loanTransactionId)

        if (!loanTransaction) {
            return res.status(404).json({ message: "Loan transaction not found." });
        }

        if (loanTransaction.loan_status !== "Borrowed" && loanTransaction.loan_status !== "Partially Consumed" && loanTransaction.loan_status !== "Consumed") {
            return res.status(400).json({ message: "Transaction is not in Borrowed/Consumed/Partially Consumed status. Please contact our staff." });
        }

        if (loanTransaction.borrower_confirmed_date) {
            return res.status(400).json({ message: "You have already confirmed the receipt of your loan items." });
        }

        // Get borrower and staff details
        const borrowerInfo = await getUserById(req, loanTransaction.borrower_id);
        const borrowerEmail = borrowerInfo.personal_info.email

        const staffMembers = await getStaffs(req);
        const staffIds = staffMembers.map(staff => staff._id);

        const url = `${CLIENT_URL}/user-loan/detail/${loanTransaction._id}`

        if (item_received) {
            loanTransaction.borrower_confirmed_date = new Date()
            await loanTransaction.save()

            // send notification to borrower
            await createNotification([loanTransaction.borrower_id], loanTransaction._id, `Hi ${borrowerInfo.personal_info.name}, Your loan transaction with ID: ${loanTransaction._id} has already confirmed at ${new Date(loanTransaction.borrower_confirmed_date).toLocaleString()}.`)

            // send email notification to borrower (received)
            const emailSubject = "Loan Item Confirmation Updated"
            const emailTitle = "Your loan item has already confirmed"
            const emailText = `Hi ${borrowerInfo.personal_info.name}, Loan transaction ID: ${loanTransaction._id} has been confirmed as received at ${new Date(loanTransaction.borrower_confirmed_date).toLocaleString()}.`
            const btnEmailText = "View Loan Item Details"

            sendMail(borrowerEmail, url, emailSubject, emailTitle, emailText, btnEmailText)

            // send notification to staff (received)
            await createNotification(staffIds, loanTransaction._id, `Loan Transaction with ID: ${loanTransaction.id} has already confirmed by ${borrowerInfo.personal_info.name} at ${new Date(loanTransaction.borrower_confirmed_date).toLocaleString()}.`);

            return res.status(200).json({
                message: "Loan items successfully confirmed as received by borrower.",
                loanTransaction
            });
        } else {
            loanTransaction.loan_status = "Ready to Pickup";
            loanTransaction.borrower_confirmed_date = null;

            await loanTransaction.save();

            // send notification to borrower (not received)
            await createNotification([loanTransaction.borrower_id], loanTransaction._id, `Hi ${borrowerInfo.personal_info.name}, You have confirmed that you have not received the loan item with transaction ID: ${loanTransaction._id}. Please confirm again with our staff.`)

            // send email notification to borrower (not received)
            const emailSubject = "Loan Item Not Received"
            const emailTitle = "Loan Item Not Received"
            const emailText = `Hi ${borrowerInfo.personal_info.name}, Your Loan transaction ID: ${loanTransaction._id} is marked as not received. Please check the loan transaction or contact our staff.`
            const btnEmailText = "View Loan Item Details"

            sendMail(borrowerEmail, url, emailSubject, emailTitle, emailText, btnEmailText)

            // send notification to staff (not received)
            await createNotification(staffIds, loanTransaction._id, `Loan Transaction by ${borrowerInfo.personal_info.name} with ID: ${loanTransaction.id} is marked as 'not received'. Loan status set back to 'Ready to Pickup'.`);

            return res.status(200).json({
                message: "Loan items are not received. Loan status set back to 'Ready to Pickup'.",
                loanTransaction
            });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const confirmReturnedByBorrower = async (req, res) => {
    try {
        const loanTransactionId = req.params.id
        const { item_returned } = req.body; //boolean
        const loanTransaction = await LoanTransactions.findById(loanTransactionId)

        if (!loanTransaction) {
            return res.status(404).json({ message: "Loan transaction not found." });
        }

        if (loanTransaction.loan_status !== "Returned") {
            return res.status(400).json({ message: "Transaction is not in Returned status. Please contact our staff." });
        }

        if (loanTransaction.return_date) {
            return res.status(400).json({ message: "You have already confirmed returned to the loan item." })
        }

        // Get borrower and staff details
        const borrowerInfo = await getUserById(req, loanTransaction.borrower_id);
        const borrowerEmail = borrowerInfo.personal_info.email

        const staffMembers = await getStaffs(req);
        const staffIds = staffMembers.map(staff => staff._id);

        const url = `${CLIENT_URL}/user-loan/detail/${loanTransaction._id}`

        if (item_returned) {
            loanTransaction.return_date = new Date();
            await loanTransaction.save();

            // send notification to borrower
            await createNotification([loanTransaction.borrower_id], loanTransaction._id, `Hi ${borrowerInfo.personal_info.name}, Your loan transaction with ID: ${loanTransaction._id} has already confirmed as "Returned" at ${new Date(loanTransaction.borrower_confirmed_date).toLocaleString()}.`)

            // send email notification to borrower (received)
            const emailSubject = "Loan Item Update to Returned"
            const emailTitle = "Your loan item has already returned"
            const emailText = `Hi ${borrowerInfo.personal_info.name}, Loan transaction ID: ${loanTransaction._id} has been confirmed as 'Returned' at ${loanTransaction.borrower_confirmed_date}. If you want to borrow the item again, please visit our website. Thank you 😃👍.`
            const btnEmailText = "View Loan Item Details"

            sendMail(borrowerEmail, url, emailSubject, emailTitle, emailText, btnEmailText)

            // send notification to staff (received)
            await createNotification(staffIds, loanTransaction._id, `Loan Transaction with ID: ${loanTransaction.id} has already confirmed as 'Returned' by ${borrowerInfo.personal_info.name} at ${new Date(loanTransaction.borrower_confirmed_date).toLocaleString()}.`);

            return res.status(200).json({
                message: "Loan items successfully confirmed as Returned by borrower.",
                loanTransaction
            });
        } else {
            let allItemsConsumable = true;
            let hasConsumableItem = false;

            for (const item of loanTransaction.borrowed_item) {
                const inventory = await Inventories.findById(item.inventory_id);

                if (item.is_consumable) {
                    hasConsumableItem = true;
                } else {
                    allItemsConsumable = false;
                }

                inventory.total_items -= item.quantity;
                await inventory.save();
            }

            if (allItemsConsumable) {
                loanTransaction.loan_status = "Consumed";
            } else if (hasConsumableItem) {
                loanTransaction.loan_status = "Partially Consumed";
            } else {
                loanTransaction.loan_status = "Borrowed";
            }

            loanTransaction.return_date = null;
            await loanTransaction.save();

            // send notification to borrower (not received)
            await createNotification([loanTransaction.borrower_id], loanTransaction._id, `Hi ${borrowerInfo.personal_info.name}, You have confirmed that you have not returned the loan item with transaction ID: ${loanTransaction._id}.`)

            // send email notification to borrower (not received)
            const emailSubject = "Loan Item Not Returned"
            const emailTitle = "Loan Item Not Returned by borrower"
            const emailText = `Hi ${borrowerInfo.personal_info.name}, Your Loan transaction ID: ${loanTransaction._id} is marked as not returned. Please check the loan transaction or contact our staff.`
            const btnEmailText = "View Loan Item Details"

            sendMail(borrowerEmail, url, emailSubject, emailTitle, emailText, btnEmailText)

            // send notification to staff (not received)
            await createNotification(staffIds, loanTransaction._id, `Loan Transaction by ${borrowerInfo.personal_info.name} with ID: ${loanTransaction.id} is marked as 'not returned'. Loan status set back to ${loanTransaction.loan_status}.`);

            return res.status(200).json({
                message: `Loan items are not confirmed. Loan status set back to ${loanTransaction.loan_status}.`,
                loanTransaction
            });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// update loan status to returned
export const updateStatusToReturned = async (req, res) => {
    try {
        const loanTransactionId = req.params.id;
        const loanTransaction = await LoanTransactions.findById(loanTransactionId);

        if (!loanTransaction) {
            return res.status(404).json({ message: "Loan transaction not found." });
        }

        if (loanTransaction.loan_status !== "Borrowed" && loanTransaction.loan_status !== "Partially Consumed") {
            return res.status(400).json({ message: "Transaction is not in a valid status to be returned." });
        }

        if (loanTransaction.loan_status === "Returned") {
            return res.status(400).json({ message: "You have already changed the loan status to Returned" })
        }

        if (loanTransaction.borrower_confirmed_date === null) {
            return res.status(400).json({ message: "Borrower must confirm the loan item first." });
        }

        // Restore inventory for each item in the loan
        for (const item of loanTransaction.borrowed_item) {
            const inventory = await Inventories.findById(item.inventory_id);
            inventory.total_items += item.quantity;
            await inventory.save();
        }

        loanTransaction.loan_status = "Returned";
        loanTransaction.staff_id = req.user._id;

        await loanTransaction.save();

        // Define notification messages
        const borrowerMessage = `Your loan with ID: ${loanTransaction._id} has been updated to "Returned" by ${req.user.personal_info.name}.`;
        const staffMessage = `Loan transaction with ID: ${loanTransaction._id} has been marked as "Returned" by ${req.user.personal_info.name}.`;

        // Send notification to borrower
        try {
            await createNotification([loanTransaction.borrower_id], loanTransaction._id, borrowerMessage);
        } catch (notificationError) {
            console.error(`Failed to create notification for borrower: ${notificationError.message}`);
        }

        // Send notification to all staff members
        const staffMembers = await getStaffs(req);
        const staffIds = staffMembers.map(staff => staff._id);

        try {
            // Send notification to staff members
            await createNotification(staffIds, loanTransaction._id, staffMessage);
        } catch (notificationError) {
            console.error(`Failed to create notification for staff members: ${notificationError.message}`);
        }

        res.json({ message: "Loan status updated to returned.", loanTransaction });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// cancel loan transaction
export const cancelLoanTransaction = async (req, res) => {
    try {
        const loanTransactionId = req.params.id;
        const userId = req.user._id;
        const { cancelation_reason } = req.body;

        if (!cancelation_reason || cancelation_reason.trim() === "") {
            return res.status(400).json({ message: "Cancelation reason is required." });
        }

        const loanTransaction = await LoanTransactions.findById(loanTransactionId)

        if (!loanTransaction) {
            return res.status(404).json({ message: "Loan transaction not found." });
        }

        if (loanTransaction.borrower_id.toString() !== userId) {
            return res.status(403).json({ message: "You are not allowed to cancel this transaction." });
        }

        if (!["Pending", "Ready to Pickup"].includes(loanTransaction.loan_status)) {
            return res.status(400).json({ message: "Transaction cannot be cancelled." });
        }

        const borrowedItems = loanTransaction.borrowed_item;

        for (const item of borrowedItems) {
            const inventory = await Inventories.findById(item.inventory_id);

            if (!inventory) {
                return res.status(404).json({ message: `Inventory item ${item.inventory_id} not found.` });
            }

            if (inventory.draft === true) {
                return res.status(400).json({ message: `Cannot cancel. Item ${inventory.asset_name} is in draft status.` });
            }

            inventory.total_items += item.quantity;
            await inventory.save();
        }

        loanTransaction.loan_status = "Cancelled";
        loanTransaction.cancelation_reason = cancelation_reason;
        await loanTransaction.save();

        const meeting = await Meetings.findOne({ loanTransaction_id: loanTransactionId });

        if (meeting) {
            meeting.status = "Meeting Cancelled";
            await meeting.save();
        }

        const itemsByProgram = groupItemsByProgram(borrowedItems);

        // Notify staff based on the program of the borrowed items
        const staffNotificationPromises = Object.entries(itemsByProgram).map(async ([program, items]) => {
            const staffMembers = await getStaffsForProgram(req, program);
            const staffIds = staffMembers.map(staff => staff._id);

            const staffMessage = `Loan transaction with ID: ${loanTransaction.transaction_id} has been marked as "Cancelled" by ${req.user.personal_info.name}.`;

            try {
                // Send notification to staff members based on their program
                await createNotification(staffIds, loanTransaction._id, staffMessage);
            } catch (notificationError) {
                console.error(`Failed to create notification for staff members: ${notificationError.message}`);
            }
        });

        // Wait for all notification promises to complete
        await Promise.all(staffNotificationPromises);

        // stop auto-cancel in rabbitMQ
        const uniqueRoutingKey = `loan_auto_cancel_${loanTransactionId}`;
        const channel = getChannel();
        if (!channel) {
            console.error("RabbitMQ channel is not available.");
            return;
        }

        if (channel) {
            await channel.deleteQueue(uniqueRoutingKey);
            console.log(`Auto-cancel stopped for Loan Transaction ID: ${loanTransactionId}`);
        }

        res.json({ message: "Loan transaction has been cancelled.", loanTransaction, ...(meeting && { meeting }), });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// get all transactions
export const getAllLoanTransactions = async (req, res) => {
    try {
        const userData = req.userData;
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        let sort = req.query.sort || "borrow_date";
        let loan_status = req.query.loanStatus || "All";
        let { borrow_date_start, borrow_date_end } = req.query

        const query = {
            "borrowed_item.item_program": userData.personal_info.program
        };

        // Apply search filter (transaction_id, loan_status, or borrowed item name)
        if (search) {
            query["$or"] = [
                { "transaction_id": { $regex: search, $options: "i" } },
                { "loan_status": { $regex: search, $options: "i" } },
                { "borrowed_item.inventory_id.asset_name": { $regex: search, $options: "i" } }
            ];
        }

        // Filter by loan_status
        const validLoanStatuses = ["Pending", "Ready to Pickup", "Borrowed", "Partially Consumed", "Consumed", "Returned", "Cancelled"];

        if (loan_status !== "All") {
            loan_status = loan_status.split(",")
            query["loan_status"] = { $in: loan_status };
        }

        // Filter by borrow_date range
        if (borrow_date_start || borrow_date_end) {
            query["borrow_date"] = {};
            if (borrow_date_start) query["borrow_date"].$gte = new Date(borrow_date_start);
            if (borrow_date_end) query["borrow_date"].$lte = new Date(borrow_date_end);
        }

        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

        let sortBy = {};
        sortBy[sort[0]] = sort[1] ? sort[1] : "desc";

        // Get total count for pagination
        const totalLoans = await LoanTransactions.countDocuments(query);

        const loanTransactions = await LoanTransactions.find(query)
            .populate('borrowed_item.inventory_id', '_id asset_name asset_id serial_number asset_img')
            .sort(sortBy)
            .skip(page * limit)
            .limit(limit)
            .lean()
            .exec();

        res.json({
            totalLoans,
            totalPages: Math.ceil(totalLoans / limit),
            page: page + 1,
            limit,
            loan_statuses: validLoanStatuses,
            loanTransactions
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// get loan transaction by ID
export const getLoanTransactionById = async (req, res) => {
    try {
        const loanTransaction = await LoanTransactions.findById(req.params.id)
            .populate('borrowed_item.inventory_id', '_id asset_name asset_id serial_number asset_img')
            .lean()
            .exec()

        if (!loanTransaction) {
            return res.status(404).json({ message: "Loan Transaction not found" })
        }

        res.json(loanTransaction)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// get transactions by user
export const getLoanTransactionsByUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const loanTransactions = await LoanTransactions.find({ borrower_id: userId })
            .populate('borrowed_item.inventory_id', '_id asset_name asset_id serial_number asset_img')
            .lean()
            .exec()

        res.json({ loanTransactions });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


