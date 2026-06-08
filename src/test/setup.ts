import { expect, afterEach } from 'vitest';

// Extend Vitest's expect (jest-dom matchers can be added later)
// expect.extend(matchers);

// Cleanup after each test case (when React Testing Library is installed)
afterEach(() => {
  // cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
