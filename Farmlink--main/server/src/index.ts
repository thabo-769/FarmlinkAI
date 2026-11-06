import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { config } from './config.js';
import auth from './routes/auth.js';
import products from './routes/products.js';
import assistant from './routes/assistant.js';
import disease from './routes/disease.js';
import tasks from './routes/tasks.js';
import prices from './routes/prices.js';
import reports from './routes/reports.js';
import weather from './routes/weather.js';
import admin from './routes/admin.js';
import analytics from './routes/analytics.js';
import irrigation from './routes/irrigation.js';
import { errors, notFound } from './middleware/errors.js';

export const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed = config.clientUrl.split(',').map((s) => s.trim());
      if (
        allowed.includes('*') ||
        allowed.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.startsWith('http://localhost:')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));

const api = express.Router();
api.get('/health', (_req, res) => res.json({ status: 'ok', service: 'farmlink-api' }));
api.use('/auth', auth);
api.use('/products', products);
api.use('/ai', assistant);
api.use('/disease', disease);
api.use('/tasks', tasks);
api.use('/prices', prices);
api.use('/reports', reports);
api.use('/weather', weather);
api.use('/admin', admin);
api.use('/analytics', analytics);
api.use('/irrigation', irrigation);

// Robust routing matching:
// /api/v1/..., /api/..., /v1/..., and direct routes
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'farmlink-api' }));
app.use('/api/v1', api);
app.use('/api', api);
app.use('/v1', api);
app.use('/', api);

app.use(notFound);
app.use(errors);

if (!process.env.VERCEL) {
  app.listen(config.port, () => console.info(`FarmLink API listening on ${config.port}`));
}

export default app;
