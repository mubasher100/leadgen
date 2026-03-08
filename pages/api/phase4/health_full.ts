import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyAdminToken } from '../../lib/auth'
import supabase from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  // Admin auth via Bearer token or admin_token cookie
  const cookies = req.headers.cookie || ''
  let token = ''
  const m = cookies.match(/admin_token=([^;]+);?/) 
  if (m?.[1]) token = m[1]
  const auth = req.headers.authorization || ''
  if (!token && auth.startsWith('Bearer ')) token = auth.slice(7)
  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' })
  }

  try {
    const { data, error } = await supabase.from('leads').select('id').limit(1)
    if (error) throw error
    res.status(200).json({ ok: true, count: (data?.length ?? 0) })
  } catch (e) {
    console.error('Phase4 health_full error', e)
    res.status(500).json({ ok: false, error: 'internal' })
  }
}
