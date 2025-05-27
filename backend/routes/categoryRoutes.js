const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/**
 * Public routes for category management.
 * These routes are accessible without authentication.
 */

// Get top-level categories (no parent category)
router.get('/', categoryController.getTopLevelCategories);

// Get subcategories under a specific parent category
router.get('/:parentId/subcategories', categoryController.getSubcategories);

module.exports = router;
