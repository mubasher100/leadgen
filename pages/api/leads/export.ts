import type { NextApiRequest, NextApiResponse } from 'next'
import supabase from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const per = 1000
  let offset = 0
  const all: any[] = []
  while (true) {
    const { data, error } = await supabase.from('leads').select('*').range(offset, offset + per - 1)
    if (error) {
      console.error('Export fetch error', error)
      res.status(500).json({ error: 'Failed to fetch leads' })
      return
    }
    if (!data || data.length === 0) break
    all.push(...data)
    offset += per
  }

  const leads = all
  if (!Array.isArray(leads) || leads.length === 0) {
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"')
    return res.end('id,created_at,updated_at,first_name,last_name,email,phone,company,city,state,country,address,data_source,source_id,budget,budget_bracket,notes,ip_address,user_agent,status,validation_status,source_timestamp\n')
  }

  const headers = [
    'id', 'created_at', 'updated_at', 'first_name', 'last_name', 'email', 'phone', 'company', 'city', 'state', 'country', 'address', 'data_source', 'source_id', 'budget', 'budget_bracket', 'notes', 'ip_address', 'user_agent', 'status', 'validation_status', 'source_timestamp'
  ]

  const rows = leads.map((r) => [
    r.id,
    r.created_at,
    r.updated_at,
    r.first_name,
    r.last_name,
    r.email,
    r.phone,
    r.company,
    r.city,
    r.state,
    r.country,
    r.address,
    r.data_source,
    r.source_id,
    r.budget,
    r.budget_bracket,
    r.notes,
    r.ip_address,
    r.user_agent,
    r.status,
    r.validation_status,
    r.source_timestamp
  ])

  const csv = [headers.join(','), ...rows.map((row) => row.map((v) => (v ?? '').toString()).join(','))].join('\n')
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"')
  res.status(200).send(csv)
}
