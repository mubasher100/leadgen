import { test, expect } from '@playwright/test'

test.describe('Phase 2 full flows (end-to-end)', () => {
  test('navigate to Phase 2 analytics and trigger enrich (mock)', async ({ page }) => {
    const base = process.env.STAGING_BASE_URL || 'http://localhost:3000'
    await page.goto(`${base}/admin/analytics`)
    await expect(page).toHaveURL(/analytics|phase2/)
    // Trigger enrich demo if endpoint exists
    const res = await page.request.post(`${base}/api/phase2/enrich-lead`, { data: { id: 'sample-id' } as any })
    expect(res.ok()).toBeTruthy()
  })
})
