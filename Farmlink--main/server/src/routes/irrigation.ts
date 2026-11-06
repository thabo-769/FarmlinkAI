import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { db, type IrrigationLogItem } from '../db/store.js';

const router = Router();
router.use(authenticate);

const DEMO_IRRIGATION_LOGS: IrrigationLogItem[] = [
  {
    id: 'irrig-1',
    user_id: 'demo',
    crop: 'Roma Tomatoes',
    duration_minutes: 45,
    water_liters: 3200,
    method: 'Drip Irrigation',
    growth_stage: 'Flowering & Fruit Set',
    weather_condition: 'Sunny (28°C)',
    saved_liters: 1200,
    date: '2026-11-04',
    notes: 'Morning drip cycle at 06:30. Good emitter uniformity across 4 rows.',
  },
  {
    id: 'irrig-2',
    user_id: 'demo',
    crop: 'White Maize (Pfumvudza)',
    duration_minutes: 30,
    water_liters: 1800,
    method: 'Pfumvudza Basin Watering',
    growth_stage: 'Vegetative (Whorl)',
    weather_condition: 'Partly Cloudy (26°C)',
    saved_liters: 800,
    date: '2026-11-02',
    notes: 'Basin moisture checked prior to watering; 4L per basin retained well by grass mulch.',
  },
  {
    id: 'irrig-3',
    user_id: 'demo',
    crop: 'Roma Tomatoes',
    duration_minutes: 40,
    water_liters: 3000,
    method: 'Drip Irrigation',
    growth_stage: 'Flowering & Fruit Set',
    weather_condition: 'Overcast (24°C)',
    saved_liters: 1500,
    date: '2026-10-31',
    notes: 'Rain expected later; curtailed normal 60-min cycle to 40 min based on AI recommendation.',
  },
];

