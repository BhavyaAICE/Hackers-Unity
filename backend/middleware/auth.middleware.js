import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - requires valid JWT
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ error: 'User no longer exists.' });
        }

        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

// Require admin role
export const requireAdmin = (req, res, next) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    next();
};

// Require admin OR specific permission
export const requirePermission = (permission) => async (req, res, next) => {
    if (req.user?.isAdmin) return next(); // super admin passes all checks

    const AdminPermission = (await import('../models/AdminPermission.js')).default;
    const perm = await AdminPermission.findOne({ user: req.user._id, isActive: true });

    if (!perm || !perm[permission]) {
        return res.status(403).json({ error: `Access denied. Missing permission: ${permission}` });
    }
    next();
};
