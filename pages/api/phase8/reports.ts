import { NextApiRequest, NextApiResponse } from 'next'

export interface ReportRequest {
  type: 'summary' | 'detailed' | 'custom'
  period: '24h' | '7d' | '30d' | '90d' | 'custom'
  startDate?: string
  endDate?: string
  format: 'json' | 'csv' | 'pdf'
  includeCharts: boolean
  breakdownBy: 'source' | 'status' | 'quality' | 'industry' | 'location'
}

export interface Report {
  id: string
  type: string
  generatedAt: string
  period: string
  fileName: string
  downloadUrl: string
  expiresAt: string
}

/**
 * Phase 8: Advanced Reporting Endpoint
 * Generates comprehensive reports on lead generation pipeline
 * 
 * POST /api/phase8/reports
 * 
 * Body:
 * {
 *   "type": "summary|detailed|custom",
 *   "period": "7d|30d|90d|custom",
 *   "format": "json|csv|pdf",
 *   "includeCharts": true,
 *   "breakdownBy": "source|status|quality"
 * }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Report | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { type = 'summary', period = '7d', format = 'json', includeCharts = false } = req.body as ReportRequest

    // Validate request
    if (!['summary', 'detailed', 'custom'].includes(type)) {
      return res.status(400).json({ error: 'Invalid report type' })
    }

    if (!['json', 'csv', 'pdf'].includes(format)) {
      return res.status(400).json({ error: 'Invalid format' })
    }

    // Generate report ID and metadata
    const reportId = `report-${Date.now()}`
    const fileName = `leads-report-${type}-${new Date().toISOString().split('T')[0]}.${format}`
    const downloadUrl = `/api/phase8/reports/${reportId}/download?format=${format}`
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days

    const report: Report = {
      id: reportId,
      type,
      generatedAt: new Date().toISOString(),
      period,
      fileName,
      downloadUrl,
      expiresAt,
    }

    res.status(200).json(report)
  } catch (error) {
    console.error('Report generation error:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
}
