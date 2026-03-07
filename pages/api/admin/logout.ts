import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Clear the admin_session cookie
  res.setHeader('Set-Cookie', ['admin_session=; HttpOnly; Path=/; Max-Age=0'])
  res.status(200).json({ ok: true })
}
