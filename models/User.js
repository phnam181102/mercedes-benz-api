const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: Number,
            default: 0, // 0 = user, 1 = admin
        },
    },
    { timestamps: true }
);

let User = mongoose.model('User', userSchema);
module.exports = User;
