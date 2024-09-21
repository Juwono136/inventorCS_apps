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
        const { loanTransactionId } = req.params

        const loanTransaction = await LoanTransactions.findById({ _id: loanTransactionId })

        if (!loanTransaction) {
            return res.status(404).json({ message: "Loan transaction not found." })
        }

        if (loanTransaction.statum_item !== "pending") {
            return res.status(400).json({ message: "Transactionis not in pending status." })
        }

        loanTransaction.status_item = "borrowed"
        await loanTransaction.save()

        res.json({ message: "Loan status updated to borrowed." })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// update loan status to returned
export const updateStatusToReturned = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
