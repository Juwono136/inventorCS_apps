import mongoose from "mongoose";

const inventorySchema = mongoose.Schema({
    asset_id: {
        type: String,
        required: true,
        unique: true
    },
    asset_name: {
        type: String,
        required: true
    },
    asset_img: {
        type: String,
        default: "https://api.dicebear.com/9.x/icons/svg?seed=Chase",
        required: true,
    },
    serial_number: {
        type: String,
        default: ""
    },
    categories: {
        type: [String], // ["Creative Tools", "Game Board", "IOT", "IOT Parts", "PC & Laptop", "Peripheral", "Others"]
        required: true,
        default: []
    },
    item_program: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        maxlength: 500,
        default: ""
        // required: true
    },
    location: {
        type: String,
        required: true,
        default: ""
    },
    room_number: {
        type: String,
        required: true,
        default: "",
    },
    cabinet: {
        type: String,
        required: true,
        default: "",
    },
    total_items: {
        type: Number,
        required: true,
        default: 0
    },
    total_likes: {
        type: Number,
        default: 0
    },
    item_status: {
        type: String,
        required: true,
        default: "Available",
        enum: ['Available', 'Maintenance', 'Lost', 'Out of Stock', 'Damaged']
    },
    draft: {
        type: Boolean,
        default: false
    },
    added_by: {
        type: String, // user id
        required: true
    },
    is_consumable: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: {
        createdAt: 'publishedAt'
    }
})

export default mongoose.model('Inventories', inventorySchema)

