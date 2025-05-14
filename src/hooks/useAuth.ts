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
          console.error('Auth state change error:', authError);
          setError(authError.message);
          setLoading(false);
        }
      );
      return unsubscribe;
    } catch (initError) {
      console.error('Auth initialization error:', initError);
      setError(initError instanceof Error ? initError.message : 'Failed to initialize authentication');
      setLoading(false);
      return () => {};
    }
  }, []);

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  return { user, loading, error, signup, login, logout };
} 