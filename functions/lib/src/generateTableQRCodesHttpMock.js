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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTableQRCodesHttpMock = void 0;
const functions = __importStar(require("firebase-functions"));
const cors_1 = __importDefault(require("cors"));
// Create a CORS middleware instance with options
const corsMiddleware = (0, cors_1.default)({ origin: true });
/**
 * HTTP Cloud function to generate QR codes for restaurant tables
 * This is a mock version that returns fake data for testing the UI
 */
exports.generateTableQRCodesHttpMock = functions.https.onRequest((request, response) => {
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
            const results = {};
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
                tables: results,
                message: `Successfully generated ${tableLabels.length} QR codes!`
            });
        }
        catch (error) {
            console.error('Error generating QR codes:', error);
            response.status(500).send({
                error: 'Internal Server Error',
                message: 'Failed to generate QR codes'
            });
        }
    });
});
//# sourceMappingURL=generateTableQRCodesHttpMock.js.map