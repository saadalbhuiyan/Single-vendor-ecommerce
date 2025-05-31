const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyUserToken } = require('../middleware/authMiddleware');

/**
 * Public product routes.
 * Reviews submission requires user authentication.
 */

// Get all products with optional filters (category, price, etc.)
router.get('/', productController.listProducts);

// Search products by keyword query parameter
router.get('/search', productController.searchProducts);

// Get product details by product ID
router.get('/:id', productController.getProductDetails);

// Get all reviews for a product by product ID
router.get('/:id/reviews', productController.getProductReviews);

// Submit a product review (authenticated users only)
router.post('/:id/reviews', verifyUserToken, productController.submitProductReview);

module.exports = router;
