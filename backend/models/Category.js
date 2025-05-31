const mongoose = require('mongoose');

/**
 * Category schema supports hierarchical categories.
 * Fields:
 * - name: unique name for the category (required)
 * - description: optional description text
 * - parent: reference to parent Category (null for top-level)
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
