import mongoose, { Schema } from "mongoose";

let profile_imgs_name_list = ["Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki"];
let profile_imgs_collections_list = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];

const userSchema = mongoose.Schema({
    personal_info: {
        binusian_id: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        program: {
            type: String,
            default: ""
        },
        address: {
            type: String,
            default: ""
        },
        phone: {
            type: String,
            default: ""
        },
        bio: {
            type: String,
            maxlength: 250,
            default: ""
        },
        role: {
            type: Number,
            required: true,
            default: 0 // 0 = user, 1 = admin, 2 = staff
        },
        avatar: {
            type: String,
            default: () => {
                return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`
            }
        },
        status: {
            type: String,
            default: "active" // [active, inactive]
        }
    },
    social_links: {
        youtube: {
            type: String,
            default: "",
        },
        instagram: {
            type: String,
            default: "",
        },
        facebook: {
            type: String,
            default: "",
        },
        twitter: {
            type: String,
            default: "",
        },
        github: {
            type: String,
            default: "",
        },
        website: {
            type: String,
            default: "",
        }
    },
    account_info: {
        total_borrowed: {
            type: Number,
            default: 0
        },
        total_project: {
            type: Number,
            default: 0
        }
    },
    borrowed_items: {
        type: [Schema.Types.ObjectId],
        ref: 'inventory',
        default: []
    }
},
    {
        timestamps: {
            createdAt: 'joinedAt'
        }
    })

export default mongoose.model("Users", userSchema)