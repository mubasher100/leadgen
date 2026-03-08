import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAdminToken } from '../../lib/auth'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = req.headers.cookie || ''
  const m = cookies.match(/admin_token=([^;]+);?/)
  const token = m?.[1] || ''
  const payload = verifyAdminToken(token)
  if (payload) {
    res.status(200).json({ ok: true, user: payload })
  } else {
    res.status(401).json({ ok: false, error: 'invalid token' })
  }
}
