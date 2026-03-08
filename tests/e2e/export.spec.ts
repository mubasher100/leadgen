import { test, expect } from '@playwright/test'

test.describe('Export', () => {
  test('export leads CSV after seed', async ({ page }) => {
    const staging = process.env.STAGING_BASE_URL || 'http://localhost:3000'
    // Seed a lead if seed endpoint exists
    try {
      await page.request.post(`${staging}/api/leads/seed`)
    } catch {
      // ignore if seed endpoint not available in this environment
    }
    const resp = await page.request.get(`${staging}/api/leads/export`)
    expect(resp.ok()).toBeTruthy()
  })
})
