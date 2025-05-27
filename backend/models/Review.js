const mongoose = require('mongoose');

/**
 * Review Schema
 * Stores user reviews and ratings for products.
 */
const reviewSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);
