const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyAdminToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', verifyAdminToken, productController.createProduct);
router.put('/:id', verifyAdminToken, productController.updateProduct);
router.delete('/:id', verifyAdminToken, productController.deleteProduct);

router.post('/:id/images', verifyAdminToken, upload.array('images', 5), productController.uploadProductImages);

module.exports = router;
