const mongoose = require('mongoose');

/**
 * Admin Schema
 *
 * Note: Password is stored in plain text here per request,
 * but storing hashed passwords is highly recommended in production.
 */
const adminSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true }, // Plain text (not secure for production)
    },
    { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
