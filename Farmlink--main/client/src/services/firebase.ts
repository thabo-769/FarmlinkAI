import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const rawApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
export const isFirebaseConfigured = Boolean(rawApiKey && rawApiKey !== 'AIzaSyDemoKeyForFarmLink' && !rawApiKey.includes('Demo'));

const firebaseConfig = {
  apiKey: rawApiKey || "AIzaSyDemoKeyForFarmLink",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "farmlink-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "farmlink-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "farmlink-ai.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
};
