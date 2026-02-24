import express from 'express';
import { Event } from '../models/Event.js';
import { protect, requirePermission, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/hackathons — public: list all hackathons (events with type=hackathon)
router.get('/', async (req, res) => {
    try {
        const { status, limit = 50, page = 1 } = req.query;
        const filter = { eventType: 'hackathon' };
        if (status) filter.status = status;

        const events = await Event.find(filter)
            .sort({ eventDate: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .select('-challenges -mentors -jury -prizes -faqs -winners -schedule'); // lightweight list

        const total = await Event.countDocuments(filter);
        res.json({ events, total, page: Number(page) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/hackathons/:id — public: full hackathon detail with all embedded data
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findOne({ _id: req.params.id, eventType: 'hackathon' })
            .populate('speakers', 'name title organization avatarUrl linkedinUrl bio')
            .populate('createdBy', 'fullName email');

        if (!event) return res.status(404).json({ error: 'Hackathon not found.' });
        res.json({ event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/hackathons — admin only (delegates to Event model)
router.post('/', protect, requirePermission('canManageHackathons'), async (req, res) => {
    try {
        const event = await Event.create({
            ...req.body,
            eventType: 'hackathon',
            createdBy: req.user._id,
        });
        res.status(201).json({ event });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/hackathons/:id — admin only
router.put('/:id', protect, requirePermission('canManageHackathons'), async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { ...req.body, eventType: 'hackathon' },
            { new: true, runValidators: true }
        );
        if (!event) return res.status(404).json({ error: 'Hackathon not found.' });
        res.json({ event });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/hackathons/:id — admin only
router.delete('/:id', protect, requireAdmin, async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Hackathon deleted.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
