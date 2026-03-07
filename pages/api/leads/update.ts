import type { NextApiRequest, NextApiResponse } from 'next'
import supabase from '../../lib/supabaseClient'

type UpdatePayload = {
  id: string
  status?: string
  notes?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const body = req.body as UpdatePayload
  if (!body?.id) {
    return res.status(400).json({ error: 'Missing id' })
  }
  const updates: any = {}
  if (body.status) updates.status = body.status
  if (body.notes) updates.notes = body.notes

  const { data, error } = await supabase.from('leads').update(updates).eq('id', body.id).select('*').single()
  if (error) {
    console.error('Lead update error', error)
    return res.status(500).json({ error: 'Failed to update lead' })
  }
  res.status(200).json(data)
}
