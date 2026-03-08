import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyPhase6Token } from '../../lib/auth6'
import { enrichLeadPhase5 } from '../../ingestors/phase5_enricher'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token || !verifyPhase6Token(token)) return res.status(401).json({ ok: false, error: 'unauthorized' })
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { id } = req.body as { id?: string }
  if (!id) return res.status(400).json({ error: 'Missing id' })
  // Demo: enrich using Phase 5 enricher bridge
  const enriched = enrichLeadPhase5({ id, name: 'Phase6 Lead' })
  res.status(200).json(enriched)
}
