const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// Helper: product থেকে শুধু যোগকৃত variant এর ডিটেইল নিয়ে আসা
function filterVariantDetails(product, variantId) {
    if (!variantId) return null;
    return product.variants.find(v => v._id.toString() === variantId.toString()) || null;
}

const getUserCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) {
            return res.status(200).json({
                success: true,
                data: {
                    items: [],
                    coupon: null,
                    subtotal: 0,
                    discountAmount: 0,
                    total: 0,
                }
            });
        }

        // Calculate subtotal
        const subtotal = cart.items.reduce((sum, item) => {
            const variant = filterVariantDetails(item.product, item.variant);
            const price = variant ? variant.price : 0;
            return sum + price * item.quantity;
        }, 0);

        // Calculate discount
        let discountAmount = 0;
        if (cart.coupon && cart.coupon.code) {
            if (cart.coupon.discountType === 'percentage') {
                discountAmount = (subtotal * cart.coupon.discountValue) / 100;
            } else if (cart.coupon.discountType === 'fixed') {
                discountAmount = cart.coupon.discountValue;
            }
        }

        const total = subtotal - discountAmount;

        // Prepare filtered items
        const itemsWithFilteredVariant = cart.items.map(item => {
            const variantDetail = filterVariantDetails(item.product, item.variant);
            return {
                _id: item._id,
                product: {
                    _id: item.product._id,
                    name: item.product.name,
                    description: item.product.description,
                    category: item.product.category,
                    images: item.product.images,
                },
                variant: variantDetail,
                quantity: item.quantity,
            };
        });

        res.status(200).json({
            success: true,
            data: {
                _id: cart._id,
                user: cart.user,
                items: itemsWithFilteredVariant,
                coupon: cart.coupon,
                subtotal,
                discountAmount,
                total,
                updatedAt: cart.updatedAt,
            }
        });
    } catch (error) {
        console.error('getUserCart error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching cart' });
    }
};

// get user end
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

        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId && (variant ? item.variant === variant : !item.variant)
        );

        if (existingItemIndex !== -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, variant: variant || null, quantity });
        }

        cart.updatedAt = new Date();
        await cart.save();

        await cart.populate('items.product');

        // Calculate subtotal
        const subtotal = cart.items.reduce((sum, item) => {
            const variantDetail = filterVariantDetails(item.product, item.variant);
            const price = variantDetail ? variantDetail.price : 0;
            return sum + price * item.quantity;
        }, 0);

        // Calculate discount
        let discountAmount = 0;
        if (cart.coupon && cart.coupon.code) {
            if (cart.coupon.discountType === 'percentage') {
                discountAmount = (subtotal * cart.coupon.discountValue) / 100;
            } else if (cart.coupon.discountType === 'fixed') {
                discountAmount = cart.coupon.discountValue;
            }
        }

        const total = subtotal - discountAmount;

        const itemsWithFilteredVariant = cart.items.map(item => {
            const variantDetail = filterVariantDetails(item.product, item.variant);
            return {
                _id: item._id,
                product: {
                    _id: item.product._id,
                    name: item.product.name,
                    description: item.product.description,
                    category: item.product.category,
                    images: item.product.images,
                },
                variant: variantDetail,
                quantity: item.quantity,
            };
        });

        res.status(201).json({
            success: true,
            data: {
                _id: cart._id,
                user: cart.user,
                items: itemsWithFilteredVariant,
                coupon: cart.coupon,
                subtotal,
                discountAmount,
                total,
                updatedAt: cart.updatedAt,
            }
        });
    } catch (error) {
        console.error('addItemToCart error:', error);
        res.status(500).json({ success: false, message: 'Server error adding item to cart' });
    }
};

// add item card end
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
        await cart.populate('items.product');

        const itemsWithFilteredVariant = cart.items.map(item => {
            const variantDetail = filterVariantDetails(item.product, item.variant);
            return {
                _id: item._id,
                product: {
                    _id: item.product._id,
                    name: item.product.name,
                    description: item.product.description,
                    category: item.product.category,
                    images: item.product.images,
                },
                variant: variantDetail,
                quantity: item.quantity,
            };
        });

        res.status(200).json({
            success: true,
            data: {
                _id: cart._id,
                user: cart.user,
                items: itemsWithFilteredVariant,
                coupon: cart.coupon,
                updatedAt: cart.updatedAt,
            }
        });
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

        await cart.populate('items.product');

        const itemsWithFilteredVariant = cart.items.map(item => {
            const variantDetail = filterVariantDetails(item.product, item.variant);
            return {
                _id: item._id,
                product: {
                    _id: item.product._id,
                    name: item.product.name,
                    description: item.product.description,
                    category: item.product.category,
                    images: item.product.images,
                },
                variant: variantDetail,
                quantity: item.quantity,
            };
        });

        res.status(200).json({
            success: true,
            data: {
                _id: cart._id,
                user: cart.user,
                items: itemsWithFilteredVariant,
                coupon: cart.coupon,
                updatedAt: cart.updatedAt,
            }
        });
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
        await cart.populate('items.product');

        const itemsWithFilteredVariant = cart.items.map(item => {
            const variantDetail = filterVariantDetails(item.product, item.variant);
            return {
                _id: item._id,
                product: {
                    _id: item.product._id,
                    name: item.product.name,
                    description: item.product.description,
                    category: item.product.category,
                    images: item.product.images,
                },
                variant: variantDetail,
                quantity: item.quantity,
            };
        });

        res.status(200).json({
            success: true,
            data: {
                _id: cart._id,
                user: cart.user,
                items: itemsWithFilteredVariant,
                coupon: cart.coupon,
                updatedAt: cart.updatedAt,
            }
        });
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
        await cart.populate('items.product');

        const itemsWithFilteredVariant = cart.items.map(item => {
            const variantDetail = filterVariantDetails(item.product, item.variant);
            return {
                _id: item._id,
                product: {
                    _id: item.product._id,
                    name: item.product.name,
                    description: item.product.description,
                    category: item.product.category,
                    images: item.product.images,
                },
                variant: variantDetail,
                quantity: item.quantity,
            };
        });

        res.status(200).json({
            success: true,
            data: {
                _id: cart._id,
                user: cart.user,
                items: itemsWithFilteredVariant,
                coupon: cart.coupon,
                updatedAt: cart.updatedAt,
            }
        });
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
