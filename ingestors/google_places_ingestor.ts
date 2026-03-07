// Google Places ingestion (Phase 1)
// This module fetches businesses from Google Places API and returns a normalized
// list of results suitable for ingestion via /api/leads/discover.
export async function fetchGooglePlaces(query: string, region: string, radiusMeters?: number): Promise<any[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    console.warn('GOOGLE_PLACES_API_KEY not configured')
    return []
  }
  const radius = radiusMeters ?? 50000
  // Use Text Search endpoint for simpler results; could switch to Nearby Search for more control
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    query
  )}&region=${encodeURIComponent(region)}&radius=${radius}&key=${apiKey}`
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.error('Google Places fetch error', res.status)
      return []
    }
    const json = await res.json()
    // Normalize minimal payload to a consistent shape
    return (json.results || []).map((r: any) => ({
      name: r.name,
      address: r.formatted_address,
      city: r.aquire_city ?? r.formatted_address?.split(',')[1]?.trim(),
      country: r.opening_hours?.open_now ? 'US' : 'US',
      place_id: r.place_id,
      rating: r.rating,
      types: r.types,
      raw: r,
    }))
  } catch (e) {
    console.error('Google Places fetch exception', e)
    return []
  }
}
