// This script simulates a customer placing an order through the table QR code

import { initializeApp } from 'firebase/app';
import { 
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore';

/**
 * Firebase configuration
 * (replace with your own firebase config)
 */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Simulates a customer placing an order from a table QR code
 */
async function simulateQRCodeOrder() {
  try {
    // Set up sample data (replace with actual IDs from your database)
    const restaurantId = 'REPLACE_WITH_RESTAURANT_ID';
    const tableId = 'REPLACE_WITH_TABLE_ID';
    
    // Create a sample order
    const order = {
      restaurantId,
      tableId,
      items: [
        {
          menuItemId: 'sample-menu-item-1',
          name: 'Burger',
          price: 12.99,
          quantity: 1,
          options: { 'Cheese': 'Cheddar' },
          specialInstructions: 'Medium well, please'
        },
        {
          menuItemId: 'sample-menu-item-2',
          name: 'Fries',
          price: 4.99,
          quantity: 1,
          options: {},
        }
      ],
      status: 'pending',
      total: 17.98,
      createdAt: serverTimestamp()
    };
    
    // Add order to Firestore
    const orderRef = await addDoc(collection(db, 'orders'), order);
    console.log(`Order placed with ID: ${orderRef.id}`);
    
    // Wait 30 seconds, then update status to 'preparing'
    console.log('Waiting 30 seconds before updating status to "preparing"...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    await updateDoc(doc(db, 'orders', orderRef.id), {
      status: 'preparing',
      updatedAt: serverTimestamp()
    });
    console.log('Order status updated to "preparing"');
    
    // Wait 30 more seconds, then update status to 'ready'
    console.log('Waiting 30 seconds before updating status to "ready"...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    await updateDoc(doc(db, 'orders', orderRef.id), {
      status: 'ready',
      updatedAt: serverTimestamp()
    });
    console.log('Order status updated to "ready"');
    
    // Get the order from Firestore to verify the updates
    const updatedOrder = await getDoc(doc(db, 'orders', orderRef.id));
    console.log('Final order state:', updatedOrder.data());
    
    process.exit(0);
  } catch (error) {
    console.error('Error simulating order:', error);
    process.exit(1);
  }
}

// Run the simulation
simulateQRCodeOrder();
