import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const { signup, login, user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-primary font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  return (    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-r from-orange-50 to-orange-100">
      {/* Left side branding */}
      <div className="hidden lg:flex lg:w-1/2 p-12 bg-gradient-to-br from-primary to-primary-light text-white flex-col justify-center items-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="auth-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1.5" fill="white" fillOpacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auth-dots)" />
          </svg>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto text-center relative z-10"
        >          <div className="flex flex-col items-center justify-center mb-10">
            <img 
              src="/logo_512.png" 
              alt="Cravely Logo" 
              className="h-36 w-auto mb-6 drop-shadow-lg" 
              onError={(e) => {
                console.error('Logo failed to load');
                e.currentTarget.style.display = 'none';
                // Show fallback logo if image fails
                const container = e.currentTarget.parentElement;
                if (container) {
                  const fallbackLogo = document.createElement('div');
                  fallbackLogo.className = "inline-block bg-white text-primary rounded-full p-4 shadow-lg";
                  fallbackLogo.innerHTML = '<span class="text-3xl font-bold">C</span>';
                  container.appendChild(fallbackLogo);
                }
              }}
            />
          </div>
          <h2 className="text-2xl font-bold mb-8">Restaurant Management Reimagined</h2>
          <p className="text-white/90 mb-10 text-lg">
            Streamline operations, enhance customer experiences, and grow your business with our comprehensive restaurant management platform.
          </p>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 shadow-md">
              <h3 className="font-bold mb-3">Order Management</h3>
              <p className="text-sm text-white/90">Efficiently track and manage all orders in real-time</p>
            </div>
            <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 shadow-md">
              <h3 className="font-bold mb-3">Menu Control</h3>
              <p className="text-sm text-white/90">Easily update and customize your menu offerings</p>
            </div>
            <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 shadow-md">
              <h3 className="font-bold mb-3">AI Assistance</h3>
              <p className="text-sm text-white/90">Get intelligent insights and recommendations</p>
            </div>
            <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 shadow-md">
              <h3 className="font-bold mb-3">Analytics</h3>
              <p className="text-sm text-white/90">Data-driven insights to optimize performance</p>
            </div>
          </div>
        </motion.div>
      </div>{/* Right side login/signup form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="p-10">            <div className="text-center mb-10">
              <div className="flex items-center justify-center mb-6">
                <img 
                  src="/logo_512.png" 
                  alt="Cravely Logo" 
                  className="h-20 w-auto drop-shadow-md" 
                  onError={(e) => {
                    console.error('Logo failed to load in form');
                    e.currentTarget.style.display = 'none';
                    // Show fallback logo if image fails
                    const container = e.currentTarget.parentElement;
                    if (container) {
                      const fallbackLogo = document.createElement('span');
                      fallbackLogo.className = "inline-flex items-center justify-center bg-primary text-white rounded-full p-2.5 shadow-lg w-12 h-12";
                      fallbackLogo.innerHTML = '<span class="text-xl font-bold">C</span>';
                      container.appendChild(fallbackLogo);
                    }
                  }}
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {isLogin ? 'Sign In to Cravely' : 'Create Your Account'}
              </h2>
              <p className="text-gray-600 mt-3">
                {isLogin 
                  ? 'Enter your credentials to access your account' 
                  : 'Fill out the form to get started with Cravely'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors shadow-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
                <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors shadow-sm"
                  placeholder={isLogin ? "Enter your password" : "Create a secure password"}
                  required
                />
              </div>
                {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-200 shadow-sm flex items-start"
                >
                  <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </motion.div>
              )}
              
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-4 px-4 rounded-lg transition-all duration-300 transform hover:shadow-lg active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
              
              <div className="text-center mt-2">
                <button
                  type="button"
                  className="text-primary hover:text-primary-hover text-sm font-medium transition-colors"
                  onClick={() => setIsLogin(l => !l)}
                >
                  {isLogin 
                    ? "Don't have an account? Sign Up" 
                    : "Already have an account? Sign In"}
                </button>
              </div>
            </form>
          </div>
          
          <div className="py-5 px-10 bg-gray-50 border-t text-center">
            <p className="text-xs text-gray-600">
              By continuing, you agree to Cravely's Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}