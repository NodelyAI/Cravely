// Type definitions for Firebase Functions tests
/// <reference types="jest" />

// This file should only contain additional type declarations
// that extend or supplement the built-in Jest types

declare global {
  namespace jest {
    interface Matchers<R, T = {}> {
      // Add custom matchers if needed, but don't redefine existing ones
    }
  }
  
  // Do not redeclare Jest globals as they are already defined in @types/jest
}

export {};
