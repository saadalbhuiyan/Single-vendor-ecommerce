const mongoose = require('mongoose');

/**
 * Review schema for user product reviews.
 * Fields:
 * - product: reference to Product being reviewed (required)
 * - user: reference to User who wrote the review (required)
 * - rating: numeric rating between 1 and 5 (required)
 * - comment: optional text comment
 * - createdAt: timestamp of review creation
 */
const reviewSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, default: '' },
    },
    {
        timestamps: { createdAt: true, updatedAt: false }, // Automatically adds createdAt field
    }
);

module.exports = mongoose.model('Review', reviewSchema);
