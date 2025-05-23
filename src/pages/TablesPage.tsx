import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Table {
  id: string;
  label: string;
  qrUrl: string;
  createdAt: any;
  status?: 'available' | 'occupied' | 'reserved' | 'maintenance';
  lastOrderTime?: any;
  capacity?: number;
  area?: string;
  notes?: string;
}

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTableLabels, setNewTableLabels] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [newTableLabel, setNewTableLabel] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState<number>(4);
  const [newTableArea, setNewTableArea] = useState<string>('Main');
  const [newTableNotes, setNewTableNotes] = useState<string>('');
  const [newTableStatus, setNewTableStatus] = useState<Table['status']>('available');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterArea, setFilterArea] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState(true);
  const [showQRPreview, setShowQRPreview] = useState<string | null>(null);
  const [showFullScreenQR, setShowFullScreenQR] = useState<{url: string, label: string} | null>(null);
  const [areas, setAreas] = useState<string[]>(['Main', 'Bar', 'Patio', 'Private']);
  
  const { user } = useAuth();
  
  // Fetch tables for the restaurant
  useEffect(() => {
    async function fetchRestaurantId() {
      try {
        if (!user) return;
        
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
        
        // Create a demo restaurant if none exists
        const demoRestaurant = await addDoc(collection(db, 'restaurants'), {
          name: 'Demo Restaurant',
          owner: user.uid,
          createdAt: serverTimestamp(),
          address: '123 Main St, Demo City',
          phone: '555-123-4567'
        });
        
        setRestaurantId(demoRestaurant.id);
        return demoRestaurant.id;
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
        
        const tableData: Table[] = [];
        querySnapshot.forEach((doc) => {
          tableData.push({
            id: doc.id,
            label: doc.data().label,
            qrUrl: doc.data().qrUrl,
            createdAt: doc.data().createdAt,
            status: doc.data().status,
            lastOrderTime: doc.data().lastOrderTime
          });
        });
        
        setTables(tableData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tables:', err);
        setError('Failed to load tables');
        setLoading(false);
      }
    }
    
    async function initData() {
      const restId = await fetchRestaurantId();
      if (restId) {
        fetchTables(restId);
      }
    }
    
    initData();
  }, [user]);      // Generate QR codes for new tables
  const generateQRCodes = async () => {
    try {
      if (!restaurantId) {
        setError('Restaurant ID not found');
        return;
      }
      
      if (!newTableLabels.trim()) {
        setError('Please enter at least one table label');
        return;
      }
      
      setIsGenerating(true);
      setError(null);
      
      // Parse table labels from input
      const tableLabels = newTableLabels
        .split('\n')
        .map(label => label.trim())
        .filter(label => label !== '');
      
      if (tableLabels.length === 0) {
        setError('Please enter at least one valid table label');
        setIsGenerating(false);
        return;
      }      try {        
        console.log('Generating QR codes for tables:', tableLabels);
        
        const functionUrl = 'https://us-central1-cravely-f2914.cloudfunctions.net/publicMenuQRGenerator';
        console.log('Using function URL:', functionUrl);
        
        const requestBody = {
          restaurantId,
          tableLabels
        };
        console.log('Request payload:', JSON.stringify(requestBody));
        
        // Use the production HTTP function
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
        
        console.log('Response status:', response.status);
        
        // If not OK, try to get error details from the response
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          
          try {
            // Try to parse as JSON
            const errorJson = JSON.parse(errorText);
            throw new Error(`Server error: ${errorJson.message || errorJson.error || response.statusText}`);
          } catch (e) {
            // If not valid JSON, use the raw text
            throw new Error(`Error: ${response.status} ${response.statusText} - ${errorText}`);
          }
        }
        
        // Parse the JSON response
        const responseData = await response.json();
        console.log('Response data:', responseData);
        
        // Handle response
        if (responseData.success) {
          const numTables = Object.keys(responseData.tables).length;
          setSuccessMessage(`Successfully generated ${numTables} QR codes!`);
          setNewTableLabels('');
          
          // Refresh table data from Firestore since our real function 
          // already created the tables in Firestore with QR code URLs
          const tablesRef = collection(db, 'tables');
          const q = query(tablesRef, where('restaurantId', '==', restaurantId));
          const querySnapshot = await getDocs(q);
          
          const tableData: Table[] = [];
          querySnapshot.forEach((doc) => {
            tableData.push({
              id: doc.id,
              label: doc.data().label,
              qrUrl: doc.data().qrUrl,
              createdAt: doc.data().createdAt,
              status: doc.data().status,
              lastOrderTime: doc.data().lastOrderTime,
              capacity: doc.data().capacity,
              area: doc.data().area,
              notes: doc.data().notes
            });
          });
          
          setTables(tableData);
        } else {
          setError('Failed to generate QR codes: ' + (responseData.message || 'Unknown error'));
        }
      } catch (err) {
        console.error('Error generating QR codes:', err);
        setError(`Error generating QR codes: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }      finally {
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('Outer error:', error);
      setError(`An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsGenerating(false);
    }
  };
  
  // Download QR code as image
  const downloadQRCode = (qrUrl: string, tableLabel: string) => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `${tableLabel.replace(/\s+/g, '-')}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    // Update table
  const updateTable = async () => {
    if (!editingTable) return;
    
    try {
      const tableRef = doc(db, 'tables', editingTable.id);
      await updateDoc(tableRef, {
        label: newTableLabel.trim(),
        status: newTableStatus,
        capacity: newTableCapacity,
        area: newTableArea,
        notes: newTableNotes
      });
      
      setSuccessMessage('Table updated successfully');
      
      // Update local state
      setTables(tables.map(t => t.id === editingTable.id ? { 
        ...t, 
        label: newTableLabel.trim(),
        status: newTableStatus,
        capacity: newTableCapacity,
        area: newTableArea,
        notes: newTableNotes
      } : t));
      
      // Clear editing state
      setEditingTable(null);
      setNewTableLabel('');
    } catch (err) {
      console.error('Error updating table:', err);
      setError('Failed to update table');
    }
  };
  
  // Update table status only
  const updateTableStatus = async (tableId: string, newStatus: Table['status']) => {
    try {
      const tableRef = doc(db, 'tables', tableId);
      await updateDoc(tableRef, {
        status: newStatus
      });
      
      setSuccessMessage(`Table status updated to ${newStatus}`);
      
      // Update local state
      setTables(tables.map(t => t.id === tableId ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error('Error updating table status:', err);
      setError('Failed to update table status');
    }
  };
  
  // Delete table
  const deleteTable = async (tableId: string) => {
    if (!confirm('Are you sure you want to delete this table?')) return;
    
    try {
      const tableRef = doc(db, 'tables', tableId);
      await deleteDoc(tableRef);
      
      setSuccessMessage('Table deleted successfully');
      
      // Remove from local state
      setTables(tables.filter(t => t.id !== tableId));
    } catch (err) {
      console.error('Error deleting table:', err);
      setError('Failed to delete table');
    }
  };  useEffect(() => {
    // Add event listeners for dropdown menus
    const handleDropdowns = () => {
      const dropdownButtons = document.querySelectorAll('.dropdown-toggle');
      
      dropdownButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          const menu = button.nextElementSibling;
          if (menu && menu.classList.contains('hidden')) {
            // Close all other dropdowns first
            document.querySelectorAll('.dropdown-menu').forEach(m => {
              m.classList.add('hidden');
            });
            
            // Open this dropdown
            menu.classList.remove('hidden');
          } else if (menu) {
            menu.classList.add('hidden');
          }
        });
      });
      
      // Close all dropdowns when clicking outside
      document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
          menu.classList.add('hidden');
        });
      });
    };
    
    // Initialize dropdowns after render
    setTimeout(handleDropdowns, 100);
    
    // Clean up event listeners
    return () => {
      document.removeEventListener('click', () => {});
    };
  }, [tables]);  // Changed from filteredTables to tables
  
  // Filter tables by status and area
  const filteredTables = tables.filter(table => {
    // Filter by status if selected
    if (filterStatus && table.status !== filterStatus) {
      return false;
    }
    
    // Filter by area if selected
    if (filterArea && table.area !== filterArea) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Table Management</h1>
        <p className="text-gray-600">Generate and manage QR codes for your restaurant tables</p>
      </motion.div>
      
      {/* Error message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm"
        >
          <p>{error}</p>
        </motion.div>
      )}
      
      {/* Success message */}
      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-sm"
        >
          <p>{successMessage}</p>
        </motion.div>
      )}
      
      {/* QR Code Generator */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white shadow rounded-lg mb-6 p-6"
      >
        <h2 className="text-lg font-medium mb-4">Generate QR Codes</h2>
        <p className="text-gray-600 mb-4">
          Enter table labels (one per line) to generate QR codes. Customers can scan these
          codes to access the ordering page for that specific table.
        </p>
        
        <textarea
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7A00] mb-4"
          rows={4}
          placeholder="Table 1&#10;Table 2&#10;Bar 1&#10;Patio 3"
          value={newTableLabels}
          onChange={(e) => setNewTableLabels(e.target.value)}
          disabled={isGenerating}
        ></textarea>
        
        <button
          onClick={generateQRCodes}
          disabled={isGenerating || !newTableLabels.trim()}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            isGenerating || !newTableLabels.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#FF7A00] hover:bg-[#FF7A00]/90'
          }`}
        >
          {isGenerating ? 'Generating...' : 'Generate QR Codes'}
        </button>
      </motion.div>
      
      {/* Table List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white shadow rounded-lg p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Your Tables</h2>
          
          {/* View toggle buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setIsGridView(true)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                isGridView ? 'bg-[#FF7A00] text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setIsGridView(false)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                !isGridView ? 'bg-[#FF7A00] text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              List View
            </button>
          </div>
        </div>
          {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">Filter by status:</label>
            <select
              value={filterStatus || ''}
              onChange={(e) => setFilterStatus(e.target.value || null)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7A00] text-sm"
            >
              <option value="">All</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">Filter by area:</label>
            <select
              value={filterArea || ''}
              onChange={(e) => setFilterArea(e.target.value || null)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7A00] text-sm"
            >
              <option value="">All areas</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#FF7A00] rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Loading tables...</p>
          </div>
        ) : filteredTables.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tables found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Generate your first QR code by entering table labels in the form above.
            </p>
          </div>
        ) : isGridView ? (          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTables.map((table) => (
              <motion.div 
                key={table.id} 
                whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                className="border rounded-lg overflow-hidden shadow-sm transition-all duration-300"
              >
                <div className={`p-4 border-b ${
                  table.status === 'available' ? 'bg-green-50' :
                  table.status === 'occupied' ? 'bg-red-50' :
                  table.status === 'reserved' ? 'bg-yellow-50' :
                  table.status === 'maintenance' ? 'bg-gray-50' :
                  'bg-gradient-to-r from-[#FF7A00]/10 to-[#FFA149]/5'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{table.label}</h3>
                      <p className="text-sm text-gray-500">
                        {table.area && <span className="mr-2">Area: {table.area}</span>}
                        {table.capacity && <span>Seats: {table.capacity}</span>}
                      </p>
                    </div>                    <span className={`text-xs font-semibold rounded-full px-2 py-1 ${
                      table.status === 'available' ? 'bg-green-100 text-green-800' :
                      table.status === 'occupied' ? 'bg-red-100 text-red-800' :
                      table.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                      table.status === 'maintenance' ? 'bg-gray-100 text-gray-800' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {table.status ? table.status.charAt(0).toUpperCase() + table.status.slice(1) : 'Unknown'}
                    </span>
                  </div>
                </div>
                {table.qrUrl ? (
                  <div className="p-4 flex flex-col items-center">
                    <img
                      src={table.qrUrl}
                      alt={`QR code for ${table.label}`}
                      className="w-32 h-32 object-contain mb-4 cursor-pointer"
                      onClick={() => setShowFullScreenQR({ url: table.qrUrl, label: table.label })}
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxyZWN0IGZpbGw9IiNGNUY1RjUiIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNiIvPjx0ZXh0IGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB4PSIxMCIgeT0iNjQiPk5vIFFSIGNvZGUgYXZhaWxhYmxlPC90ZXh0PjwvZz48L3N2Zz4=';
                      }}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => downloadQRCode(table.qrUrl, table.label)}
                        className="px-3 py-2 bg-[#FF7A00] text-white text-sm rounded-md hover:bg-[#FF7A00]/90 transition-colors flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                      <button
                        onClick={() => setShowFullScreenQR({ url: table.qrUrl, label: table.label })}
                        className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-[#FF7A00]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <p>QR code will be generated</p>
                  </div>
                )}
                
                {table.notes && (
                  <div className="px-4 py-2 border-t bg-gray-50">
                    <p className="text-xs text-gray-500 italic">Notes: {table.notes}</p>
                  </div>
                )}
                
                <div className="bg-gray-50 px-4 py-3 border-t">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1">
                      {/* Update status buttons */}
                      <div className="dropdown relative">                        <button className="dropdown-toggle px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">
                          Status ▼
                        </button>
                        <div className="dropdown-menu hidden absolute left-0 mt-1 w-28 bg-white shadow-lg rounded-md z-10 py-1">
                          <button 
                            onClick={() => updateTableStatus(table.id, 'available')}
                            className="w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                          >
                            Available
                          </button>
                          <button 
                            onClick={() => updateTableStatus(table.id, 'occupied')}
                            className="w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                          >
                            Occupied
                          </button>
                          <button 
                            onClick={() => updateTableStatus(table.id, 'reserved')}
                            className="w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                          >
                            Reserved
                          </button>
                          <button 
                            onClick={() => updateTableStatus(table.id, 'maintenance')}
                            className="w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                          >
                            Maintenance
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setEditingTable(table);
                          setNewTableLabel(table.label);
                          setNewTableStatus(table.status || 'available');
                          setNewTableCapacity(table.capacity || 4);
                          setNewTableArea(table.area || 'Main');
                          setNewTableNotes(table.notes || '');
                        }}
                        className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTable(table.id)}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTables.map((table) => (
              <div key={table.id} className="py-4 flex flex-wrap md:flex-nowrap items-center justify-between">
                <div className="w-full md:w-auto mb-3 md:mb-0">
                  <div className="flex items-start">
                    <div className="mr-3">
                      {table.qrUrl ? (
                        <img
                          src={table.qrUrl}
                          alt={`QR code for ${table.label}`}
                          className="w-16 h-16 object-contain cursor-pointer"
                          onClick={() => setShowFullScreenQR({ url: table.qrUrl, label: table.label })}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-medium">{table.label}</h3>
                      <div className="flex flex-wrap text-sm text-gray-500 mt-1">
                        <p className="mr-3">ID: {table.id.substring(0, 6)}...</p>
                        {table.area && <p className="mr-3">Area: {table.area}</p>}
                        {table.capacity && <p>Seats: {table.capacity}</p>}
                      </div>
                      {table.notes && (
                        <p className="text-xs text-gray-500 italic mt-1">Notes: {table.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Status badge */}                  <span className={`text-xs font-semibold rounded-full px-3 py-1 ${
                    table.status === 'available' ? 'bg-green-100 text-green-800' :
                    table.status === 'occupied' ? 'bg-red-100 text-red-800' :
                    table.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                    table.status === 'maintenance' ? 'bg-gray-100 text-gray-800' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {table.status ? table.status.charAt(0).toUpperCase() + table.status.slice(1) : 'Unknown'}
                  </span>
                  
                  {/* Status dropdown */}
                  <div className="dropdown relative">                    <button className="dropdown-toggle px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">
                      Status ▼
                    </button>
                    <div className="dropdown-menu hidden absolute right-0 mt-1 w-28 bg-white shadow-lg rounded-md z-10 py-1">
                      <button 
                        onClick={() => updateTableStatus(table.id, 'available')}
                        className="w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                      >
                        Available
                      </button>
                      <button 
                        onClick={() => updateTableStatus(table.id, 'occupied')}
                        className="w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                      >
                        Occupied
                      </button>
                      <button 
                        onClick={() => updateTableStatus(table.id, 'reserved')}
                        className="w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                      >
                        Reserved
                      </button>
                      <button 
                        onClick={() => updateTableStatus(table.id, 'maintenance')}
                        className="w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                      >
                        Maintenance
                      </button>
                    </div>
                  </div>
                  
                  {/* Download QR button */}
                  {table.qrUrl && (
                    <button
                      onClick={() => downloadQRCode(table.qrUrl, table.label)}
                      className="px-3 py-1 bg-[#FF7A00] text-white text-sm rounded-md hover:bg-[#FF7A00]/90 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  )}
                  
                  {/* View QR button */}
                  {table.qrUrl && (
                    <button
                      onClick={() => setShowFullScreenQR({ url: table.qrUrl, label: table.label })}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  )}
                  
                  {/* Edit button */}
                  <button
                    onClick={() => {
                      setEditingTable(table);
                      setNewTableLabel(table.label);
                      setNewTableStatus(table.status || 'available');
                      setNewTableCapacity(table.capacity || 4);
                      setNewTableArea(table.area || 'Main');
                      setNewTableNotes(table.notes || '');
                    }}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  
                  {/* Delete button */}
                  <button
                    onClick={() => deleteTable(table.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
        {/* Edit table modal */}
      {editingTable && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6">
            <h3 className="text-lg font-medium mb-4">Edit Table</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Table Label</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                  placeholder="Table label"
                  value={newTableLabel}
                  onChange={(e) => setNewTableLabel(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                  value={newTableStatus || 'available'}
                  onChange={(e) => setNewTableStatus(e.target.value as Table['status'])}
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                  value={newTableCapacity}
                  onChange={(e) => setNewTableCapacity(parseInt(e.target.value) || 1)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <select
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                  value={newTableArea}
                  onChange={(e) => setNewTableArea(e.target.value)}
                >
                  {areas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                  rows={3}
                  placeholder="Special notes about this table"
                  value={newTableNotes || ''}
                  onChange={(e) => setNewTableNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setEditingTable(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateTable}
                className="px-4 py-2 bg-[#FF7A00] text-white rounded-md hover:bg-[#FF7A00]/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      )}
        {/* Full screen QR Code preview modal */}
      {showFullScreenQR && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80 p-4"
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6 text-center">
            <h3 className="text-xl font-medium mb-2">{showFullScreenQR.label}</h3>            <p className="text-gray-500 mb-6">Scan this QR code to access the menu for this table</p>
            
            <div className="flex justify-center mb-6">
              <img
                src={showFullScreenQR.url}
                alt={`QR code for ${showFullScreenQR.label}`}
                className="w-56 h-56 object-contain"
              />
            </div>
            
            <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded mb-6 font-mono break-all">
              {window.location.origin}/r/{restaurantId}/t/{showFullScreenQR.label.replace(/\s+/g, '-').toLowerCase()}/menu
            </p>
            
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => downloadQRCode(showFullScreenQR.url, showFullScreenQR.label)}
                className="px-4 py-2 bg-[#FF7A00] text-white rounded-md hover:bg-[#FF7A00]/90 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
              <button
                onClick={() => setShowFullScreenQR(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
