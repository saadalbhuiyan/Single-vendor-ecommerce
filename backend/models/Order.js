const mongoose = require('mongoose');

/**
 * Schema representing an individual item in an order.
 */
const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: mongoose.Schema.Types.ObjectId, ref: 'Product.variants', default: null }, // Optional variant reference
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // Price per unit at time of purchase
});

/**
 * Schema representing an order placed by a user.
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
