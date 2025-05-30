const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyUserToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

/**
 * User routes for managing profile, address, mobile number, and avatar.
 * All routes require user authentication via JWT.
 */

// Get the authenticated user's profile
router.get('/me', verifyUserToken, userController.getProfile);

// Update the authenticated user's profile (name, email)
router.put('/me', verifyUserToken, userController.updateProfile);

// Delete the authenticated user's account
router.delete('/me', verifyUserToken, userController.deleteAccount);

// Update the authenticated user's address
router.put('/me/address', verifyUserToken, userController.updateAddress);

// Update the authenticated user's mobile number
router.put('/me/mobile', verifyUserToken, userController.updateMobile);

// Upload a new avatar image for the authenticated user
router.post('/me/avatar', verifyUserToken, upload.single('avatar'), userController.uploadAvatar);

// Verify the user's email after email change
router.post('/me/verify-email-change', verifyUserToken, userController.verifyEmailChange);

module.exports = router;
