import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyPhase6Token } from '../../lib/auth6'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token || !verifyPhase6Token(token)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' })
  }
  res.status(200).json({ ok: true, status: 'healthy' })
}
