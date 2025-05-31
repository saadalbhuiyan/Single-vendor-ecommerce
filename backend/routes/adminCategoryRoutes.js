const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

/**
 * Category management routes protected by admin authentication.
 * All routes require a valid admin JWT token.
 */

// Get all categories (Admin access)
router.get('/', verifyAdminToken, categoryController.getAllCategories);

// Create a new category (Admin access)
router.post('/', verifyAdminToken, categoryController.createCategory);

// Update a category by ID (Admin access)
router.put('/:id', verifyAdminToken, categoryController.updateCategory);

// Delete a category by ID (Admin access)
router.delete('/:id', verifyAdminToken, categoryController.deleteCategory);

module.exports = router;
