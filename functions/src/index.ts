import * as admin from 'firebase-admin';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as functions from 'firebase-functions';
import { realQRGenerator } from './enhancedQRCodeGenerator';
import { publicMenuQRGenerator } from './publicMenuQRGenerator';

// Initialize Firebase Admin SDK
try {
  // Check if admin has already been initialized
  if (admin.apps.length === 0) {
    admin.initializeApp({
      // Use default credentials (will use service account in production,
      // or environment variables locally)
      credential: admin.credential.applicationDefault(),
      storageBucket: 'cravely-f2914.appspot.com' // Explicitly set the storage bucket
    });
    console.log('Firebase Admin SDK initialized successfully');
  } else {
    console.log('Firebase Admin SDK already initialized');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

// Export functions
export { 
  realQRGenerator,
  publicMenuQRGenerator
};
