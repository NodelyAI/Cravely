import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { vi, expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Set up global TextEncoder/TextDecoder
// Use type assertion to avoid TypeScript errors with incompatible interfaces
global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

// Mock DOM elements not available in JSDOM
if (typeof HTMLElement.prototype.scrollIntoView === 'undefined') {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn()
  });
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Element.scrollIntoView
Element.prototype.scrollIntoView = vi.fn();
