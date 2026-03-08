import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Phase 15: Multi-channel Campaign Management
 */

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req

  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (method === 'POST') {
    const newCampaign = {
      id: `camp-${Date.now()}`,
      name: req.body.name,
      status: 'draft',
      channels: req.body.channels || ['email'],
      created_at: new Date().toISOString(),
    }
    return res.status(201).json({ message: 'Campaign created', campaign: newCampaign })
  }

  if (method === 'GET') {
    return res.status(200).json({
      campaigns: [
        {
          id: 'camp-001',
          name: 'Q1 Enterprise Campaign',
          status: 'running',
          channels: ['email', 'linkedin'],
          budget: 50000,
          spent: 12500,
        },
      ],
      total: 1,
    })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
