import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyPhase7Token } from '../../lib/auth7'
import { enrichLeadPhase7 } from '../../ingestors/phase7_enricher'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token || !verifyPhase7Token(token)) return res.status(401).json({ ok: false, error: 'unauthorized' })
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { id } = req.body as { id?: string }
  if (!id) return res.status(400).json({ error: 'Missing id' })

  // Demo: enrich using Phase 7 enricher
  const enriched = enrichLeadPhase7({ id, name: 'Phase7 Lead' })
  res.status(200).json(enriched)
}
