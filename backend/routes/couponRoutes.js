const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * User coupon management routes.
 * All routes require user JWT authentication.
 */

// Protect all routes with user token verification middleware
router.use(authMiddleware.verifyUserToken);

// Validate coupon by code (provided as query parameter `code`)
router.get('/validate', couponController.validateCoupon);

// Get coupon details by coupon ID
router.get('/:id', couponController.getCouponById);

module.exports = router;
