import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../services/firebase';
import { usePendingOrdersCount } from '../hooks/usePendingOrdersCount';

interface SidebarProps {
  expanded?: boolean;
  toggleSidebar?: () => void;
}

export default function Sidebar({ expanded = true, toggleSidebar = () => {} }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const { pendingCount } = usePendingOrdersCount(restaurantId);
  
  // Fetch restaurant ID when user is available
  useEffect(() => {
    const fetchRestaurantId = async () => {
      if (!user) return;
      
      try {
        const restaurantsRef = collection(db, 'restaurants');
        const q = query(restaurantsRef);
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const firstRestaurant = querySnapshot.docs[0];
          setRestaurantId(firstRestaurant.id);
        }
      } catch (err) {
        console.error('Error fetching restaurant ID in sidebar:', err);
      }
    };
    
    fetchRestaurantId();
  }, [user]);
      const navItems = [
    { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { to: '/orders', icon: '📋', label: 'Orders', badge: pendingCount > 0 ? pendingCount : null },
    { to: '/menu', icon: '🍽️', label: 'Menu' },
    { to: '/tables', icon: '🪑', label: 'Tables' },
    { to: '/chat', icon: '💬', label: 'AI Chat' },
    { to: '/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <motion.div 
      initial={false}
      animate={{
        width: expanded ? '240px' : '72px',
      }}
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 flex flex-col z-20 shadow-sm transition-all duration-300`}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        {expanded ? (
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="inline-block bg-gradient-to-r from-[#FF7A00] to-[#FF7A00]/80 text-white rounded px-2 py-1">C</span>
            <span className="font-bold text-lg">Cravely</span>
          </Link>
        ) : (
          <Link to="/dashboard" className="mx-auto">
            <span className="inline-block bg-gradient-to-r from-[#FF7A00] to-[#FF7A00]/80 text-white rounded px-2 py-1">C</span>
          </Link>
        )}
      </div>

      {/* Toggle button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full w-6 h-6 flex items-center justify-center shadow-sm hover:bg-gray-50"
      >
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {expanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          )}
        </motion.div>
      </button>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => (
            <li key={item.to}>              <Link
                to={item.to}
                className={`flex items-center rounded-lg p-3 transition-colors duration-200 hover:bg-gray-100 ${
                  location.pathname === item.to 
                    ? 'bg-[#FF7A00]/10 text-[#FF7A00]' 
                    : 'text-gray-700'
                }`}
                aria-label={item.label}
              >
                <span className="text-xl relative">
                  {item.icon}
                  {item.badge && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </span>
                {expanded && (
                  <div className="ml-3 font-medium flex items-center">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-full bg-[#FF7A00]/10 text-[#FF7A00] flex items-center justify-center font-medium">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          {expanded && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || ''}
              </p>
            </div>
          )}
        </div>
        
        {expanded && (
          <button
            onClick={logout}
            className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Sign Out
          </button>
        )}
      </div>
    </motion.div>
  );
}