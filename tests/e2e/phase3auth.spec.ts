import { test, expect } from '@playwright/test'

test.describe('Phase 3 Admin Auth', () => {
  test('admin can login with phase3 auth', async ({ page }) => {
    const base = process.env.STAGING_BASE_URL || 'http://localhost:3000'
    await page.goto(`${base}/admin/login`)
    const password = process.env.ADMIN_PASSWORD || 'admin123'
    await page.fill('input[type="password"]', password)
    await page.click('button[type="submit"]')
    await page.waitForURL(/admin/)
    await expect(page).toHaveURL(/admin/)
  })
})
