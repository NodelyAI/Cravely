import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  collection, query, where, orderBy, onSnapshot, doc, updateDoc, 
  getDocs, serverTimestamp, Timestamp 
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import OrderNotifications from '../components/features/OrderNotifications';
import { registerServiceWorker, requestNotificationPermission } from '../services/notifications';

type OrderItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  options: Record<string, string>;
  specialInstructions?: string;
};

type Order = {
  id: string;
  restaurantId: string;
  tableId: string;
  tableName?: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  createdAt: Timestamp;
  total: number;
  customerName?: string;
  specialRequests?: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user } = useAuth();

  // Request notification permission and register service worker
  useEffect(() => {
    const setupNotifications = async () => {
      await registerServiceWorker();
      await requestNotificationPermission();
    };
    
    setupNotifications();
  }, []);

  // Fetch restaurant ID and listen for orders
  useEffect(() => {
    async function fetchRestaurantId() {
      try {
        if (!user) return null;
        
        // In a real app, this would come from authenticated user claims
        // For demo purposes, we'll fetch the first restaurant the user has access to
        const restaurantsRef = collection(db, 'restaurants');
        const q = query(restaurantsRef);
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const firstRestaurant = querySnapshot.docs[0];
          setRestaurantId(firstRestaurant.id);
          return firstRestaurant.id;
        }
        
        setError('No restaurants found for this user');
        setLoading(false);
        return null;
      } catch (err) {
        console.error('Error fetching restaurant ID:', err);
        setError('Failed to load restaurant information');
        setLoading(false);
        return null;
      }
    }

    async function fetchTables(restId: string) {
      try {
        const tablesRef = collection(db, 'tables');
        const q = query(tablesRef, where('restaurantId', '==', restId));
        const querySnapshot = await getDocs(q);
        
        const tableData: Record<string, string> = {};
        querySnapshot.forEach((doc) => {
          tableData[doc.id] = doc.data().label;
        });
        
        setTables(tableData);
      } catch (err) {
        console.error('Error fetching tables:', err);
      }
    }
    
    async function setupOrdersListener(restId: string) {
      // Set up real-time listener for orders
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('restaurantId', '==', restId),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const orderData: Order[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          orderData.push({
            id: doc.id,
            restaurantId: data.restaurantId,
            tableId: data.tableId,
            tableName: tables[data.tableId] || `Table ${data.tableId.substring(0, 4)}`,
            items: data.items || [],
            status: data.status,
            createdAt: data.createdAt,
            total: data.total,
            specialRequests: data.specialRequests
          });
        });
        
        setOrders(orderData);
        setLoading(false);
      }, (error) => {
        console.error('Error listening to orders:', error);
        setError('Failed to load orders');
        setLoading(false);
      });
      
      return unsubscribe;
    }
    
    async function initData() {
      const restId = await fetchRestaurantId();
      if (restId) {
        await fetchTables(restId);
        return setupOrdersListener(restId);
      }
      return () => {};
    }
    
    const unsubscribe = initData();
    
    // Cleanup listener on unmount
    return () => {
      unsubscribe.then(unsub => unsub());
    };
  }, [user]);

  // Format the timestamp into a more readable format
  const formatTime = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date in a user-friendly way
  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Handle order status change
  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      
      // The UI will update automatically via the Firestore listener
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    }
  };

  // Filter orders based on status and search query
  const filteredOrders = orders.filter(order => 
    (filterStatus === 'All' || order.status === filterStatus.toLowerCase()) &&
    (searchQuery === '' || 
     order.id.toString().includes(searchQuery) || 
     order.tableId.toString().includes(searchQuery) ||
     (order.tableName && order.tableName.toLowerCase().includes(searchQuery.toLowerCase())) ||
     order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Sort orders by status and timestamp
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    // Priority order: pending, preparing, ready, served, cancelled
    const statusPriority: Record<string, number> = {
      'pending': 0,
      'preparing': 1,
      'ready': 2,
      'served': 3,
      'cancelled': 4
    };
    
    // First sort by status priority
    const statusDiff = statusPriority[a.status] - statusPriority[b.status];
    if (statusDiff !== 0) return statusDiff;
    
    // Then sort by timestamp (newest first)
    return b.createdAt?.seconds - a.createdAt?.seconds;
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

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-16 h-16 border-4 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-lg">Loading orders...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto w-full p-4 md:p-6 flex flex-col gap-6">
      {/* Order notifications */}
      <OrderNotifications restaurantId={restaurantId} />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          Order Tracking
        </h1>
        
        <div className="flex gap-2">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            onClick={() => alert('This would open a POS interface for creating orders')}
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
          <p className="text-2xl font-bold text-orange-600">{orders.filter(o => o.status === 'pending').length}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <p className="text-yellow-800 text-sm font-medium">Preparing</p>
          <p className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'preparing').length}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <p className="text-green-800 text-sm font-medium">Ready</p>
          <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'ready').length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p className="text-blue-800 text-sm font-medium">Served</p>
          <p className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'served').length}</p>
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
                      <h3 className="font-bold text-gray-900">Order #{order.id.substring(0, 8)}</h3>
                      <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.tableName || `Table ${order.tableId.substring(0, 4)}`} • {formatTime(order.createdAt)}
                    </p>
                  </div>
                  <div>
                    <span 
                      className={`
                        inline-block px-2 py-1 rounded-full text-xs font-semibold
                        ${order.status === 'pending' ? 'bg-orange-100 text-orange-800' : 
                          order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === 'ready' ? 'bg-green-100 text-green-800' : 
                          order.status === 'served' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'}
                      `}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-medium text-gray-500 mb-1">ITEMS</h4>
                  <ul className="space-y-1">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="text-sm">
                        {item.quantity}x {item.name} - ${item.price.toFixed(2)}
                        {item.specialInstructions && (
                          <span className="text-xs text-gray-500 italic ml-2">
                            ({item.specialInstructions})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
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
                    {['pending', 'preparing', 'ready', 'served', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(order.id, status as Order['status'])}
                        disabled={order.status === status}
                        className={`
                          px-3 py-2 rounded-lg text-xs font-medium transition-colors
                          ${order.status === status 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : status === 'pending' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' : 
                              status === 'preparing' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 
                              status === 'ready' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                              status === 'served' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 
                              'bg-red-100 text-red-800 hover:bg-red-200'
                          }
                        `}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-2">
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                    onClick={() => window.open(`/r/${order.restaurantId}/t/${order.tableId}`, '_blank')}
                  >
                    View Table Menu
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