import type { NextApiRequest, NextApiResponse } from 'next'

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

  // Set a simple HttpOnly cookie to mark admin session (short-lived)
  res.setHeader('Set-Cookie', [`admin_session=1; HttpOnly; Path=/; Max-Age=3600`])
  res.status(200).json({ ok: true })
}
