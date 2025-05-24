// Same as provided before, but here it is again for clarity:

import User from '../models/User.js';

export const getUser = async (req, res) => {
    try {
        const user = req.user;
        res.json({
            email: user.email,
            name: user.name,
            mobile: user.mobile,
            addresses: user.addresses,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
        });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = req.user;

        if (name) user.name = name;
        if (email && email !== user.email) {
            user.email = email;
            user.isVerified = false;
        }

        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        res.json({ message: 'User deleted successfully' });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const { addresses } = req.body;
        if (!Array.isArray(addresses)) return res.status(400).json({ message: 'Addresses must be an array' });

        const user = req.user;
        user.addresses = addresses;
        await user.save();
        res.json({ message: 'Addresses updated successfully', addresses: user.addresses });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateMobile = async (req, res) => {
    try {
        const { mobile } = req.body;
        if (!mobile) return res.status(400).json({ message: 'Mobile number is required' });

        const user = req.user;
        user.mobile = mobile;
        await user.save();
        res.json({ message: 'Mobile number updated successfully', mobile: user.mobile });
    } catch {
        res.status(500).json({ message: 'Server error' });
    }
};
