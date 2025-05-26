require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Admin routes separated by function
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin/users', require('./routes/adminUserRoutes'));

app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/admin/categories', require('./routes/adminCategoryRoutes'));

app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/admin/products', require('./routes/adminProductRoutes'));

app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/admin/wishlist', require('./routes/adminWishlistRoutes'));

// Admin coupon routes
app.use('/api/admin/coupons', require('./routes/adminCouponRoutes'));

// User coupon routes
app.use('/api/coupons', require('./routes/couponRoutes'));

app.use('/api/cart', require('./routes/cartRoutes'));


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
