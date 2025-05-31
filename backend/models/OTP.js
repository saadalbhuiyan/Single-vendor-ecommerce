const mongoose = require('mongoose');

/**
 * OTP schema for storing one-time password codes tied to emails.
 * Fields:
 * - email: user email address (required)
 * - code: OTP code string (required)
 * - expiresAt: datetime when OTP expires (required)
 *
 * TTL index on expiresAt automatically deletes expired OTP documents.
 */
const otpSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        code: { type: String, required: true },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true }
);

// TTL index to auto-remove documents when expiresAt passes
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', otpSchema);
