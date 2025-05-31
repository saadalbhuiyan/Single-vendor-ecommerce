const User = require('../models/User');
const path = require('path');
const fs = require('fs');

/**
 * Get authenticated user's profile information.
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
 * Update user's profile: name and email.
 * Email change resets email verification.
 */
exports.updateProfile = async (req, res) => {
    try {
        const user = req.user;
        const { name, email } = req.body;

        if (name !== undefined) user.name = name;

        if (email !== undefined && email !== user.email) {
            user.email = email;
            user.isEmailVerified = false; // Require re-verification
        }

        await user.save();

        return res.json({ message: 'Profile updated', user });
    } catch (error) {
        console.error('updateProfile error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Delete the authenticated user's account.
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
 * Update user's address.
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
 * Upload or update user's avatar image.
 * Deletes previous avatar file if exists.
 */
exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const user = req.user;

        // Remove old avatar file if exists
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
 * Mark user's email as verified after verification process.
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
