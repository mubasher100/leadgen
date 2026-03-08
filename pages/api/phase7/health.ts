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
  res.status(200).json({ ok: true, status: 'healthy' })
}
