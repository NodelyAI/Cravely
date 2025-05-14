import '@testing-library/jest-dom';
import '@jest/globals';
import { TextEncoder as NodeTextEncoder, TextDecoder as NodeTextDecoder } from 'util';

// Set up global TextEncoder/TextDecoder as they're not available in Jest automatically
global.TextEncoder = NodeTextEncoder as typeof TextEncoder;
global.TextDecoder = NodeTextDecoder as typeof TextDecoder;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
