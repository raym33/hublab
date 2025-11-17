/**
 * Playwright E2E Test Setup
 * Adds necessary polyfills for Node.js environment
 */

// Polyfill for TransformStream if not available
if (typeof global.TransformStream === 'undefined') {
  // @ts-ignore
  global.TransformStream = class TransformStream {
    constructor() {
      // Minimal implementation for test environment
    }
  };
}

// Polyfill for ReadableStream if needed
if (typeof global.ReadableStream === 'undefined') {
  // @ts-ignore
  global.ReadableStream = class ReadableStream {
    constructor() {}
  };
}

// Polyfill for WritableStream if needed
if (typeof global.WritableStream === 'undefined') {
  // @ts-ignore
  global.WritableStream = class WritableStream {
    constructor() {}
  };
}

export {};
