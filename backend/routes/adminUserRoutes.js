const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

/**
 * Admin user management routes.
 * All routes protected by admin authentication.
 */

// Get list of all users
router.get('/users', verifyAdminToken, adminUserController.getAllUsers);

// Get details of a user by ID
router.get('/users/:id', verifyAdminToken, adminUserController.getUserById);

// Update user status (e.g., activate/suspend)
router.put('/users/:id', verifyAdminToken, adminUserController.updateUserStatus);

// Delete a user by ID
router.delete('/users/:id', verifyAdminToken, adminUserController.deleteUser);

module.exports = router;
