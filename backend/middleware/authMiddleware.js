const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const User = require('../models/User');
const Admin = require('../models/Admin');

const verifyUserToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const decoded = jwt.verify(token, jwtConfig.secret);

        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: 'Unauthorized: User not found' });

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

const verifyAdminToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const decoded = jwt.verify(token, jwtConfig.secret);

        const admin = await Admin.findById(decoded.id);
        if (!admin) return res.status(401).json({ message: 'Unauthorized: Admin not found' });

        req.admin = admin;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = {
    verifyUserToken,
    verifyAdminToken,
};
