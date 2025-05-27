const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

/**
 * Admin authentication routes.
 */

// Admin login (no auth required)
router.post('/auth/login', adminController.adminLogin);

// Update admin credentials (protected)
router.put('/credentials', verifyAdminToken, adminController.updateAdminCredentials);

module.exports = router;
