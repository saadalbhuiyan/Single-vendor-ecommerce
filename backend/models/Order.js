const mongoose = require('mongoose');

/**
 * Schema for individual items in an order.
 * Fields:
 * - product: references a Product document (required)
 * - variant: references a variant within Product.variants (optional)
 * - quantity: number of units ordered (min 1)
 * - price: price per unit at time of order (required)
 */
const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    // Variant usually is a subdocument within Product, so ref to 'Product.variants' won't work in Mongoose
    // Instead, store variant id as String or ObjectId without ref or custom ref handling.
    variant: { type: mongoose.Schema.Types.ObjectId, default: null },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
});

/**
 * Main Order schema.
 * Fields:
 * - user: reference to User who placed the order (required)
 * - items: array of order items
 * - shippingAddress: embedded address object
 * - paymentStatus: enum, defaults to 'pending'
 * - orderStatus: enum, defaults to 'pending'
 * - paymentMethod: string, default is 'DemoGateway'
 * - totalAmount: total order amount (required)
 * - coupon: embedded coupon info (code, discountType, discountValue)
 * - returnRequested: boolean flag for return requests
 * - returnReason: string explanation for return
 * - createdAt, updatedAt: timestamps
 */
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
        default: 'pending',
    },
    paymentMethod: { type: String, default: 'DemoGateway' },
    totalAmount: { type: Number, required: true },
    coupon: {
        code: String,
        discountType: String,
        discountValue: Number,
    },
    returnRequested: { type: Boolean, default: false },
    returnReason: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
