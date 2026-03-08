import { test, expect } from '@playwright/test'

test.describe('Phase 7 full flows', () => {
  test('token endpoint returns a token', async ({ page, request }) => {
    const base = process.env.STAGING_BASE_URL || 'http://localhost:3000'
    const r = await request.get(`${base}/api/phase7/token`)
    expect(r.ok()).toBeTruthy()
    const json = await r.json()
    expect(json).toHaveProperty('token')
  })

  test('health endpoint works with valid token', async ({ page, request }) => {
    const base = process.env.STAGING_BASE_URL || 'http://localhost:3000'
    const tRes = await request.get(`${base}/api/phase7/token`)
    const token = (await tRes.json()).token
    const h = await request.get(`${base}/api/phase7/health`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(h.status()).toBe(200)
    const j = await h.json()
    expect(j.ok).toBe(true)
  })

  test('enrich-lead endpoint with token', async ({ page, request }) => {
    const base = process.env.STAGING_BASE_URL || 'http://localhost:3000'
    const tRes = await request.get(`${base}/api/phase7/token`)
    const token = (await tRes.json()).token
    const res = await request.post(`${base}/api/phase7/enrich-lead`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      data: JSON.stringify({ id: 'sample-id' }),
    })
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body).toHaveProperty('enrichment')
    expect(body.enrichment).toHaveProperty('phase7', true)
    expect(body.enrichment).toHaveProperty('domain')
  })

  test('navigate to Phase 7 hub', async ({ page }) => {
    const base = process.env.STAGING_BASE_URL || 'http://localhost:3000'
    await page.goto(`${base}/admin/phase7`)
    await expect(page).toHaveURL(/phase7/)
  })
})
