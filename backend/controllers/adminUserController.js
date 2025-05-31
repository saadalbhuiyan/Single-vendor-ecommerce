const User = require('../models/User');

/**
 * Get all users, excluding sensitive JWT token,
 * sorted by creation date descending (newest first).
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-jwtToken').sort({ createdAt: -1 });
        return res.json(users);
    } catch (error) {
        console.error('getAllUsers error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Get user by ID, excluding sensitive JWT token.
 * Returns 404 if user not found.
 */
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        // Validate userId format (optional, but recommended)
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }

        const user = await User.findById(userId, '-jwtToken');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.json(user);
    } catch (error) {
        console.error('getUserById error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Update user's active status.
 * Accepts boolean `isActive` in request body.
 * Returns 400 if invalid input, 404 if user not found.
 */
exports.updateUserStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const { isActive } = req.body;

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ message: '`isActive` boolean field is required.' });
        }

        // Optional userId format validation
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.isActive = isActive;
        await user.save();

        return res.json({
            message: `User has been ${isActive ? 'activated' : 'suspended'}.`,
            user,
        });
    } catch (error) {
        console.error('updateUserStatus error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Delete user by ID.
 * Returns 404 if user not found.
 */
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Optional userId format validation
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('deleteUser error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
