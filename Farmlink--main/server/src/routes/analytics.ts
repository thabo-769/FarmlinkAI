import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { db, type FarmFinancialRecord } from '../db/store.js';

const router = Router();
router.use(authenticate);

const DEMO_FINANCIAL_RECORDS: FarmFinancialRecord[] = [
  {
    id: 'fin-1',
    user_id: 'demo',
    type: 'income',
    category: 'Crop Sales',
    crop: 'White Maize',
    amount: 3800,
    currency: 'USD',
    quantity: 10000,
    unit: 'kg',
    date: '2026-10-15',
    season: '2025/2026 Season',
    notes: 'Sold 10 metric tonnes to local grain aggregator at $0.38/kg',
  },
  {
    id: 'fin-2',
    user_id: 'demo',
    type: 'income',
    category: 'Crop Sales',
    crop: 'Roma Tomatoes',
    amount: 1920,
    currency: 'USD',
    quantity: 160,
    unit: 'crates',
    date: '2026-10-28',
    season: '2025/2026 Season',
    notes: 'Sold at Mbare Musika wholesale morning market at $12.00/crate',
  },
  {
    id: 'fin-3',
    user_id: 'demo',
    type: 'expense',
    category: 'Fertilizers',
    crop: 'White Maize',
    amount: 864,
    currency: 'USD',
    quantity: 24,
    unit: 'bags (50kg)',
    date: '2026-09-10',
    season: '2026/2027 Season',
    notes: 'Compound D basal fertilizer (7-14-7) purchased from Norton depot',
  },
  {
    id: 'fin-4',
    user_id: 'demo',
    type: 'expense',
    category: 'Seeds & Seedlings',
    crop: 'White Maize',
    amount: 320,
    currency: 'USD',
    quantity: 8,
    unit: 'bags (10kg)',
    date: '2026-09-18',
    season: '2026/2027 Season',
    notes: 'Certified drought-tolerant hybrid SC719 seed maize',
  },
  {
    id: 'fin-5',
    user_id: 'demo',
    type: 'expense',
    category: 'Labor',
    crop: 'General Farm',
    amount: 450,
    currency: 'USD',
    date: '2026-10-05',
    season: '2026/2027 Season',
    notes: 'Land clearing, Pfumvudza basin digging, and border fencing maintenance',
  },
  {
    id: 'fin-6',
    user_id: 'demo',
    type: 'expense',
    category: 'Fuel & Irrigation',
    crop: 'Roma Tomatoes',
    amount: 280,
    currency: 'USD',
    date: '2026-10-20',
    season: '2026/2027 Season',
    notes: 'Diesel for secondary booster pump and drip filter replacement',
  },
  {
    id: 'fin-7',
    user_id: 'demo',
    type: 'expense',
    category: 'Chemicals & Crop Protection',
    crop: 'White Maize',
    amount: 175,
    currency: 'USD',
    date: '2026-10-25',
    season: '2026/2027 Season',
    notes: 'Emamectin benzoate for Fall Armyworm preventive spray protocol',
  },
  {
    id: 'fin-8',
    user_id: 'demo',
    type: 'income',
    category: 'Livestock Sales',
    crop: 'Free-Range Roadrunners',
    amount: 780,
    currency: 'USD',
    quantity: 120,
    unit: 'birds',
    date: '2026-11-01',
    season: '2026/2027 Season',
    notes: 'Sold to local restaurants in Harare at $6.50/bird',
  },
];

