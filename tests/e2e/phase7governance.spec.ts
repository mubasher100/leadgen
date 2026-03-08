import { test, expect } from '@playwright/test'

test.describe('Phase 7 governance endpoint', () => {
  test('fetch governance with valid token', async ({ request }) => {
    const base = process.env.STAGING_BASE_URL || 'http://localhost:3000'
    const t = await request.get(`${base}/api/phase7/token`)
    const token = (await t.json()).token
    const r = await request.get(`${base}/api/phase7/governance`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    // since governance.ts is a GET endpoint, 200 is expected
    expect(r.status()).toBe(200)
    const json = await r.json()
    expect(json).toHaveProperty('governance')
  })
})
