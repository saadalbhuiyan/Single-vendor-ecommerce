const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

/**
 * All report endpoints are protected by admin JWT authentication.
 */

// Sales report for last 30 days
router.get('/sales', verifyAdminToken, reportController.getSalesReport);

// User activity report
router.get('/user-activity', verifyAdminToken, reportController.getUserActivityReport);

// Product performance report
router.get('/product-performance', verifyAdminToken, reportController.getProductPerformanceReport);

// Order status distribution report
router.get('/order-status', verifyAdminToken, reportController.getOrderStatusReport);

// Coupon usage report
router.get('/coupon-usage', verifyAdminToken, reportController.getCouponUsageReport);

// Return/refund requests report
router.get('/return-requests', verifyAdminToken, reportController.getReturnRequestsReport);

// Sales by category report
router.get('/sales-by-category', verifyAdminToken, reportController.getSalesByCategoryReport);

// Top customers report
router.get('/top-customers', verifyAdminToken, reportController.getTopCustomersReport);

// Inventory status report
router.get('/inventory-status', verifyAdminToken, reportController.getInventoryStatusReport);

module.exports = router;
