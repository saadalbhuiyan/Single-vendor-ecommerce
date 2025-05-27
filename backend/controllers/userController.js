const User = require('../models/User');
const path = require('path');
const fs = require('fs');

/**
 * Get authenticated user's profile data.
 * GET /api/users/me
 */
exports.getProfile = async (req, res) => {
    try {
        const user = req.user;
        return res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            mobile: user.mobile,
            address: user.address,
            avatar: user.avatar,
            isEmailVerified: user.isEmailVerified,
        });
    } catch (error) {
        console.error('getProfile error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Update authenticated user's profile (name and/or email).
 * PATCH /api/users/me
 */
exports.updateProfile = async (req, res) => {
    try {
        const user = req.user;
        const { name, email } = req.body;

        if (name !== undefined) user.name = name;

        if (email !== undefined && email !== user.email) {
            user.email = email;
            user.isEmailVerified = false; // Reset verification on email change
        }

        await user.save();

        return res.json({ message: 'Profile updated', user });
    } catch (error) {
        console.error('updateProfile error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Delete authenticated user's account.
 * DELETE /api/users/me
 */
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        await User.findByIdAndDelete(userId);
        return res.json({ message: 'User account deleted' });
    } catch (error) {
        console.error('deleteAccount error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Update user's shipping address.
 * PATCH /api/users/me/address
 */
exports.updateAddress = async (req, res) => {
    try {
        const user = req.user;
        const { address } = req.body;
        if (!address) return res.status(400).json({ message: 'Address is required' });

        user.address = address;
        await user.save();

        return res.json({ message: 'Address updated', address: user.address });
    } catch (error) {
        console.error('updateAddress error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Update user's mobile number.
 * PATCH /api/users/me/mobile
 */
exports.updateMobile = async (req, res) => {
    try {
        const user = req.user;
        const { mobile } = req.body;
        if (!mobile) return res.status(400).json({ message: 'Mobile number is required' });

        user.mobile = mobile;
        await user.save();

        return res.json({ message: 'Mobile number updated', mobile: user.mobile });
    } catch (error) {
        console.error('updateMobile error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Upload and update user's avatar image.
 * POST /api/users/me/avatar
 * Expects a single file upload with field name 'avatar'.
 */
exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const user = req.user;

        // Delete old avatar file if exists
        if (user.avatar) {
            const oldPath = path.join(__dirname, '..', user.avatar);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        user.avatar = `uploads/${req.file.filename}`;
        await user.save();

        return res.json({ message: 'Avatar uploaded', avatar: user.avatar });
    } catch (error) {
        console.error('uploadAvatar error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Confirm and mark email as verified.
 * POST /api/users/me/verify-email-change
 */
exports.verifyEmailChange = async (req, res) => {
    try {
        const user = req.user;
        user.isEmailVerified = true;
        await user.save();

        return res.json({ message: 'Email verified' });
    } catch (error) {
        console.error('verifyEmailChange error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
