const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyAdminToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

/**
 * Product management routes.
 * All routes protected by admin authentication.
 */

// Create a new product
router.post('/', verifyAdminToken, productController.createProduct);

// Update existing product by ID
router.put('/:id', verifyAdminToken, productController.updateProduct);

// Delete product by ID
router.delete('/:id', verifyAdminToken, productController.deleteProduct);

// Upload images for a product (max 5 images)
router.post('/:id/images', verifyAdminToken, upload.array('images', 5), productController.uploadProductImages);

module.exports = router;
