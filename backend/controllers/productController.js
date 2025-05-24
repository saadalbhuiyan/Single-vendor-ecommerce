import Product from '../models/Product.js';

// User: List all products (optionally filter by category)
export const getProducts = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) filter.category = req.query.category;

        const products = await Product.find(filter).populate('category', 'name').exec();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
};

// User: Search products by keyword in name or description
export const searchProducts = async (req, res) => {
    try {
        const { keyword } = req.query;
        if (!keyword) return res.status(400).json({ message: 'Keyword required' });

        const regex = new RegExp(keyword, 'i');
        const products = await Product.find({
            $or: [{ name: regex }, { description: regex }],
        }).populate('category', 'name');

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to search products', error: error.message });
    }
};

// User: Get product details by ID
export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get product', error: error.message });
    }
};

// Admin: Create product
export const createProduct = async (req, res) => {
    try {
        const { name, description, category, variants } = req.body;

        if (!name || !category)
            return res.status(400).json({ message: 'Name and category are required' });

        const product = new Product({
            name,
            description,
            category,
            variants: variants || [],
            images: [], // Images added later
        });

        await product.save();
        res.status(201).json({ message: 'Product created', product });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create product', error: error.message });
    }
};

// Admin: Update product
export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updateData = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (updateData.name !== undefined) product.name = updateData.name;
        if (updateData.description !== undefined) product.description = updateData.description;
        if (updateData.category !== undefined) product.category = updateData.category;
        if (updateData.variants !== undefined) product.variants = updateData.variants;

        await product.save();
        res.json({ message: 'Product updated', product });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
};

// Admin: Delete product
export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete product', error: error.message });
    }
};

// Admin: Upload images for product
export const uploadImages = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (!req.body.images || req.body.images.length === 0)
            return res.status(400).json({ message: 'No images uploaded' });

        product.images = product.images.concat(req.body.images);

        if (product.images.length > 5)
            return res.status(400).json({ message: 'Maximum 5 images allowed per product' });

        await product.save();

        res.json({ message: 'Images uploaded successfully', images: product.images });
    } catch (error) {
        res.status(500).json({ message: 'Failed to upload images', error: error.message });
    }
};