router.get('/', (req, res) => {
  const userId = req.user!.id;
  const userRecords = db.analytics.get(userId) || DEMO_FINANCIAL_RECORDS;

  let totalIncome = 0;
  let totalExpenses = 0;
  let totalProductionKg = 0;

  const categoryMap: Record<string, number> = {};
  const cropMap: Record<string, { income: number; expense: number; productionKg: number }> = {};

  userRecords.forEach((r) => {
    if (r.type === 'income') {
      totalIncome += r.amount;
      if (r.crop) {
        if (!cropMap[r.crop]) cropMap[r.crop] = { income: 0, expense: 0, productionKg: 0 };
        cropMap[r.crop].income += r.amount;
        if (r.unit === 'kg' && r.quantity) cropMap[r.crop].productionKg += r.quantity;
      }
    } else if (r.type === 'expense') {
      totalExpenses += r.amount;
      categoryMap[r.category] = (categoryMap[r.category] || 0) + r.amount;
      if (r.crop) {
        if (!cropMap[r.crop]) cropMap[r.crop] = { income: 0, expense: 0, productionKg: 0 };
        cropMap[r.crop].expense += r.amount;
      }
    } else if (r.type === 'production') {
      if (r.quantity) totalProductionKg += r.quantity;
    }
  });

  const netProfit = totalIncome - totalExpenses;
  const marginPct = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  const expenseBreakdown = Object.entries(categoryMap).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
  }));

  const cropPerformance = Object.entries(cropMap).map(([crop, data]) => ({
    crop,
    revenue: data.income,
    expenses: data.expense,
    profit: data.income - data.expense,
    productionKg: data.productionKg,
  }));

  const monthlyTrends = [
    { month: 'Jun 26', income: 1200, expenses: 650, profit: 550 },
    { month: 'Jul 26', income: 1450, expenses: 800, profit: 650 },
    { month: 'Aug 26', income: 1100, expenses: 720, profit: 380 },
    { month: 'Sep 26', income: 1800, expenses: 1184, profit: 616 },
    { month: 'Oct 26', income: 3920, expenses: 1405, profit: 2515 },
    { month: 'Nov 26', income: 2480, expenses: 950, profit: 1530 },
  ];

  const seasonComparison = {
    current_season: {
      name: '2026/2027 Season',
      revenue: 6500,
      expenses: 2089,
      profit: 4411,
      yield_tonnes_ha: 4.8,
    },
    previous_season: {
      name: '2025/2026 Season',
      revenue: 5720,
      expenses: 2350,
      profit: 3370,
      yield_tonnes_ha: 4.1,
    },
  };

  const aiInsights = [
    {
      title: 'Fertilizer Input Optimization',
      impact: '+$140 / hectare',
      type: 'cost-reduction',
      text: 'Fertilizer comprises 41% of current production expenses. Applying split top-dressing (Ammonium Nitrate) 4 and 7 weeks post-emergence alongside cattle manure mulching can reduce leaching loss by up to 22% in sandy loam soils.',
    },
    {
      title: 'High-Margin Horticultural Arbitrage',
      impact: '+$340 / month',
      type: 'revenue-boost',
      text: 'Roma tomatoes sold at Mbare Musika achieved an average gross margin of 68%. Staggering tomato plantings by 3 weeks ensures continuous harvest into high-price December holiday windows.',
    },
    {
      title: 'Solar Pumping Payback Milestone',
      impact: '-$85 / month',
      type: 'operational',
      text: 'Transitioning from diesel to solar pumping has already cut monthly fuel expenses by 60%. Full capital payback is projected within 4.5 months at current pumping frequencies.',
    },
  ];

  res.json({
    summary: {
      total_income: totalIncome,
      total_expenses: totalExpenses,
      net_profit: netProfit,
      profit_margin_pct: marginPct,
      currency: 'USD',
      total_production_kg: totalProductionKg || 10000,
    },
    monthly_trends: monthlyTrends,
    expense_breakdown: expenseBreakdown,
    crop_performance: cropPerformance,
    season_comparison: seasonComparison,
    ai_insights: aiInsights,
    records: userRecords,
  });
});

router.post('/records', (req, res) => {
  const userId = req.user!.id;
  const userRecords = db.analytics.get(userId) || [...DEMO_FINANCIAL_RECORDS];

  const newRecord: FarmFinancialRecord = {
    id: 'fin-' + Date.now(),
    user_id: userId,
    type: req.body.type || 'expense',
    category: req.body.category || 'General',
    crop: req.body.crop,
    amount: Number(req.body.amount) || 0,
    currency: req.body.currency || 'USD',
    quantity: req.body.quantity ? Number(req.body.quantity) : undefined,
    unit: req.body.unit,
    date: req.body.date || new Date().toISOString().split('T')[0],
    notes: req.body.notes,
    season: req.body.season || '2026/2027 Season',
  };

  userRecords.unshift(newRecord);
  db.analytics.set(userId, userRecords);

  res.status(201).json({ data: newRecord });
});

router.delete('/records/:id', (req, res) => {
  const userId = req.user!.id;
  const userRecords = db.analytics.get(userId) || [...DEMO_FINANCIAL_RECORDS];
  const filtered = userRecords.filter((r) => r.id !== req.params.id);
  db.analytics.set(userId, filtered);
  res.json({ success: true });
});

export default router;
