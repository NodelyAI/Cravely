import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../services/firebase';
import { AIChat } from '../../../../components/features/AIChat';

// Types
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  options?: Array<{
    name: string;
    choices: Array<{
      name: string;
      price: number;
    }>;
  }>;
  dietary?: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
    nutFree?: boolean;
  };
  available: boolean;
}

interface Table {
  id: string;
  label: string;
  restaurantId: string;
  qrUrl: string;
}

interface Restaurant {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  options: Record<string, string>;
  specialInstructions?: string;
}

// Guest ordering page component
export default function TableOrderPage() {
  const { restaurantId, tableId } = useParams<{ restaurantId: string; tableId: string }>();
    // State
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [table, setTable] = useState<Table | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
    // Initialize AI assistant
  // Order-related state
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [lastOrders, setLastOrders] = useState<any[]>([]);
  const [billRequested, setBillRequested] = useState(false);
  const [assistanceRequested, setAssistanceRequested] = useState(false);
  
  // Fetch restaurant, table, and menu data
  useEffect(() => {
    async function fetchData() {
      try {
        if (!restaurantId || !tableId) {
          throw new Error('Restaurant ID or Table ID not provided');
        }
        
        setLoading(true);
        
        // Fetch restaurant data
        const restaurantDoc = await getDoc(doc(db, 'restaurants', restaurantId));
        if (!restaurantDoc.exists()) {
          throw new Error('Restaurant not found');
        }
        
        const restaurantData = restaurantDoc.data();
        setRestaurant({
          id: restaurantDoc.id,
          name: restaurantData.name,
          logo: restaurantData.logo,
          primaryColor: restaurantData.primaryColor,
          secondaryColor: restaurantData.secondaryColor
        });
        
        // Fetch table data
        const tableDoc = await getDoc(doc(db, 'tables', tableId));
        if (!tableDoc.exists()) {
          throw new Error('Table not found');
        }
        
        const tableData = tableDoc.data();
        setTable({
          id: tableDoc.id,
          label: tableData.label,
          restaurantId: tableData.restaurantId,
          qrUrl: tableData.qrUrl
        });
        
        // Check if table belongs to restaurant
        if (tableData.restaurantId !== restaurantId) {
          throw new Error('Table does not belong to this restaurant');
        }
        
        // Fetch menu items
        const menuItemsQuery = query(
          collection(db, 'menuItems'),
          where('restaurantId', '==', restaurantId),
          where('available', '==', true)
        );
        
        const menuItemsSnapshot = await getDocs(menuItemsQuery);
        const items: MenuItem[] = [];
        const categoriesSet = new Set<string>();
        
        menuItemsSnapshot.forEach((doc) => {
          const item = { id: doc.id, ...doc.data() } as MenuItem;
          items.push(item);
          if (item.category) categoriesSet.add(item.category);
        });
        
        setMenuItems(items);
        setCategories(Array.from(categoriesSet));
        
        // Set default category if any
        if (categoriesSet.size > 0) {
          setSelectedCategory(Array.from(categoriesSet)[0]);
        }
        
        // Fetch last orders for this table (for AI recommendations)
        const lastOrdersQuery = query(
          collection(db, 'orders'),
          where('tableId', '==', tableId),
          where('status', '==', 'completed')
        );
        
        const lastOrdersSnapshot = await getDocs(lastOrdersQuery);
        const orders: any[] = [];
        
        lastOrdersSnapshot.forEach((doc) => {
          orders.push({ id: doc.id, ...doc.data() });
        });
        
        setLastOrders(orders);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [restaurantId, tableId]);
  
  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Filter menu items by category
  const filteredMenuItems = selectedCategory 
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems;
  
  // Open item customization modal
  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setSelectedOptions({});
    setQuantity(1);
    setSpecialInstructions('');
    setModalOpen(true);
  };
  
  // Add item to cart
  const addToCart = () => {
    if (!selectedItem) return;
    
    // Calculate price including options
    let totalPrice = selectedItem.price;
    if (selectedItem.options) {
      selectedItem.options.forEach(optionGroup => {
        const selectedChoice = optionGroup.choices.find(
          choice => choice.name === selectedOptions[optionGroup.name]
        );
        if (selectedChoice) {
          totalPrice += selectedChoice.price;
        }
      });
    }
    
    // Create cart item
    const cartItem: CartItem = {
      menuItemId: selectedItem.id,
      name: selectedItem.name,
      price: totalPrice,
      quantity: quantity,
      options: selectedOptions,
      specialInstructions: specialInstructions.trim() || undefined
    };
    
    // Add to cart
    setCart(prev => [...prev, cartItem]);
    
    // Close modal
    setModalOpen(false);
  };
  
  // Remove item from cart
  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };
  
  // Submit order
  const placeOrder = async () => {
    try {
      if (!restaurantId || !tableId || cart.length === 0) return;
      
      // Create order in Firestore
      const orderRef = await addDoc(collection(db, 'orders'), {
        restaurantId,
        tableId,
        items: cart.map(item => ({
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          options: item.options,
          specialInstructions: item.specialInstructions
        })),
        total: cartTotal,
        status: 'pending',
        createdAt: serverTimestamp()
      });
        // Reset cart and show success message
      setCart([]);
      setCartOpen(false);
      setOrderSuccess(true);
      
      // Log order ID for tracking
      console.log(`Order placed successfully with ID: ${orderRef.id}`);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setOrderSuccess(false);
      }, 5000);
      
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err instanceof Error ? err.message : 'Failed to place your order');
    }
  };
  
  // Request bill
  const requestBill = async () => {
    try {
      if (!restaurantId || !tableId) return;
      
      // Create bill request in Firestore
      await addDoc(collection(db, 'billRequests'), {
        restaurantId,
        tableId,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      setBillRequested(true);
      
      // Reset after 2 minutes
      setTimeout(() => {
        setBillRequested(false);
      }, 120000);
      
    } catch (err) {
      console.error('Error requesting bill:', err);
      setError(err instanceof Error ? err.message : 'Failed to request your bill');
    }
  };
  
  // Request server assistance
  const callServer = async () => {
    try {
      if (!restaurantId || !tableId) return;
      
      // Create assistance request in Firestore
      await addDoc(collection(db, 'assistanceRequests'), {
        restaurantId,
        tableId,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      setAssistanceRequested(true);
      
      // Reset after 2 minutes
      setTimeout(() => {
        setAssistanceRequested(false);
      }, 120000);
      
    } catch (err) {
      console.error('Error calling server:', err);
      setError(err instanceof Error ? err.message : 'Failed to call server');
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-16 h-16 border-4 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-lg">Loading menu...</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant header */}
      <header
        className="px-4 py-6 bg-gradient-to-r shadow-md"
        style={{
          backgroundColor: restaurant?.primaryColor || '#4f46e5',
          color: '#ffffff'
        }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            {restaurant?.logo && (
              <img
                src={restaurant.logo}
                alt={restaurant?.name}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
            )}
            <div>
              <h1 className="text-xl font-bold">{restaurant?.name}</h1>
              <p className="text-sm opacity-90">Table: {table?.label}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={callServer}
              disabled={assistanceRequested}
              className={`rounded-full p-2 text-sm flex items-center ${
                assistanceRequested ? 'bg-green-500 text-white' : 'bg-white text-gray-800'
              }`}
            >
              {assistanceRequested ? 'Server coming' : 'Call server'}
            </button>
            
            <button
              onClick={requestBill}
              disabled={billRequested}
              className={`rounded-full p-2 text-sm flex items-center ${
                billRequested ? 'bg-green-500 text-white' : 'bg-white text-gray-800'
              }`}
            >
              {billRequested ? 'Bill requested' : 'Request bill'}
            </button>
          </div>
        </div>
      </header>
      
      {/* Order success message */}
      {orderSuccess && (
        <div className="fixed top-4 left-0 right-0 mx-auto w-max bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          <span className="block sm:inline">Your order has been placed successfully!</span>
        </div>
      )}
      
      {/* Categories tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 overflow-x-auto">
          <div className="flex space-x-1 py-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  selectedCategory === category 
                    ? `bg-${restaurant?.primaryColor || 'indigo-600'} text-white` 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Menu items grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenuItems.map(item => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              {item.image && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium">{item.name}</h3>
                  <p className="text-lg font-semibold">${item.price.toFixed(2)}</p>
                </div>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
                
                {/* Dietary indicators */}
                {item.dietary && (
                  <div className="flex mt-2 space-x-1">
                    {item.dietary.vegetarian && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Veg</span>
                    )}
                    {item.dietary.vegan && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Vegan</span>
                    )}
                    {item.dietary.glutenFree && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">GF</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {/* Item customization modal */}
      {modalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{selectedItem.name}</h2>
                <button onClick={() => setModalOpen(false)} className="text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <p className="text-gray-600 mb-4">{selectedItem.description}</p>
              
              {/* Options */}
              {selectedItem.options && selectedItem.options.map(optionGroup => (
                <div key={optionGroup.name} className="mb-4">
                  <h3 className="font-medium mb-2">{optionGroup.name}</h3>
                  <div className="space-y-2">
                    {optionGroup.choices.map(choice => (
                      <div key={choice.name} className="flex items-center">
                        <input
                          type="radio"
                          id={`${optionGroup.name}-${choice.name}`}
                          name={optionGroup.name}
                          value={choice.name}
                          checked={selectedOptions[optionGroup.name] === choice.name}
                          onChange={() => setSelectedOptions({
                            ...selectedOptions,
                            [optionGroup.name]: choice.name
                          })}
                          className="mr-2"
                        />
                        <label htmlFor={`${optionGroup.name}-${choice.name}`} className="flex-1">
                          {choice.name}
                          {choice.price > 0 && ` (+$${choice.price.toFixed(2)})`}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Special instructions */}
              <div className="mb-4">
                <label htmlFor="instructions" className="block font-medium mb-2">
                  Special Instructions
                </label>
                <textarea
                  id="instructions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Any special requests?"
                  rows={2}
                ></textarea>
              </div>
              
              {/* Quantity */}
              <div className="mb-6">
                <label className="block font-medium mb-2">Quantity</label>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-3 py-1 border rounded-l-md bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-t border-b">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="px-3 py-1 border rounded-r-md bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Add to cart button */}
              <button
                onClick={addToCart}
                className="w-full py-3 rounded-md text-white font-medium"
                style={{ backgroundColor: restaurant?.primaryColor || '#4f46e5' }}
              >
                Add to Order - ${(selectedItem.price * quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Cart button */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setCartOpen(true)}
          className="rounded-full h-14 w-14 flex items-center justify-center text-white relative shadow-lg"
          style={{ backgroundColor: restaurant?.primaryColor || '#4f46e5' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>
      
      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Order</h2>
              <button onClick={() => setCartOpen(false)} className="text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 my-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between border-b pb-4">
                      <div>
                        <div className="flex items-baseline">
                          <span className="font-medium">{item.quantity}x</span>
                          <span className="ml-2">{item.name}</span>
                        </div>
                        
                        {/* Selected options */}
                        {Object.entries(item.options).map(([option, choice]) => (
                          <div key={option} className="text-sm text-gray-600 ml-6">
                            {option}: {choice}
                          </div>
                        ))}
                        
                        {/* Special instructions */}
                        {item.specialInstructions && (
                          <div className="text-sm text-gray-600 ml-6 italic">
                            "{item.specialInstructions}"
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-start">
                        <span className="mr-3">${(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold">${cartTotal.toFixed(2)}</span>
              </div>
              
              <button
                onClick={placeOrder}
                disabled={cart.length === 0}
                className={`w-full py-3 rounded-md text-white font-medium ${
                  cart.length === 0 ? 'bg-gray-300 cursor-not-allowed' : ''
                }`}
                style={{ backgroundColor: cart.length === 0 ? undefined : (restaurant?.primaryColor || '#4f46e5') }}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}      {/* AI recommendations */}
      <div className="fixed bottom-4 left-4 z-40">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-sm">
          <AIChat 
            context={{ 
              tableId, 
              lastOrders
            }} 
          />
        </div>
      </div>
    </div>
  );
}
