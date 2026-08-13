import { defineConfig, devices } from '@playwright/test';

const previewPort = Number(process.env.PLAYWRIGHT_PORT ?? 4173);
const previewBaseURL = `http://127.0.0.1:${previewPort}/ben-portfolio/`;

export default defineConfig({
  testDir: './tests/e2e',
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}{ext}',
  use: {
    baseURL: previewBaseURL,
  },
  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${previewPort} --strictPort`,
    url: previewBaseURL,
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
