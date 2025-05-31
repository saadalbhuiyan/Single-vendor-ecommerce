const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * Admin routes for order management.
 * All routes are protected by admin JWT authentication middleware.
 */
router.use(authMiddleware.verifyAdminToken);

// Get a list of all orders
router.get('/', orderController.getAllOrders);

// Update order status by order ID
router.put('/:id/status', orderController.updateOrderStatus);

// Approve order cancellation by order ID
router.put('/:id/cancel', orderController.approveOrderCancellation);

module.exports = router;
