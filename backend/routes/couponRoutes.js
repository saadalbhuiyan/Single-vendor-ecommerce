const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.verifyUserToken);

router.get('/validate', couponController.validateCoupon);
router.get('/:id', couponController.getCouponById);

module.exports = router;
