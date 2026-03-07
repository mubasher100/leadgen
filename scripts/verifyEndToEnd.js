#!/usr/bin/env node
/* Simple end-to-end sanity check for Phase 1 DM app
   - Seeds a sample lead via /api/leads (requires ADMIN_PASSWORD-protected admin or non-admin path depending on API)
   - Creates a new lead via /api/leads
   - Exports CSV via /api/leads/export
*/
const BASE = process.env.BASE_URL || 'http://localhost:3000'

async function seedLead() {
  try {
    const payload = {
      firstName: 'Test',
      lastName: 'Lead',
      email: 'testlead@example.com',
      businessType: 'Digital Marketing',
    }
    const res = await fetch(`${BASE}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    console.log('Lead create response:', data)
  } catch (e) {
    console.error('Seed lead failed:', e)
  }
}

async function exportLeads() {
  try {
    const res = await fetch(`${BASE}/api/leads/export`, { method: 'GET' })
    const txt = await res.text()
    console.log('Leads export size:', txt.length)
  } catch (e) {
    console.error('Export failed:', e)
  }
}

async function run() {
  console.log('Running end-to-end verify against', BASE)
  await seedLead()
  await exportLeads()
}

run().catch((e) => console.error(e))
