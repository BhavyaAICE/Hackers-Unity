import express from 'express';
import { Event, Speaker } from '../models/Event.js';
import EventRegistration from '../models/Registration.js';
import { protect, requireAdmin, requirePermission } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/events — public: list all events
router.get('/', async (req, res) => {
    try {
        const { status, type, limit = 50, page = 1 } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (type) filter.eventType = type;

        const events = await Event.find(filter)
            .populate('speakers', 'name title organization avatarUrl')
            .sort({ eventDate: 1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Event.countDocuments(filter);
        res.json({ events, total, page: Number(page), totalCount: total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/events/admin/registrations — total registration count across all events
router.get('/admin/registrations', protect, requirePermission('canViewRegistrations'), async (req, res) => {
    try {
        const totalCount = await EventRegistration.countDocuments();
        res.json({ totalCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/events/my/registrations — user's own registrations
router.get('/my/registrations', protect, async (req, res) => {
    try {
        const registrations = await EventRegistration.find({ user: req.user._id })
            .populate('event', 'title eventDate status thumbnailImage');
        res.json({ registrations });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/events/:id — public: single event (full detail)
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('speakers', 'name title organization avatarUrl linkedinUrl bio')
            .populate('createdBy', 'fullName email');
        if (!event) return res.status(404).json({ error: 'Event not found.' });
        res.json({ event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/events — admin only
router.post('/', protect, requirePermission('canManageEvents'), async (req, res) => {
    try {
        const event = await Event.create({ ...req.body, createdBy: req.user._id });
        res.status(201).json({ event });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/events/:id — admin only
router.put('/:id', protect, requirePermission('canManageEvents'), async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!event) return res.status(404).json({ error: 'Event not found.' });
        res.json({ event });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/events/:id — admin only
router.delete('/:id', protect, requireAdmin, async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        // Also delete all registrations for this event
        await EventRegistration.deleteMany({ event: req.params.id });
        res.json({ message: 'Event deleted.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/events/:id/register — authenticated users
router.post('/:id/register', protect, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found.' });
        if (!event.registrationEnabled) return res.status(400).json({ error: 'Registration is closed.' });
        if (event.maxParticipants && event.registrationCount >= event.maxParticipants) {
            return res.status(400).json({ error: 'Event is full.' });
        }

        const registration = await EventRegistration.create({
            event: event._id,
            user: req.user._id,
            fullName: req.body.fullName || req.user.fullName,
            email: req.body.email || req.user.email,
            phone: req.body.phone,
            organization: req.body.organization,
            designation: req.body.designation,
            customFields: req.body.customFields || {},
        });

        // Increment registration count
        await Event.findByIdAndUpdate(event._id, { $inc: { registrationCount: 1 } });

        res.status(201).json({ registration });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ error: 'You are already registered for this event.' });
        res.status(400).json({ error: err.message });
    }
});

// GET /api/events/:id/registrations — admin only
router.get('/:id/registrations', protect, requirePermission('canViewRegistrations'), async (req, res) => {
    try {
        const registrations = await EventRegistration.find({ event: req.params.id })
            .populate('user', 'email fullName');
        res.json({ registrations });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
