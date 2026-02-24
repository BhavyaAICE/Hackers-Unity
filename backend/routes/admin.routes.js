import express from 'express';
import User from '../models/User.js';
import AdminPermission from '../models/AdminPermission.js';
import { protect, requireAdmin, requirePermission } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/admin/permissions — returns current user's permissions object
router.get('/permissions', protect, async (req, res) => {
    try {
        if (req.user.isAdmin) {
            return res.json({
                permissions: {
                    is_super_admin: true,
                    can_view_dashboard: true,
                    can_manage_events: true,
                    can_manage_hackathons: true,
                    can_view_registrations: true,
                    can_export_data: true,
                    can_manage_sponsors: true,
                    can_manage_testimonials: true,
                    can_manage_content: true,
                    can_manage_achievements: true,
                    can_view_contact_queries: true,
                    can_manage_users: true,
                },
            });
        }

        const perm = await AdminPermission.findOne({ user: req.user._id, isActive: true });
        if (!perm) {
            return res.json({
                permissions: {
                    is_super_admin: false, can_view_dashboard: false, can_manage_events: false,
                    can_manage_hackathons: false, can_view_registrations: false, can_export_data: false,
                    can_manage_sponsors: false, can_manage_testimonials: false, can_manage_content: false,
                    can_manage_achievements: false, can_view_contact_queries: false, can_manage_users: false,
                },
            });
        }

        res.json({
            permissions: {
                is_super_admin: false,
                can_view_dashboard: perm.canViewDashboard,
                can_manage_events: perm.canManageEvents,
                can_manage_hackathons: perm.canManageHackathons,
                can_view_registrations: perm.canViewRegistrations,
                can_export_data: perm.canExportData,
                can_manage_sponsors: perm.canManageSponsors,
                can_manage_testimonials: perm.canManageTestimonials,
                can_manage_content: perm.canManageContent,
                can_manage_achievements: perm.canManageAchievements,
                can_view_contact_queries: perm.canViewContactQueries,
                can_manage_users: perm.canManageUsers,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/admin/users — list all users (admin only)
router.get('/users', protect, requirePermission('canManageUsers'), async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/admin/users/:id — update user (toggle admin, etc.)
router.put('/users/:id', protect, requireAdmin, async (req, res) => {
    try {
        const { isAdmin } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { isAdmin }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json({ user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST /api/admin/invite — invite admin with permissions
router.post('/invite', protect, requireAdmin, async (req, res) => {
    try {
        const { email, permissions } = req.body;
        const inviteToken = Math.random().toString(36).substring(2) + Date.now().toString(36);

        const perm = await AdminPermission.findOneAndUpdate(
            { email: email.toLowerCase() },
            {
                email: email.toLowerCase(),
                invitedBy: req.user._id,
                inviteToken,
                isActive: true,
                ...permissions,
            },
            { upsert: true, new: true }
        );

        // TODO: Send invite email via Resend
        res.status(201).json({ message: 'Invitation sent.', inviteToken });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /api/admin/all-permissions — list all admin permission records
router.get('/all-permissions', protect, requirePermission('canManageUsers'), async (req, res) => {
    try {
        const permissions = await AdminPermission.find()
            .populate('user', 'fullName email avatarUrl')
            .populate('invitedBy', 'fullName email');
        res.json({ permissions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/admin/all-permissions/:id  (canonical)
router.put('/all-permissions/:id', protect, requireAdmin, async (req, res) => {
    try {
        const perm = await AdminPermission.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!perm) return res.status(404).json({ error: 'Permission record not found.' });
        res.json({ permission: perm });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/admin/all-permissions/:id  (canonical)
router.delete('/all-permissions/:id', protect, requireAdmin, async (req, res) => {
    try {
        await AdminPermission.findByIdAndDelete(req.params.id);
        res.json({ message: 'Permission record deleted.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Aliases for /permissions/:id (frontend compatibility) ─────────────────

// PUT /api/admin/permissions/:id  → alias for /all-permissions/:id
router.put('/permissions/:id', protect, requireAdmin, async (req, res) => {
    try {
        const perm = await AdminPermission.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!perm) return res.status(404).json({ error: 'Permission record not found.' });
        res.json({ permission: perm });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/admin/permissions/:id → alias for /all-permissions/:id
router.delete('/permissions/:id', protect, requireAdmin, async (req, res) => {
    try {
        await AdminPermission.findByIdAndDelete(req.params.id);
        res.json({ message: 'Permission record deleted.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
