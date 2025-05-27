const mongoose = require('mongoose');

/**
 * Category Schema
 *
 * Supports hierarchical categories via optional parent reference.
 * A null parent indicates a top-level category.
 */
const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, default: '' },
        parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
