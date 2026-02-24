import express from 'express';
import User from '../models/User.js';
import { protect, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/users/me — get own profile
router.get('/me', protect, async (req, res) => {
    try {
        res.json({
            user: {
                id: req.user._id,
                email: req.user.email,
                fullName: req.user.fullName,
                avatarUrl: req.user.avatarUrl,
                isAdmin: req.user.isAdmin,
                createdAt: req.user.createdAt,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/users/me — update own profile
router.put('/me', protect, async (req, res) => {
    try {
        const allowed = ['fullName', 'avatarUrl'];
        const updates = {};
        allowed.forEach((field) => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
        res.json({
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                avatarUrl: user.avatarUrl,
                isAdmin: user.isAdmin,
            },
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/users/me/password — change password
router.put('/me/password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect.' });

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully.' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /api/users — admin: list all users
router.get('/', protect, requireAdmin, async (req, res) => {
    try {
        const { limit = 50, page = 1 } = req.query;
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        const total = await User.countDocuments();
        res.json({ users, total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
