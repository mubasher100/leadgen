import type { NextApiRequest, NextApiResponse } from 'next'
import supabase from '../../../lib/supabaseClient'
import { enrichLead } from '../../../ingestors/enrichment'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { id } = req.body
  if (!id) return res.status(400).json({ error: 'Missing id' })
  const { data: leadArr, error } = await supabase.from('leads').select('*').eq('id', id).single()
  if (error || !leadArr) {
    return res.status(500).json({ error: 'Lead not found' })
  }
  const lead = leadArr
  const enriched = enrichLead(lead)
  // store enrichment in the existing lead row's data field
  const { data, err } = await supabase.from('leads').update({ data: enriched.data ?? lead.data, enrichment: enriched.enrichment }).eq('id', id).select('*').single()
  if (err) {
    return res.status(500).json({ error: 'Enrichment failed' })
  }
  res.status(200).json(data)
}
