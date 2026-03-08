import { defineConfig, devices } from '@playwright/test'

const stagingBaseURL = process.env.STAGING_BASE_URL || 'http://localhost:3000'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: stagingBaseURL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'Chromium', use: { browserName: 'chromium' } },
  ],
})
