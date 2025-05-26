const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyUserToken } = require('../middleware/authMiddleware');

router.get('/', productController.listProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductDetails);
router.get('/:id/reviews', productController.getProductReviews);
router.post('/:id/reviews', verifyUserToken, productController.submitProductReview);

module.exports = router;
