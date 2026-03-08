import { test, expect } from '@playwright/test'

test.describe('Phase 5 health', () => {
  test('admin health check', async ({ page }) => {
    const base = process.env.STAGING_BASE_URL || 'http://localhost:3000'
    await page.goto(`${base}/admin/login`)
    const password = process.env.ADMIN_PASSWORD || 'admin123'
    await page.fill('input[type="password"]', password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/admin/)
    const res = await page.request.get(`${base}/api/phase5/health`)
    expect(res.status()).toBeGreaterThan(199)
  })
})
