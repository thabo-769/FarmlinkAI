import { Router } from 'express';
import { marketPrices } from './pricesData.js';

const router = Router();

router.get('/', (req, res) => {
  let list = [...marketPrices];
  const query = String(req.query.q || req.query.crop || '').trim().toLowerCase();
  const category = String(req.query.category || '').trim().toLowerCase();
  const market = String(req.query.market || '').trim().toLowerCase();

  if (query) {
    list = list.filter((p) =>
      p.crop.toLowerCase().includes(query) ||
      p.market.toLowerCase().includes(query) ||
      p.city.toLowerCase().includes(query)
    );
  }
  if (category && category !== 'all' && category !== 'all products') {
    list = list.filter((p) => p.category.toLowerCase().includes(category));
  }
  if (market && market !== 'all' && market !== 'all zimbabwe') {
    list = list.filter((p) => p.market.toLowerCase().includes(market) || p.city.toLowerCase().includes(market));
  }

  res.json({
    data: list,
    updated_at: new Date().toISOString(),
    source_agency: 'Agricultural Marketing Authority (AMA) & Regional Depots',
    notice: 'Market prices are verified benchmark records from Mbare Musika, Bulawayo, Sakubva, GMB, and regional agricultural stations.',
  });
});

export default router;
