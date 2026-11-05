import { Router } from 'express';
import { db, type ProductItem } from '../db/store.js';
import { authenticate, allowRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { productSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(48, Math.max(1, Number(req.query.limit) || 12));
  let list = db.products.filter((p) => p.status === 'active');

  if (req.query.category && req.query.category !== 'All products') {
    list = list.filter((p) => p.category === String(req.query.category));
  }
  if (req.query.search) {
    const s = String(req.query.search).toLowerCase();
    list = list.filter((p) => `${p.name} ${p.location} ${p.description}`.toLowerCase().includes(s));
  }

  const paginated = list.slice((page - 1) * limit, page * limit);
  res.json({ data: paginated, page, limit, total: list.length });
});

router.get('/mine', authenticate, (req, res) => {
  const userId = req.user!.id;
  const mine = db.products.filter((p) => p.seller_id === userId);
  res.json({ data: mine });
});

router.get('/:id', (req, res) => {
  const item = db.products.find((p) => p.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json({ data: item });
});

router.post('/', authenticate, allowRoles('farmer', 'supplier'), validate(productSchema), (req, res) => {
  const userId = req.user!.id;
  const newProduct: ProductItem = {
    id: 'prod-' + Date.now(),
    seller_id: userId,
    name: req.body.name,
    category: req.body.category,
    description: req.body.description,
    price: Number(req.body.price),
    currency: req.body.currency || 'USD',
    quantity: Number(req.body.quantity),
    unit: req.body.unit,
    location: req.body.location,
    status: 'active',
    created_at: new Date().toISOString(),
    profiles: { full_name: (req.user as any)?.name || 'Local Farmer', location: req.body.location },
  };

  db.products.unshift(newProduct);
  res.status(201).json({ data: newProduct });
});

router.patch('/:id', authenticate, (req, res) => {
  const item = db.products.find((p) => p.id === req.params.id && p.seller_id === req.user!.id);
  if (!item) {
    res.status(404).json({ error: 'Product not found or unauthorized' });
    return;
  }
  Object.assign(item, req.body);
  res.json({ data: item });
});

router.delete('/:id', authenticate, (req, res) => {
  const idx = db.products.findIndex((p) => p.id === req.params.id && p.seller_id === req.user!.id);
  if (idx !== -1) {
    db.products.splice(idx, 1);
  }
  res.status(204).end();
});

export default router;
