import mongoose, { Schema } from "mongoose";

const meetingSchema = mongoose.Schema({
    loanTransaction_id: {
        type: Schema.Types.ObjectId,
        ref: "LoanTransactions",
        required: true,
    },
    borrower_id: {
        type: String, // save user_id from users API (borrower)
        required: true
    },
    staff_id: {
        type: String, // save user_id from users API (staff)
        default: null,
    },
    meeting_date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['Need Approval', 'Approved', 'Rejected'],
        default: 'Need Approval',
    },
}, {
    timestamps: true
})

export default mongoose.model('Meetings', meetingSchema)