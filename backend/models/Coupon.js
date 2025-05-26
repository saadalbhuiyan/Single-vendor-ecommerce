const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true }, // percent (0-100) or fixed amount
    minPurchaseAmount: { type: Number, default: 0 }, // Minimum cart amount to apply coupon
    maxDiscountAmount: { type: Number, default: null }, // Maximum discount amount allowed (optional)
    usageLimit: { type: Number, default: null }, // How many times coupon can be used (null means unlimited)
    usedCount: { type: Number, default: 0 }, // Times coupon has been used
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Coupon', CouponSchema);
