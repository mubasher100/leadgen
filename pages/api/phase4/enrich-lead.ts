import type { NextApiRequest, NextApiResponse } from 'next'
import supabase from '../../../lib/supabaseClient'
import { enrichLead } from '../../../ingestors/enrichment'
import { verifyAdminToken } from '../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Basic auth check: expect Bearer token
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token) return res.status(401).json({ ok: false, error: 'unauthorized' })
  if (!verifyAdminToken(token)) return res.status(401).json({ ok: false, error: 'invalid token' })

  // Ensure role is admin for Phase 4 operations
  const payload = verifyAdminToken(token)
  if (!payload || payload.role !== 'admin') {
    return res.status(403).json({ ok: false, error: 'forbidden' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.body as { id?: string }
  if (!id) return res.status(400).json({ error: 'Missing id' })

  // Load lead to enrich
  const { data: lead } = await supabase.from('leads').select('*').eq('id', id).single()
  if (!lead) return res.status(404).json({ error: 'Lead not found' })

  const enriched = enrichLead(lead)
  const updates: any = {
    enrichment: enriched.enrichment,
  }
  if (enriched.data) updates.data = enriched.data

  const { data, error } = await supabase.from('leads').update(updates).eq('id', id).select('*').single()
  if (error) {
    return res.status(500).json({ error: 'Enrichment failed' })
  }
  res.status(200).json(data)
}
