module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    // Disable unused variable warnings during development
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
  },
  env: {
    browser: true,
    node: true,
  },
};
