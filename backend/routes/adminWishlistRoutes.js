const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * Admin routes for wishlist management.
 * All routes require valid admin JWT authentication.
 */

// Protect all routes with admin token verification middleware
router.use(authMiddleware.verifyAdminToken);

// Get all wishlist items (admin access)
router.get('/', wishlistController.getAllWishlist);

// Delete a wishlist item by ID (admin access)
router.delete('/:id', wishlistController.deleteWishlistItemByAdmin);

module.exports = router;
