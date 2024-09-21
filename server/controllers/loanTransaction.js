import LoanTransactions from '../models/loanTransaction.js';
import Inventories from '../models/inventory.js';

// create loan transaction
export const createLoanTransaction = async (req, res) => {
    try {
        const { inventory_id, purpose_of_loan, borrow_date, return_date, quantity } = req.body

        if (!inventory_id || !purpose_of_loan || !borrow_date || !return_date) {
            return res.status(400).json({ message: "Please fill in all fields." });
        }

        if (!quantity || quantity <= 0 || typeof quantity !== 'number') {
            return res.status(400).json({ message: "Please specify a valid quantity." });
        }

        const inventory = await Inventories.findById(inventory_id);
        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found." });
        }

        if (inventory.total_items <= 0) {
            return res.status(400).json({ message: "Sorry, item is not available for loan." });
        }

        if (inventory.total_items < quantity) {
            return res.status(400).json({ message: "Sorry, insufficient items available for loan." });
        }

        if (inventory.draft === true) {
            return res.status(400).json({ message: "Sorry, Inventory is not ready to loan." })
        }

        // Handle borrow_date validation and formatting
        let formattedBorrowDate = new Date(borrow_date);
        let formattedReturnDate = new Date(return_date);

        if (isNaN(formattedBorrowDate.getTime()) || isNaN(formattedReturnDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format." });
        }

        const newLoanTransaction = await LoanTransactions.create({
            user_id: req.user.id,
            inventory_id,
            purpose_of_loan,
            borrow_date: formattedBorrowDate,
            return_date: formattedReturnDate,
            quantity,
        });

        inventory.total_items -= quantity
        await inventory.save();

        res.json({ message: "Loan item created successfully.", newLoanTransaction });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// update loan status to borrowed
export const updateStatusToBorrowed = async (req, res) => {
    try {
        const loanTransactionId = req.params.id

        const loanTransaction = await LoanTransactions.findById(loanTransactionId)

        if (!loanTransaction) {
            return res.status(404).json({ message: "Loan transaction not found." })
        }

        if (loanTransaction.status_item !== "pending") {
            return res.status(400).json({ message: "Transaction is not in pending status." })
        }

        loanTransaction.status_item = "borrowed"
        loanTransaction.admin_id = req.user.id
        await loanTransaction.save()

        res.json({ message: "Loan status updated to borrowed." })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// update loan status to returned
export const updateStatusToReturned = async (req, res) => {
    try {
        const loanTransactionId = req.params.id
        const loanTransaction = await LoanTransactions.findById(loanTransactionId)

        if (!loanTransaction) {
            return res.status(404).json({ message: "Loan transaction not found." });
        }

        if (loanTransaction.status_item !== "borrowed") {
            return res.status(400).json({ message: "Transaction is not in borrowed status." });
        }

        const inventory = await Inventories.findById(loanTransaction.inventory_id);

        loanTransaction.status_item = "returned";
        loanTransaction.return_date = new Date();
        loanTransaction.admin_id = req.user.id
        await loanTransaction.save();

        inventory.total_items += loanTransaction.quantity;
        await inventory.save();

        res.json({ message: "Loan status updated to returned." })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// get all transactions
export const getAllLoanTransactions = async (req, res) => {
    try {
        const loanTransactions = await LoanTransactions.find()
            .populate('inventory_id', 'asset_name asset_id serial_number')
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

        const loanTransactions = await LoanTransactions.find({ user_id: userId })
            .populate('inventory_id', 'asset_name asset_id serial_number')
            .exec();

        res.json({ message: "User loan transactions retrieved successfully.", loanTransactions });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// cancel loan transaction
export const cancelLoanTransaction = async (req, res) => {
    try {
        const loanTransactionId = req.params.id
        const loanTransaction = await LoanTransactions.findById(loanTransactionId)

        if (!loanTransaction) {
            return res.status(404).json({ message: "Loan transaction not found." });
        }

        if (loanTransaction.status_item !== "pending") {
            return res.status(400).json({ message: "Transaction cannot be cancelled." });
        }

        const inventory = await Inventories.findById(loanTransaction.inventory_id);

        if (!inventory) {
            return res.status(404).json({ message: "Inventory not found." });
        }

        loanTransaction.status_item = "cancelled";
        await loanTransaction.save();

        inventory.total_items += loanTransaction.quantity;
        await inventory.save();

        res.json({ message: "Loan transaction has been cancelled." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
