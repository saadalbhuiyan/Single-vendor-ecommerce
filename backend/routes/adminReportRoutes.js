const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

// সব রিপোর্ট এডমিন অথেনটিকেশন প্রয়োজন

router.get('/sales', verifyAdminToken, reportController.getSalesReport);
router.get('/user-activity', verifyAdminToken, reportController.getUserActivityReport);
router.get('/product-performance', verifyAdminToken, reportController.getProductPerformanceReport);
router.get('/order-status', verifyAdminToken, reportController.getOrderStatusReport);
router.get('/coupon-usage', verifyAdminToken, reportController.getCouponUsageReport);
router.get('/return-requests', verifyAdminToken, reportController.getReturnRequestsReport);
router.get('/sales-by-category', verifyAdminToken, reportController.getSalesByCategoryReport);
router.get('/top-customers', verifyAdminToken, reportController.getTopCustomersReport);
router.get('/inventory-status', verifyAdminToken, reportController.getInventoryStatusReport);

module.exports = router;
