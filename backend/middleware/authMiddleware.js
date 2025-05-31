const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const User = require('../models/User');
const Admin = require('../models/Admin');

/**
 * Extracts and verifies JWT token from Authorization header.
 * Returns the decoded payload if valid, otherwise throws.
 */
const extractAndVerifyToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('No token provided');
    }
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, jwtConfig.secret);
};

/**
 * Middleware to verify user JWT token.
 * Attaches user document to req.user if valid.
 */
const verifyUserToken = async (req, res, next) => {
    try {
        const decoded = extractAndVerifyToken(req.headers.authorization);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: ' + error.message });
    }
};

/**
 * Middleware to verify admin JWT token.
 * Attaches admin document to req.admin if valid.
 */
const verifyAdminToken = async (req, res, next) => {
    try {
        const decoded = extractAndVerifyToken(req.headers.authorization);
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(401).json({ message: 'Unauthorized: Admin not found' });
        }
        req.admin = admin;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: ' + error.message });
    }
};

module.exports = {
    verifyUserToken,
    verifyAdminToken,
};
