import { Router } from 'express';
import { db } from '../db/store.js';
import { authenticate, allowRoles } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, allowRoles('admin'));

router.get('/summary', (_req, res) => {
  res.json({
    usersCount: db.profiles.size,
    productsCount: db.products.length,
    openReports: 0,
  });
});

export default router;
