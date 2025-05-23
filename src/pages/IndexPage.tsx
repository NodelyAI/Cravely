import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function IndexPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is logged in, redirect to dashboard
    // If not logged in, redirect to landing page
    if (!loading) {
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/landing');
      }
    }
  }, [user, loading, navigate]);
  
  // Show loading state while checking authentication
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-16 h-16 border-4 border-t-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-lg">Loading...</p>
    </div>
  );
}
