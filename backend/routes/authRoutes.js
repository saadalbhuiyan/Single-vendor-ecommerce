const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * Authentication routes for sending/validating OTP and logging out.
 */

// Send OTP to user's email
router.post('/send-otp', authController.sendOTP);

// Verify the OTP sent to the user's email
router.post('/verify-otp', authController.verifyOTP);

// Log out the user (invalidate JWT token)
router.post('/logout', authController.logout);

module.exports = router;
