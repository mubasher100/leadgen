import type { NextApiRequest, NextApiResponse } from 'next'
import { enrichLeadPhase3 } from '../../../ingestors/phase3_enricher'
import { signAdminToken, verifyAdminToken } from '../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple auth check for Phase 3 endpoint (admin flow)
  const token = (req.headers.authorization || '').replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ ok: false, error: 'unauthorized' })
  }
  const payload = verifyAdminToken(token)
  if (!payload) return res.status(401).json({ ok: false, error: 'invalid token' })

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { id } = req.body as { id?: string }
  if (!id) return res.status(400).json({ error: 'Missing id' })
  // For demo, pretend we enrich by updating a simple field
  // In production, you would fetch lead, enrich, and persist
  const enriched = enrichLeadPhase3({ id, enriched: true })
  res.status(200).json(enriched)
}
