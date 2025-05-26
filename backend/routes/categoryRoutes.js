const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Public or User auth routes (depending on your app's auth policy)
router.get('/', categoryController.getTopLevelCategories);
router.get('/:parentId/subcategories', categoryController.getSubcategories);

module.exports = router;
