import { Router } from 'express';
import multer from 'multer';
import { rateLimit } from 'express-rate-limit';
import { authenticate } from '../middleware/auth.js';
import { HttpError } from '../middleware/errors.js';
import { analyzePlantImage } from '../services/ai.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) =>
    cb(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)),
});

router.use(
  authenticate,
  rateLimit({ windowMs: 60_000, limit: 10, standardHeaders: true, legacyHeaders: false }),
);

router.post('/analyze', upload.single('image'), async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      throw new HttpError(400, 'Please upload one JPEG, PNG or WebP plant image up to 5 MB.');
    }

    const b = file.buffer;

    // Validate magic bytes — fixes the broken WEBP check (was comparing wrong slice)
    // and removes the unreliable JPEG end-of-image tail check (some encoders append trailing bytes).
    let valid = false;
    if (file.mimetype === 'image/jpeg') {
      // JPEG always starts with FF D8
      valid = b.length >= 2 && b[0] === 0xff && b[1] === 0xd8;
    } else if (file.mimetype === 'image/png') {
      valid =
        b.length >= 8 &&
        b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    } else if (file.mimetype === 'image/webp') {
      // RIFF????WEBP — use 'ascii' to avoid UTF-8 multi-byte mangling
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
    const assessment = await analyzePlantImage(b.toString('base64'), file.mimetype, symptoms);

    res.json({
      assessment,
      disclaimer:
        'Preliminary AI image assessment only — not a confirmed diagnosis. For serious or spreading crop damage, contact an AGRITEX extension officer immediately.',
    });
  } catch (e) {
    next(e);
  }
});

export default router;
