import type { NextApiRequest, NextApiResponse } from 'next'
import supabase from '../../lib/supabaseClient'

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

  const body = req.body as LeadInput

  // Basic bot protection via honeypot
  if (body.website && String(body.website).trim().length > 0) {
    // Silently ignore bot submissions
    return res.status(200).json({ id: null, status: 'ignored' })
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
  res.status(201).json({ id: data?.id, status: data?.status, created_at: data?.created_at })
}
