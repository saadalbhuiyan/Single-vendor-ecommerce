const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const getUserCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) {
            // If cart not found, return empty
            return res.status(200).json({ success: true, data: { items: [], coupon: null } });
        }
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error('getUserCart error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching cart' });
    }
};

const addItemToCart = async (req, res) => {
    try {
        const { productId, variant, quantity } = req.body;
        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({ success: false, message: 'productId and quantity >=1 required' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        // Check if item with same product + variant exists
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId && (variant ? item.variant === variant : true)
        );

        if (existingItemIndex !== -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({ product: productId, variant: variant || null, quantity });
        }

        cart.updatedAt = new Date();
        await cart.save();

        await cart.populate('items.product').execPopulate();

        res.status(201).json({ success: true, data: cart });
    } catch (error) {
        console.error('addItemToCart error:', error);
        res.status(500).json({ success: false, message: 'Server error adding item to cart' });
    }
};

const updateCartItemQuantity = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        if (!quantity || quantity < 1) {
            return res.status(400).json({ success: false, message: 'Quantity >= 1 is required' });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Cart item not found' });
        }

        item.quantity = quantity;
        cart.updatedAt = new Date();

        await cart.save();
        await cart.populate('items.product').execPopulate();

        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error('updateCartItemQuantity error:', error);
        res.status(500).json({ success: false, message: 'Server error updating cart item quantity' });
    }
};

const removeCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Cart item not found' });
        }

        item.remove();
        cart.updatedAt = new Date();
        await cart.save();

        await cart.populate('items.product').execPopulate();

        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error('removeCartItem error:', error);
        res.status(500).json({ success: false, message: 'Server error removing cart item' });
    }
};

const applyCouponToCart = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ success: false, message: 'Coupon code is required' });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), active: true });
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found or inactive' });
        }

        const now = new Date();
        if (coupon.validFrom > now || coupon.validUntil < now) {
            return res.status(400).json({ success: false, message: 'Coupon is not valid at this time' });
        }

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.coupon = {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
        };
        cart.updatedAt = new Date();

        await cart.save();
        await cart.populate('items.product').execPopulate();

        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error('applyCouponToCart error:', error);
        res.status(500).json({ success: false, message: 'Server error applying coupon' });
    }
};

const removeCouponFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.coupon = {
            code: null,
            discountType: null,
            discountValue: 0,
        };
        cart.updatedAt = new Date();

        await cart.save();
        await cart.populate('items.product').execPopulate();

        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error('removeCouponFromCart error:', error);
        res.status(500).json({ success: false, message: 'Server error removing coupon' });
    }
};

const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.items = [];
        cart.coupon = {
            code: null,
            discountType: null,
            discountValue: 0,
        };
        cart.updatedAt = new Date();

        await cart.save();

        res.status(200).json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        console.error('clearCart error:', error);
        res.status(500).json({ success: false, message: 'Server error clearing cart' });
    }
};

module.exports = {
    getUserCart,
    addItemToCart,
    updateCartItemQuantity,
    removeCartItem,
    applyCouponToCart,
    removeCouponFromCart,
    clearCart,
};
