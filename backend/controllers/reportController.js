const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const ReturnRequest = require('../models/ReturnRequest');

/**
 * Get sales report for the last 30 days:
 * - total sales amount
 * - total orders
 * - average order value
 */
exports.getSalesReport = async (req, res) => {
    try {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const salesData = await Order.aggregate([
            { $match: { createdAt: { $gte: last30Days }, paymentStatus: 'paid' } },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 },
                    avgOrderValue: { $avg: '$totalAmount' },
                },
            },
        ]);

        res.json({ success: true, data: salesData[0] || {} });
    } catch (error) {
        console.error('getSalesReport error:', error);
        res.status(500).json({ success: false, message: 'Server error generating sales report' });
    }
};

/**
 * Get user activity report for the last 30 days:
 * - total users
 * - active users who placed orders
 * - active user percentage
 */
exports.getUserActivityReport = async (req, res) => {
    try {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const totalUsers = await User.countDocuments();
        const activeUsers = await Order.distinct('user', { createdAt: { $gte: last30Days } });

        res.json({
            success: true,
            data: {
                totalUsers,
                activeUsers: activeUsers.length,
                activeUserPercentage: ((activeUsers.length / totalUsers) * 100).toFixed(2),
            },
        });
    } catch (error) {
        console.error('getUserActivityReport error:', error);
        res.status(500).json({ success: false, message: 'Server error generating user activity report' });
    }
};

/**
 * Get product performance report:
 * - total quantity sold per product
 * - total sales amount per product
 */
exports.getProductPerformanceReport = async (req, res) => {
    try {
        const productPerformance = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalQuantitySold: { $sum: '$items.quantity' },
                    totalSalesAmount: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails',
                },
            },
            { $unwind: '$productDetails' },
            {
                $project: {
                    productId: '$_id',
                    name: '$productDetails.name',
                    totalQuantitySold: 1,
                    totalSalesAmount: 1,
                },
            },
            { $sort: { totalQuantitySold: -1 } },
        ]);

        res.json({ success: true, data: productPerformance });
    } catch (error) {
        console.error('getProductPerformanceReport error:', error);
        res.status(500).json({ success: false, message: 'Server error generating product performance report' });
    }
};

/**
 * Get order status distribution report.
 */
exports.getOrderStatusReport = async (req, res) => {
    try {
        const statusCounts = await Order.aggregate([
            {
                $group: {
                    _id: '$orderStatus',
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json({ success: true, data: statusCounts });
    } catch (error) {
        console.error('getOrderStatusReport error:', error);
        res.status(500).json({ success: false, message: 'Server error generating order status report' });
    }
};

/**
 * Get coupon usage report:
 * - usage count per coupon
 * - total discount amount per coupon
 */
exports.getCouponUsageReport = async (req, res) => {
    try {
        const couponStats = await Order.aggregate([
            { $match: { coupon: { $ne: null }, paymentStatus: 'paid' } },
            {
                $group: {
                    _id: '$coupon.code',
                    usageCount: { $sum: 1 },
                    totalDiscount: { $sum: '$coupon.discountValue' },
                },
            },
            { $sort: { usageCount: -1 } },
        ]);

        res.json({ success: true, data: couponStats });
    } catch (error) {
        console.error('getCouponUsageReport error:', error);
        res.status(500).json({ success: false, message: 'Server error generating coupon usage report' });
    }
};

/**
 * Get return/refund request statistics.
 */
exports.getReturnRequestsReport = async (req, res) => {
    try {
        const totalRequests = await ReturnRequest.countDocuments();
        const pendingRequests = await ReturnRequest.countDocuments({ status: 'pending' });
        const approvedRequests = await ReturnRequest.countDocuments({ status: 'approved' });
        const rejectedRequests = await ReturnRequest.countDocuments({ status: 'rejected' });

        res.json({
            success: true,
            data: {
                totalRequests,
                pendingRequests,
                approvedRequests,
                rejectedRequests,
            },
        });
    } catch (error) {
        console.error('getReturnRequestsReport error:', error);
        res.status(500).json({ success: false, message: 'Server error generating return requests report' });
    }
};

/**
 * Get sales by category report.
 */
exports.getSalesByCategoryReport = async (req, res) => {
    try {
        const salesByCategory = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'productDetails',
                },
            },
            { $unwind: '$productDetails' },
            {
                $group: {
                    _id: '$productDetails.category',
                    totalSales: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
                    totalQuantity: { $sum: '$items.quantity' },
                },
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryDetails',
                },
            },
            { $unwind: '$categoryDetails' },
            {
                $project: {
                    categoryId: '$_id',
                    categoryName: '$categoryDetails.name',
                    totalSales: 1,
                    totalQuantity: 1,
                },
            },
            { $sort: { totalSales: -1 } },
        ]);

        res.json({ success: true, data: salesByCategory });
    } catch (error) {
        console.error('getSalesByCategoryReport error:', error);
        res.status(500).json({ success: false, message: 'Server error generating sales by category report' });
    }
};

/**
 * Get top customers report (top 10 by total spent).
 */
exports.getTopCustomersReport = async (req, res) => {
    try {
        const topCustomers = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            {
                $group: {
                    _id: '$user',
                    totalSpent: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            { $unwind: '$userDetails' },
            {
                $project: {
                    userId: '$_id',
                    userName: '$userDetails.name',
                    totalSpent: 1,
                    totalOrders: 1,
                },
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 10 },
        ]);

        res.json({ success: true, data: topCustomers });
    } catch (error) {
        console.error('getTopCustomersReport error:', error);
        res.status(500).json({ success: false, message: 'Server error generating top customers report' });
    }
};

/**
 * Get inventory status report by summing stock in product variants.
 */
exports.getInventoryStatusReport = async (req, res) => {
    try {
        const inventoryStatus = await Product.aggregate([
            {
                $project: {
                    name: 1,
                    totalStock: { $sum: '$variants.stock' },
                },
            },
            { $sort: { totalStock: -1 } },
        ]);

        res.json({ success: true, data: inventoryStatus });
    } catch (error) {
        console.error('getInventoryStatusReport error:', error);
        res.status(500).json({ success: false, message: 'Server error generating inventory status report' });
    }
};
