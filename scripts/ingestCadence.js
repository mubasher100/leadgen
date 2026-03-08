// Lightweight, production-friendly cadence runner (JS)
// This will perform a small discovery cycle and post to /api/leads/discover
const fetch = require('node-fetch')
const { enrichLead } = require('../ingestors/enrichment.js')

async function run() {
  const base = process.env.BASE_URL || 'http://localhost:3000'
  // Example: post a small sample discovery lead
  const payload = {
    name: 'Sample Co',
    data_source: 'Google Places',
    source_id: 'gp-sample-js',
    address: '123 Demo Ave',
  }
  const enriched = enrichLead(payload)
  await fetch(`${base}/api/leads/discover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enriched),
  }).catch(console.error)
  console.log('Ingest cadence run complete (JS)')
}

run().catch(console.error)
