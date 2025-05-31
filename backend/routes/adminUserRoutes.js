const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

/**
 * Admin user management routes.
 * All routes are protected by admin JWT authentication.
 */

// Get list of all users
router.get('/users', verifyAdminToken, adminUserController.getAllUsers);

// Get user details by ID
router.get('/users/:id', verifyAdminToken, adminUserController.getUserById);

// Update user status (activate or suspend)
router.put('/users/:id', verifyAdminToken, adminUserController.updateUserStatus);

// Delete a user by ID
router.delete('/users/:id', verifyAdminToken, adminUserController.deleteUser);

module.exports = router;
