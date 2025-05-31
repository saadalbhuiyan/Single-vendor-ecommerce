const mongoose = require('mongoose');

/**
 * User schema defining the user model.
 * Fields:
 * - email: unique email address (required)
 * - name: user's full name (optional)
 * - mobile: phone number (optional)
 * - address: user's address (optional)
 * - avatar: path or URL to user avatar image (optional)
 * - isEmailVerified: flag indicating if email is verified (default false)
 * - jwtToken: stored JWT token for session management (optional)
 * - isActive: user account active status (default true)
 * - timestamps: automatic createdAt and updatedAt fields
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
