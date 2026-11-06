import { Router } from 'express';
import { marketPrices } from './pricesData.js';
import { db, type PriceAlertItem } from '../db/store.js';

const router = Router();

const DEFAULT_ALERTS: PriceAlertItem[] = [
  {
    id: 'alert-1',
    user_id: 'demo',
    crop: 'White Maize (Grain)',
    market: 'Mbare Musika',
    target_price: 0.40,
    currency: 'USD',
    condition: 'above',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    active: true,
  },
  {
    id: 'alert-2',
    user_id: 'demo',
    crop: 'Roma Tomatoes',
    market: 'Bulawayo Malaleni',
    target_price: 14.0,
    currency: 'USD',
    condition: 'above',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    active: true,
  },
];

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

router.get('/forecasts', (req, res) => {
  const forecasts = [
    {
      crop: 'White Maize (Grain)',
      current_price: 0.38,
      currency: 'USD/kg',
      forecast_30d: 0.42,
      trend: 'up',
      pct_change: '+10.5%',
      confidence: 'High (88%)',
      reasoning:
        'Lean season grain stocks depletion and peak pre-planting demand from local millers and livestock feed compounders.',
      recommendation:
        'Hold remaining commercial grain stocks until mid-December when regional depot spot prices typically peak before early green maize arrives.',
    },
    {
      crop: 'Roma Tomatoes',
      current_price: 12.0,
      currency: 'USD/crate (20kg)',
      forecast_30d: 14.5,
      trend: 'up',
      pct_change: '+20.8%',
      confidence: 'Medium (76%)',
      reasoning:
        'Heavy early summer rainfall in Mutoko and Mazowe restricts open-field supply, driving wholesale demand in Harare and Bulawayo.',
      recommendation:
        'Greenhouse or sheltered drip farmers should accelerate fruit sizing to capture peak Christmas holiday wholesale premiums.',
    },
    {
      crop: 'Soya Beans (Commercial)',
      current_price: 0.58,
      currency: 'USD/kg',
      forecast_30d: 0.60,
      trend: 'stable',
      pct_change: '+3.4%',
      confidence: 'High (92%)',
      reasoning:
        'Firm institutional procurement from edible oil expressers; import parity prices maintain support levels.',
      recommendation:
        'Contractual forward-delivery arrangements with crushing plants offer secure floor pricing.',
    },
    {
      crop: 'Waltham Butternut Squash',
      current_price: 0.65,
      currency: 'USD/kg',
      forecast_30d: 0.62,
      trend: 'down',
      pct_change: '-4.6%',
      confidence: 'Medium (70%)',
      reasoning:
        'Increased arrivals of winter-cured butternut from Midlands and Lowveld irrigated schemes arriving on urban wholesale markets.',
      recommendation:
        'Grade and pack into premium 10kg cartons for supermarket distribution rather than bulk open-air market sales.',
    },
  ];

  res.json({ data: forecasts });
});

router.get('/opportunities', (req, res) => {
  const opportunities = [
    {
      crop: 'Roma Tomatoes',
      high_market: 'Bulawayo Malaleni ($13.50/crate)',
      low_market: 'Mutoko Farmgate ($9.00/crate)',
      spread: '+$4.50/crate (+50%)',
      action: 'Direct refrigerated or evening transit to Bulawayo captures major price premium.',
    },
    {
      crop: 'Waltham Butternut',
      high_market: 'Mbare Musika Harare ($0.75/kg)',
      low_market: 'Gweru Wholesale ($0.55/kg)',
      spread: '+$0.20/kg (+36%)',
      action: 'Harare greengrocers experiencing high institutional restaurant demand.',
    },
    {
      crop: 'Free-Range Roadrunner Chickens',
      high_market: 'Harare Suburban ($7.50/bird)',
      low_market: 'Goromonzi Depots ($5.50/bird)',
      spread: '+$2.00/bird (+36%)',
      action: 'Dress and vacuum pack for Harare direct consumer home delivery.',
    },
  ];

  res.json({ data: opportunities });
});

router.get('/alerts', (req, res) => {
  const userId = (req as any).user?.id || 'demo';
  const alerts = db.priceAlerts.get(userId) || DEFAULT_ALERTS;
  res.json({ data: alerts });
});

router.post('/alerts', (req, res) => {
  const userId = (req as any).user?.id || 'demo';
  const alerts = db.priceAlerts.get(userId) || [...DEFAULT_ALERTS];

  const newAlert: PriceAlertItem = {
    id: 'alert-' + Date.now(),
    user_id: userId,
    crop: req.body.crop || 'White Maize',
    market: req.body.market || 'Mbare Musika',
    target_price: Number(req.body.target_price) || 0.4,
    currency: req.body.currency || 'USD',
    condition: req.body.condition || 'above',
    created_at: new Date().toISOString(),
    active: true,
  };

  alerts.unshift(newAlert);
  db.priceAlerts.set(userId, alerts);

  res.status(201).json({ data: newAlert });
});

router.delete('/alerts/:id', (req, res) => {
  const userId = (req as any).user?.id || 'demo';
  const alerts = db.priceAlerts.get(userId) || [...DEFAULT_ALERTS];
  const filtered = alerts.filter((a) => a.id !== req.params.id);
  db.priceAlerts.set(userId, filtered);
  res.json({ success: true });
});

export default router;