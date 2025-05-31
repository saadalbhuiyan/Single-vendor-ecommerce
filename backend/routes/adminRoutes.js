const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

/**
 * Admin authentication routes.
 */

// Admin login route (no authentication required)
router.post('/auth/login', adminController.adminLogin);

// Update admin credentials (requires admin JWT token)
router.put('/credentials', verifyAdminToken, adminController.updateAdminCredentials);

module.exports = router;
