/**
 * @jest-environment node
 */

import * as admin from 'firebase-admin';
import functionsTest from 'firebase-functions-test';
import * as fs from 'fs';
import * as QRCode from 'qrcode';
import { generateTableQRCodes } from '../src/generateTableQRCodes';

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
        serverTimestamp: jest.fn().mockReturnValue({ type: 'timestamp' } as unknown as admin.firestore.FieldValue)
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

const testEnv = functionsTest();

describe('generateTableQRCodes', () => {
  // Properly typed console.error backup
  const originalConsoleError: typeof console.error = console.error;
  
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
    const wrappedFunction = testEnv.wrap(generateTableQRCodes);
    
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
    const wrappedFunction = testEnv.wrap(generateTableQRCodes);
    
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
