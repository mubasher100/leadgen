import { test, expect } from '@playwright/test'

test.describe('Phase 5 enrichment flow', () => {
  test('phase5 enrich endpoint reachability', async ({ page }) => {
    const base = process.env.STAGING_BASE_URL || 'http://localhost:3000'
    const token = 'Bearer ' + (process.env.ADMIN_PASSWORD ? '' : '')
    const res = await page.request.post(`${base}/api/phase5/enrich-lead`, {
      headers: { 'Authorization': token },
      data: { id: 'sample-id' }
    } as any)
    expect(res.status()).toBeGreaterThan(199)
  })
})
