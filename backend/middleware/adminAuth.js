import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const adminAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(401).json({ message: 'Authorization token required' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin')
            return res.status(403).json({ message: 'Access denied. Admins only.' });

        const admin = await Admin.findById(decoded.id);
        if (!admin) return res.status(401).json({ message: 'Admin not found' });

        req.admin = admin; // Attach admin info
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
