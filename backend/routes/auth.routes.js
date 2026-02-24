import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import AdminPermission from '../models/AdminPermission.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Helper to sign JWT
const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google — verify Google ID token, return our JWT
router.post('/google', async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) return res.status(400).json({ error: 'idToken is required.' });

        // Verify the token with Google
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Find existing user by googleId, or by email (merge account)
        let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] });

        if (user) {
            // Link googleId if not yet linked
            if (!user.googleId) {
                user.googleId = googleId;
                if (!user.avatarUrl && picture) user.avatarUrl = picture;
                await user.save({ validateBeforeSave: false });
            }
        } else {
            // Create new user
            user = await User.create({
                email: email.toLowerCase(),
                fullName: name || email.split('@')[0],
                avatarUrl: picture || '',
                googleId,
                isEmailVerified: true,
            });

            // Auto-link admin permissions if invited by email
            await AdminPermission.findOneAndUpdate(
                { email: email.toLowerCase(), user: null },
                { user: user._id, inviteAcceptedAt: new Date() }
            );
        }

        const token = signToken(user._id);
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                avatarUrl: user.avatarUrl,
                isAdmin: user.isAdmin,
            },
        });
    } catch (err) {
        console.error('Google auth error:', err);
        res.status(401).json({ error: 'Google authentication failed.' });
    }
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { email, password, fullName } = req.body;

        if (!email || !password || !fullName) {
            return res.status(400).json({ error: 'Email, password, and full name are required.' });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ error: 'An account with this email already exists.' });
        }

        // Create user
        const user = await User.create({ email, password, fullName, isEmailVerified: true });

        // Auto-link admin permissions if invited
        await AdminPermission.findOneAndUpdate(
            { email: email.toLowerCase(), user: null },
            { user: user._id, inviteAcceptedAt: new Date() }
        );

        const token = signToken(user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                avatarUrl: user.avatarUrl,
                isAdmin: user.isAdmin,
            },
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Server error during signup.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user || !user.password) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = signToken(user._id);

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                avatarUrl: user.avatarUrl,
                isAdmin: user.isAdmin,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error during login.' });
    }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email?.toLowerCase() });

        // Always respond the same (don't reveal if email exists)
        if (!user) {
            return res.json({ message: 'If that email exists, a reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        await user.save({ validateBeforeSave: false });

        // TODO: Send email via Resend with resetToken
        // For now, return token in dev (remove in production)
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        console.log('Password reset URL (dev only):', resetUrl);

        res.json({ message: 'If that email exists, a reset link has been sent.' });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token.' });
        }

        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        const jwtToken = signToken(user._id);
        res.json({ token: jwtToken, message: 'Password reset successful.' });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// GET /api/auth/me — get current user
router.get('/me', protect, async (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            email: req.user.email,
            fullName: req.user.fullName,
            avatarUrl: req.user.avatarUrl,
            isAdmin: req.user.isAdmin,
        },
    });
});

export default router;
