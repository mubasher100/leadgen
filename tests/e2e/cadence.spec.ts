import { test, expect } from '@playwright/test'

test.describe('Cadence ingestion', () => {
  test('post discovery payload via API', async ({ page }) => {
    const staging = process.env.STAGING_BASE_URL || 'http://localhost:3000'
    // If not logged in, login automatically by calling the API directly
    // This test assumes admin is not required for discovery; we just hit the endpoint
    const payload = {
      name: 'Sample Cadence Co',
      data_source: 'Google Places',
      source_id: 'gp-cadence-001',
      address: '1 Cadence Way',
    }
    const res = await page.request.post(`${staging}/api/leads/discover`, {
      data: payload
    } as any)
    // Accept 200/201 and proceed
    expect([200,201]).toContain(res.status())
  })
})
