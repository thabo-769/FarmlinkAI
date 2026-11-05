import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let appInstance: any = null;

export function getFirebaseAdminAuth() {
  if (!appInstance) {
    if (getApps().length === 0) {
      appInstance = initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'farmlink-ai',
      });
    } else {
      appInstance = getApps()[0];
    }
  }
  return getAuth(appInstance);
}
