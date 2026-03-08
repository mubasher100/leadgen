import type { NextApiRequest, NextApiResponse } from 'next'
import { enrichLeadPhase5 } from '../../ingestors/phase5_enricher'
import { verifyAdminToken } from '../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Admin auth via Bearer token
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' })
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { id } = req.body as { id?: string }
  if (!id) return res.status(400).json({ error: 'Missing id' })
  // Fetch lead
  // In production, fetch via your DB client; here we simulate via enrichment function
  const lead = { id, name: 'Sample Lead' }
  const enriched = enrichLeadPhase5(lead)
  res.status(200).json(enriched)
}
