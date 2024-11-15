import mongoose, { Schema } from "mongoose";

const notificationSchema = mongoose.Schema({
    user_id: {
        type: [String],
        required: true
    },
    loan_transaction: {
        type: Schema.Types.ObjectId,
        ref: "LoanTransactions",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    is_read: {
        type: Boolean,
        required: true,
    }
}, {
    timestamps: true
})

export default mongoose.model('Notifications', notificationSchema)