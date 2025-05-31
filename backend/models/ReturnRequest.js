const mongoose = require('mongoose');

/**
 * Schema representing a return request made by a user for an order.
 * Fields:
 * - order: reference to the related Order (required)
 * - user: reference to the User who made the request (required)
 * - reason: explanation for the return (required)
 * - status: current status of the return request (pending, approved, rejected)
 * - createdAt: timestamp when request was created
 */
const returnRequestSchema = new mongoose.Schema(
    {
        order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        reason: { type: String, required: true },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('ReturnRequest', returnRequestSchema);
