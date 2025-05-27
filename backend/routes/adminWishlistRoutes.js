const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * Admin routes for wishlist management.
 * Protected by admin authentication middleware.
 */

router.use(authMiddleware.verifyAdminToken);

// Get all wishlist items (admin)
router.get('/', wishlistController.getAllWishlist);

// Delete a wishlist item by ID (admin)
router.delete('/:id', wishlistController.deleteWishlistItemByAdmin);

module.exports = router;
