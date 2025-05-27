const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

/**
 * Handles admin login by validating credentials and issuing JWT token.
 * Expects `username` and `password` in the request body.
 */
exports.adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        // Find admin by username
        const admin = await Admin.findOne({ username });

        // Check if admin exists and password matches
        // NOTE: In production, use hashed passwords with bcrypt.compare()
        if (!admin || admin.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // Generate JWT token with admin ID and role
        const token = jwt.sign(
            { id: admin._id, role: 'admin' },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        return res.json({
            token,
            admin: { id: admin._id, username: admin.username },
        });
    } catch (error) {
        console.error('adminLogin error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Updates the admin’s credentials (username and/or password).
 * Expects authenticated admin to be available on `req.admin`.
 * Request body may include `username` and/or `password`.
 */
exports.updateAdminCredentials = async (req, res) => {
    try {
        const admin = req.admin;
        const { username, password } = req.body;

        // Update fields if provided
        if (username) admin.username = username;
        if (password) {
            // NOTE: Hash password before saving in production
            admin.password = password;
        }

        await admin.save();

        return res.json({
            message: 'Admin credentials updated successfully.',
            admin: { id: admin._id, username: admin.username },
        });
    } catch (error) {
        console.error('updateAdminCredentials error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
