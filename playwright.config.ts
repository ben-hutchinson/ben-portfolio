import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:4173/ben-portfolio/',
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1',
    url: 'http://127.0.0.1:4173/ben-portfolio/',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'Chromium', use: { browserName: 'chromium' } },
    { name: 'Firefox', use: { browserName: 'firefox' } },
    { name: 'WebKit', use: { browserName: 'webkit' } },
    { name: 'mobile-Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-Safari', use: { ...devices['iPhone 13'] } },
  ],
});
