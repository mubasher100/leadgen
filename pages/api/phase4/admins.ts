import type { NextApiRequest, NextApiResponse } from 'next'
import supabase from '../../lib/supabaseClient'
import { verifyAdminToken } from '../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Very basic RBAC: require Bearer token
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' })
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('admins').select('*')
    if (error) return res.status(500).json({ error: 'failed to fetch admins' })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { email, role } = req.body as { email?: string; role?: string }
    if (!email) return res.status(400).json({ error: 'missing email' })
    if (!role) return res.status(400).json({ error: 'missing role' })
    const { data, error } = await supabase.from('admins').insert([{ email, role }]).select('*').single()
    if (error) return res.status(500).json({ error: 'admin creation failed' })
    res.status(201).json(data)
    return
  }

  res.status(405).json({ error: 'method not allowed' })
}
