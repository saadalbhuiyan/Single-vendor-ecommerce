const mongoose = require('mongoose');

/**
 * Wishlist schema representing a product added by a user.
 * - user: reference to the User who added the product (required)
 * - product: reference to the Product added (required)
 * - addedAt: timestamp when the product was added (default to now)
 *
 * Compound unique index on (user, product) to prevent duplicates.
 */
const WishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    addedAt: { type: Date, default: Date.now },
});

// Ensure a user cannot add the same product multiple times
WishlistSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);
