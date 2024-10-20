import mongoose, { Schema } from "mongoose";

const loanTransactionSchema = mongoose.Schema({
    user_id: {
        type: String, // save user_id from users API (borrower)
        required: true
    },
    admin_id: {
        type: String, // save user_id from users API (admin/staff)
        default: null
    },
    inventory_id: {
        type: Schema.Types.ObjectId,
        ref: 'Inventories',
        required: true
    },
    purpose_of_loan: {
        type: String,
        maxlength: 500,
        default: ""
    },
    quantity: {
        type: Number,
        default: 1
    },
    borrow_date: {
        type: Date,
        required: true,
        default: null
    },
    return_date: {
        type: Date,
        required: true,
        default: null
    },
    loan_status: {
        type: String,
        required: true,
        default: "Pending",
        enum: ["Pending", "Borrowed", "Returned", "Cancelled"]
    }
}, {
    timestamps: true
})

export default mongoose.model('LoanTransactions', loanTransactionSchema)