import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

// POST /api/admin/auth/login
export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password)
            return res.status(400).json({ message: 'Username and password are required' });

        const admin = await Admin.findOne({ username });

        if (!admin || admin.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST /api/admin/auth/logout
// Stateless logout, client discards token
export const adminLogout = async (req, res) => {
    // Optional: Implement token blacklist if desired
    res.json({ message: 'Logout successful (client side token discard)' });
};

// PUT /api/admin/credentials
// Admin updates username and/or password
export const updateAdminCredentials = async (req, res) => {
    try {
        const { username, password } = req.body;
        const adminId = req.admin._id;

        const admin = await Admin.findById(adminId);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        if (username) admin.username = username;
        if (password) admin.password = password;

        await admin.save();

        res.json({ message: 'Admin credentials updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
