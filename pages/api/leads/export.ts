import type { NextApiRequest, NextApiResponse } from 'next'
import supabase from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  // Optional filtering via query params
  const { data_source } = req.query;

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq(data_source ? 'data_source' : '', (data_source as string) ?? undefined)
  
  if (error) {
    console.error('Export fetch error', error)
    res.status(500).json({ error: 'Failed to fetch leads' })
    return
  }

  const leads = data || []
  if (!Array.isArray(leads) || leads.length === 0) {
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"')
    return res.end('id,created_at,first_name,last_name,email,company,city,state,country,data_source,source_id\n')
  }

  // CSV header (basic; extend as needed)
  const headers = [
    'id',
    'created_at',
    'first_name',
    'last_name',
    'email',
    'phone',
    'company',
    'city',
    'state',
    'country',
    'data_source',
    'source_id',
    'budget',
    'budget_bracket',
    'notes',
  ]

  const rows = leads.map((r: any) => [
    r.id,
    r.created_at,
    r.first_name,
    r.last_name,
    r.email,
    r.phone,
    r.company,
    r.city,
    r.state,
    r.country,
    r.data_source,
    r.source_id,
    r.budget,
    r.budget_bracket,
    r.notes
  ])

  const csv = [headers.join(','), ...rows.map((row) => row.map((v) => (v ?? '').toString()).join(','))].join('\n')

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"')
  res.status(200).send(csv)
}
