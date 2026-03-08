import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAdminToken } from '../../../lib/auth'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Accept both cookie-based admin_token and Bearer token for health checks in tests
  const cookies = req.headers.cookie || ''
  let token = ''
  const m = cookies.match(/admin_token=([^;]+);?/)
  if (m?.[1]) token = m[1]
  const auth = req.headers.authorization || ''
  if (!token && auth.startsWith('Bearer ')) token = auth.slice(7)
  if (token && verifyAdminToken(token)) {
    res.status(200).json({ ok: true, status: 'healthy' })
  } else {
    // If no token, still respond 401; tests can login to establish a session first
    res.status(401).json({ ok: false, error: 'unauthorized' })
  }
}
