// Google Places ingestion (Phase 1)
// This module fetches businesses from Google Places API and returns a normalized
// list of results suitable for ingestion via /api/leads/discover.
export async function fetchGooglePlaces(query: string, region: string, radiusMeters?: number): Promise<any[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    console.warn('GOOGLE_PLACES_API_KEY not configured')
    return []
  }
  const r = radiusMeters ?? 50000
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    query
  )}&region=${encodeURIComponent(region)}&radius=${r}&key=${apiKey}`
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.error('Google Places fetch error', res.status)
      return []
    }
    const json = await res.json()
    return json.results ?? []
  } catch (e) {
    console.error('Google Places fetch exception', e)
    return []
  }
}
