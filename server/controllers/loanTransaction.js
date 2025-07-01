import LoanTransactions from "../models/loanTransaction.js";
import Inventories from "../models/inventory.js";
import Meetings from "../models/meeting.js";
import { getStaffs } from "../utils/getStaffs.js";
import { createNotification } from "./notification.js";
import { sendMail } from "../utils/sendMail.js";
import { getUserById } from "../utils/getUserById.js";
import { getChannel } from "../utils/rabbitmq.js";

const { CLIENT_URL } = process.env;

// generate unique transaction_id
const generateTransactionId = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Ensure two-digit month
  const day = String(now.getDate()).padStart(2, "0"); // Ensure two-digit day
  const timeStamp = now.getTime(); // Milliseconds since epoch
  return `INV/${year}${month}${day}/BUI/SOCCA/${timeStamp}`;
};

// foramt date DD/MM/YYYY
export const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
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
  return staffMembers.filter((staff) => staff.personal_info.program === program);
};

// Schedule job to auto-cancel
export const processAutoCancel = async (loanTransactionId) => {
  try {
    const loanTransaction = await LoanTransactions.findById(loanTransactionId);

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
        const inventory = await Inventories.findById(item.inventory_id);

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

    // create notification for borrower
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
    if (
      !borrowed_item ||
      !Array.isArray(borrowed_item) ||
      borrowed_item.length === 0 ||
      !purpose_of_loan ||
      !borrow_date ||
      !expected_return_date
    ) {
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

      if (!inventory_id || !quantity || quantity <= 0 || typeof quantity !== "number") {
        return res
          .status(400)
          .json({ message: "Please specify a valid inventory_id and quantity for each item." });
      }

      if (quantity > 5) {
        return res
          .status(400)
          .json({ message: `Sorry, The quantity for each item cannot exceed 5.` });
      }

      const inventory = await Inventories.findById(inventory_id);
      if (!inventory) {
        return res.status(404).json({ message: `Inventory not found for id: ${inventory_id}.` });
      }

      if (inventory.draft === true) {
        return res
          .status(400)
          .json({ message: `Sorry, Inventory ${inventory.asset_name} is not ready to loan.` });
      }

      if (inventory.total_items <= 0) {
        return res
          .status(400)
          .json({ message: `Sorry, item ${inventory.asset_name} is not available for loan.` });
      }

      if (inventory.total_items < quantity) {
        return res.status(400).json({
          message: `Sorry, insufficient items available for loan for ${inventory.asset_name}.`,
        });
      }

      borrowedItems.push({
        inventory_id,
        quantity,
        is_consumable: inventory.is_consumable,
        item_program: inventory.item_program,
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
        const staffIds = staffMembers.map((staff) => staff._id);

        const newLoanTransaction = await LoanTransactions.create({
          transaction_id: transactionId,
          borrower_id: req.user._id,
          borrowed_item: items,
          purpose_of_loan,
          borrow_date: formattedBorrowDate,
          expected_return_date: formattedReturnDate,
          is_new: true,
        });

        try {
          await createNotification(
            staffIds,
            newLoanTransaction._id,
            `Loan request from ${req.user.personal_info.name} with Transaction ID: ${transactionId} is pending approval.`
          );
        } catch (notificationError) {
          console.error(
            `Failed to create notification for staff members: ${notificationError.message}`
          );
        }

        // send email to specific user
        const staffEmails = staffMembers
          .filter((staff) => staff.personal_info.program === program)
          .map((staff) => staff.personal_info.email);

        const url = `${CLIENT_URL}/user-loan/detail-loan/${newLoanTransaction._id}`;
        const emailSubject = "New Loan Request Submitted";
        const emailTitle = "Loan Transaction Request Created";
        const emailText = `New Loan request from ${req.user.personal_info.name} with Transaction ID: ${transactionId} is pending approval.`;
        const btnEmailText = "View Loan Item Details";

        sendMail(staffEmails, url, emailSubject, emailTitle, emailText, btnEmailText);

        return newLoanTransaction;
      })
    );

    res.json({
      message: "Loan items created successfully.",
      loanTransactions,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// mark transaction is new or not
export const markTransactionIsNew = async (req, res) => {
  try {
    const loanTransactionId = req.params.id;
    const loanTransaction = await LoanTransactions.findByIdAndUpdate(
      loanTransactionId,
      { is_new: false },
      { new: true }
    );

    if (!loanTransaction) {
      return res.status(404).json({ message: "Loan Transaction not found." });
    }

    res.json({ loanTransaction });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// update loan status to ready to pickup
export const updateStatusToReadyToPickup = async (req, res) => {
  try {
    const loanTransactionId = req.params.id;

    const loanTransaction = await LoanTransactions.findOneAndUpdate(
      { _id: loanTransactionId, loan_status: "Pending" },
      {
        loan_status: "Ready to Pickup",
        staff_id: req.user._id,
        pickup_time: new Date(),
      },
      { new: true }
    );

    if (!loanTransaction) {
      return res
        .status(404)
        .json({ message: "Loan transaction not found or not in Pending status." });
    }
    // const inventory = await Inventories.findById(loanTransaction.borrower_id)

    // Calculate expiry date (pickup_time + 3 days)
    const expiryDate = new Date(loanTransaction.pickup_time);
    // expiryDate.setMinutes(expiryDate.getMinutes() + 2);
    expiryDate.setDate(expiryDate.getDate() + 3); // 3 days
    const formattedExpiryDate = formatDate(expiryDate);

    // send notification to borrower
    await createNotification(
      loanTransaction.borrower_id,
      loanTransaction._id,
      `Your loan item with ID: ${loanTransaction.transaction_id} is ready to pickup. Please create a request meeting with our staff to pickup your loan item before ${formattedExpiryDate}.`
    );

    // send email to borrower
    const borrowerInfo = await getUserById(req, loanTransaction.borrower_id);
    const borrowerEmail = borrowerInfo.personal_info.email;
    const url = `${CLIENT_URL}/user-loan/detail/${loanTransaction._id}`;
    const emailSubject = "Your Loan is Ready to Pickup";
    const emailTitle = "Loan Item Ready for Pickup";
    const emailText = `Your loan item with ID: ${loanTransaction.transaction_id} is ready to pickup. Please create a request meeting with our staff to pickup your loan item before ${formattedExpiryDate}.`;
    const btnEmailText = "View Loan Item Details";

    sendMail(borrowerEmail, url, emailSubject, emailTitle, emailText, btnEmailText);

    res.json({ message: "Loan status updated to ready to pickup.", loanTransaction });

    // send message to rabbitMQ for auto-cancel scheduling
    const channel = getChannel();
    if (!channel) {
      console.error("RabbitMQ channel is not available.");
      return;
    }
    const queue = "loan_auto_cancel";
    const uniqueRoutingKey = `loan_auto_cancel_${loanTransactionId}`;
    const delay = 3 * 24 * 60 * 60 * 1000; // 3 days
    const expires = delay + 1 * 60 * 60 * 1000; // 3 days + 1 hour
    const message = JSON.stringify({ loanTransactionId });

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
        "x-expires": expires,
      },
    });

    await channel.bindQueue(queue, "loan_dlx", queue);

    await channel.sendToQueue(uniqueRoutingKey, Buffer.from(message), { persistent: true });

    // console.log(`Scheduled auto-cancel for Loan Transaction ID: ${loanTransactionId} in 3 days`);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// staff confirms the handover of loan items to the borrower
export const staffConfirmHandover = async (req, res) => {
  try {
    const loanTransactionId = req.params.id;
    const { checkedItemIds } = req.body;

    // Validate checklist input
    if (!checkedItemIds || !Array.isArray(checkedItemIds) || checkedItemIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Checklist item data is required and must be an array." });
    }

    const loanTransaction = await LoanTransactions.findById(loanTransactionId);

    if (!loanTransaction) {
      return res.status(404).json({ message: "Loan transaction not found." });
    }

    // Validate loan status
    if (loanTransaction.loan_status !== "Ready to Pickup") {
      return res.status(400).json({
        message: `Current transaction status is "${loanTransaction.loan_status}", cannot proceed with handover confirmation.`,
      });
    }

    if (loanTransaction.borrowed_confirmed_date_by_staff) {
      return res
        .status(400)
        .json({ message: "Items have already been confirmed for handover by staff." });
    }

    // handover item checklist
    const borrowedItems = Array.isArray(loanTransaction.borrowed_item)
      ? loanTransaction.borrowed_item
      : [];
    const itemIdsInTransaction = borrowedItems.map((item) => item._id.toString());
    let allItemsChecked = true;

    // validate if all checkedItemIds exist in the transaction
    for (const checkedId of checkedItemIds) {
      if (!itemIdsInTransaction.includes(checkedId)) {
        return res.status(400).json({ message: "Please check all the items on the loan list" });
      }
    }

    // mark checked items
    loanTransaction.borrowed_item.forEach((item) => {
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

    const staffInfo = await getUserById(req, req.user._id);
    const stafffEmail = staffInfo.personal_info.email;

    // If all items are checked, update staff confirmation date
    loanTransaction.borrow_confirmed_date_by_staff = new Date();
    loanTransaction.borrow_confirmed_by = stafffEmail;
    await loanTransaction.save();

    return res.json({ loanTransaction });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// borrower confirms the loan items (update loan status to borrowed)
export const userConfirmReceipt = async (req, res) => {
  try {
    const loanTransactionId = req.params.id;

    const loanTransaction = await LoanTransactions.findById(loanTransactionId);

    if (!loanTransaction) {
      return res.status(404).json({ message: "Loan transaction not found." });
    }

    if (loanTransaction.loan_status !== "Ready to Pickup") {
      return res.status(400).json({
        message: `Current transaction status is "${loanTransaction.loan_status}", cannot confirm receipt.`,
      });
    }

    if (!loanTransaction.borrow_confirmed_date_by_staff) {
      return res.status(400).json({
        message:
          "Staff has not yet confirmed loan item handover. Please wait for staff confirmation",
      });
    }

    if (loanTransaction.borrow_confirmed_date_by_user) {
      return res
        .status(400)
        .json({ message: "You have already confirmed receipt of these loan items." });
    }

    const borrowedItems = Array.isArray(loanTransaction.borrowed_item)
      ? loanTransaction.borrowed_item
      : [];
    const isHandoverChecklistComplete = borrowedItems.every(
      (item) => item.staff_checked_handover === true
    );
    if (!isHandoverChecklistComplete) {
      return res.status(400).json({
        message: "Staff handover checklist is incomplete. Cannot proceed with confirmation.",
      });
    }

    let allItemsConsumable = true;
    let hasConsumableItem = false;

    for (const item of loanTransaction.borrowed_item) {
      const inventory = await Inventories.findById(item.inventory_id);

      if (inventory.draft === true) {
        return res.status(400).json({
          message: `Cannot borrow item ${inventory.asset_name}. Inventory is in draft status.`,
        });
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

    loanTransaction.borrow_confirmed_date_by_user = new Date();
    await loanTransaction.save();

    // Determine the notification message based on the loan status
    let borrowerMessage;
    let staffMessage;

    switch (loanTransaction.loan_status) {
      case "Consumed":
        staffMessage = `The loan item with transaction iD: ${loanTransaction.transaction_id} has been successfully confirmed and received by the borrower. Loan transaction updated to "Consumed" by ${req.user.personal_info.name}. All items are consumable.`;
        borrowerMessage = `The loan transaction has been successfully received. Your loan request with ID: ${loanTransaction.transaction_id} has been updated to "Consumed". All items are consumable.`;
        break;
      case "Partially Consumed":
        staffMessage = `The loan item with transaction iD: ${loanTransaction.transaction_id} has been successfully confirmed and received by the borrower. Loan transaction updated to "Partially Consumed" by ${req.user.personal_info.name}. Some items are consumable.`;
        borrowerMessage = `The loan transaction has been successfully received. Your loan request with ID: ${loanTransaction.transaction_id} has been updated to "Partially Consumed". Some items are consumable.`;
        break;
      case "Borrowed":
        staffMessage = `The loan item with transaction iD: ${loanTransaction.transaction_id} has been successfully confirmed and received by the borrower. Loan transaction updated to "Borrowed" by ${req.user.personal_info.name}.`;
        borrowerMessage = `The loan transaction has been successfully received. Your Loan request with ID: ${loanTransaction.transaction_id} has been updated to "Borrowed".`;
        break;
      default:
        borrowerMessage = `Your loan request with ID: ${loanTransaction.transaction_id} status has been updated.`;
        staffMessage = `Loan transaction with ID: ${loanTransaction.transaction_id} status has been updated.`;
    }

    // send notification to user staff by program
    const itemsByProgram = groupItemsByProgram(borrowedItems);

    const staffNotificationPromises = Object.entries(itemsByProgram).map(
      async ([program, items]) => {
        const staffMembers = await getStaffsForProgram(req, program);
        const staffIds = staffMembers.map((staff) => staff._id);

        try {
          // Send notification to staff members based on their program
          await createNotification(staffIds, loanTransaction._id, staffMessage);
        } catch (notificationError) {
          console.error(
            `Failed to create notification for staff members: ${notificationError.message}`
          );
        }
      }
    );

    // Wait for all notification promises to complete
    await Promise.all(staffNotificationPromises);

    // Send notification to borrower
    try {
      await createNotification([loanTransaction.borrower_id], loanTransaction._id, borrowerMessage);
    } catch (notificationError) {
      console.error(`Failed to create notification for borrower: ${notificationError.message}`);
    }

    // send email notification to borrower
    const borrowerInfo = await getUserById(req, loanTransaction.borrower_id);
    const borrowerEmail = borrowerInfo.personal_info.email;
    const url = `${CLIENT_URL}/user-loan/detail/${loanTransaction._id}`;
    const emailSubject = "loan Item Receipt";
    const emailTitle = "Loan Item Successfully Borrowed";
    const btnEmailText = "Your Loan Item Detail";

    if (loanTransaction.loan_status === "Consumed") {
      const emailText = `Hi ${borrowerInfo.personal_info.name}, the loan transaction has been successfully received. Your loan item status with ID: ${loanTransaction.transaction_id} is "Consumed", So, you don't need to returned that item. Thank you for borrowing the loan items through inventorCS.`;

      sendMail(borrowerEmail, url, emailSubject, emailTitle, emailText, btnEmailText);
    } else {
      const emailText = `Hi ${borrowerInfo.personal_info.name}, You have successfully borrowed the loan item (${loanTransaction.transaction_id}). Please view the loan item details through the link below. 😊👇`;

      sendMail(borrowerEmail, url, emailSubject, emailTitle, emailText, btnEmailText);
    }

    res.json({ message: "Confirmation of receiving loan item successfully.", loanTransaction });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// staff confirms receiving the returned item
export const staffConfirmReturn = async (req, res) => {
  try {
    const loanTransactionId = req.params.id;
    const { checkedReturnedItemIds, loan_note } = req.body;

    // validate checklist input
    if (checkedReturnedItemIds && !Array.isArray(checkedReturnedItemIds)) {
      return res
        .status(400)
        .json({ message: "Return checklist data must be an array if provided." });
    }

    if (!loan_note) {
      return res.status(400).json({ message: "Loan Note cannot be blank." });
    }

    const loanTransaction = await LoanTransactions.findById(loanTransactionId);

    if (!loanTransaction) {
      return res.status(404).json({ message: "Loan transaction not found." });
    }

    // validate status
    const validStatuses = ["Borrowed", "Partially Consumed"];
    if (!validStatuses.includes(loanTransaction.loan_status)) {
      return res.status(400).json({
        message: `Current status is "${loanTransaction.loan_status}", cannot process return.`,
      });
    }
    if (loanTransaction.returned_confirmed_date_by_staff) {
      return res.status(400).json({ message: "Return already confirmed by staff." });
    }

    // determine returnable items
    const borrowedItems = Array.isArray(loanTransaction.borrowed_item)
      ? loanTransaction.borrowed_item
      : [];

    const returnableItems = borrowedItems.filter((item) => !item.is_consumable);
    let allChecked = true;

    if (returnableItems.length > 0) {
      if (!checkedReturnedItemIds || checkedReturnedItemIds.length === 0) {
        return res
          .status(400)
          .json({ message: "Return checklist items are required as there are items to return." });
      }
      const returnableIds = returnableItems.map((i) => i._id.toString());

      // validate all provided IDs
      for (const id of checkedReturnedItemIds) {
        if (!returnableIds.includes(id)) {
          return res.status(400).json({ message: `Checklist ID '${id}' is invalid.` });
        }
      }

      // mark checked
      loanTransaction.borrowed_item = loanTransaction.borrowed_item.map((item) => {
        if (!item.is_consumable && checkedReturnedItemIds.includes(item._id.toString())) {
          return { ...item, staff_checked_return: true };
        }
        return item;
      });

      // verify all returned items checked
      returnableItems.forEach((item) => {
        const updated = loanTransaction.borrowed_item.find((i) => i._id.equals(item._id));
        if (!updated || !updated.staff_checked_return) allChecked = false;
      });

      if (!allChecked) {
        return res.status(400).json({ message: "Not all items have been checked." });
      }
    }

    // create notification and email to borrower
    const borrowerInfo = await getUserById(req, loanTransaction.borrower_id);
    const borrowerName = borrowerInfo.personal_info.name;
    // const borrowerEmail = borrowerInfo.personal_info.email;
    // const url = `${CLIENT_URL}/user-loan/detail/${loanTransaction._id}`;
    const borrowerMessage = `Hi ${borrowerName}, your returned items for transaction ID: ${loanTransaction.transaction_id} have been processed and confirmed by our staff. Please confirm the item return process to complete the loan transaction.`;

    await createNotification([loanTransaction.borrower_id], loanTransaction._id, borrowerMessage);

    // sendMail(
    //     borrowerEmail,
    //     url,
    //     "Loan Item Return Confirmation",
    //     "Your returned items have been confirmed by staff",
    //     borrowerMessage,
    //     "Confirm Loan Item"
    // );

    const staffInfo = await getUserById(req, req.user._id);
    const stafffEmail = staffInfo.personal_info.email;

    // create notification for user staff
    const itemsByProgram = groupItemsByProgram(loanTransaction.borrowed_item);
    const staffNotificationPromises = Object.entries(itemsByProgram).map(
      async ([program, items]) => {
        const staffMembers = await getStaffsForProgram(req, program);
        const staffIds = staffMembers.map((staff) => staff._id);

        const staffMessage = `Return for loan transaction ID: ${loanTransaction.transaction_id} has been checked and confirmed by ${staffInfo.personal_info.name}.`;

        try {
          // Send notification to staff members based on their program
          await createNotification(staffIds, loanTransaction._id, staffMessage);
        } catch (notificationError) {
          console.error(
            `Failed to create notification for staff members: ${notificationError.message}`
          );
        }
      }
    );

    // Wait for all notification promises to complete
    await Promise.all(staffNotificationPromises);

    // save checklist and set staff confirmation date
    loanTransaction.returned_confirmed_date_by_staff = new Date();
    loanTransaction.returned_confirmed_by = stafffEmail;
    loanTransaction.loan_note = loan_note;
    await loanTransaction.save();

    return res.json({ loanTransaction });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// borrower confirms that the return process is complete
export const confirmReturnedByBorrower = async (req, res) => {
  try {
    const loanTransactionId = req.params.id;

    const loanTransaction = await LoanTransactions.findById(loanTransactionId);

    if (!loanTransaction) {
      return res.status(404).json({ message: "Loan transaction not found." });
    }

    const validReturnStatuses = ["Borrowed", "Partially Consumed"];
    if (!validReturnStatuses.includes(loanTransaction.loan_status)) {
      return res.status(400).json({
        message: `Current transaction status is "${loanTransaction.loan_status}", cannot confirm return.`,
      });
    }
    if (!loanTransaction.returned_confirmed_date_by_staff) {
      return res.status(400).json({
        message:
          "Staff has not yet confirmed receiving the returned items. Please wait for staff confirmation.",
      });
    }
    if (loanTransaction.returned_confirmed_date_by_user || loanTransaction.return_date) {
      return res
        .status(400)
        .json({ message: "You have already confirmed the return of these items." });
    }

    const borrowedItems = loanTransaction.borrowed_item.filter((item) => !item.is_consumable);

    for (const item of borrowedItems) {
      const inventory = await Inventories.findById(item.inventory_id);

      if (!inventory) {
        return res.status(404).json({ message: `Inventory item ${item.inventory_id} not found.` });
      }

      if (inventory.draft === true) {
        return res
          .status(400)
          .json({ message: `Cannot returned. Item ${inventory.asset_name} is in draft status.` });
      }

      inventory.total_items += item.quantity;
      await inventory.save();
    }

    // create notification and email to borrower
    const borrowerInfo = await getUserById(req, loanTransaction.borrower_id);
    const borrowerName = borrowerInfo.personal_info.name;
    const borrowerEmail = borrowerInfo.personal_info.email;
    const url = `${CLIENT_URL}/user-loan/detail/${loanTransaction._id}`;
    const borrowerMessage = `Hi ${borrowerName}, your returned items for transaction ID: ${loanTransaction.transaction_id} have been successfully received by our staff. Thank you for borrowing and returning the loan items through inventorCS.`;

    await createNotification([loanTransaction.borrower_id], loanTransaction._id, borrowerMessage);

    sendMail(
      borrowerEmail,
      url,
      "The loan items have been returned.",
      "Thank you for confirming the return",
      borrowerMessage,
      "See loan item details"
    );

    // create notification for user staff
    const itemsByProgram = groupItemsByProgram(loanTransaction.borrowed_item);
    const staffNotificationPromises = Object.entries(itemsByProgram).map(
      async ([program, items]) => {
        const staffMembers = await getStaffsForProgram(req, program);
        const staffIds = staffMembers.map((staff) => staff._id);

        const staffMessage = `Loan transaction with ID: ${loanTransaction.transaction_id} has been successfully returned by ${borrowerName}. Loan Transaction Complete.`;

        try {
          // Send notification to staff members based on their program
          await createNotification(staffIds, loanTransaction._id, staffMessage);
        } catch (notificationError) {
          console.error(
            `Failed to create notification for staff members: ${notificationError.message}`
          );
        }
      }
    );

    // Wait for all notification promises to complete
    await Promise.all(staffNotificationPromises);

    loanTransaction.loan_status = "Returned";
    loanTransaction.returned_confirmed_date_by_user = new Date();
    loanTransaction.return_date = new Date();
    await loanTransaction.save();

    res.json({
      message: "Thank you for confirming. Loan items successfully returned.",
      loanTransaction,
    });
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

    const loanTransaction = await LoanTransactions.findById(loanTransactionId);

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
        return res
          .status(400)
          .json({ message: `Cannot cancel. Item ${inventory.asset_name} is in draft status.` });
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
    const staffNotificationPromises = Object.entries(itemsByProgram).map(
      async ([program, items]) => {
        const staffMembers = await getStaffsForProgram(req, program);
        const staffIds = staffMembers.map((staff) => staff._id);

        const staffMessage = `Loan transaction with ID: ${loanTransaction.transaction_id} has been marked as "Cancelled" by ${req.user.personal_info.name}.`;

        try {
          // Send notification to staff members based on their program
          await createNotification(staffIds, loanTransaction._id, staffMessage);
        } catch (notificationError) {
          console.error(
            `Failed to create notification for staff members: ${notificationError.message}`
          );
        }
      }
    );

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

    res.json({
      message: "Loan transaction has been cancelled.",
      loanTransaction,
      ...(meeting && { meeting }),
    });
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
    let { borrow_date_start, borrow_date_end } = req.query;

    const query = {
      "borrowed_item.item_program": userData.personal_info.program,
    };

    // Apply search filter (transaction_id, loan_status, or borrowed item name)
    if (search) {
      query["$or"] = [
        { transaction_id: { $regex: search, $options: "i" } },
        { loan_status: { $regex: search, $options: "i" } },
        { "borrowed_item.inventory_id.asset_name": { $regex: search, $options: "i" } },
      ];
    }

    // Filter by loan_status
    const validLoanStatuses = [
      "Pending",
      "Ready to Pickup",
      "Borrowed",
      "Partially Consumed",
      "Consumed",
      "Returned",
      "Cancelled",
    ];

    if (loan_status !== "All") {
      loan_status = loan_status.split(",");
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
      .populate("borrowed_item.inventory_id", "_id asset_name asset_id serial_number asset_img")
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
      loanTransactions,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// get loan transaction by ID
export const getLoanTransactionById = async (req, res) => {
  try {
    const loanTransaction = await LoanTransactions.findById(req.params.id)
      .populate("borrowed_item.inventory_id", "_id asset_name asset_id serial_number asset_img")
      .lean()
      .exec();

    if (!loanTransaction) {
      return res.status(404).json({ message: "Loan Transaction not found" });
    }

    res.json(loanTransaction);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// get transactions by user
export const getLoanTransactionsByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const loanTransactions = await LoanTransactions.find({ borrower_id: userId })
      .populate("borrowed_item.inventory_id", "_id asset_name asset_id serial_number asset_img")
      .lean()
      .exec();

    res.json({ loanTransactions });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
