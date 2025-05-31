const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/**
 * Public routes for category retrieval.
 * Accessible without authentication.
 */

// Get all top-level categories (categories with no parent)
router.get('/', categoryController.getTopLevelCategories);

// Get all subcategories for a given parent category ID
router.get('/:parentId/subcategories', categoryController.getSubcategories);

module.exports = router;
