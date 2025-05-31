const Product = require('../models/Product');
const Review = require('../models/Review');
const fs = require('fs');
const path = require('path');
const { compressImage } = require('../utils/imageUtils');

/**
 * List products with optional filtering by category and price range.
 */
exports.listProducts = async (req, res) => {
    try {
        const filters = {};
        if (req.query.category) filters.category = req.query.category;
        if (req.query.minPrice) filters['variants.price'] = { $gte: Number(req.query.minPrice) };
        if (req.query.maxPrice) {
            filters['variants.price'] = {
                ...filters['variants.price'],
                $lte: Number(req.query.maxPrice),
            };
        }

        const products = await Product.find(filters).populate('category').sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error('listProducts error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Search products by name keyword (case-insensitive).
 */
exports.searchProducts = async (req, res) => {
    try {
        const keyword = req.query.q || '';
        const regex = new RegExp(keyword, 'i');
        const products = await Product.find({ name: regex }).populate('category');
        res.json(products);
    } catch (error) {
        console.error('searchProducts error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Get detailed product information by ID.
 */
exports.getProductDetails = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        console.error('getProductDetails error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Get all reviews for a product.
 */
exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.id }).populate('user', 'name email');
        res.json(reviews);
    } catch (error) {
        console.error('getProductReviews error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Submit a review for a product.
 * Ensures rating is between 1 and 5 and prevents duplicate reviews by same user.
 */
exports.submitProductReview = async (req, res) => {
    try {
        const userId = req.user._id;
        const productId = req.params.id;
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const existingReview = await Review.findOne({ user: userId, product: productId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        const review = new Review({ product: productId, user: userId, rating, comment });
        await review.save();

        res.status(201).json({ message: 'Review submitted', review });
    } catch (error) {
        console.error('submitProductReview error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Create a new product.
 * Requires name and category fields.
 */
exports.createProduct = async (req, res) => {
    try {
        const { name, description, category, variants } = req.body;
        if (!name || !category) {
            return res.status(400).json({ message: 'Name and category are required' });
        }

        const product = new Product({
            name,
            description,
            category,
            variants: variants || [],
            images: [],
        });

        await product.save();
        res.status(201).json({ message: 'Product created', product });
    } catch (error) {
        console.error('createProduct error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Update an existing product by ID.
 */
exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, category, variants } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (name !== undefined) product.name = name;
        if (description !== undefined) product.description = description;
        if (category !== undefined) product.category = category;
        if (variants !== undefined) product.variants = variants;

        await product.save();
        res.json({ message: 'Product updated', product });
    } catch (error) {
        console.error('updateProduct error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Delete product by ID, removing associated image files.
 */
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findByIdAndDelete(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Delete images from filesystem
        if (product.images && product.images.length > 0) {
            product.images.forEach(imgPath => {
                const fullPath = path.join(__dirname, '..', imgPath);
                if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
            });
        }

        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('deleteProduct error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Upload and compress images for a product.
 */
exports.uploadProductImages = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No images uploaded' });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const uploadedImages = [];

        for (const file of req.files) {
            const compressedImagePath = `uploads/${file.filename}-compressed.webp`;

            await compressImage(file.path, compressedImagePath);

            // Remove original uploaded file
            fs.unlinkSync(file.path);

            product.images.push(compressedImagePath);
            uploadedImages.push(compressedImagePath);
        }

        await product.save();

        res.json({ message: 'Images uploaded and compressed', images: uploadedImages });
    } catch (error) {
        console.error('uploadProductImages error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
