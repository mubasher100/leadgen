import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lightweight seed endpoint for local testing
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const seeds = [
    {
      first_name: 'Alice',
      last_name: 'Anderson',
      email: 'alice@example.com',
      company: 'Acme Digital',
      city: 'Los Angeles',
      state: 'CA',
      country: 'US',
      address: '123 Market St',
      business_type: 'Digital Marketing',
      service_interest: 'SEO',
      lead_source: 'LocalTest',
      budget: 5000,
      data_source: 'Google Places',
      source_id: 'gp-seed-1',
      source_timestamp: new Date().toISOString(),
      data: {},
    },
    {
      first_name: 'Bob',
      last_name: 'Ng',
      email: 'bob.ng@example.com',
      company: 'Northstar LLC',
      city: 'New York',
      state: 'NY',
      country: 'US',
      address: '45 Broadway',
      business_type: 'Digital Marketing',
      service_interest: 'PPC',
      lead_source: 'LocalTest',
      budget: 7500,
      data_source: 'Yelp',
      source_id: 'yp-seed-2',
      source_timestamp: new Date().toISOString(),
      data: {},
    },
    {
      first_name: 'Carol',
      last_name: 'Chen',
      email: 'carol.chen@example.com',
      company: 'BluePeak',
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
      address: '200 Market St',
      business_type: 'Digital Marketing',
      service_interest: 'Content',
      lead_source: 'LocalTest',
      budget: 12000,
      data_source: 'Google Places',
      source_id: 'gp-seed-3',
      source_timestamp: new Date().toISOString(),
      data: {},
    },
  ]

  const { data, error } = await supabase.from('leads').insert(seeds).select('id').limit(seeds.length)
  if (error) {
    console.error('Seed error', error)
    return res.status(500).json({ error: 'Seed failed' })
  }
  res.status(200).json({ inserted: data?.length ?? seeds.length })
}
