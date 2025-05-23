import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/menu', label: 'Menu' },
  { to: '/orders', label: 'Orders' },
  { to: '/chat', label: 'AI Chat' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <nav className={`${scrolled ? 'shadow-md' : ''} transition-all duration-300 sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-primary/10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 min-w-0">
            <div className="relative flex items-center">
              <img 
                src="/navbar_128.png" 
                alt="Cravely Logo" 
                className="h-12 w-auto drop-shadow-sm hover:brightness-105 transition-all duration-300" 
                onError={(e) => {
                  console.error('Logo failed to load');
                  e.currentTarget.style.display = 'none';
                  // Show fallback text logo if image fails to load
                  const fallbackLogo = document.createElement('span');
                  fallbackLogo.className = 'text-2xl font-extrabold text-primary';
                  fallbackLogo.textContent = 'Cravely';
                  e.currentTarget.parentElement?.appendChild(fallbackLogo);
                }}
              />
            </div>
            {/* Restaurant name next to logo */}
            <span className="truncate font-bold text-lg text-gray-800 hidden sm:inline-block">Russel Street Kitchen</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="flex space-x-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    location.pathname === link.to 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-text-primary hover:bg-primary/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>            {/* Profile Menu */}
            <div className="relative ml-4">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center justify-center rounded-full w-10 h-10 bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300 border border-primary/20 shadow-sm"
                aria-label="Open user menu"
              >
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </button>
              
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-10 border border-gray-200"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-orange-50">
                      <p className="text-sm font-medium text-text-primary">Signed in as</p>
                      <p className="text-sm text-text-muted truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-text-primary hover:bg-accent/5 transition-colors duration-200">Profile Settings</Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-error/5 transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="p-2 rounded-lg hover:bg-primary/10 focus:outline-none transition-colors duration-200"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
              {mobileOpen ? (
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>      {/* Mobile menu - using improved design from the third image */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            
            {/* Side panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 w-[280px] h-full bg-white z-40 shadow-lg md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                <Link to="/dashboard" className="flex items-center gap-2 min-w-0" onClick={() => setMobileOpen(false)}>
                  <img src="/navbar_128.png" alt="Cravely Logo" className="h-10 w-auto" />
                  <span className="font-bold text-base truncate">Russel Street Kitchen</span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-[#FF7A00]/10 text-[#FF7A00] flex items-center justify-center font-medium">
                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.email?.split('@')[0] || 'admin'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || 'admin@cravely.ca'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-4">
                <ul className="space-y-1 px-3">
                  {navLinks.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center rounded-lg p-3 transition-colors duration-200 hover:bg-gray-100 ${
                          location.pathname === link.to 
                            ? 'bg-[#FF7A00]/10 text-[#FF7A00]' 
                            : 'text-gray-700'
                        }`}
                      >
                        <span className="ml-3 font-medium">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}