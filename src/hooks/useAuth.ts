import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../services/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, 
        (currentUser) => {
          setUser(currentUser);
          setLoading(false);
          setError(null);
        }, 
        (authError) => {
          // Handle auth state change errors with the actual error message
          setError(authError.message || 'Authentication session error. Please try signing in again.');
          setLoading(false);
        }
      );
      return unsubscribe;
    } catch (initError) {
      // Handle initialization errors with error message when available
      setError(initError instanceof Error ? initError.message : 'Failed to initialize authentication.');
      setLoading(false);
      return () => {};
    }
  }, []);const signup = async (email: string, password: string) => {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      // Provide detailed error messages without logging to console
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please use a different email or try logging in.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use at least 6 characters.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection and try again.');
      } else if (error.code === 'auth/invalid-api-key') {
        throw new Error('Authentication service configuration error. Please contact support.');
      } else {
        throw new Error('Failed to create account. Please check your information and try again.');
      }
    }
  };  const login = async (email: string, password: string) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      // Provide detailed user-friendly error messages without console logging
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/user-disabled') {
        throw new Error('This account has been disabled. Please contact support.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many unsuccessful login attempts. Please try again later or reset your password.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection and try again.');
      } else if (error.code === 'auth/invalid-api-key') {
        throw new Error('Authentication service configuration error. Please contact support.');
      } else {
        throw new Error('Login failed. Please check your information and try again.');
      }
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  return { user, loading, error, signup, login, logout };
}