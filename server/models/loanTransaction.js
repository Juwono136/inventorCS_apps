import mongoose, { Schema } from "mongoose";

const loanTransactionSchema = mongoose.Schema({
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
    borrower_confirmed_date: {
        type: Date,
        default: null
    },
    expected_return_date: {
        type: Date,
        required: true,
        default: null
    },
    return_date: {
        type: Date,
        default: null
    },
    loan_status: {
        type: String,
        required: true,
        default: "Pending",
        enum: ["Pending", "Ready to Pickup", "Borrowed", "Partially Consumed", "Consumed", "Returned", "Cancelled"]
    }
}, {
    timestamps: true
})

export default mongoose.model('LoanTransactions', loanTransactionSchema)