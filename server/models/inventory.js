import mongoose, { Schema } from "mongoose";

const inventorySchema = mongoose.Schema({
    inventory_id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    inventory_img: {
        type: String,
        required: true
    },
    serial_number: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        maxlength: 500,
        // required: true
    },
    category: {
        type: [String],
        required: true
    },
    borrow_date: {
        type: Date,
        required: true
    },
    return_date: {
        type: Date,
        default: ""
    },
    status_of_loan: {
        type: String,
        default: "ready",
    },
    purpose_of_loan: {
        type: String,
        default: ""
    },
    total_items: {
        type: Number,
        default: 0
    },
    total_likes: {
        type: Number,
        default: 0
    },
    borrower: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    }
}, {
    timestamps: {
        createdAt: 'publishedAt'
    }
})

export default mongoose.model('inventory', inventorySchema)

