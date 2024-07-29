import mongoose, { Schema } from "mongoose";

const inventorySchema = mongoose.Schema({
    inventory_id: {
        type: String,
        required: true,
        unique: true
    },
    inventory_name: {
        type: String,
        required: true
    },
    inventory_img: {
        type: String,
        // required: true
    }

}, {
    timestamps: {
        createdAt: 'publishedAt'
    }
})

export default mongoose.model('inventory', inventorySchema)

