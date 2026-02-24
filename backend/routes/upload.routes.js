import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// ─── Cloudinary config ─────────────────────────────────────────────────────
// Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in
// your Vercel environment variables (and backend/.env for local dev)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Check credentials are present
const isCloudinaryConfigured = () =>
    !!(process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET);

// Target widths per variant for on-the-fly Cloudinary transformations
const VARIANT_WIDTHS = {
    hero: 1920,
    section: 1200,
    mobile: 600,
    thumbnail: 400,
    original: null,
};

// ─── Multer — memory storage (no disk I/O) ─────────────────────────────────
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
});

// ─── POST /api/upload ──────────────────────────────────────────────────────
router.post('/', protect, upload.single('file'), async (req, res) => {
    if (!isCloudinaryConfigured()) {
        return res.status(503).json({
            error: 'Image storage is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Vercel environment variables.',
        });
    }

    try {
        if (!req.file) return res.status(400).json({ error: 'No file provided' });

        const variant = req.query.variant || 'original';
        const prefix = (req.query.prefix || 'upload').toString().replace(/[^a-z0-9-]/gi, '-').slice(0, 30);
        const targetWidth = VARIANT_WIDTHS[variant] ?? null;

        // Upload buffer to Cloudinary via a stream
        const result = await new Promise((resolve, reject) => {
            const uploadOptions = {
                folder: 'hackers-unity',
                public_id: `${prefix}-${variant}-${Date.now()}`,
                resource_type: 'image',
                format: 'webp',
                quality: 85,
                transformation: targetWidth ? [{ width: targetWidth, crop: 'limit' }] : [],
            };

            const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });

            stream.end(req.file.buffer);
        });

        res.json({
            url: result.secure_url,          // permanent CDN URL
            path: result.public_id,           // Cloudinary public_id (used to delete)
        });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: err.message || 'Upload failed' });
    }
});

// ─── DELETE /api/upload?path=hackers-unity/xxx ─────────────────────────────
router.delete('/', protect, async (req, res) => {
    if (!isCloudinaryConfigured()) {
        return res.status(503).json({ error: 'Image storage is not configured.' });
    }

    try {
        const publicId = req.query.path;
        if (!publicId) return res.status(400).json({ error: 'No path provided' });

        await cloudinary.uploader.destroy(publicId);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
