// FloodGuard AI / JeevanSetu — Firebase Configuration

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Provided Firebase web application configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCt58H5c025g5TXpT6IQjMKc4VBwsSMCQg",
  authDomain: "ai-tsav.firebaseapp.com",
  projectId: "ai-tsav",
  storageBucket: "ai-tsav.firebasestorage.app",
  messagingSenderId: "546535964980",
  appId: "1:546535964980:web:bc9ab90035291c9b536561",
  measurementId: "G-V0M1CMZ3KV"
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics conditionally
export const analyticsPromise = isSupported().then(supported => supported ? getAnalytics(app) : null);
