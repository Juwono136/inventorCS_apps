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
        unique: true,
        default: ""
    },
    desc: {
        type: String,
        maxlength: 500,
        default: ""
        // required: true
    },
    categories: {
        type: [String], // ["gadget", "electrical", "computer", "etc"]
        required: true,
        default: []
    },
    location: {
        type: String,
        default: ""
    },
    room_number: {
        type: String,
        default: "",
    },
    total_items: {
        type: Number,
        default: 0
    },
    total_likes: {
        type: Number,
        default: 0
    },
    draft: {
        type: Boolean,
        default: false
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'publishedAt'
    }
})

export default mongoose.model('Inventories', inventorySchema)

