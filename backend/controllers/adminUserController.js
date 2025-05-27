const User = require('../models/User');

/**
 * Retrieves all users excluding their JWT tokens for security.
 * Sorted by creation date in descending order.
 * GET /api/admin/users
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
 * Retrieves a single user by ID, excluding JWT token.
 * Returns 404 if user is not found.
 * GET /api/admin/users/:id
 */
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId, '-jwtToken');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json(user);
    } catch (error) {
        console.error('getUserById error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * Updates the 'isActive' status of a user.
 * Expects boolean field `isActive` in request body.
 * Returns 400 if invalid input or 404 if user not found.
 * PUT /api/admin/users/:id
 */
exports.updateUserStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const { isActive } = req.body;

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ message: '`isActive` boolean field is required.' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
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
 * Deletes a user by ID.
 * Returns 404 if user not found.
 * DELETE /api/admin/users/:id
 */
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('deleteUser error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
