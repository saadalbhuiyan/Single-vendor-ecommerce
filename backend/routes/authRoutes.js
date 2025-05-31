const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * Authentication routes:
 * - Send OTP to user email
 * - Verify OTP for login/signup
 * - Logout user (invalidate token)
 */

// Send OTP to user's email
router.post('/send-otp', authController.sendOTP);

// Verify the OTP sent to the user's email
router.post('/verify-otp', authController.verifyOTP);

// Log out the user by invalidating JWT token
router.post('/logout', authController.logout);

module.exports = router;
