import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

interface Table {
  id: string;
  label: string;
  qrUrl: string;
  createdAt: any;
}

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTableLabels, setNewTableLabels] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  
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
            createdAt: doc.data().createdAt
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
  }, [user]);
  
  // Generate QR codes for new tables
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
      }        try {
        let result;
        
        // Use the production HTTP function for all environments
        const response = await fetch('https://us-central1-cravely-f2914.cloudfunctions.net/generateTableQRCodesHttp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            restaurantId,
            tableLabels
          })
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        result = { data: await response.json() };
          // Handle response
        const data = result.data as { success: boolean; tables: Record<string, string> };
        if (data.success) {
          setSuccessMessage(`Successfully generated ${Object.keys(data.tables).length} QR codes!`);
          setNewTableLabels('');
          
          // Refresh from Firestore since our cloud function adds data there
          const tablesRef = collection(db, 'tables');
          const q = query(tablesRef, where('restaurantId', '==', restaurantId));
          const querySnapshot = await getDocs(q);
          
          const tableData: Table[] = [];
          querySnapshot.forEach((doc) => {
            tableData.push({
              id: doc.id,
              label: doc.data().label,
              qrUrl: doc.data().qrUrl,
              createdAt: doc.data().createdAt
            });
          });
          
          setTables(tableData);
        } else {
          setError('Failed to generate QR codes');
        }
      } catch (err) {
        console.error('Error generating QR codes:', err);
        setError('An error occurred while generating QR codes');
      } finally {
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('Outer error:', error);
      setError('An unexpected error occurred');
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
        <h2 className="text-lg font-medium mb-4">Your Tables</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#FF7A00] rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Loading tables...</p>
          </div>
        ) : tables.length === 0 ? (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table) => (
              <motion.div 
                key={table.id} 
                whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                className="border rounded-lg overflow-hidden shadow-sm transition-all duration-300"
              >
                <div className="p-4 border-b bg-gradient-to-r from-[#FF7A00]/10 to-[#FFA149]/5">
                  <h3 className="font-medium text-gray-900">{table.label}</h3>
                  <p className="text-sm text-gray-500">ID: {table.id}</p>
                </div>
                {table.qrUrl ? (
                  <div className="p-4 flex flex-col items-center">
                    <img
                      src={table.qrUrl}
                      alt={`QR code for ${table.label}`}
                      className="w-32 h-32 object-contain mb-4"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxyZWN0IGZpbGw9IiNGNUY1RjUiIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNiIvPjx0ZXh0IGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB4PSIxMCIgeT0iNjQiPk5vIFFSIGNvZGUgYXZhaWxhYmxlPC90ZXh0PjwvZz48L3N2Zz4=';
                      }}
                    />
                    <button
                      onClick={() => downloadQRCode(table.qrUrl, table.label)}
                      className="px-4 py-2 bg-[#FF7A00] text-white text-sm rounded-md hover:bg-[#FF7A00]/90 transition-colors"
                    >
                      Download QR
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-[#FF7A00]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <p>QR code will be generated</p>
                  </div>
                )}
                
                <div className="bg-gray-50 px-4 py-3 text-sm text-gray-500">
                  <p>
                    Scanning this QR code will take customers to:
                  </p>
                  <p className="font-mono text-xs mt-1 truncate">
                    /r/{restaurantId}/t/{table.id}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
