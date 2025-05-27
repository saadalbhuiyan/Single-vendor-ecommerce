const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyUserToken } = require('../middleware/authMiddleware');

/**
 * Public routes for product management.
 * Reviews-related routes are protected by user authentication.
 */

// Get all products (with optional filters)
router.get('/', productController.listProducts);

// Search products by keyword
router.get('/search', productController.searchProducts);

// Get details of a specific product by ID
router.get('/:id', productController.getProductDetails);

// Get reviews for a specific product by ID
router.get('/:id/reviews', productController.getProductReviews);

// Submit a review for a specific product (user must be authenticated)
router.post('/:id/reviews', verifyUserToken, productController.submitProductReview);

module.exports = router;
