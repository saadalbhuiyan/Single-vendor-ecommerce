const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: String, required: false }, // Optional, e.g. size/color as string or JSON
    quantity: { type: Number, required: true, min: 1, default: 1 },
});

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
