"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTableQRCodes = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const QRCode = __importStar(require("qrcode"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
/**
 * Cloud function to generate QR codes for restaurant tables
 *
 * @param {string} restaurantId - ID of the restaurant
 * @param {string[]} tableLabels - Array of table labels (e.g., "Table 1", "Bar 3")
 * @returns {object} Object containing the created tableIds and their respective QR URLs
 */
exports.generateTableQRCodes = functions.https.onCall(async (data, context) => {
    try {
        // Validate input
        const { restaurantId, tableLabels } = data;
        if (!restaurantId || !tableLabels || !Array.isArray(tableLabels)) {
            throw new functions.https.HttpsError('invalid-argument', 'Function requires restaurantId (string) and tableLabels (string array)');
        }
        // Reference to Firestore and Storage
        const db = admin.firestore();
        const storage = admin.storage();
        const bucket = storage.bucket();
        const results = {};
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
    }
    catch (error) {
        console.error('Error generating QR codes:', error);
        throw new functions.https.HttpsError('internal', 'Failed to generate QR codes', error);
    }
});
//# sourceMappingURL=generateTableQRCodes.js.map