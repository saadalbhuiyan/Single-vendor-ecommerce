const mongoose = require('mongoose');

/**
 * Schema for individual cart items.
 * - product: references a Product document (required)
 * - variant: optional variant identifier (e.g., size, color)
 * - quantity: number of units, minimum 1, defaults to 1
 */
const CartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: String, default: null },
    quantity: { type: Number, required: true, min: 1, default: 1 },
});

/**
 * Cart schema linked to a single user.
 * - user: references User document, unique per user (one cart per user)
 * - items: array of CartItemSchema
 * - coupon: optional coupon details applied to cart
 * - updatedAt: timestamp for last cart update
 */
const CartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
    items: [CartItemSchema],
    coupon: {
        code: { type: String, default: null },
        discountType: { type: String, enum: ['percentage', 'fixed'], default: null },
        discountValue: { type: Number, default: 0 },
    },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cart', CartSchema);
