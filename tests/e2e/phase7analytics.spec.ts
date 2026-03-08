import { test, expect } from '@playwright/test'

test.describe('Phase 7 analytics endpoint', () => {
  test('fetch analytics with valid token', async ({ request }) => {
    const base = process.env.STAGING_BASE_URL || 'http://localhost:3000'
    const t = await request.get(`${base}/api/phase7/token`)
    const token = (await t.json()).token
    const r = await request.get(`${base}/api/phase7/analytics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(r.status()).toBe(200)
    const data = await r.json()
    expect(data).toHaveProperty('total')
    expect(data).toHaveProperty('byStatus')
  })
})
