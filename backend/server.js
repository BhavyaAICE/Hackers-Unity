import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import eventRoutes from './routes/events.routes.js';
import hackathonRoutes from './routes/hackathons.routes.js';
import adminRoutes from './routes/admin.routes.js';
import contentRoutes from './routes/content.routes.js';
import userRoutes from './routes/users.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost:4173',
];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        // Allow any *.vercel.app subdomain (preview + production deployments)
        if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return callback(null, true);
        if (allowedOrigins.some(o => origin.startsWith(o.replace(/\/$/, ''))) ||
            /^http:\/\/localhost:\d+$/.test(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically (local dev only — Vercel filesystem is read-only)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ─── DB connection middleware ───────────────────────────────────────────────
// Connect per-request so failures return a 503 instead of crashing the container.
// connectDB() caches the connection, so subsequent calls are instant.
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('DB connection failed:', err.message);
        res.status(503).json({ error: 'Database unavailable. Check MONGODB_URI and Atlas IP whitelist.' });
    }
});

// ─── Routes ────────────────────────────────────────────────────────────────
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/events', eventRoutes);
apiRouter.use('/hackathons', hackathonRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/content', contentRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/upload', uploadRoutes);

// Health check (bypasses DB middleware — always responds)
apiRouter.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Mount for local dev (frontend calls /api/...)
app.use('/api', apiRouter);

// Mount for Vercel Services (where the /api prefix is stripped from the URL)
app.use('/', apiRouter);

// ─── 404 Handler ───────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found.` });
});

// ─── Global Error Handler ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error.',
    });
});

// ─── Start Server (local dev only) ─────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
    // Connect eagerly in local dev for fast startup feedback
    connectDB().catch(console.error);
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

// ─── Vercel Serverless Export ──────────────────────────────────────────────
export default app;
