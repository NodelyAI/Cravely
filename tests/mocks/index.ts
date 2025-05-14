// Common test mocks for the app
import { vi } from 'vitest';

// Create mock functions that can be used with jest-style mocking
export const createMockFn = () => {
  const mockFn = vi.fn();
  mockFn.mockImplementation = vi.fn().mockImplementation((implementation) => {
    mockFn.mockImplementationOnce(implementation);
    return mockFn;
  });
  mockFn.mockResolvedValue = vi.fn().mockImplementation((val) => {
    mockFn.mockImplementation(() => Promise.resolve(val));
    return mockFn;
  });
  return mockFn;
};

// Common Firebase mock functions for use in tests
export const firebaseMocks = {
  collection: createMockFn(),
  doc: createMockFn(),
  getDoc: createMockFn(),
  getDocs: createMockFn(),
  query: createMockFn(),
  where: createMockFn(),
  addDoc: createMockFn(),
  serverTimestamp: vi.fn().mockReturnValue('mock-timestamp')
};

// Common AI hook mock
export const aiHookMock = {
  generateResponse: vi.fn().mockResolvedValue({ text: 'AI response' }),
  loading: false,
  error: null
};

// Firebase mock implementation
export const setupFirebaseMocks = () => {
  vi.mock('firebase/firestore', () => firebaseMocks);
  
  vi.mock('../src/services/firebase', () => ({
    db: {}
  }));
};

// AI hook mock implementation
export const setupAIHookMock = () => {
  vi.mock('../src/hooks/useAI', () => ({
    useAI: () => aiHookMock
  }));
};
