import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

router.post('/', (req, res) => {
  res.status(201).json({ status: 'received', message: 'Report submitted for review' });
});

router.get('/mine', (_req, res) => {
  res.json({ data: [] });
});

export default router;
