import type { NextApiRequest, NextApiResponse } from 'next'
import { signAdminToken } from '../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  const { password } = req.body as { password?: string }
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  if (!password || password !== adminPassword) {
    return res.status(401).json({ ok: false, message: 'Invalid password' })
  }

  // Create and set a signed admin token cookie
  const token = signAdminToken({ role: 'admin', iat: Date.now() })
  res.setHeader('Set-Cookie', [`admin_token=${token}; HttpOnly; Path=/; Max-Age=7200`])
  res.status(200).json({ ok: true })
}
