const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema(
    {
        userId: String,
        uniqueString: String,
        createdAt: Date,
        expiresAt: Date,
    },
    { timestamps: true }
);

let passwordReset = mongoose.model('passwordReset', passwordResetSchema);
module.exports = passwordReset;
