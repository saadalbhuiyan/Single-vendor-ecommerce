const mongoose = require('mongoose');

/**
 * User Schema
 * Stores user account details including profile, verification, and status.
 */
const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, default: '' },
        mobile: { type: String, default: '' },
        address: { type: String, default: '' },
        avatar: { type: String, default: '' },
        isEmailVerified: { type: Boolean, default: false },
        jwtToken: { type: String, default: null },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
