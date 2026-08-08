// FloodGuard AI / JeevanSetu — Firebase Auth Service Wrapper

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

/**
 * Convert Firebase User object into serializable AuthUser.
 */
export function formatAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'Operator'),
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous,
  };
}

/**
 * Sign in with Email and Password.
 */
export async function loginWithEmail(email: string, pass: string): Promise<AuthUser> {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return formatAuthUser(result.user);
}

/**
 * Create new user account with Email and Password.
 */
export async function registerWithEmail(email: string, pass: string): Promise<AuthUser> {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  return formatAuthUser(result.user);
}

/**
 * Sign in with Google Popup.
 */
export async function loginWithGoogle(): Promise<AuthUser> {
  const result = await signInWithPopup(auth, googleProvider);
  return formatAuthUser(result.user);
}

/**
 * Sign in as Guest / Anonymous User (Quick Demo Access).
 */
export async function loginAsGuest(): Promise<AuthUser> {
  const result = await signInAnonymously(auth);
  return formatAuthUser(result.user);
}

/**
 * Sign out current Firebase user.
 */
export async function logoutFirebase(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribe to Firebase Auth state changes.
 */
export function subscribeToAuth(callback: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(auth, user => {
    if (user) {
      callback(formatAuthUser(user));
    } else {
      callback(null);
    }
  });
}
