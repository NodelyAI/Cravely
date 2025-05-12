import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.email?.split('@')[0] || 'User';

  const statsData = [
    { label: 'Active Orders', value: 12, bgColor: 'bg-blue-100', textColor: 'text-blue-600', icon: '📋' },
    { label: 'Tables Occupied', value: 8, bgColor: 'bg-green-100', textColor: 'text-green-600', icon: '🪑' },
    { label: 'Menu Items', value: 24, bgColor: 'bg-yellow-100', textColor: 'text-yellow-600', icon: '🍔' },
    { label: 'Total Revenue', value: '$1,243', bgColor: 'bg-purple-100', textColor: 'text-purple-600', icon: '💰' },
  ];

  const recentActivity = [
    { id: 1, action: 'New order received', time: '2 minutes ago', table: 'Table 5' },
    { id: 2, action: 'Payment processed', time: '15 minutes ago', table: 'Table 3' },
    { id: 3, action: 'Order completed', time: '32 minutes ago', table: 'Table 7' },
    { id: 4, action: 'Menu item updated', time: '1 hour ago', item: 'Margherita Pizza' },
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome back, {firstName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your restaurant today.
        </p>
      </motion.div>

      {/* Stats Grid */}
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
            className={`${stat.bgColor} rounded-lg shadow-sm p-6 flex flex-col`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`text-2xl ${stat.textColor}`}>{stat.icon}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white ${stat.textColor}`}>
                Today
              </span>
            </div>
            <div className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</div>
            <div className="text-sm font-medium mt-1 text-gray-600">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Action Cards */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <motion.div variants={item} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          <div className="bg-blue-600 text-white p-4">
            <h2 className="font-bold text-lg">Manage Orders</h2>
            <p className="text-blue-100 text-sm">Track and update order status</p>
          </div>
          <div className="p-4">
            <p className="text-gray-600 text-sm mb-4">
              You have <span className="font-bold text-blue-600">12 active orders</span> that need attention.
            </p>
            <Link to="/orders" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors">
              View Orders
            </Link>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          <div className="bg-green-600 text-white p-4">
            <h2 className="font-bold text-lg">Menu Management</h2>
            <p className="text-green-100 text-sm">Update your menu offerings</p>
          </div>
          <div className="p-4">
            <p className="text-gray-600 text-sm mb-4">
              You have <span className="font-bold text-green-600">24 menu items</span> currently available.
            </p>
            <Link to="/menu" className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors">
              Manage Menu
            </Link>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          <div className="bg-purple-600 text-white p-4">
            <h2 className="font-bold text-lg">AI Assistant</h2>
            <p className="text-purple-100 text-sm">Get intelligent help and insights</p>
          </div>
          <div className="p-4">
            <p className="text-gray-600 text-sm mb-4">
              Ask questions, get recommendations, and optimize your restaurant operations.
            </p>
            <Link to="/chat" className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors">
              Chat with AI
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="font-bold text-lg text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="px-6 py-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">
                  {activity.table ? `${activity.table} • ` : ''}
                  {activity.item ? `${activity.item} • ` : ''}
                  {activity.time}
                </p>
              </div>
              <div>
                <button className="text-sm text-blue-600 hover:text-blue-800">View</button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 px-6 py-3 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Activity
          </button>
        </div>
      </motion.div>
    </div>
  );
}