const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

/**
 * Admin Login Controller
 * Authenticates admin by username and password,
 * returns JWT token upon successful login.
 */
exports.adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input presence
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        // Find admin by username
        const admin = await Admin.findOne({ username });
        if (!admin) {
            // Avoid exposing which field is wrong
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // Plain text password check (insecure, but as requested)
        if (admin.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // Check JWT secret availability
        if (!jwtConfig.secret) {
            console.error('JWT secret is not configured');
            return res.status(500).json({ message: 'Server configuration error.' });
        }

        // Generate JWT token with admin id and role
        const token = jwt.sign(
            { id: admin._id, role: 'admin' },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn || '1h' }
        );

        // Return token and admin info (exclude sensitive data)
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
 * Update Admin Credentials Controller
 * Allows admin to update username and/or password.
 * Password stored as plain text (not recommended).
 */
exports.updateAdminCredentials = async (req, res) => {
    try {
        const admin = req.admin; // Assumes req.admin set by auth middleware
        if (!admin) {
            return res.status(401).json({ message: 'Unauthorized. Admin not found.' });
        }

        const { username, password } = req.body;

        // Update username if provided
        if (username) {
            admin.username = username;
        }

        // Update password if provided (plain text)
        if (password) {
            if (password.length < 8) {
                return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
            }
            admin.password = password;
        }

        // Save updated admin data
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
