import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import cors from 'cors';

// Create a CORS middleware instance with options
const corsMiddleware = cors({ origin: true });

// Initialize Firebase Admin if not already initialized
if (admin.apps.length === 0) {
  try {
    admin.initializeApp({
      // Explicitly specify the storage bucket
      storageBucket: 'cravely-f2914.appspot.com'
    });
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error: any) {
    console.error('Error initializing Firebase Admin SDK:', error.message || 'Unknown error');
  }
}

/**
 * Enhanced HTTP Cloud function to generate QR codes for restaurant tables
 * This version explicitly handles Firestore operations
 */
export const realQRGenerator = functions.https.onRequest((request, response) => {
  // Apply CORS middleware
  corsMiddleware(request, response, async () => {
    try {
      // Only allow POST requests
      if (request.method !== 'POST') {
        response.status(405).send({
          error: 'Method Not Allowed',
          message: 'Only POST method is allowed'
        });
        return;
      }

      // Extract data from request body
      const { restaurantId, tableLabels } = request.body;
      
      // Validate input
      if (!restaurantId || !tableLabels || !Array.isArray(tableLabels)) {
        response.status(400).send({
          error: 'Bad Request',
          message: 'Function requires restaurantId (string) and tableLabels (string array)'
        });
        return;
      }
      
      // Get Firestore reference
      const db = admin.firestore();
      
      // Results to return
      const results: Record<string, string> = {};
      
      // Use a batch for better consistency
      const batch = db.batch();
      
      // Process each table label
      for (const label of tableLabels) {
        try {
          // Create a new table document with a generated ID
          const tableRef = db.collection('tables').doc();
          const tableId = tableRef.id;  // Generate QR code URL - using a placeholder image service
          // Include 'menu' in the path so QR codes redirect to menu page for ordering
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://cravely.app/r/${restaurantId}/t/${tableId}/menu`;
          // Add or update the Firestore document for this table
          batch.set(tableRef, {
            restaurantId,
            label,
            qrUrl,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'available',
            capacity: 4,
            area: 'Main'
          });
          
          // Add to results
          results[tableId] = qrUrl;
        } catch (tableError) {
          console.error(`Error processing table ${label}:`, tableError);
          // Continue processing other tables even if one fails
        }
      }
      
      // Commit the batch to Firestore
      await batch.commit();
      
      // Wait a second to ensure Firestore consistency
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Send success response with tables created
      response.status(200).send({
        success: true,
        tables: results,
        message: `Successfully created ${Object.keys(results).length} tables with QR codes`
      });
    } catch (error: any) {
      console.error('Error generating QR codes:', error);
      
      response.status(500).send({
        error: 'Internal Server Error',
        message: `Failed to generate QR codes: ${error.message || 'Unknown error'}`
      });
    }
  });
});
