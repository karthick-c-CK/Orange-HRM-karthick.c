import { defineConfig, devices } from '@playwright/test';
import { envConfig } from './src/utils/env.config';

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results',
  timeout: 180_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
  ],
  use: {
    baseURL: envConfig.baseUrl,
    headless: true,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: {
      mode: 'on',
      size: { width: 1440, height: 900 },
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});