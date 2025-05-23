import { useState, useEffect, useRef } from 'react';
import { collection, query, where, orderBy, onSnapshot, limit, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';

type NotificationProps = {
  restaurantId: string | null;
};

export default function OrderNotifications({ restaurantId }: NotificationProps) {
  const [newOrders, setNewOrders] = useState<{id: string, tableLabel: string, timestamp: Timestamp}[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastOrderTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!restaurantId) return;
    
    // Listen for new orders
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('restaurantId', '==', restaurantId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          
          // Check if this is truly a new order (not just initial load)
          const orderTime = data.createdAt?.toDate().getTime();
          if (orderTime && orderTime > lastOrderTimeRef.current) {
            // Play sound
            if (audioRef.current) {
              audioRef.current.play().catch(e => console.log('Error playing sound:', e));
            }
            
            // Add to notifications
            setNewOrders(prev => [
              { 
                id: change.doc.id, 
                tableLabel: data.tableLabel || `Table ${data.tableId.substring(0, 4)}`,
                timestamp: data.createdAt
              },
              ...prev.slice(0, 4) // Keep only the 5 most recent
            ]);
          }
        }
      });
      
      // Update the last order time to now
      lastOrderTimeRef.current = Date.now();
    });
    
    return () => unsubscribe();
  }, [restaurantId]);
  
  const removeNotification = (orderId: string) => {
    setNewOrders(prev => prev.filter(order => order.id !== orderId));
  };
  
  const formatTime = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <>      {/* Sound effect for new orders */}
      <audio ref={audioRef} preload="auto">
        <source src="/assets/sounds/notification.mp3" type="audio/mpeg" />
      </audio>
      
      {/* Notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
        {newOrders.map((order) => (
          <div 
            key={order.id}
            className="bg-orange-500 text-white p-4 rounded-lg shadow-lg max-w-xs animate-bounce-once"
            onClick={() => removeNotification(order.id)}
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div>
                <h3 className="font-bold">New Order!</h3>
                <p className="text-sm">{order.tableLabel} • {formatTime(order.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
