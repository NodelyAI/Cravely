module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: './tsconfig.json' }],
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
