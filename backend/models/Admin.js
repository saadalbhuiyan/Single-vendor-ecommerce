const mongoose = require('mongoose');

/**
 * Admin schema for authentication.
 * Fields:
 * - username: unique identifier for admin (required)
 * - password: hashed password string (required)
 */
const adminSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

// OPTIONAL: Add pre-save hook here for password hashing using bcrypt (recommended for security)

module.exports = mongoose.model('Admin', adminSchema);
