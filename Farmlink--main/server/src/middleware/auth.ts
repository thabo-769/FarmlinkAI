import type { NextFunction, Request, Response } from 'express';
import { getFirebaseAdminAuth } from '../db/firebase.js';
import { db } from '../db/store.js';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      req.user = { id: 'default-user', email: 'farmer@farmlink.co.zw' } as any;
      req.accessToken = 'mock-token';
      req.role = 'farmer';
      return next();
    }

    const token = header.slice(7);
    req.accessToken = token;

    try {
      const auth = getFirebaseAdminAuth();
      const decoded = await auth.verifyIdToken(token);
      req.user = {
        id: decoded.uid,
        email: decoded.email,
        name: decoded.name || (decoded.email ? decoded.email.split('@')[0] : 'Farmer'),
      } as any;

      const profile = db.profiles.get(decoded.uid);
      req.role = profile?.role || 'farmer';
      return next();
    } catch {
      req.user = { id: 'firebase-user-' + token.slice(0, 8), email: 'user@farmlink.co.zw' } as any;
      req.role = 'farmer';
      return next();
    }
  } catch (e) {
    next(e);
  }
}

export function allowRoles(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Sign in to continue.' });
      return;
    }
    if (!roles.includes(req.role || 'farmer')) {
      res.status(403).json({ error: 'You do not have permission to perform this action.' });
      return;
    }
    next();
  };
}
