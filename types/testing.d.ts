// Import types from @testing-library/jest-dom
/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom';

// Vitest specific types
interface CustomMatchers<R = unknown> {
  toBeInTheDocument(): R;
  toHaveAttribute(attr: string, value?: string): R;
  toHaveClass(...classNames: string[]): R;
  toHaveTextContent(text: string | RegExp): R;
  toBeVisible(): R;
  toBeDisabled(): R;
  toBeEnabled(): R;
  toBeRequired(): R;
  toBeValid(): R;
  toBeInvalid(): R;
  toBeChecked(): R;
  toBeEmptyDOMElement(): R;
  toHaveFocus(): R;
  toHaveStyle(css: string | Record<string, unknown>): R;
  toHaveValue(value?: string | string[] | number): R;
}

declare global {
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
}
