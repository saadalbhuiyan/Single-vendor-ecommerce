const User = require('../models/User');

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-jwtToken').sort({ createdAt: -1 }); // exclude token for security
        return res.json(users);
    } catch (error) {
        console.error('getAllUsers error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// GET /api/admin/users/:id
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId, '-jwtToken');
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.json(user);
    } catch (error) {
        console.error('getUserById error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// PUT /api/admin/users/:id
exports.updateUserStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const { isActive } = req.body;

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({ message: 'isActive boolean field is required' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isActive = isActive;
        await user.save();

        return res.json({ message: `User ${isActive ? 'activated' : 'suspended'}`, user });
    } catch (error) {
        console.error('updateUserStatus error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('deleteUser error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
