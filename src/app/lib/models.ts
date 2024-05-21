import mongoose from "mongoose";
const user_schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    useremail: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    clinic_name: {
        type: String,
    },
    clinic_type: {
        type: String,
    },
    img: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    },

},{timestamps: true});

export const Users =  mongoose.models.Users || mongoose.model("Users", user_schema);
