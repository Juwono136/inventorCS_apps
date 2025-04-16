import mongoose, { Schema } from "mongoose";

const meetingSchema = mongoose.Schema({
    loanTransaction_id: {
        type: Schema.Types.ObjectId,
        ref: "LoanTransactions",
        required: true,
    },
    meeting_date: {
        type: Date,
        required: true,
    },
    meeting_confirmed_date: {
        type: Date,
        default: null
    },
    meeting_approved_by: {
        type: String,
        default: ""
    },
    meeting_time: {
        type: String, // Format "HH:mm" (example: "14:30")
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['Need Approval', 'Approved', 'Meeting Cancelled'],
        default: 'Need Approval',
    },
}, {
    timestamps: true
})

meetingSchema.index({ "loanTransaction_id": 1 })

export default mongoose.model('Meetings', meetingSchema)