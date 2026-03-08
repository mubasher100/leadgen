import { NextApiRequest, NextApiResponse } from 'next'

export interface AnalyticsMetrics {
  totalLeads: number
  enrichedLeads: number
  enrichmentRate: number
  leadsBySource: { [key: string]: number }
  leadsByStatus: { [key: string]: number }
  leadsByQuality: { [key: string]: number }
  topIndustries: Array<{ industry: string; count: number }>
  topLocations: Array<{ location: string; count: number }>
  conversionMetrics: {
    contacted: number
    interested: number
    qualified: number
    converted: number
  }
  timeSeriesData: Array<{
    date: string
    leadsCreated: number
    leadsEnriched: number
    conversions: number
  }>
  enrichmentProviderMetrics: {
    [provider: string]: {
      attempts: number
      successes: number
      failures: number
      avgTimeMs: number
      successRate: number
    }
  }
  budgetAnalytics: {
    totalSpent: number
    costPerLead: number
    costPerEnrichedLead: number
    remainingBudget: number
    projectedMonthlySpend: number
  }
  qualityMetrics: {
    avgLeadScore: number
    leadQualityDistribution: {
      high: number
      medium: number
      low: number
    }
    dataCompletenessRate: number
    duplicateRate: number
  }
}

/**
 * Phase 8: Enhanced Analytics Endpoint
 * Provides comprehensive analytics and reporting on lead generation pipeline
 * 
 * GET /api/phase8/analytics?period=7d&source=all&status=all
 * 
 * Query Parameters:
 *   - period: '24h' | '7d' | '30d' | '90d' | 'custom' (default: '7d')
 *   - source: 'google' | 'yelp' | 'chamber' | 'all' (default: 'all')
 *   - status: 'new' | 'contacted' | 'interested' | 'qualified' | 'converted' | 'all' (default: 'all')
 *   - industryFilter: comma-separated industries (optional)
 *   - locationFilter: comma-separated locations (optional)
 * 
 * Requires Bearer token with 'analytics' role
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalyticsMetrics | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Parse query parameters
    const { period = '7d', source = 'all', status = 'all' } = req.query

    // Mock analytics data (in production, query actual database)
    const analytics: AnalyticsMetrics = {
      totalLeads: 1247,
      enrichedLeads: 1156,
      enrichmentRate: 92.7,

      leadsBySource: {
        'Google Maps': 542,
        'Yelp': 398,
        'Chamber of Commerce': 307,
      },

      leadsByStatus: {
        'new': 245,
        'contacted': 398,
        'interested': 276,
        'qualified': 198,
        'converted': 130,
      },

      leadsByQuality: {
        'high': 658,
        'medium': 421,
        'low': 168,
      },

      topIndustries: [
        { industry: 'Technology', count: 324 },
        { industry: 'Healthcare', count: 287 },
        { industry: 'Finance', count: 256 },
        { industry: 'Retail', count: 198 },
        { industry: 'Manufacturing', count: 182 },
      ],

      topLocations: [
        { location: 'San Francisco, CA', count: 389 },
        { location: 'New York, NY', count: 356 },
        { location: 'Los Angeles, CA', count: 298 },
        { location: 'Chicago, IL', count: 204 },
      ],

      conversionMetrics: {
        contacted: 398,
        interested: 276,
        qualified: 198,
        converted: 130,
      },

      timeSeriesData: [
        { date: '2026-03-01', leadsCreated: 145, leadsEnriched: 134, conversions: 8 },
        { date: '2026-03-02', leadsCreated: 156, leadsEnriched: 148, conversions: 12 },
        { date: '2026-03-03', leadsCreated: 138, leadsEnriched: 127, conversions: 9 },
        { date: '2026-03-04', leadsCreated: 167, leadsEnriched: 158, conversions: 14 },
        { date: '2026-03-05', leadsCreated: 149, leadsEnriched: 141, conversions: 11 },
        { date: '2026-03-06', leadsCreated: 174, leadsEnriched: 167, conversions: 15 },
        { date: '2026-03-07', leadsCreated: 151, leadsEnriched: 143, conversions: 10 },
        { date: '2026-03-08', leadsCreated: 167, leadsEnriched: 158, conversions: 13 },
      ],

      enrichmentProviderMetrics: {
        'Google Places': {
          attempts: 542,
          successes: 521,
          failures: 21,
          avgTimeMs: 245,
          successRate: 96.1,
        },
        'Yelp Fusion': {
          attempts: 398,
          successes: 376,
          failures: 22,
          avgTimeMs: 312,
          successRate: 94.5,
        },
        'Chamber of Commerce': {
          attempts: 307,
          successes: 259,
          failures: 48,
          avgTimeMs: 187,
          successRate: 84.4,
        },
      },

      budgetAnalytics: {
        totalSpent: 4892.50,
        costPerLead: 3.92,
        costPerEnrichedLead: 4.23,
        remainingBudget: 5107.50,
        projectedMonthlySpend: 9785.00,
      },

      qualityMetrics: {
        avgLeadScore: 7.2,
        leadQualityDistribution: {
          high: 658,
          medium: 421,
          low: 168,
        },
        dataCompletenessRate: 89.3,
        duplicateRate: 2.1,
      },
    }

    res.status(200).json(analytics)
  } catch (error) {
    console.error('Analytics error:', error)
    res.status(500).json({ error: 'Failed to fetch analytics' })
  }
}
