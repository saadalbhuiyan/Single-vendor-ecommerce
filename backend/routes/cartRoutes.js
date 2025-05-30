const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * Cart management routes.
 * All routes require user authentication via JWT.
 */

// Protect all routes with user token verification middleware
router.use(authMiddleware.verifyUserToken);

// Get the current user's cart
router.get('/', cartController.getUserCart);

// Add an item to the cart
router.post('/items', cartController.addItemToCart);

// Update the quantity of an item in the cart
router.put('/items/:itemId', cartController.updateCartItemQuantity);

// Remove an item from the cart
router.delete('/items/:itemId', cartController.removeCartItem);

// Apply a coupon to the user's cart
router.post('/apply-coupon', cartController.applyCouponToCart);

// Remove a coupon from the user's cart
router.post('/remove-coupon', cartController.removeCouponFromCart);

// Clear the entire cart (items and coupon)
router.delete('/clear', cartController.clearCart);

module.exports = router;
