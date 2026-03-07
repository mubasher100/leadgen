import type { NextApiRequest, NextApiResponse } from 'next'
import supabase from '../../lib/supabaseClient'

type DiscoveryPayload = {
  name?: string
  domain?: string
  address?: string
  city?: string
  state?: string
  country?: string
  phone?: string
  website?: string
  data_source: string
  source_id: string
  source_timestamp?: string
  data?: any
  enrichment?: any
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const payload = req.body as DiscoveryPayload
  if (!payload || !payload.source_id || !payload.data_source) {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  // Deduplication: if this discovery source and id already exists, return without creating
  if (payload?.source_id) {
    const { data: existing, error: derr } = await supabase.from('leads').select('id').eq('data_source', payload.data_source).eq('source_id', payload.source_id).limit(1).single()
    if (existing?.id && !derr) {
      res.status(200).json({ id: existing.id, status: 'exists' })
      return
    }
  }

  const leadPayload: any = {
    // map discovery fields into core lead fields where possible
    first_name: payload.name?.split(' ')[0] ?? null,
    last_name: payload.name?.split(' ').slice(1).join(' ') ?? null,
    email: null,
    company: payload.name ?? payload.domain ?? null,
    city: payload.city ?? null,
    state: payload.state ?? null,
    country: payload.country ?? null,
    address: payload.address ?? null,
    data_source: payload.data_source,
    source_id: payload.source_id,
    source_timestamp: payload.source_timestamp ? new Date(payload.source_timestamp).toISOString() : null,
    data: payload.data ?? null,
    notes: payload?.notes ?? null,
  }

  const { data, error } = await supabase.from('leads').insert([leadPayload]).select('id, status, created_at').single()
  if (error) {
    console.error('Discovery insert error', error)
    res.status(500).json({ error: 'Failed to ingest discovery lead' })
    return
  }
  res.status(201).json({ id: data?.id, status: data?.status, created_at: data?.created_at })
}
