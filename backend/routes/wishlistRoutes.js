const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * Wishlist management routes.
 * All routes are protected by user authentication.
 */

router.use(authMiddleware.verifyUserToken);

// Get the authenticated user's wishlist
router.get('/', wishlistController.getUserWishlist);

// Add a product to the authenticated user's wishlist
router.post('/', wishlistController.addToWishlist);

// Remove a product from the authenticated user's wishlist
router.delete('/:productId', wishlistController.removeFromWishlist);

// Clear the authenticated user's entire wishlist
router.delete('/', wishlistController.clearWishlist);

module.exports = router;
