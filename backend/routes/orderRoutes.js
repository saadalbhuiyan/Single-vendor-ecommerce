const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * User routes for order management.
 * All routes require valid user JWT authentication.
 */

// Protect all routes with user token verification middleware
router.use(authMiddleware.verifyUserToken);

// Create a new order
router.post('/', orderController.createOrder);

// Get all orders for the authenticated user
router.get('/', orderController.getUserOrders);

// Get details of a specific order by ID
router.get('/:id', orderController.getOrderById);

// Cancel an order by ID
router.put('/:id/cancel', orderController.cancelOrder);

// Initiate payment for an order by ID
router.post('/:id/pay', orderController.initiatePayment);

// Request a return for an order by ID
router.post('/:id/return-request', orderController.requestReturn);

module.exports = router;
