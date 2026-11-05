import { Router } from 'express';
import { db, type UserProfile } from '../db/store.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, fullName, role, location } = req.body;
  const id = 'user-' + Date.now();
  db.profiles.set(id, {
    id,
    full_name: fullName || 'FarmLink member',
    role: role || 'farmer',
    location: location || 'Harare',
    created_at: new Date().toISOString(),
  });
  res.status(201).json({ status: 'ok', user: { id, email } });
});

router.post('/login', async (req, res) => {
  res.json({ status: 'ok' });
});

router.get('/profile', authenticate, async (req, res) => {
  const userId = req.user!.id;
  let prof = db.profiles.get(userId);
  if (!prof) {
    prof = {
      id: userId,
      full_name: req.user!.email ? req.user!.email.split('@')[0] : 'Farmer',
      role: 'farmer',
      location: 'Zimbabwe',
      created_at: new Date().toISOString(),
    };
    db.profiles.set(userId, prof);
  }
  res.json({ data: prof });
});

router.patch('/profile', authenticate, async (req, res) => {
  const userId = req.user!.id;
  let prof = db.profiles.get(userId);
  if (!prof) {
    prof = {
      id: userId,
      full_name: req.user!.email ? req.user!.email.split('@')[0] : 'Farmer',
      role: 'farmer',
      location: 'Zimbabwe',
      created_at: new Date().toISOString(),
    };
  }

  const updated: UserProfile = {
    ...prof,
    ...(req.body.full_name !== undefined ? { full_name: req.body.full_name } : {}),
    ...(req.body.role !== undefined ? { role: req.body.role } : {}),
    ...(req.body.location !== undefined ? { location: req.body.location } : {}),
    ...(req.body.phone !== undefined ? { phone: req.body.phone } : {}),
    ...(req.body.farm_name !== undefined ? { farm_name: req.body.farm_name } : {}),
    ...(req.body.farm_size !== undefined ? { farm_size: req.body.farm_size } : {}),
    ...(req.body.farming_type !== undefined ? { farming_type: req.body.farming_type } : {}),
    ...(req.body.bio !== undefined ? { bio: req.body.bio } : {}),
  };

  db.profiles.set(userId, updated);
  res.json({ data: updated });
});

export default router;
