"use strict";
/**
 * @jest-environment node
 */
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
const admin = __importStar(require("firebase-admin"));
const firebase_functions_test_1 = __importDefault(require("firebase-functions-test"));
const fs = __importStar(require("fs"));
const QRCode = __importStar(require("qrcode"));
const generateTableQRCodes_1 = require("../src/generateTableQRCodes");
// Mock Firebase Admin
jest.mock('firebase-admin', () => {
    return {
        initializeApp: jest.fn(),
        firestore: jest.fn(() => ({
            collection: jest.fn(() => ({
                doc: jest.fn(() => ({
                    id: 'test-table-id',
                    set: jest.fn(() => Promise.resolve()),
                    update: jest.fn(() => Promise.resolve())
                }))
            })),
            FieldValue: {
                // Use type assertion to fix the type compatibility issue
                serverTimestamp: jest.fn().mockReturnValue({ type: 'timestamp' })
            }
        })),
        storage: jest.fn(() => ({
            bucket: jest.fn(() => ({
                upload: jest.fn(() => Promise.resolve()),
                file: jest.fn(() => ({
                    getSignedUrl: jest.fn(() => Promise.resolve(['https://storage.googleapis.com/test-url.png']))
                }))
            }))
        }))
    };
});
// Mock QRCode
jest.mock('qrcode', () => ({
    toFile: jest.fn(() => Promise.resolve())
}));
// Mock fs
jest.mock('fs', () => ({
    unlinkSync: jest.fn()
}));
const testEnv = (0, firebase_functions_test_1.default)();
describe('generateTableQRCodes', () => {
    // Properly typed console.error backup
    const originalConsoleError = console.error;
    beforeAll(() => {
        // Mock console.error to prevent output during tests
        console.error = jest.fn();
    });
    afterAll(() => {
        // Restore original console.error
        console.error = originalConsoleError;
        testEnv.cleanup();
        jest.clearAllMocks();
    });
    it('should generate QR codes for tables', async () => {
        const wrappedFunction = testEnv.wrap(generateTableQRCodes_1.generateTableQRCodes);
        const result = await wrappedFunction({
            restaurantId: 'test-restaurant',
            tableLabels: ['Table 1', 'Table 2']
        });
        expect(result.success).toBe(true);
        expect(admin.firestore).toHaveBeenCalled();
        expect(admin.storage).toHaveBeenCalled();
        expect(QRCode.toFile).toHaveBeenCalled();
        expect(fs.unlinkSync).toHaveBeenCalled();
    });
    it('should throw an error for invalid input', async () => {
        const wrappedFunction = testEnv.wrap(generateTableQRCodes_1.generateTableQRCodes);
        // Missing tableLabels
        await expect(wrappedFunction({
            restaurantId: 'test-restaurant'
        })).rejects.toThrow();
        // Non-array tableLabels
        await expect(wrappedFunction({
            restaurantId: 'test-restaurant',
            tableLabels: 'not-an-array'
        })).rejects.toThrow();
        // Missing restaurantId
        await expect(wrappedFunction({
            tableLabels: ['Table 1']
        })).rejects.toThrow();
    });
});
//# sourceMappingURL=generateTableQRCodes.test.js.map