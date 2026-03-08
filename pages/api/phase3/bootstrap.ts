import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }
  res.status(200).json({ ok: true, msg: 'Phase 3 bootstrap placeholder. Implement provisioning scripts in production.' })
}
