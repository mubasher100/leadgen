import type { NextApiRequest, NextApiResponse } from 'next'
import supabase from '../../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  // Simple analytics: counts by status for the last 30 days, computed in-app
  const cutoff = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
  const { data, error } = await supabase.from('leads').select('status, created_at, data_source, budget')
  if (error) {
    console.error('Analytics fetch error', error)
    return res.status(500).json({ error: 'Failed to fetch analytics' })
  }
  const leads = (data || []).filter((l: any) => (l.created_at || '').toString() >= cutoff)
  const byStatus: Record<string, number> = {}
  const bySource: Record<string, number> = {}
  const byBudget: Record<string, number> = {}
  leads.forEach((l: any) => {
    const s = l.status || 'New'
    byStatus[s] = (byStatus[s] || 0) + 1
    const ds = l.data_source || 'Unknown'
    bySource[ds] = (bySource[ds] || 0) + 1
    const bucket = l.budget ? (l.budget < 5000 ? '<5k' : l.budget < 10000 ? '5k-10k' : '>10k') : 'Unknown'
    byBudget[bucket] = (byBudget[bucket] || 0) + 1
  })
  res.status(200).json({ total: leads.length, byStatus, bySource, byBudget })
}
