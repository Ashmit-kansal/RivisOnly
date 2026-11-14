import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const clean = (val) => {
  if (!val) return '';
  let s = String(val).trim();
  // Strip surrounding quotes if user added them
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return s;
};

const apiKey = clean(import.meta.env.VITE_FIREBASE_API_KEY);
const defaultAuthDomain = clean(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);

// On production (Vercel), using window.location.hostname serves /__/auth via Vercel's reverse proxy,
// eliminating cross-domain cookie blocks, Brave Shields issues, and COOP popup severing.
const isLocal = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.startsWith('192.168.')
);
const authDomain = typeof window !== 'undefined' && !isLocal && window.location.hostname
  ? window.location.hostname
  : defaultAuthDomain;

const projectId = clean(import.meta.env.VITE_FIREBASE_PROJECT_ID);
const storageBucket = clean(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
const messagingSenderId = clean(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID);
const appId = clean(import.meta.env.VITE_FIREBASE_APP_ID);

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

// Verify if valid keys are provided
export const isFirebaseConfigured = Boolean(
  apiKey &&
  apiKey !== 'your_api_key_here' &&
  !apiKey.includes('your_') &&
  projectId &&
  projectId !== 'your_project_id' &&
  !projectId.includes('your_')
);

export let firebaseInitError = null;
let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    googleProvider = new GoogleAuthProvider();
    googleProvider.addScope('profile');
    googleProvider.addScope('email');
    googleProvider.addScope('https://www.googleapis.com/auth/drive.readonly');
    googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    });
    console.log('[Firebase] Successfully initialized for project:', projectId);
  } catch (err) {
    console.error('[Firebase] Initialization error:', err);
    firebaseInitError = err.message || 'Firebase failed to initialize.';
  }
} else {
  console.warn('[Firebase] Configuration keys missing or using placeholder in .env:', {
    hasApiKey: Boolean(apiKey),
    hasProjectId: Boolean(projectId),
    hasAuthDomain: Boolean(authDomain)
  });
}

export { app, auth, db, googleProvider };
