const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * Wishlist management routes.
 * All routes require user authentication via JWT.
 */

// Protect all routes with user token verification middleware
router.use(authMiddleware.verifyUserToken);

// Get the authenticated user's wishlist items
router.get('/', wishlistController.getUserWishlist);

// Add a product to the authenticated user's wishlist
router.post('/', wishlistController.addToWishlist);

// Remove a specific product from the authenticated user's wishlist
router.delete('/:productId', wishlistController.removeFromWishlist);

// Clear the authenticated user's entire wishlist
router.delete('/', wishlistController.clearWishlist);

module.exports = router;
