const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

exports.adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const admin = await Admin.findOne({ username });
        if (!admin || admin.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { id: admin._id, role: 'admin' },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        return res.json({
            token,
            admin: { id: admin._id, username: admin.username }
        });
    } catch (error) {
        console.error('adminLogin error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.updateAdminCredentials = async (req, res) => {
    try {
        const admin = req.admin;
        const { username, password } = req.body;

        if (username) admin.username = username;
        if (password) admin.password = password;

        await admin.save();

        return res.json({
            message: 'Admin credentials updated',
            admin: { id: admin._id, username: admin.username },
        });
    } catch (error) {
        console.error('updateAdminCredentials error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