router.get('/recommendation', (req, res) => {
  const crop = String(req.query.crop || 'Maize').trim();
  const stage = String(req.query.stage || 'Vegetative').trim();
  const soil = String(req.query.soil || 'Sandy Loam').trim();
  const method = String(req.query.method || 'Drip Irrigation').trim();
  const areaM2 = Number(req.query.area || 1000);

  // Baseline Crop Coefficients (FAO-56 standard)
  const kcValues: Record<string, Record<string, number>> = {
    Maize: { Seedling: 0.4, Vegetative: 0.85, 'Flowering/Tasseling': 1.15, Maturity: 0.7 },
    Tomatoes: { Seedling: 0.45, Vegetative: 0.75, 'Flowering & Fruit Set': 1.1, Maturity: 0.8 },
    Cabbages: { Seedling: 0.45, Vegetative: 0.8, 'Head Formation': 1.05, Maturity: 0.9 },
    Wheat: { Seedling: 0.35, Vegetative: 0.75, Heading: 1.15, Ripening: 0.5 },
    Potatoes: { Emergence: 0.45, Vegetative: 0.75, Tuberization: 1.1, Maturity: 0.7 },
    Onions: { Initial: 0.5, Vegetative: 0.7, Bulbing: 1.05, Ripening: 0.75 },
  };

  const cropKey = Object.keys(kcValues).find((k) => k.toLowerCase() === crop.toLowerCase()) || 'Maize';
  const stageKc = kcValues[cropKey]?.[stage] || 0.85;

  // Typical Zimbabwe summer reference ET0 ~ 5.2 mm/day
  const et0 = 5.2;
  const cropEtcMmPerDay = Number((et0 * stageKc).toFixed(2));

  // Irrigation system efficiency
  const efficiency = method.includes('Drip') ? 0.9 : method.includes('Pfumvudza') ? 0.85 : method.includes('Sprinkler') ? 0.75 : 0.6;

  // Gross water requirement mm/day
  const grossMmPerDay = Number((cropEtcMmPerDay / efficiency).toFixed(2));
  const litersPerM2PerDay = grossMmPerDay;
  const totalLitersPerDay = Math.round(litersPerM2PerDay * areaM2);
  const totalLitersPerWeek = totalLitersPerDay * 7;

  // Frequency recommendation based on soil
  let frequencyDays = 2;
  let runDurationMinutes = 45;
  let soilAdvice = 'Adequate water holding capacity.';

  if (soil.toLowerCase().includes('sand')) {
    frequencyDays = 1; // daily short pulses for sandy soil
    runDurationMinutes = 30;
    soilAdvice = 'Sandy soils have low water retention (40mm/m). Apply frequent, shorter pulses to prevent deep leaching below the root zone.';
  } else if (soil.toLowerCase().includes('pfumvudza') || soil.toLowerCase().includes('mulch')) {
    frequencyDays = 3;
    runDurationMinutes = 40;
    soilAdvice = 'Pfumvudza mulch cover significantly suppresses evaporation. Water every 3 days; check soil beneath the mulch before irrigating.';
  } else if (soil.toLowerCase().includes('clay')) {
    frequencyDays = 4;
    runDurationMinutes = 65;
    soilAdvice = 'Clay loam holds moisture tightly (130mm/m). Water less frequently with longer cycles to ensure deep root penetration without surface pooling.';
  }

  // Rainfall prediction simulation (based on Zimbabwean summer season)
  const forecastRainMm = 14;
  const rainExpected = true;
  const adjustedWeeklyWaterLiters = Math.max(0, Math.round(totalLitersPerWeek - (forecastRainMm * areaM2 * 0.75)));
  const waterSavedLiters = Math.max(0, totalLitersPerWeek - adjustedWeeklyWaterLiters);

  const recommendation = {
    crop: cropKey,
    growth_stage: stage,
    soil_type: soil,
    irrigation_method: method,
    area_m2: areaM2,
    etc_mm_per_day: cropEtcMmPerDay,
    recommended_frequency: `Every ${frequencyDays} days (${Math.round(7 / frequencyDays)} sessions/week)`,
    recommended_run_time: `${runDurationMinutes} minutes per session`,
    optimal_time: '06:00 AM – 08:30 AM (or after 17:00 PM)',
    liters_per_day: totalLitersPerDay,
    standard_weekly_liters: totalLitersPerWeek,
    weather_adjusted_weekly_liters: adjustedWeeklyWaterLiters,
    estimated_water_saved_liters: waterSavedLiters,
    weather_alert: rainExpected
      ? `Upcoming 14mm rainfall forecast in the next 48 hours. Reduce irrigation duration by 60% and delay Friday cycle to conserve ${waterSavedLiters.toLocaleString()} Liters.`
      : 'Dry weather pattern forecast. Maintain consistent scheduled soil moisture.',
    soil_agronomy_tip: soilAdvice,
    pfumvudza_tip:
      'In Pfumvudza basins, 4–5 Liters per basin 2 to 3 times weekly is sufficient during dry spells. Avoid pouring directly onto the plant stem.',
  };

  res.json({ data: recommendation });
});

router.get('/logs', (req, res) => {
  const userId = req.user!.id;
  const logs = db.irrigationLogs.get(userId) || DEMO_IRRIGATION_LOGS;
  const totalWaterUsed = logs.reduce((sum, l) => sum + l.water_liters, 0);
  const totalWaterSaved = logs.reduce((sum, l) => sum + l.saved_liters, 0);

  res.json({
    data: logs,
    summary: {
      total_sessions: logs.length,
      total_water_used_liters: totalWaterUsed,
      total_water_saved_liters: totalWaterSaved,
    },
  });
});

router.post('/logs', (req, res) => {
  const userId = req.user!.id;
  const logs = db.irrigationLogs.get(userId) || [...DEMO_IRRIGATION_LOGS];

  const newLog: IrrigationLogItem = {
    id: 'irrig-' + Date.now(),
    user_id: userId,
    crop: req.body.crop || 'Maize',
    duration_minutes: Number(req.body.duration_minutes) || 30,
    water_liters: Number(req.body.water_liters) || 2000,
    method: req.body.method || 'Drip Irrigation',
    growth_stage: req.body.growth_stage || 'Vegetative',
    weather_condition: req.body.weather_condition || 'Sunny (26°C)',
    saved_liters: Number(req.body.saved_liters) || 500,
    date: req.body.date || new Date().toISOString().split('T')[0],
    notes: req.body.notes || 'Routine irrigation cycle',
  };

  logs.unshift(newLog);
  db.irrigationLogs.set(userId, logs);

  res.status(201).json({ data: newLog });
});

export default router;
