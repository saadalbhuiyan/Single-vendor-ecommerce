const mongoose = require('mongoose');

/**
 * Schema representing a product variant.
 * - size: optional size descriptor (e.g., 'M', 'L')
 * - color: optional color descriptor (e.g., 'red')
 * - price: price for this variant (required)
 * - stock: available stock quantity (default 0)
 */
const variantSchema = new mongoose.Schema({
    size: { type: String, default: '' },
    color: { type: String, default: '' },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
});

/**
 * Main product schema.
 * Fields:
 * - name: product name (required)
 * - description: optional product description
 * - category: reference to Category (required)
 * - variants: array of variant subdocuments
 * - images: array of image URL or file paths
 * - createdAt, updatedAt: timestamps
 */
const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: '' },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
        variants: [variantSchema],
        images: [{ type: String }],
    },
    {
        timestamps: true, // Mongoose auto manages createdAt and updatedAt
    }
);

module.exports = mongoose.model('Product', productSchema);
