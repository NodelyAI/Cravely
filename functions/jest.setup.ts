// Add Jest specific ESM module import capability
import type { Config } from '@jest/types';
import type { InitialOptionsTsJest } from 'ts-jest';

// Ensure proper Jest type support
declare global {
  namespace NodeJS {
    interface Global {
      expect: typeof import('@jest/expect');
    }
  }
}

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.json' }],
  },
} as Config.InitialOptions & InitialOptionsTsJest;
