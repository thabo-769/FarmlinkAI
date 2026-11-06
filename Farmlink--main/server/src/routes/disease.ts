import { Router } from 'express';
import multer from 'multer';
import { rateLimit } from 'express-rate-limit';
import { authenticate } from '../middleware/auth.js';
import { HttpError } from '../middleware/errors.js';
import { analyzePlantImage } from '../services/ai.js';
import { db, type DiagnosisRecord } from '../db/store.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) =>
    cb(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)),
});

router.use(
  authenticate,
  rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: true, legacyHeaders: false }),
);

// Demo seed diagnoses for initial view
const DEFAULT_DEMO_DIAGNOSES: DiagnosisRecord[] = [
  {
    id: 'diag-demo-1',
    user_id: 'demo',
    problem: 'Fall Armyworm (Spodoptera frugiperda)',
    crop_type: 'White Maize',
    severity: 'high',
    confidence: 94,
    symptoms: 'Ragged windowing in young whorl leaves with moist sawdust frass.',
    treatment: 'Early morning hand-picking or apply pinch of dry sand/ash into whorl; apply emamectin benzoate if >15% threshold exceeded.',
    prevention: 'Plant with first effective rains, rotate cereals with sugar beans or cowpeas, scout weekly.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'diag-demo-2',
    user_id: 'demo',
    problem: 'Early Blight (Alternaria solani)',
    crop_type: 'Roma Tomatoes',
    severity: 'moderate',
    confidence: 88,
    symptoms: 'Target-board concentric brown rings on lower foliage, leaf yellowing.',
    treatment: 'Prune infected lower foliage immediately and burn/bury away from plots. Switch to drip irrigation.',
    prevention: 'Apply straw mulch to prevent soil-splash spores; avoid overhead irrigation in late afternoon.',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

router.get('/history', (req, res) => {
  const userId = req.user!.id;
  const list = db.diagnoses.get(userId) || DEFAULT_DEMO_DIAGNOSES;
  res.json({ data: list });
});

router.post('/analyze', upload.single('image'), async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      throw new HttpError(400, 'Please upload one JPEG, PNG or WebP plant image up to 5 MB.');
    }

    const b = file.buffer;

    let valid = false;
    if (file.mimetype === 'image/jpeg') {
      valid = b.length >= 2 && b[0] === 0xff && b[1] === 0xd8;
    } else if (file.mimetype === 'image/png') {
      valid =
        b.length >= 8 &&
        b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    } else if (file.mimetype === 'image/webp') {
      valid =
        b.length >= 12 &&
        b.subarray(0, 4).toString('ascii') === 'RIFF' &&
        b.subarray(8, 12).toString('ascii') === 'WEBP';
    }

    if (!valid) {
      throw new HttpError(
        400,
        'The file content does not match its declared image type. Please upload a valid JPEG, PNG or WebP.',
      );
    }

    const symptoms = String(req.body.symptoms || '').slice(0, 1200);
    const cropType = String(req.body.cropType || '').trim();
    const assessment = await analyzePlantImage(b.toString('base64'), file.mimetype, symptoms);

    // Heuristically extract diagnosis structure for rich card rendering
    const sLow = symptoms.toLowerCase();
    const aLow = assessment.toLowerCase();

    let problem = 'Unidentified Foliar Symptom';
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'moderate';
    let confidence = 85;

    if (sLow.includes('armyworm') || aLow.includes('armyworm') || sLow.includes('whorl') || sLow.includes('caterpillar')) {
      problem = 'Fall Armyworm (Spodoptera frugiperda)';
      severity = 'high';
      confidence = 94;
    } else if (sLow.includes('blight') || aLow.includes('blight') || sLow.includes('target') || sLow.includes('concentric')) {
      problem = 'Early Blight (Alternaria solani)';
      severity = 'moderate';
      confidence = 91;
    } else if (sLow.includes('streak') || aLow.includes('streak') || aLow.includes('msv')) {
      problem = 'Maize Streak Virus (MSV)';
      severity = 'high';
      confidence = 89;
    } else if (sLow.includes('yellow') || aLow.includes('chlorosis') || aLow.includes('deficiency')) {
      problem = 'Nutrient Deficiency (Nitrogen/Magnesium Chlorosis)';
      severity = 'low';
      confidence = 84;
    } else if (sLow.includes('wilting') || aLow.includes('wilt') || aLow.includes('ralstonia')) {
      problem = 'Bacterial Wilt / Root Rot';
      severity = 'critical';
      confidence = 87;
    }

    const userId = req.user!.id;
    const userHistory = db.diagnoses.get(userId) || [...DEFAULT_DEMO_DIAGNOSES];

    const diagnosisRecord: DiagnosisRecord = {
      id: 'diag-' + Date.now(),
      user_id: userId,
      problem,
      crop_type: cropType || (sLow.includes('maize') ? 'Maize' : sLow.includes('tomato') ? 'Tomato' : 'Field Crop'),
      severity,
      confidence,
      symptoms: symptoms || 'Visual foliar discoloration',
      treatment: 'Remove severely diseased foliage and isolate plot; inspect morning pest thresholds before chemical spray.',
      prevention: 'Rotate crops, avoid overhead irrigation in late afternoon, and maintain clean field borders.',
      created_at: new Date().toISOString(),
    };

    userHistory.unshift(diagnosisRecord);
    db.diagnoses.set(userId, userHistory);

    res.json({
      assessment,
      diagnosis: diagnosisRecord,
      disclaimer:
        'Preliminary AI image assessment only — not a confirmed diagnosis. For serious or spreading crop damage, contact an AGRITEX extension officer immediately.',
    });
  } catch (e) {
    next(e);
  }
});

export default router;
