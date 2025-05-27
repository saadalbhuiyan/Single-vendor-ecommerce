require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const orderController = require('./controllers/orderController');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware setup
app.use(cors());  // Enable Cross-Origin Resource Sharing
app.use(express.json());  // Parse incoming JSON requests
app.use('/uploads', express.static('uploads'));  // Serve static files (uploads)

// User & Authentication Routes
app.use('/api/auth', require('./routes/authRoutes'));  // Authentication routes (login, OTP)
app.use('/api/users', require('./routes/userRoutes'));  // User profile and account routes

// Admin Routes
app.use('/api/admin', require('./routes/adminRoutes'));  // Admin routes (auth)
app.use('/api/admin/users', require('./routes/adminUserRoutes'));  // Admin user management routes
app.use('/api/admin/categories', require('./routes/adminCategoryRoutes'));  // Admin category routes
app.use('/api/admin/products', require('./routes/adminProductRoutes'));  // Admin product management routes
app.use('/api/admin/wishlist', require('./routes/adminWishlistRoutes'));  // Admin wishlist management routes
app.use('/api/admin/coupons', require('./routes/adminCouponRoutes'));  // Admin coupon routes
app.use('/api/admin/orders', require('./routes/adminOrderRoutes'));  // Admin order management routes
app.use('/api/admin/reports', require('./routes/adminReportRoutes'));  // Admin reports

// Category and Product Routes (Public and Admin routes separated)
app.use('/api/categories', require('./routes/categoryRoutes'));  // Public category routes
app.use('/api/products', require('./routes/productRoutes'));  // Public product routes

// Wishlist Routes (Public and Admin routes separated)
app.use('/api/wishlist', require('./routes/wishlistRoutes'));  // Public wishlist routes

// Coupon Routes (Public and Admin routes separated)
app.use('/api/coupons', require('./routes/couponRoutes'));  // Public coupon routes

// Cart Routes
app.use('/api/cart', require('./routes/cartRoutes'));  // Cart management routes

// Order Routes (User and Admin routes separated)
app.use('/api/orders', require('./routes/orderRoutes'));  // User order routes

// Payment Callback Routes (simulate gateway webhooks)
app.post('/api/payment/success', orderController.handlePaymentSuccess);
app.post('/api/payment/fail', orderController.handlePaymentFail);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
