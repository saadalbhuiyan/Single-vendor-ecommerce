require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const orderController = require('./controllers/orderController');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB database
connectDB();

// Middleware setup
app.use(cors()); // Enable CORS for all origins by default (consider restricting in production)
app.use(express.json()); // Parse JSON request bodies
app.use('/uploads', express.static('uploads')); // Serve uploaded static files

// Authentication routes (login, OTP, signup, etc.)
app.use('/api/auth', require('./routes/authRoutes'));

// User profile and account management routes
app.use('/api/users', require('./routes/userRoutes'));

// Admin routes for authentication and management
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin/users', require('./routes/adminUserRoutes'));
app.use('/api/admin/categories', require('./routes/adminCategoryRoutes'));
app.use('/api/admin/products', require('./routes/adminProductRoutes'));
app.use('/api/admin/wishlist', require('./routes/adminWishlistRoutes'));
app.use('/api/admin/coupons', require('./routes/adminCouponRoutes'));
app.use('/api/admin/orders', require('./routes/adminOrderRoutes'));
app.use('/api/admin/reports', require('./routes/adminReportRoutes'));

// Public category and product routes
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// Wishlist routes for users
app.use('/api/wishlist', require('./routes/wishlistRoutes'));

// Coupon routes for users
app.use('/api/coupons', require('./routes/couponRoutes'));

// Cart management routes
app.use('/api/cart', require('./routes/cartRoutes'));

// User order routes
app.use('/api/orders', require('./routes/orderRoutes'));

// Payment gateway callback/webhook endpoints
app.post('/api/payment/success', orderController.handlePaymentSuccess);
app.post('/api/payment/fail', orderController.handlePaymentFail);

// Start server listening on the configured port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
