const mongoose = require('mongoose');

/**
 * Variant Schema
 * Represents product variants such as size, color, price, and stock.
 */
const variantSchema = new mongoose.Schema({
    size: { type: String, default: '' },
    color: { type: String, default: '' },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
});

/**
 * Product Schema
 * Main product details including references to category and variants.
 */
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    variants: [variantSchema],
    images: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
