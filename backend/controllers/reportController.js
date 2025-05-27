const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const ReturnRequest = require('../models/ReturnRequest');

exports.getSalesReport = async (req, res) => {
    try {
        // মোট বিক্রয়, মোট অর্ডার, গড় অর্ডার মূল্য, সময় ভিত্তিক (last 30 days)
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
                }
            }
        ]);

        res.json({ success: true, data: salesData[0] || {} });
    } catch (error) {
        console.error('getSalesReport error:', error);
        res.status(500).json({ success: false, message: 'Server error generating sales report' });
    }
};

exports.getUserActivityReport = async (req, res) => {
    try {
        // ইউজার সংখ্যা, গত 30 দিনে কতজন অ্যাকটিভ ছিল (অর্ডার করেছে)
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
            }
        });
    } catch (error) {
        console.error('getUserActivityReport error:', error);
        res.status(500).json({ success: false, message: 'Server error generating user activity report' });
    }
};

exports.getProductPerformanceReport = async (req, res) => {
    try {
        // প্রতিটি প্রোডাক্টের মোট বিক্রয় সংখ্যা ও পরিমাণ
        const productPerformance = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalQuantitySold: { $sum: '$items.quantity' },
                    totalSalesAmount: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $project: {
                    productId: '$_id',
                    name: '$productDetails.name',
                    totalQuantitySold: 1,
                    totalSalesAmount: 1
                }
            },
            { $sort: { totalQuantitySold: -1 } }
        ]);

        res.json({ success: true, data: productPerformance });
    } catch (error) {
        console.error('getProductPerformanceReport error:', error);
        res.status(500).json({ success: false, message: 'Server error generating product performance report' });
    }
};

exports.getOrderStatusReport = async (req, res) => {
    try {
        // অর্ডারের স্ট্যাটাস অনুযায়ী সংখ্যা
        const statusCounts = await Order.aggregate([
            {
                $group: {
                    _id: '$orderStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({ success: true, data: statusCounts });
    } catch (error) {
        console.error('getOrderStatusReport error:', error);
        res.status(500).json({ success: false, message: 'Server error generating order status report' });
    }
};

exports.getCouponUsageReport = async (req, res) => {
    try {
        // প্রতিটি কুপনের ব্যবহার এবং সফলতা হার
        const couponStats = await Order.aggregate([
            { $match: { coupon: { $ne: null }, paymentStatus: 'paid' } },
            {
                $group: {
                    _id: '$coupon.code',
                    usageCount: { $sum: 1 },
                    totalDiscount: { $sum: '$coupon.discountValue' }
                }
            },
            { $sort: { usageCount: -1 } }
        ]);

        res.json({ success: true, data: couponStats });
    } catch (error) {
        console.error('getCouponUsageReport error:', error);
        res.status(500).json({ success: false, message: 'Server error generating coupon usage report' });
    }
};

exports.getReturnRequestsReport = async (req, res) => {
    try {
        // রিটার্ন/রিফান্ড রিকোয়েস্টের পরিসংখ্যান
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
            }
        });
    } catch (error) {
        console.error('getReturnRequestsReport error:', error);
        res.status(500).json({ success: false, message: 'Server error generating return requests report' });
    }
};

exports.getSalesByCategoryReport = async (req, res) => {
    try {
        // ক্যাটাগরি অনুযায়ী বিক্রয় পরিমাণ
        const salesByCategory = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $group: {
                    _id: '$productDetails.category',
                    totalSales: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
                    totalQuantity: { $sum: '$items.quantity' }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryDetails'
                }
            },
            { $unwind: '$categoryDetails' },
            {
                $project: {
                    categoryId: '$_id',
                    categoryName: '$categoryDetails.name',
                    totalSales: 1,
                    totalQuantity: 1
                }
            },
            { $sort: { totalSales: -1 } }
        ]);

        res.json({ success: true, data: salesByCategory });
    } catch (error) {
        console.error('getSalesByCategoryReport error:', error);
        res.status(500).json({ success: false, message: 'Server error generating sales by category report' });
    }
};

exports.getTopCustomersReport = async (req, res) => {
    try {
        // শীর্ষ ক্রেতাদের তালিকা (কতটা কেনা হয়েছে)
        const topCustomers = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            {
                $group: {
                    _id: '$user',
                    totalSpent: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            {
                $project: {
                    userId: '$_id',
                    userName: '$userDetails.name',
                    totalSpent: 1,
                    totalOrders: 1
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 10 }
        ]);

        res.json({ success: true, data: topCustomers });
    } catch (error) {
        console.error('getTopCustomersReport error:', error);
        res.status(500).json({ success: false, message: 'Server error generating top customers report' });
    }
};

exports.getInventoryStatusReport = async (req, res) => {
    try {
        // প্রোডাক্ট ইনভেন্টরি (স্টক) অবস্থা রিপোর্ট
        const inventoryStatus = await Product.aggregate([
            {
                $project: {
                    name: 1,
                    totalStock: { $sum: '$variants.stock' },
                }
            },
            { $sort: { totalStock: -1 } }
        ]);

        res.json({ success: true, data: inventoryStatus });
    } catch (error) {
        console.error('getInventoryStatusReport error:', error);
        res.status(500).json({ success: false, message: 'Server error generating inventory status report' });
    }
};
