const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.verifyUserToken);

router.get('/', cartController.getUserCart);
router.post('/items', cartController.addItemToCart);
router.put('/items/:itemId', cartController.updateCartItemQuantity);
router.delete('/items/:itemId', cartController.removeCartItem);
router.post('/apply-coupon', cartController.applyCouponToCart);
router.post('/remove-coupon', cartController.removeCouponFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;
