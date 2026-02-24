import express from 'express';
import { Sponsor, Testimonial, WebsiteContent, Achievement, ContactQuery } from '../models/Content.js';
import { protect, requirePermission } from '../middleware/auth.middleware.js';

const router = express.Router();

// ─── Sponsors ──────────────────────────────────────────────────────────────
router.get('/sponsors', async (req, res) => {
    try {
        const sponsors = await Sponsor.find({ isActive: true }).sort({ displayOrder: 1 });
        res.json({ sponsors });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/sponsors', protect, requirePermission('canManageSponsors'), async (req, res) => {
    try {
        const sponsor = await Sponsor.create(req.body);
        res.status(201).json({ sponsor });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/sponsors/:id', protect, requirePermission('canManageSponsors'), async (req, res) => {
    try {
        const sponsor = await Sponsor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ sponsor });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/sponsors/:id', protect, requirePermission('canManageSponsors'), async (req, res) => {
    try {
        await Sponsor.findByIdAndDelete(req.params.id);
        res.json({ message: 'Sponsor deleted.' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── Testimonials ──────────────────────────────────────────────────────────
router.get('/testimonials', async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ isActive: true }).sort({ displayOrder: 1 });
        res.json({ testimonials });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/testimonials', protect, requirePermission('canManageTestimonials'), async (req, res) => {
    try {
        const testimonial = await Testimonial.create(req.body);
        res.status(201).json({ testimonial });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/testimonials/:id', protect, requirePermission('canManageTestimonials'), async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ testimonial });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/testimonials/:id', protect, requirePermission('canManageTestimonials'), async (req, res) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id);
        res.json({ message: 'Testimonial deleted.' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── Achievements ──────────────────────────────────────────────────────────
router.get('/achievements', async (req, res) => {
    try {
        const achievements = await Achievement.find({ isActive: true }).sort({ displayOrder: 1 });
        res.json({ achievements });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/achievements', protect, requirePermission('canManageAchievements'), async (req, res) => {
    try {
        const achievement = await Achievement.create(req.body);
        res.status(201).json({ achievement });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/achievements/:id', protect, requirePermission('canManageAchievements'), async (req, res) => {
    try {
        const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ achievement });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/achievements/:id', protect, requirePermission('canManageAchievements'), async (req, res) => {
    try {
        await Achievement.findByIdAndDelete(req.params.id);
        res.json({ message: 'Achievement deleted.' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── Hero Content ──────────────────────────────────────────────────────────
// GET /api/content/hero — returns { content: { id, content } } or { content: null }
router.get('/hero', async (req, res) => {
    try {
        const section = await WebsiteContent.findOne({ sectionKey: 'hero', isActive: true });
        if (!section) return res.json({ content: null });
        res.json({ content: { id: section._id, content: section.content } });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/content/hero — create hero content
router.post('/hero', protect, requirePermission('canManageContent'), async (req, res) => {
    try {
        const section = await WebsiteContent.create({
            sectionKey: 'hero',
            title: 'Hero Section',
            content: req.body.content,
            isActive: true,
            updatedBy: req.user._id,
        });
        res.status(201).json({ id: section._id, content: section.content });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT /api/content/hero/:id — update hero content by id
router.put('/hero/:id', protect, requirePermission('canManageContent'), async (req, res) => {
    try {
        const section = await WebsiteContent.findByIdAndUpdate(
            req.params.id,
            { content: req.body.content, updatedBy: req.user._id },
            { new: true }
        );
        if (!section) return res.status(404).json({ error: 'Content not found.' });
        res.json({ id: section._id, content: section.content });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// ─── Page Content (Visual Editor) ───────────────────────────────────────────
router.get('/pages/:pageKey', async (req, res) => {
    try {
        const section = await WebsiteContent.findOne({ sectionKey: `page_${req.params.pageKey}`, isActive: true });
        if (!section) return res.json({ content: {} });
        const contentObj = {};
        if (section.content) section.content.forEach((v, k) => { contentObj[k] = v; });
        res.json({ content: contentObj });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/pages/:pageKey', protect, requirePermission('canManageContent'), async (req, res) => {
    try {
        let section = await WebsiteContent.findOne({ sectionKey: `page_${req.params.pageKey}` });
        if (!section) {
            section = new WebsiteContent({ sectionKey: `page_${req.params.pageKey}`, title: `Page: ${req.params.pageKey}`, isActive: true });
        }
        section.content = new Map();
        for (const [k, v] of Object.entries(req.body.content || {})) {
            section.content.set(k, v);
        }
        section.updatedBy = req.user._id;
        await section.save();
        const contentObj = {};
        section.content.forEach((v, k) => { contentObj[k] = v; });
        res.json({ content: contentObj });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// ─── Generic Website Content ────────────────────────────────────────────────
router.get('/content', async (req, res) => {
    try {
        const content = await WebsiteContent.find({ isActive: true }).sort({ displayOrder: 1 });
        res.json({ content });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/content/:sectionKey', async (req, res) => {
    try {
        const section = await WebsiteContent.findOne({ sectionKey: req.params.sectionKey, isActive: true });
        if (!section) return res.status(404).json({ error: 'Content section not found.' });
        res.json({ section });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/content/:sectionKey', protect, requirePermission('canManageContent'), async (req, res) => {
    try {
        const section = await WebsiteContent.findOneAndUpdate(
            { sectionKey: req.params.sectionKey },
            { ...req.body, updatedBy: req.user._id },
            { new: true, upsert: true }
        );
        res.json({ section });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// ─── Contact Queries ───────────────────────────────────────────────────────
router.post('/contact', async (req, res) => {
    try {
        const query = await ContactQuery.create(req.body);
        res.status(201).json({ message: 'Query received.', query });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.get('/contact', protect, requirePermission('canViewContactQueries'), async (req, res) => {
    try {
        const queries = await ContactQuery.find().sort({ createdAt: -1 });
        res.json({ queries });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/contact/:id', protect, requirePermission('canViewContactQueries'), async (req, res) => {
    try {
        const query = await ContactQuery.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status, resolvedBy: req.user._id, resolvedAt: new Date() },
            { new: true }
        );
        res.json({ query });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE /api/content/contact/:id
router.delete('/contact/:id', protect, requirePermission('canViewContactQueries'), async (req, res) => {
    try {
        await ContactQuery.findByIdAndDelete(req.params.id);
        res.json({ message: 'Contact query deleted.' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
