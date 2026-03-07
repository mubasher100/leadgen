import type { NextApiRequest, NextApiResponse } from 'next'
import supabase from '../../lib/supabaseClient'
import { sendLeadNotification } from '../../lib/email'

function isAdmin(req: NextApiRequest): boolean {
  const cookie = (req.headers.cookie as string) ?? ''
  return /(^|;\s*)admin_session\s*=\s*1(;|$)/.test(cookie)
}
function isAdmin(req: NextApiRequest): boolean {
  const cookie = req.headers.cookie ?? ''
  // Very simple admin check via cookie; token-based upgrade later
  return /(^|;\s*)admin_session\s*=\s*1(;|$)/.test(cookie)
}

type LeadInput = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  jobTitle?: string
  city?: string
  state?: string
  country?: string
  address?: string
  businessType: string
  serviceInterest?: string
  leadSource?: string
  budget?: number
  budgetBracket?: string
  dataSource?: string
  sourceId?: string
  sourceTimestamp?: string
  data?: any
  notes?: string
  ipAddress?: string
  userAgent?: string
  website?: string // honeypot field; should be empty
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  // Admin GET path
  if (req.method === 'GET') {
    if (!isAdmin(req)) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    const page = parseInt((req.query?.page as string) || '1', 10)
    const perPage = 25
    const offset = (page - 1) * perPage
    const { data: rows, error: derr } = await supabase.from('leads').select('*').range(offset, offset + perPage - 1)
    if (derr) {
      console.error('Lead fetch error', derr)
      res.status(500).json({ error: 'Failed to fetch leads' })
      return
    }
    res.status(200).json(rows)
    return
  }

  const body = req.body as LeadInput

  // Basic bot protection via honeypot
  if (body.website && String(body.website).trim().length > 0) {
    // Silently ignore bot submissions
    return res.status(200).json({ id: null, status: 'ignored' })
  }

  // Admin: allow GET to fetch leads (admin only)
  if (req.method === 'GET') {
    if (!isAdmin(req)) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    const page = parseInt((req.query?.page as string) || '1', 10)
    const perPage = 25
    const offset = (page - 1) * perPage
    const { data: rows, error: qerr } = await supabase.from('leads').select('*').range(offset, offset + perPage - 1)
    if (qerr) {
      console.error('Lead fetch error', qerr)
      res.status(500).json({ error: 'Failed to fetch leads' })
      return
    }
    res.status(200).json(rows)
    return
  }

  // Build insert payload matching DB columns
  const payload = {
    first_name: body.firstName,
    last_name: body.lastName,
    email: body.email,
    phone: body.phone,
    company: body.company,
    job_title: body.jobTitle,
    city: body.city,
    state: body.state,
    country: body.country,
    address: body.address,
    business_type: body.businessType,
    service_interest: body.serviceInterest,
    lead_source: body.leadSource,
    budget: body.budget,
    budget_bracket: body.budgetBracket,
    data_source: body.dataSource,
    source_id: body.sourceId,
    source_timestamp: body.sourceTimestamp ? new Date(body.sourceTimestamp).toISOString() : null,
    data: body.data ?? null,
    notes: body.notes,
    ip_address: body.ipAddress || '',
    user_agent: body.userAgent || '',
  }

  const { data, error } = await supabase.from('leads').insert([payload]).select('id, status, created_at').single()
  if (error) {
    console.error('Lead insert error', error)
    res.status(500).json({ error: 'Failed to save lead' })
    return
  }
  // Fire-and-forget notification to owner
  try {
    await sendLeadNotification({ ...payload, id: data?.id, status: data?.status, created_at: data?.created_at })
  } catch (e) {
    console.error('Notification error', e)
  }
  res.status(201).json({ id: data?.id, status: data?.status, created_at: data?.created_at })
}
