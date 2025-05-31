const mongoose = require('mongoose');

/**
 * Coupon schema defines discount codes and their properties.
 * Fields:
 * - code: unique uppercase coupon code (required)
 * - description: optional textual description
 * - discountType: either 'percentage' or 'fixed' (required)
 * - discountValue: numeric value of discount (required)
 * - minPurchaseAmount: minimum order amount to apply coupon (default 0)
 * - maxDiscountAmount: maximum discount amount allowed (nullable)
 * - usageLimit: max number of uses (nullable)
 * - usedCount: number of times coupon has been used (default 0)
 * - validFrom: start date of coupon validity (default to creation date)
 * - validUntil: end date of coupon validity (required)
 * - active: whether coupon is currently active (default true)
 * - createdAt: timestamp of creation (default now)
 */
const CouponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    description: { type: String },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
    },
    minPurchaseAmount: {
        type: Number,
        default: 0,
    },
    maxDiscountAmount: {
        type: Number,
        default: null,
    },
    usageLimit: {
        type: Number,
        default: null,
    },
    usedCount: {
        type: Number,
        default: 0,
    },
    validFrom: {
        type: Date,
        default: Date.now,
    },
    validUntil: {
        type: Date,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Coupon', CouponSchema);
