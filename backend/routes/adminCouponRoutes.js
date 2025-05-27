const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * All routes below are protected and require admin authentication.
 */
router.use(authMiddleware.verifyAdminToken);

// Create a new coupon (admin)
router.post('/', couponController.createCoupon);

// Get all coupons (admin)
router.get('/', couponController.getAllCoupons);

// Update a coupon by ID (admin)
router.put('/:id', couponController.updateCoupon);

// Delete a coupon by ID (admin)
router.delete('/:id', couponController.deleteCoupon);

module.exports = router;
