import { defineConfig, devices } from '@playwright/test'

// Polyfill for TransformStream in Node.js environment
if (typeof global.TransformStream === 'undefined') {
  // Use native Node.js web streams (available in Node 18+)
  try {
    const { TransformStream, ReadableStream, WritableStream } = require('node:stream/web');
    global.TransformStream = TransformStream;
    global.ReadableStream = ReadableStream;
    global.WritableStream = WritableStream;
  } catch (e) {
    // Fallback: minimal mock for test runner
    // @ts-ignore
    global.TransformStream = class TransformStream {
      constructor() {}
    };
  }
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
