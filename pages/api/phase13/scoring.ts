import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Phase 13: Advanced Lead Scoring & Segmentation
 */

interface LeadScoreRequest {
  lead_id: string
  lead_data: Record<string, any>
}

// Lead scoring algorithm
function calculateLeadScore(leadData: Record<string, any>): number {
  let score = 50 // Base score

  // Company size scoring
  if (leadData.annual_revenue) {
    if (leadData.annual_revenue > 50000000) score += 25
    else if (leadData.annual_revenue > 10000000) score += 15
    else if (leadData.annual_revenue > 1000000) score += 10
  }

  // Engagement scoring
  if (leadData.interactions) {
    score += Math.min(leadData.interactions * 3, 20)
  }

  // Recency scoring
  if (leadData.days_since_contact) {
    if (leadData.days_since_contact <= 7) score += 15
    else if (leadData.days_since_contact <= 30) score += 10
    else if (leadData.days_since_contact <= 90) score += 5
  }

  // Industry fit
  if (leadData.industry === 'Technology' || leadData.industry === 'Financial') {
    score += 10
  }

  // Response rate
  if (leadData.response_rate) {
    score += leadData.response_rate * 10
  }

  return Math.min(score, 100)
}

function categorizeScore(score: number): string {
  if (score >= 80) return 'hot'
  if (score >= 60) return 'warm'
  if (score >= 40) return 'cool'
  return 'cold'
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req

  // Verify Bearer token
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (method === 'POST') {
    const body = req.body as LeadScoreRequest
    const score = calculateLeadScore(body.lead_data)
    const category = categorizeScore(score)

    return res.status(200).json({
      lead_id: body.lead_id,
      score,
      category,
      timestamp: new Date().toISOString(),
    })
  }

  if (method === 'GET' && query.action === 'segments') {
    return res.status(200).json({
      segments: [
        { id: 'high-value', name: 'High Value Leads', size: 1243, avg_score: 85 },
        { id: 'mid-market', name: 'Mid-Market', size: 3421, avg_score: 65 },
        { id: 'nurture', name: 'Nurture Leads', size: 5634, avg_score: 45 },
      ],
      timestamp: new Date().toISOString(),
    })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
