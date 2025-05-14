import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  imageUrl?: string; // URL to display image
  available: boolean;
  popular?: boolean;
  allergens?: string[];
  prepTime?: number; // in minutes
  restaurantId: string;
};

type Category = {
  id: string;
  name: string;
  count: number;
};

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch menu items from Firestore
  useEffect(() => {
    async function fetchMenuItems() {
      try {
        setLoading(true);
        const menuItemsCollection = collection(db, 'menuItems');
        const menuItemsQuery = query(menuItemsCollection, orderBy('category'));
        const querySnapshot = await getDocs(menuItemsQuery);
        
        const items: MenuItem[] = [];
        
        for (const doc of querySnapshot.docs) {
          const data = doc.data() as Omit<MenuItem, 'id'>;
          const item: MenuItem = {
            id: doc.id,
            ...data,
            popular: data.popular || false
          };
          
          // If the item has an image path, get the download URL
          if (item.image && item.image.startsWith('menu-items/')) {
            try {
              const imageRef = ref(storage, item.image);
              const downloadURL = await getDownloadURL(imageRef);
              item.imageUrl = downloadURL;
            } catch (imageError) {
              console.error(`Error loading image for ${item.name}:`, imageError);
              // Use a placeholder if image loading fails
              item.imageUrl = `https://via.placeholder.com/150?text=${encodeURIComponent(item.name)}`;
            }
          } else if (!item.imageUrl) {
            // If no image or imageUrl provided, use a placeholder
            item.imageUrl = `https://via.placeholder.com/150?text=${encodeURIComponent(item.name)}`;
          }
          
          items.push(item);
        }
        
        setMenuItems(items);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError('Failed to load menu items. Please try again later.');
        setLoading(false);
      }
    }
    
    fetchMenuItems();
  }, []);

  // Derived categories from menu items
  const categories: Category[] = [
    { id: 'all', name: 'All Items', count: menuItems.length },
    ...Array.from(new Set(menuItems.map(item => item.category)))
      .map(category => ({
        id: category.toLowerCase().replace(/\s+/g, '-'),
        name: category,
        count: menuItems.filter(item => item.category === category).length
      }))
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Filter menu items based on selected category, search query, and availability
  const filteredItems = menuItems.filter(item => 
    (selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.replace(/-/g, ' ')) &&
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     item.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (!showAvailableOnly || item.available)
  );
  // Toggle item availability
  const toggleAvailability = (itemId: string) => {
    setMenuItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, available: !item.available } : item
      )
    );
  };

  // Delete a menu item
  const deleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      setMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));
    }
  };

  // Open edit modal with item data
  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setIsAddModalOpen(true);
  };

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
          Menu Management
        </h1>
        
        <button 
          onClick={() => {
            setEditingItem(null);
            setIsAddModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Add New Item
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Menu
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available-only"
                  checked={showAvailableOnly}
                  onChange={() => setShowAvailableOnly(!showAvailableOnly)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="available-only" className="text-sm text-gray-700">
                  Available items only
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Categories */}
      <div className="flex overflow-x-auto pb-2 mb-4 scrollbar-hide">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                selectedCategory === category.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Menu Items Grid */}
      {!loading && !error && filteredItems.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show" 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredItems.map((menuItem) => (
            <motion.div
              key={menuItem.id}
              variants={item}
              className={`bg-white rounded-lg shadow-sm overflow-hidden border ${
                menuItem.available ? 'border-gray-200' : 'border-red-200'
              }`}
            >              <div className="relative h-40 bg-gray-200">
                <img
                  src={menuItem.imageUrl || menuItem.image}
                  alt={menuItem.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/150?text=${encodeURIComponent(menuItem.name)}`;
                  }}
                />
                {menuItem.popular && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-bold">
                    Popular
                  </div>
                )}
                {!menuItem.available && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Currently Unavailable</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{menuItem.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{menuItem.category}</p>
                  </div>
                  <div className="text-lg font-bold text-blue-600">${menuItem.price.toFixed(2)}</div>
                </div>
                
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{menuItem.description}</p>
                
                {menuItem.allergens && menuItem.allergens.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-500">ALLERGENS:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {menuItem.allergens.map((allergen, index) => (
                        <span key={index} className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-xs">
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-4 flex flex-wrap gap-2 justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(menuItem)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded text-xs font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem(menuItem.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1.5 rounded text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                  
                  <button
                    onClick={() => toggleAvailability(menuItem.id)}
                    className={`${
                      menuItem.available 
                        ? 'bg-green-100 hover:bg-green-200 text-green-800' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    } px-3 py-1.5 rounded text-xs font-medium`}
                  >
                    {menuItem.available ? 'Available' : 'Mark Available'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">No menu items found. Try adjusting your search or filters.</p>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear search
            </button>
          )}
          {selectedCategory !== 'all' && (
            <button 
              onClick={() => setSelectedCategory('all')}
              className="mt-2 ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Show all categories
            </button>
          )}
        </div>
      )}
      
      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="font-bold text-lg text-gray-900">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <form className="space-y-4">
                {/* Name and Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                    <input 
                      type="text" 
                      value={editingItem?.name || ''} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Margherita Pizza"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input 
                        type="number" 
                        value={editingItem?.price || ''} 
                        className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Category and Availability */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select 
                      value={editingItem?.category || ''} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a category</option>
                      {Array.from(new Set(menuItems.map(item => item.category))).map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))}
                      <option value="new">+ Add new category</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center h-5 mt-6">
                      <input
                        id="available"
                        type="checkbox"
                        checked={editingItem?.available || false}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="available" className="font-medium text-gray-700">Available</label>
                      <p className="text-gray-500">Item is currently available for order</p>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    value={editingItem?.description || ''} 
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe this menu item..."
                  ></textarea>
                </div>
                
                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input 
                    type="text" 
                    value={editingItem?.image || ''} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                {/* Allergens */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allergens</label>
                  <div className="flex flex-wrap gap-2">
                    {['Gluten', 'Dairy', 'Eggs', 'Soy', 'Nuts', 'Seafood'].map((allergen, index) => (
                      <label key={index} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={editingItem?.allergens?.includes(allergen) || false}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{allergen}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Prep Time and Popular */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Time (minutes)</label>
                    <input 
                      type="number" 
                      value={editingItem?.prepTime || 0} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center h-5 mt-6">
                      <input
                        id="popular"
                        type="checkbox"
                        checked={editingItem?.popular || false}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="popular" className="font-medium text-gray-700">Mark as Popular</label>
                      <p className="text-gray-500">Highlight this as a popular item</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingItem ? 'Save Changes' : 'Add Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}