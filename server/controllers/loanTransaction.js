import LoanTransactions from '../models/loanTransaction.js';
import Inventories from '../models/inventory.js';
import { getStaffs } from '../utils/getStaffs.js';
import { createNotification } from './notification.js';
import { sendMail } from '../utils/sendMail.js';
import { getUserById } from '../utils/getUserById.js';

const { CLIENT_URL } = process.env

// create loan transaction
export const createLoanTransaction = async (req, res) => {
    try {
        const { borrowed_item, purpose_of_loan, borrow_date, expected_return_date } = req.body;

        // Validasi input
        if (!borrowed_item || !Array.isArray(borrowed_item) || borrowed_item.length === 0 || !purpose_of_loan || !borrow_date || !expected_return_date) {
            return res.status(400).json({ message: "Please fill in all fields." });
        }

        // Handle borrow_date validation and formatting
        let formattedBorrowDate = new Date(borrow_date);
        let formattedReturnDate = new Date(expected_return_date);

        if (isNaN(formattedBorrowDate.getTime()) || isNaN(formattedReturnDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format." });
        }

        if (formattedReturnDate <= formattedBorrowDate) {
            return res.status(400).json({ message: "Return date must be after borrow date." });
        }

        const borrowedItems = [];

        // Validasi setiap item
        for (const item of borrowed_item) {
            const { inventory_id, quantity } = item;

            if (!inventory_id || !quantity || quantity <= 0 || typeof quantity !== 'number') {
                return res.status(400).json({ message: "Please specify a valid inventory_id and quantity for each item." });
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
                is_consumable: inventory.is_consumable
            });

            inventory.total_items -= quantity;
            await inventory.save();
        }

        const newLoanTransaction = await LoanTransactions.create({
            borrower_id: req.user._id,
            borrowed_item: borrowedItems,
            purpose_of_loan,
            borrow_date: formattedBorrowDate,
            expected_return_date: formattedReturnDate,
        });

        // send notification to staff 
        const staffMembers = await getStaffs(req);
        const staffIds = staffMembers.map(staff => staff._id);

        try {
            await createNotification(staffIds, newLoanTransaction._id, `Loan request from ${req.user.personal_info.name} with Transaction ID: ${newLoanTransaction._id} is pending approval.`);
        } catch (notificationError) {
            console.error(`Failed to create notification for staff members: ${notificationError.message}`);
        }

        // send email to specific user
        const staffEmails = staffMembers.map(staff => staff.personal_info.email)
        const url = `${CLIENT_URL}/user-loan/detail-loan/${newLoanTransaction._id}`
        const emailSubject = "New Loan Request Submitted"
        const emailTitle = "Loan Transaction Request Created"
        const emailText = `New Loan request from ${req.user.personal_info.name} with Transaction ID: ${newLoanTransaction._id} is pending approval.`
        const btnEmailText = "View Loan Item Details"

        sendMail(staffEmails, url, emailSubject, emailTitle, emailText, btnEmailText);

        res.json({ message: "Loan item created successfully.", newLoanTransaction });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// update loan status to ready to pickup
export const updateStatusToReadyToPickup = async (req, res) => {
    try {
        const loanTransactionId = req.params.id

        const loanTransaction = await LoanTransactions.findById(loanTransactionId)

        if (!loanTransaction) {
            return res.status(404).json({ message: "Loan transaction not found." });
        }

        if (loanTransaction.loan_status !== "Pending") {
            return res.status(400).json({ message: "Transaction is not in Pending status." });
        }

        // const inventory = await Inventories.findById(loanTransaction.borrower_id)

        await createNotification(loanTransaction.borrower_id, loanTransaction._id, `Your loan item with ID: ${loanTransaction._id} is ready to pickup. Please pick up your items by meeting with our staff.`);

        loanTransaction.loan_status = "Ready to Pickup";
        loanTransaction.staff_id = req.user._id;
        await loanTransaction.save();

        // send email to borrower
        const borrowerInfo = await getUserById(req, loanTransaction.borrower_id);
        const borrowerEmail = borrowerInfo.personal_info.email
        const url = `${CLIENT_URL}/user-loan/detail/${loanTransaction._id}`
        const emailSubject = "Your Loan is Ready to Pickup"
        const emailTitle = "Loan Item Ready for Pickup"
        const emailText = `Your loan item with ID: ${loanTransaction._id} is ready to pickup. Please pick up your items by meeting with our staff.`
        const btnEmailText = "View Loan Item Details"

        sendMail(borrowerEmail, url, emailSubject, emailTitle, emailText, btnEmailText);

        res.json({ message: "Loan status updated to ready to pickup.", loanTransaction });
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

        const loanTransaction = await LoanTransactions.findById(loanTransactionId);

        if (!loanTransaction) {
            return res.status(404).json({ message: "Loan transaction not found." });
        }

        if (loanTransaction.borrower_id.toString() !== userId) {
            return res.status(403).json({ message: "You are not allowed to cancel this transaction." });
        }

        if (loanTransaction.loan_status !== "Pending") {
            return res.status(400).json({ message: "Only pending transactions can be cancelled." });
        }

        for (const item of loanTransaction.borrowed_item) {
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
        await loanTransaction.save();

        // Send notification to all staff members
        const staffMembers = await getStaffs(req);
        const staffIds = staffMembers.map(staff => staff._id);

        const staffMessage = `Loan transaction with ID: ${loanTransaction._id} has been marked as "Cancelled" by ${req.user.personal_info.name}.`;

        try {
            // Send notification to staff members
            await createNotification(staffIds, loanTransaction._id, staffMessage);
        } catch (notificationError) {
            console.error(`Failed to create notification for staff members: ${notificationError.message}`);
        }

        res.json({ message: "Loan transaction has been cancelled.", loanTransaction });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// get all transactions
export const getAllLoanTransactions = async (req, res) => {
    try {
        const loanTransactions = await LoanTransactions.find()
            .populate('borrowed_item.inventory_id', 'asset_name asset_id serial_number')
            .exec();

        res.json({ loanTransactions });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// get loan transaction by ID
export const getLoanTransactionById = async (req, res) => {
    try {
        const loanTransaction = await LoanTransactions.findById(req.params.id)
            .populate('borrowed_item.inventory_id', 'asset_name asset_id serial_number')
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
            .populate('borrowed_item.inventory_id', 'asset_name asset_id serial_number')
            .exec();

        res.json({ loanTransactions });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


