import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
    color: { type: String },
    size: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    variants: [variantSchema],
    images: {
        type: [String], // URLs or file paths
        default: [],    // default to empty array on creation
        validate: {
            validator: function (val) {
                // Allow empty array but max 5 images
                return val.length <= 5;
            },
            message: '{PATH} cannot have more than 5 images',
        },
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Product', productSchema);
