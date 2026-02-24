import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Vercel guard ──────────────────────────────────────────────────────────
// Vercel has a read-only filesystem — disk-based uploads are not supported.
// Return a clear error so the rest of the app doesn't crash.
const isVercel = !!process.env.VERCEL;

// ─── Storage setup (local dev only) ────────────────────────────────────────
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!isVercel && !fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

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

// Target widths per variant
const VARIANT_WIDTHS = {
    hero: 1920,
    section: 1200,
    mobile: 600,
    thumbnail: 400,
    original: null,
};

// ─── POST /api/upload ──────────────────────────────────────────────────────
router.post('/', protect, upload.single('file'), async (req, res) => {
    if (isVercel) {
        return res.status(503).json({
            error: 'File uploads are not supported in this deployment. Please configure cloud storage (e.g. Cloudinary).',
        });
    }

    try {
        if (!req.file) return res.status(400).json({ error: 'No file provided' });

        // Dynamically import sharp so it doesn't crash the module if unavailable
        const { default: sharp } = await import('sharp');

        const variant = req.query.variant || 'original';
        const prefix = (req.query.prefix || 'upload').toString().replace(/[^a-z0-9-]/gi, '-').slice(0, 30);
        const timestamp = Date.now();
        const filename = `${prefix}-${variant}-${timestamp}.webp`;
        const outPath = path.join(uploadsDir, filename);

        const targetWidth = VARIANT_WIDTHS[variant] ?? null;

        let sharpInstance = sharp(req.file.buffer);
        if (targetWidth) {
            sharpInstance = sharpInstance.resize(targetWidth, undefined, { withoutEnlargement: true });
        }
        await sharpInstance.webp({ quality: 85 }).toFile(outPath);

        const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`;
        const publicUrl = `${backendUrl}/uploads/${filename}`;

        res.json({ url: publicUrl, path: `uploads/${filename}` });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: err.message || 'Upload failed' });
    }
});

// ─── DELETE /api/upload?path=uploads/xxx.webp ──────────────────────────────
router.delete('/', protect, (req, res) => {
    if (isVercel) {
        return res.status(503).json({ error: 'File deletion is not supported in this deployment.' });
    }

    try {
        const filePath = req.query.path;
        if (!filePath) return res.status(400).json({ error: 'No path provided' });

        const absPath = path.resolve(__dirname, '../public', filePath);
        const safeDir = path.resolve(uploadsDir);

        if (!absPath.startsWith(safeDir)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
