const mongoose = require('mongoose');

/**
 * OTP Schema
 * Stores one-time password codes linked to user emails.
 * Includes TTL index to auto-delete expired OTP documents.
 */
const otpSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        code: { type: String, required: true },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true }
);

// TTL index on expiresAt field to automatically remove expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', otpSchema);
