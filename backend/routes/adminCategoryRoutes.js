const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

/**
 * Routes for category management - all protected by admin authentication.
 */

// Get all categories (admin)
router.get('/', verifyAdminToken, categoryController.getAllCategories);

// Create a new category (admin)
router.post('/', verifyAdminToken, categoryController.createCategory);

// Update a category by ID (admin)
router.put('/:id', verifyAdminToken, categoryController.updateCategory);

// Delete a category by ID (admin)
router.delete('/:id', verifyAdminToken, categoryController.deleteCategory);

module.exports = router;
