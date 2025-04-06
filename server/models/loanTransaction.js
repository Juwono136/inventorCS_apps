import mongoose, { Schema } from "mongoose";

const loanTransactionSchema = mongoose.Schema({
    transaction_id: {
        type: String,
        required: true,
        unique: true
    },
    borrower_id: {
        type: String, // save user_id from users API (borrower)
        required: true
    },
    staff_id: {
        type: String, // save user_id from users API (staff)
        default: null
    },
    borrowed_item: [{
        inventory_id: {
            type: Schema.Types.ObjectId,
            ref: 'Inventories',
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        },
        is_consumable: {
            type: Boolean,
            required: true
        },
        item_program: {
            type: String,
            required: true,
        }
    }],
    purpose_of_loan: {
        type: String,
        maxlength: 500,
        default: ""
    },
    borrow_date: {
        type: Date,
        required: true,
        default: null
    },
    borrower_confirmed_date: { // When the borrower receives the loan item
        type: Date,
        default: null
    },
    staff_confirmed_date: { // When the staff confirms the loan item for borrowing
        type: Date,
        default: null
    },
    expected_return_date: {
        type: Date,
        required: true,
        default: null
    },
    return_date: { // When the borrower successfully returns the loan item to the staff
        type: Date,
        default: null
    },
    loan_status: {
        type: String,
        required: true,
        default: "Pending",
        enum: ["Pending", "Ready to Pickup", "Borrowed", "Partially Consumed", "Consumed", "Returned", "Cancelled"]
    },
    pickup_time: {
        type: Date,
        default: null
    },
    is_new: {
        type: Boolean,
        required: true,
    }
}, {
    timestamps: true
})

loanTransactionSchema.index({ "transaction_id": 1 })
loanTransactionSchema.index({ loan_status: 1, pickup_time: 1 });

export default mongoose.model('LoanTransactions', loanTransactionSchema)