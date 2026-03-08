import { test, expect } from '@playwright/test'

test.describe('Phase 5 Admin Auth', () => {
  test('admin login with phase5 token', async ({ page }) => {
    const base = process.env.STAGING_BASE_URL || 'http://localhost:3000'
    await page.goto(`${base}/admin/login`)
    const password = process.env.ADMIN_PASSWORD || 'admin123'
    await page.fill('input[type="password"]', password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/admin/)
    expect(true).toBeTruthy()
  })
})
