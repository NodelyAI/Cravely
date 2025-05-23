import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Log config for debugging (hiding actual key values)
console.log('Firebase config loaded:', {
  apiKey: firebaseConfig.apiKey ? '✓ Present' : '✗ Missing',
  authDomain: firebaseConfig.authDomain ? '✓ Present' : '✗ Missing',
  projectId: firebaseConfig.projectId ? '✓ Present' : '✗ Missing',
  storageBucket: firebaseConfig.storageBucket ? '✓ Present' : '✗ Missing',
  messagingSenderId: firebaseConfig.messagingSenderId ? '✓ Present' : '✗ Missing',
  appId: firebaseConfig.appId ? '✓ Present' : '✗ Missing',
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Set persistent authentication (browser persists auth state through refreshes/sessions)
import { browserLocalPersistence, setPersistence } from 'firebase/auth';
// Use local persistence to keep users signed in across page refreshes
setPersistence(auth, browserLocalPersistence)
  .catch(error => {
    // This is non-critical functionality, so we don't need to show an error to the user
  });

export const db = getFirestore(app);
// Make sure we're connecting to the default region
export const functions = getFunctions(app, 'us-central1'); 
export const storage = getStorage(app);

// All emulator connections have been removed to ensure we always use real Firebase services
// Do not re-enable emulators unless specifically needed for testing