export const adminCheck = (req, res, next) => {
    // Assume req.user is populated by auth middleware
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};
