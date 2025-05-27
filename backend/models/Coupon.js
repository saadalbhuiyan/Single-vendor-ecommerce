const mongoose = require('mongoose');

/**
 * Coupon Schema
 *
 * Represents discount coupons with constraints such as validity period,
 * usage limits, discount type and amount.
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
        required: true, // Percentage (0-100) or fixed amount
    },
    minPurchaseAmount: {
        type: Number,
        default: 0, // Minimum cart amount to apply coupon
    },
    maxDiscountAmount: {
        type: Number,
        default: null, // Optional maximum discount cap
    },
    usageLimit: {
        type: Number,
        default: null, // Null means unlimited usage
    },
    usedCount: {
        type: Number,
        default: 0, // Number of times coupon has been used
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
