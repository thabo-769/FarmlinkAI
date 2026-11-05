import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { chatSchema } from '../validators/schemas.js';
import { answerAgriculture } from '../services/ai.js';

const router = Router();
router.use(authenticate);
router.use(
  rateLimit({
    windowMs: 60_000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many assistant requests. Please wait a moment and try again.' },
  })
);

router.post('/chat', validate(chatSchema), async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;
    const id = conversationId || 'conv-' + Date.now();
    const answer = await answerAgriculture(message);
    res.json({
      conversationId: id,
      answer,
      disclaimer: 'General AI guidance; not a confirmed diagnosis.',
    });
  } catch (e) {
    next(e);
  }
});

router.get('/conversations', (_req, res) => {
  res.json({ data: [] });
});

export default router;
