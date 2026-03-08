import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAdminToken } from '../../lib/auth'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  // Try token from cookie if present as well
  const cookies = req.headers.cookie || ''
  const m = cookies.match(/admin_token=([^;]+);?/) 
  const cookieToken = m?.[1] || ''
  const t = token || cookieToken
  if (!t || !verifyAdminToken(t)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' })
  }
  res.status(200).json({ ok: true, status: 'healthy' })
}
