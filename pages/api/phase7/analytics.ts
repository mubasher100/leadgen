import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyPhase7Token } from '../../lib/auth7'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token || !verifyPhase7Token(token)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' })
  }

  // Placeholder analytics payload for Phase 7
  const payload = {
    total: 1024,
    byStatus: {
      new: 120,
      contacted: 480,
      qualified: 424,
    },
    bySource: {
      website: 700,
      social: 180,
      referral: 144,
    },
  }
  res.status(200).json(payload)
}
