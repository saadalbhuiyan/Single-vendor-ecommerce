const mongoose = require('mongoose');

/**
 * Wishlist Schema
 * Stores user-product wishlist entries.
 * Unique compound index ensures no duplicate wishlist entries per user-product pair.
 */
const WishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    addedAt: { type: Date, default: Date.now },
});

// Compound unique index on user and product to prevent duplicates
WishlistSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);
