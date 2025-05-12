import { useState } from 'react';
import { motion } from 'framer-motion';

type Order = {
  id: number;
  table: number;
  items: string[];
  status: 'Pending' | 'Preparing' | 'Ready' | 'Served' | 'Cancelled';
  timestamp: string;
  total: number;
  customerName?: string;
  specialRequests?: string;
};

export default function OrdersPage() {
  // Example orders with more detailed information
  const [orders, setOrders] = useState<Order[]>([
    { 
      id: 101, 
      table: 5, 
      items: ['Margherita Pizza', 'Caesar Salad', 'Soda'], 
      status: 'Preparing', 
      timestamp: '2025-05-12T15:30:00',
      total: 28.97,
      specialRequests: 'Extra cheese on pizza'
    },
    { 
      id: 102, 
      table: 2, 
      items: ['Spaghetti Carbonara', 'Garlic Bread', 'Red Wine'], 
      status: 'Served', 
      timestamp: '2025-05-12T15:15:00',
      total: 32.50,
      customerName: 'Jane Smith'
    },
    { 
      id: 103, 
      table: 7, 
      items: ['Burger', 'Fries', 'Chocolate Milkshake'], 
      status: 'Pending', 
      timestamp: '2025-05-12T15:45:00',
      total: 24.99
    },
    { 
      id: 104, 
      table: 3, 
      items: ['Greek Salad', 'Lemonade'], 
      status: 'Ready', 
      timestamp: '2025-05-12T15:40:00',
      total: 15.50,
      customerName: 'Michael Johnson',
      specialRequests: 'No onions in salad'
    },
    { 
      id: 105, 
      table: 10, 
      items: ['Pepperoni Pizza', 'Chicken Wings', 'Beer'], 
      status: 'Pending', 
      timestamp: '2025-05-12T15:50:00',
      total: 39.95
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Format the timestamp into a more readable format
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date in a user-friendly way
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Handle order status change
  const handleStatusChange = (orderId: number, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Filter orders based on status and search query
  const filteredOrders = orders.filter(order => 
    (filterStatus === 'All' || order.status === filterStatus) &&
    (searchQuery === '' || 
     order.id.toString().includes(searchQuery) || 
     order.table.toString().includes(searchQuery) ||
     order.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase())) ||
     (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Sort orders by timestamp (newest first) and then by status priority
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    // Priority order: Pending, Preparing, Ready, Served, Cancelled
    const statusPriority: Record<string, number> = {
      'Pending': 0,
      'Preparing': 1,
      'Ready': 2,
      'Served': 3,
      'Cancelled': 4
    };
    
    // First sort by status priority
    const statusDiff = statusPriority[a.status] - statusPriority[b.status];
    if (statusDiff !== 0) return statusDiff;
    
    // Then sort by timestamp (newest first)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Animation variants
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
    <div className="max-w-6xl mx-auto w-full p-4 md:p-6 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          Order Tracking
        </h1>
        
        <div className="flex gap-2">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            New Order
          </button>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Orders
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by order #, table, or items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <div className="flex flex-wrap gap-2">
              {['All', 'Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    filterStatus === status 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
          <p className="text-orange-800 text-sm font-medium">Pending</p>
          <p className="text-2xl font-bold text-orange-600">{orders.filter(o => o.status === 'Pending').length}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <p className="text-yellow-800 text-sm font-medium">Preparing</p>
          <p className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'Preparing').length}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <p className="text-green-800 text-sm font-medium">Ready</p>
          <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'Ready').length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p className="text-blue-800 text-sm font-medium">Served</p>
          <p className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'Served').length}</p>
        </div>
      </div>
      
      {/* Orders List */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4"
      >
        {sortedOrders.map(order => (
          <motion.div
            key={order.id}
            variants={item}
            className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Order Basic Info */}
              <div className="p-4 flex-1 sm:border-r border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">Order #{order.id}</h3>
                      <span className="text-xs text-gray-500">{formatDate(order.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Table {order.table} • {formatTime(order.timestamp)}
                    </p>
                    {order.customerName && (
                      <p className="text-sm text-gray-600 mt-1">
                        Customer: {order.customerName}
                      </p>
                    )}
                  </div>
                  <div>
                    <span 
                      className={`
                        inline-block px-2 py-1 rounded-full text-xs font-semibold
                        ${order.status === 'Pending' ? 'bg-orange-100 text-orange-800' : 
                          order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === 'Ready' ? 'bg-green-100 text-green-800' : 
                          order.status === 'Served' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'}
                      `}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-medium text-gray-500 mb-1">ITEMS</h4>
                  <ul className="space-y-1">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="text-sm">{item}</li>
                    ))}
                  </ul>
                </div>
                {order.specialRequests && (
                  <div className="mb-3">
                    <h4 className="text-xs font-medium text-gray-500 mb-1">SPECIAL REQUESTS</h4>
                    <p className="text-sm italic">{order.specialRequests}</p>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-medium text-gray-500">TOTAL</h4>
                    <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              {/* Order Actions */}
              <div className="bg-gray-50 p-4 flex flex-col justify-between gap-2">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2">UPDATE STATUS</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {['Pending', 'Preparing', 'Ready', 'Served', 'Cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(order.id, status as Order['status'])}
                        disabled={order.status === status}
                        className={`
                          px-3 py-2 rounded-lg text-xs font-medium transition-colors
                          ${order.status === status 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : status === 'Pending' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' : 
                              status === 'Preparing' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 
                              status === 'Ready' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                              status === 'Served' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 
                              'bg-red-100 text-red-800 hover:bg-red-200'
                          }
                        `}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                    View Details
                  </button>
                  <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                    Print Receipt
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {filteredOrders.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">No orders found. Try adjusting your search or filters.</p>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear search
            </button>
          )}
          {filterStatus !== 'All' && (
            <button 
              onClick={() => setFilterStatus('All')}
              className="mt-2 ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Show all statuses
            </button>
          )}
        </div>
      )}
    </div>
  );
}