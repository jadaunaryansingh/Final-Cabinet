import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  const requiredEnvVars = [
    import.meta.env.VITE_FIREBASE_API_KEY,
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    import.meta.env.VITE_FIREBASE_PROJECT_ID,
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    import.meta.env.VITE_FIREBASE_APP_ID
  ];
  
  return requiredEnvVars.every(envVar => envVar && envVar !== 'undefined' && envVar !== '');
};

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only if properly configured
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured()) {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    
    // Initialize Firebase Authentication and get a reference to the service
    auth = getAuth(app);
    
    // Initialize Firestore
    db = getFirestore(app);
    
    // Optionally initialize analytics (only in browser)
    if (typeof window !== 'undefined' && 'measurementId' in firebaseConfig) {
      try {
        getAnalytics(app);
      } catch (e) {
        // Analytics might fail in some environments (SSR, etc.)
        console.log('Analytics not initialized:', e);
      }
    }
    
    // Connect to Firebase emulators ONLY in local development
    const isLocalDevelopment = import.meta.env.DEV &&
                               import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true' &&
                               window.location.hostname === 'localhost';

    if (isLocalDevelopment && !auth.app.options.projectId?.includes('demo')) {
      // Only connect to Auth emulator if explicitly enabled and running locally
      try {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
        // connectFirestoreEmulator(db, '127.0.0.1', 8080); // DISABLED
        console.log('Connected to Firebase Auth emulator');
      } catch (error) {
        // Emulators already connected or not available
        console.log('Firebase emulators not connected:', error);
      }
    } else {
      console.log('Using production Firebase services');
    }
    
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    app = null;
    auth = null;
    db = null;
  }
} else {
  console.log('Firebase not configured - using demo mode. Set VITE_USE_FIREBASE_AUTH=true and configure Firebase environment variables to enable Firebase authentication.');
}

// Export with null checks
export { auth, db, isFirebaseConfigured };
export default app;
