// Yelp Fusion ingestion (Phase 1)
export async function fetchYelpBusinesses(term: string, location: string, limit = 20): Promise<any[]> {
  const apiKey = process.env.YELP_API_KEY
  if (!apiKey) {
    console.warn('YELP_API_KEY not configured')
    return []
  }
  const url = `https://api.yelp.com/v3/businesses/search?term=${encodeURIComponent(
    term
  )}&location=${encodeURIComponent(location)}&limit=${limit}`
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!res.ok) {
      console.error('Yelp fetch error', res.status)
      return []
    }
    const json = await res.json()
    return json.businesses ?? []
  } catch (e) {
    console.error('Yelp fetch exception', e)
    return []
  }
}
