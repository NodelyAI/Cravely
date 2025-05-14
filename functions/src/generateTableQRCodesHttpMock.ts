import * as functions from 'firebase-functions';
import cors from 'cors';

// Create a CORS middleware instance with options
const corsMiddleware = cors({ origin: true });

/**
 * HTTP Cloud function to generate QR codes for restaurant tables
 * This is a mock version that returns fake data for testing the UI
 */
export const generateTableQRCodesHttpMock = functions.https.onRequest((request, response) => {
  // Apply CORS middleware
  corsMiddleware(request, response, async () => {
    try {
      // Only allow POST requests
      if (request.method !== 'POST') {
        response.status(405).send('Method Not Allowed');
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
      
      const results: Record<string, string> = {};
      
      // Generate mock QR codes
      for (const label of tableLabels) {
        // Create a fake table ID
        const tableId = Math.random().toString(36).substring(2, 15);
        
        // Mock QR code URL - using a placeholder image service
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://cravely.app/r/${restaurantId}/t/${tableId}`;
        
        // Add to results
        results[tableId] = qrUrl;
      }
      
      // Send success response
      response.status(200).send({
        success: true,
        tables: results
      });
    } catch (error) {
      console.error('Error generating QR codes:', error);
      response.status(500).send({
        error: 'Internal Server Error',
        message: 'Failed to generate QR codes'
      });
    }
  });
});
