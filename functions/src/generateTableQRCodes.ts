import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

/**
 * Cloud function to generate QR codes for restaurant tables
 * 
 * @param {string} restaurantId - ID of the restaurant
 * @param {string[]} tableLabels - Array of table labels (e.g., "Table 1", "Bar 3")
 * @returns {object} Object containing the created tableIds and their respective QR URLs
 */
export const generateTableQRCodes = functions.https.onCall(async (data, context) => {
  try {
    // Validate input
    const { restaurantId, tableLabels } = data;
    
    if (!restaurantId || !tableLabels || !Array.isArray(tableLabels)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Function requires restaurantId (string) and tableLabels (string array)'
      );
    }

    // Reference to Firestore and Storage
    const db = admin.firestore();
    const storage = admin.storage();
    const bucket = storage.bucket();
    
    const results: Record<string, string> = {};
    
    // Process each table label
    for (const label of tableLabels) {
      // Create a new table document with a generated ID
      const tableRef = db.collection('tables').doc();
      const tableId = tableRef.id;
      
      // Initial table data with empty QR URL
      await tableRef.set({
        restaurantId,
        label,
        qrUrl: "",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Generate deep link URL
      const deepLinkUrl = `https://cravely.app/r/${restaurantId}/t/${tableId}`;
      
      // Generate QR code
      const tempFilePath = path.join(os.tmpdir(), `${tableId}.png`);
      await QRCode.toFile(tempFilePath, deepLinkUrl, {
        errorCorrectionLevel: 'H',
        margin: 4,
        width: 512,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      // Upload to Firebase Storage
      const storageFilePath = `qrcodes/${restaurantId}/${tableId}.png`;
      await bucket.upload(tempFilePath, {
        destination: storageFilePath,
        metadata: {
          contentType: 'image/png',
          cacheControl: 'public, max-age=31536000'
        }
      });
      
      // Get the public download URL
      const [file] = await bucket.file(storageFilePath).getSignedUrl({
        action: 'read',
        expires: '01-01-2100' // Far future expiration date
      });
      
      // Update the table document with the QR URL
      await tableRef.update({
        qrUrl: file
      });
      
      // Clean up temp file
      fs.unlinkSync(tempFilePath);
      
      // Add to results
      results[tableId] = file;
    }
    
    return {
      success: true,
      tables: results
    };
  } catch (error) {
    console.error('Error generating QR codes:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to generate QR codes',
      error
    );
  }
});
