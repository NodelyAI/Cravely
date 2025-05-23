import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

export function usePendingOrdersCount(restaurantId: string | null) {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) {
      setPendingCount(0);
      setLoading(false);
      return () => {};
    }

    // Set up real-time listener for pending orders
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('restaurantId', '==', restaurantId),
      where('status', '==', 'pending')
    );

    // Initial fetch
    const fetchInitialCount = async () => {
      try {
        const snapshot = await getDocs(q);
        setPendingCount(snapshot.size);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching initial pending orders count:', err);
        setError('Failed to load orders count');
        setLoading(false);
      }
    };

    fetchInitialCount();

    // Set up listener for real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingCount(snapshot.size);
      setLoading(false);
    }, (err) => {
      console.error('Error in pending orders listener:', err);
      setError('Error in orders listener');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [restaurantId]);

  return { pendingCount, loading, error };
}
