const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

router.get('/', verifyAdminToken, categoryController.getAllCategories);
router.post('/', verifyAdminToken, categoryController.createCategory);
router.put('/:id', verifyAdminToken, categoryController.updateCategory);
router.delete('/:id', verifyAdminToken, categoryController.deleteCategory);

module.exports = router;
