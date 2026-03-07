// Google/Yelp discovery cadence for Phase 1
// This script is designed to be scheduled (cron, CI) to fetch data from licensed sources
// and post discovered entries to /api/leads/discover.

import fetch from 'node-fetch'
import { fetchGooglePlaces } from '../ingestors/google_places_ingestor'
import { fetchYelpBusinesses } from '../ingestors/Yelp_ingestor'

async function run() {
  const base = process.env.API_BASE_URL || 'http://localhost:3000'

  // Run Google and Yelp in parallel to reduce cadence duration
  const gPromise = fetchGooglePlaces('digital marketing agency', 'US')
  const yPromise = fetchYelpBusinesses('digital marketing', 'New York, NY')
  try {
    const [gResults, YelpResults] = await Promise.all([gPromise, yPromise])
    for (const r of (gResults || []).slice(0, 5)) {
      const payload: any = {
        name: r.name,
        address: r.address,
        city: r.city ?? '',
        data_source: 'Google Places',
        source_id: r.place_id,
        source_timestamp: r.source_timestamp ?? new Date().toISOString(),
        data: r,
      }
      await fetch(`${base}/api/leads/discover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }
    for (const r of (YelpResults || []).slice(0, 5)) {
      const payload: any = {
        name: r.name,
        address: r.location?.address1,
        city: r.location?.city,
        data_source: 'Yelp',
        source_id: r.id,
        source_timestamp: r.time ?? new Date().toISOString(),
        data: r,
      }
      await fetch(`${base}/api/leads/discover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }
  } catch (e) {
    console.error('Cadence error', e)
  }
}

run().catch(console.error)
