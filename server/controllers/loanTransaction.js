import LoanTransactions from '../models/loanTransaction.js';
import Inventories from '../models/inventory.js';

// create loan transaction
export const createLoanTransaction = async (req, res) => {
    try {
        const { borrowed_item, purpose_of_loan, borrow_date, return_date } = req.body;

        // Validasi input
        if (!borrowed_item || !Array.isArray(borrowed_item) || borrowed_item.length === 0 || !purpose_of_loan || !borrow_date || !return_date) {
            return res.status(400).json({ message: "Please fill in all fields." });
        }

        // Handle borrow_date validation and formatting
        let formattedBorrowDate = new Date(borrow_date);
        let formattedReturnDate = new Date(return_date);

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

        // Membuat transaksi pinjaman baru
        const newLoanTransaction = await LoanTransactions.create({
            borrower_id: req.user.id,
            borrowed_item: borrowedItems,
            purpose_of_loan,
            borrow_date: formattedBorrowDate,
            return_date: formattedReturnDate,
        });

        res.json({ message: "Loan item created successfully.", newLoanTransaction });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// update loan status to borrowed
export const updateStatusToBorrowed = async (req, res) => {
    try {
        const loanTransactionId = req.params.id;

        const loanTransaction = await LoanTransactions.findById(loanTransactionId);

        if (!loanTransaction) {
            return res.status(404).json({ message: "Loan transaction not found." });
        }

        if (loanTransaction.loan_status !== "Pending") {
            return res.status(400).json({ message: "Transaction is not in pending status." });
        }

        let allItemsConsumable = true;
        let hasConsumableItem = false;

        // Cek setiap item dalam transaksi pinjaman
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
        }

        // Update status pinjaman berdasarkan apakah semua item habis pakai atau tidak
        if (allItemsConsumable) {
            loanTransaction.loan_status = "Consumed";
        } else if (hasConsumableItem) {
            loanTransaction.loan_status = "Partially Consumed";
        } else {
            loanTransaction.loan_status = "Borrowed";
        }

        loanTransaction.admin_id = req.user.id;
        await loanTransaction.save();

        res.json({ message: "Loan status updated.", loanTransaction });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

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

        loanTransaction.loan_status = "Returned";
        loanTransaction.return_date = new Date();
        loanTransaction.admin_id = req.user.id;

        for (const item of loanTransaction.borrowed_item) {
            const inventory = await Inventories.findById(item.inventory_id);
            if (inventory) {
                inventory.total_items += item.quantity;
                await inventory.save();
            }
        }

        await loanTransaction.save();

        res.json({ message: "Loan status updated to returned.", loanTransaction });
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

        res.json({ message: "All loan transactions retrieved successfully.", loanTransactions });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// get transactions by user
export const getLoanTransactionsByUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const loanTransactions = await LoanTransactions.find({ borrower_id: userId })
            .populate('borrowed_item.inventory_id', 'asset_name asset_id serial_number')
            .exec();

        res.json({ message: "User loan transactions retrieved successfully.", loanTransactions });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// cancel loan transaction
export const cancelLoanTransaction = async (req, res) => {
    try {
        const loanTransactionId = req.params.id;
        const userId = req.user.id;

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

        res.json({ message: "Loan transaction has been cancelled.", loanTransaction });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
