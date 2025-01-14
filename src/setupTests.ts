import '@testing-library/jest-dom';
import { expect, jest, test } from '@jest/globals';

// Make jest available globally
global.jest = jest;
global.expect = expect;
global.test = test;

// Mock the matchMedia function for tests
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