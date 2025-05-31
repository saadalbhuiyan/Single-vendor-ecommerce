const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

/**
 * Get the authenticated user's wishlist items.
 */
exports.getUserWishlist = async (req, res) => {
    try {
        const wishlistItems = await Wishlist.find({ user: req.user._id })
            .populate('product', 'name price images description variants')
            .exec();

        res.status(200).json({ success: true, data: wishlistItems });
    } catch (error) {
        console.error('getUserWishlist error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching wishlist' });
    }
};

/**
 * Add a product to the authenticated user's wishlist.
 */
exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ success: false, message: 'ProductId is required' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const existing = await Wishlist.findOne({ user: req.user._id, product: productId });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Product already in wishlist' });
        }

        const wishlistItem = new Wishlist({
            user: req.user._id,
            product: productId,
        });
        await wishlistItem.save();

        res.status(201).json({ success: true, data: wishlistItem });
    } catch (error) {
        console.error('addToWishlist error:', error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Duplicate wishlist entry' });
        }
        res.status(500).json({ success: false, message: 'Server error adding to wishlist' });
    }
};

/**
 * Remove a product from the authenticated user's wishlist.
 */
exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const deleted = await Wishlist.findOneAndDelete({ user: req.user._id, product: productId });
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Wishlist item not found' });
        }
        res.status(200).json({ success: true, message: 'Removed from wishlist' });
    } catch (error) {
        console.error('removeFromWishlist error:', error);
        res.status(500).json({ success: false, message: 'Server error removing wishlist item' });
    }
};

/**
 * Clear the authenticated user's entire wishlist.
 */
exports.clearWishlist = async (req, res) => {
    try {
        await Wishlist.deleteMany({ user: req.user._id });
        res.status(200).json({ success: true, message: 'Wishlist cleared' });
    } catch (error) {
        console.error('clearWishlist error:', error);
        res.status(500).json({ success: false, message: 'Server error clearing wishlist' });
    }
};

/**
 * Get all wishlist items (Admin use).
 * Populates user and product basic info.
 */
exports.getAllWishlist = async (req, res) => {
    try {
        const allWishlist = await Wishlist.find()
            .populate('user', 'name email')
            .populate('product', 'name price')
            .exec();
        res.status(200).json({ success: true, data: allWishlist });
    } catch (error) {
        console.error('getAllWishlist error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching all wishlist data' });
    }
};

/**
 * Delete a wishlist item by ID (Admin use).
 */
exports.deleteWishlistItemByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Wishlist.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Wishlist item not found' });
        }
        res.status(200).json({ success: true, message: 'Wishlist item deleted by admin' });
    } catch (error) {
        console.error('deleteWishlistItemByAdmin error:', error);
        res.status(500).json({ success: false, message: 'Server error deleting wishlist item' });
    }
};
