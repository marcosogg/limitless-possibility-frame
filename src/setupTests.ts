// src/setupTests.ts
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Add all matchers to expect
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
});
