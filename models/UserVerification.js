const mongoose = require('mongoose');

const userVerificationSchema = new mongoose.Schema(
    {
        userId: String,
        uniqueString: String,
        createdAt: Date,
        expiresAt: Date,
    },
    { timestamps: true }
);

let userVerification = mongoose.model('userVerification', userVerificationSchema);
module.exports = userVerification;
