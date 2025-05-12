import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import MobileMenu from '../components/MobileMenu';

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.email?.split('@')[0] || 'Admin';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const statsData = [
    { 
      label: 'Active Orders', 
      value: 12, 
      bgColor: 'bg-blue-50', 
      textColor: 'text-blue-600',
      iconPath: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    { 
      label: 'Tables', 
      value: 8, 
      bgColor: 'bg-green-50', 
      textColor: 'text-green-600',
      iconPath: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    { 
      label: 'Menu Items', 
      value: 24, 
      bgColor: 'bg-yellow-50', 
      textColor: 'text-yellow-600',
      iconPath: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    { 
      label: 'Revenue', 
      value: '$1,243', 
      bgColor: 'bg-purple-50', 
      textColor: 'text-purple-600',
      iconPath: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const actionCards = [
    {
      title: 'Manage Orders',
      description: 'Track and update order status',
      info: 'You have 12 active orders that need attention.',
      link: '/orders',
      buttonText: 'View Orders',
      bgGradient: 'from-[#FF7A00] to-[#FFA149]',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      title: 'Menu Management',
      description: 'Update your menu offerings',
      info: 'You have 24 menu items currently available.',
      link: '/menu',
      buttonText: 'Manage Menu',
      bgGradient: 'from-[#FF7A00] to-[#FFA149]',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      title: 'AI Assistant',
      description: 'Get intelligent help and insights',
      info: 'Ask questions, get recommendations, and optimize your restaurant operations.',
      link: '/chat',
      buttonText: 'Chat with AI',
      bgGradient: 'from-[#FF7A00] to-[#FFA149]',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    }
  ];

  const recentActivity = [
    { id: 1, action: 'New order received', time: '2 minutes ago', table: 'Table 5' },
    { id: 2, action: 'Payment processed', time: '15 minutes ago', table: 'Table 3' },
    { id: 3, action: 'Order completed', time: '32 minutes ago', table: 'Table 7' },
    { id: 4, action: 'Menu item updated', time: '1 hour ago', item: 'Margherita Pizza' },
    { id: 5, action: 'New reservation', time: '2 hours ago', table: 'Table 2' },
    { id: 6, action: 'Inventory updated', time: '3 hours ago', item: 'Beverages' }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif]">
      {/* Mobile Menu */}
      {isMobile && <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />}
      
      {/* Main Content */}
      <main className="transition-all duration-300">
        {/* Header for both mobile and desktop */}
        <div className="bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between sticky top-0 z-10">
          {isMobile ? (
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          ) : (
            <div className="w-10"></div> /* Spacer for non-mobile */
          )}
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="inline-block bg-gradient-to-r from-[#FF7A00] to-[#FF7A00]/80 text-white rounded px-2 py-1">C</span>
            <span className="font-bold text-lg">Cravely</span>
          </Link>
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-[#FF7A00]/10 text-[#FF7A00] flex items-center justify-center font-medium">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header Zone */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome back, {firstName}!
            </h1>
            <p className="text-gray-600 mt-1 text-base">
              Here's what's happening with your restaurant today.
            </p>
          </motion.div>

          {/* KPI Zone */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                className={`${stat.bgColor} rounded-xl shadow-sm p-6 flex flex-col transition-all duration-300`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`${stat.textColor} p-2 rounded-lg bg-white`}>
                    {stat.iconPath}
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white ${stat.textColor}`}>
                    Today
                  </span>
                </div>
                <div className={`text-3xl font-bold ${stat.textColor} mt-2`}>{stat.value}</div>
                <div className="text-sm font-medium mt-1 text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Action Zone */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="mb-8 space-y-4"
          >
            {actionCards.map((card, index) => (
              <motion.div 
                key={index}
                variants={item}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start md:items-center gap-4 mb-4 md:mb-0">
                    <div className={`p-3 bg-gradient-to-br ${card.bgGradient} rounded-lg text-white`}>
                      {card.icon}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{card.title}</h2>
                      <p className="text-sm text-gray-600">{card.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <p className="text-sm text-gray-600 hidden md:block">
                      {card.info}
                    </p>
                    <Link 
                      to={card.link} 
                      className="px-6 py-2.5 bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white text-sm font-medium rounded-lg shadow-sm transition-colors whitespace-nowrap"
                    >
                      {card.buttonText}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Activity Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-lg text-gray-900">Recent Activity</h2>
              <button className="text-sm font-medium text-[#FF7A00] hover:text-[#FF7A00]/80 transition-colors">
                View All
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentActivity.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {activity.table && <span>{activity.table}</span>}
                          {activity.item && <span>{activity.item}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{activity.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-[#FF7A00] hover:text-[#FF7A00]/80">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}