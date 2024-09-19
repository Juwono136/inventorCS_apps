import mongoose, { Schema } from "mongoose";

const loanTransactionSchema = mongoose.Schema({
    user_id: {
        type: String, // save user_id from users API
        required: true
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
    borrow_date: {
        type: Date,
        required: true
    },
    return_date: {
        type: Date,
        default: null
    },
    status_item: {
        type: String,
        default: "borrowed",
        enum: ["borrowed", "returned"]
    }
}, {
    timestamps: true
})

export default mongoose.model('LoanTransactions', loanTransactionSchema)