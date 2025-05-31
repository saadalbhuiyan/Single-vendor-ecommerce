const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * All coupon routes below require admin authentication.
 * The verifyAdminToken middleware protects these routes.
 */
router.use(authMiddleware.verifyAdminToken);

// Create a new coupon (admin only)
router.post('/', couponController.createCoupon);

// Get all coupons (admin only)
router.get('/', couponController.getAllCoupons);

// Update an existing coupon by ID (admin only)
router.put('/:id', couponController.updateCoupon);

// Delete a coupon by ID (admin only)
router.delete('/:id', couponController.deleteCoupon);

module.exports = router;
