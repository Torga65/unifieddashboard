import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import portfolioRoutes from './routes/portfolio.js';
import { reload as reloadSnapshot, getSnapshotDate, hasSnapshot } from './snapshot-reader.js';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS — allow the EDS dev server and any localhost origin
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin(origin, cb) {
    // Allow requests with no origin (curl, server-to-server) and any localhost
    if (!origin || allowedOrigins.includes(origin) || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      cb(null, true);
    } else {
      console.warn(`[CORS] Blocked origin: ${origin}`);
      cb(null, true); // permissive in dev — tighten for prod
    }
  },
  credentials: true,
}));

app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    snapshot: hasSnapshot() ? { date: getSnapshotDate() } : null,
  });
});

// Reload snapshot from disk (call after running the snapshot script)
app.post('/api/snapshot/reload', (_req, res) => {
  try {
    const snap = reloadSnapshot();
    if (snap) {
      return res.json({ status: 'reloaded', date: snap.snapshotDate, opportunities: snap.opportunityCount });
    }
    return res.status(404).json({ status: 'error', error: 'No snapshot found on disk' });
  } catch (err) {
    console.error('[ASO Server] Snapshot reload failed:', err);
    return res.status(500).json({ status: 'error', error: 'Reload failed' });
  }
});
});

// Portfolio routes
app.use('/api/portfolio', portfolioRoutes);

// Load snapshot on startup
reloadSnapshot();

app.listen(PORT, () => {
  console.log(`[ASO Server] Running on http://localhost:${PORT}`);
  console.log(`[ASO Server] Portfolio endpoint: GET /api/portfolio/opportunity-metrics`);
  if (hasSnapshot()) {
    console.log(`[ASO Server] Snapshot loaded: ${getSnapshotDate()}`);
  } else {
    console.log(`[ASO Server] No snapshot found — run: node scripts/snapshot.js --token <TOKEN>`);
  }
});

export default app;
