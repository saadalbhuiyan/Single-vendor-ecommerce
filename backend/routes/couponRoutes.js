const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * User routes for coupon management.
 * All routes are protected by user authentication.
 */

router.use(authMiddleware.verifyUserToken);

// Validate coupon using the provided code in query parameter
router.get('/validate', couponController.validateCoupon);

// Get details of a specific coupon by ID
router.get('/:id', couponController.getCouponById);

module.exports = router;
