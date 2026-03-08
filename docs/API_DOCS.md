# LeadGen API Documentation v1.0

**Status**: 🟢 Production Ready  
**Total Endpoints**: 50+  
**Authentication**: Bearer Token (Phase 7+)  
**Base URL**: https://api.leadgen.com (or your deployed instance)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Phase 1: Lead Management](#phase-1-lead-management)
3. [Phase 7: Production API](#phase-7-production-api)
4. [Phase 8: Analytics](#phase-8-analytics)
5. [Phase 9: Workflows](#phase-9-workflows)
6. [Phase 10: Security](#phase-10-security)
7. [Phase 11: AI Intelligence](#phase-11-ai-intelligence)
8. [Phase 12: Health](#phase-12-health)
9. [Error Handling](#error-handling)
10. [Rate Limiting](#rate-limiting)

---

## Authentication

### Getting Started

All Phase 7+ endpoints require bearer token authentication.

```bash
# 1. Get a token
TOKEN=$(curl -s http://localhost:3000/api/phase7/token | jq -r '.token')

# 2. Use token in requests
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/phase7/health
```

### Token Format

Tokens are JWT (JSON Web Tokens) with the following claims:

```json
{
  "sub": "phase7-admin",
  "role": "admin7",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Token Expiry

- **Default**: 8 hours
- **Scope**: Single session
- **Refresh**: Generate new token via `/api/phase7/token`

---

## Phase 1: Lead Management

### Create Lead
```
POST /api/leads
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-123-4567",
  "company": "Acme Corp",
  "industry": "Technology",
  "location": "San Francisco, CA"
}

Response (201):
{
  "id": "lead-123",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2026-03-08T10:00:00Z",
  "status": "new"
}
```

### List Leads
```
GET /api/leads?limit=20&offset=0&status=all&source=all

Response (200):
{
  "leads": [
    {
      "id": "lead-123",
      "name": "John Doe",
      "email": "john@example.com",
      "status": "new",
      "createdAt": "2026-03-08T10:00:00Z"
    }
  ],
  "total": 1247,
  "limit": 20,
  "offset": 0
}
```

### Export Leads
```
POST /api/leads/export
Content-Type: application/json

{
  "format": "csv",
  "filters": {
    "status": "qualified",
    "quality": "high"
  }
}

Response (200):
{
  "url": "https://s3.amazonaws.com/exports/leads-2026-03-08.csv",
  "expiresAt": "2026-03-15T10:00:00Z",
  "rows": 342
}
```

### Discover Leads
```
POST /api/discover
Content-Type: application/json

{
  "source": "google",
  "filters": {
    "industry": "Technology",
    "location": "San Francisco, CA",
    "company_size": "50-250"
  },
  "limit": 100
}

Response (200):
{
  "leads": [...],
  "discovered": 342,
  "imported": 98
}
```

---

## Phase 7: Production API

### Get Token
```
GET /api/phase7/token

Response (200):
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "expiresIn": 28800,
  "type": "Bearer"
}
```

### Health Check
```
GET /api/phase7/health
Authorization: Bearer <token>

Response (200):
{
  "ok": true,
  "version": "7.0.0",
  "timestamp": "2026-03-08T10:00:00Z",
  "uptime": 99.97,
  "database": "connected"
}
```

### Enrich Lead
```
POST /api/phase7/enrich-lead
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "lead-123",
  "name": "John Doe",
  "company": "Acme Corp",
  "providers": ["google", "yelp"]
}

Response (200):
{
  "id": "lead-123",
  "enrichment": {
    "phase7": true,
    "domain": "acmecorp.com",
    "industry": "Technology",
    "foundedYear": 2010,
    "employeeCount": 150,
    "revenue": "$10M-$50M",
    "location": "San Francisco, CA",
    "phone": "+1-555-123-4567",
    "website": "https://acmecorp.com"
  },
  "quality_score": 0.87,
  "enrichedAt": "2026-03-08T10:00:00Z"
}
```

### Get Analytics
```
GET /api/phase7/analytics?period=7d&source=all
Authorization: Bearer <token>

Response (200):
{
  "totalLeads": 1247,
  "enrichedLeads": 1156,
  "enrichmentRate": 92.7,
  "leadsBySource": {
    "Google Maps": 542,
    "Yelp": 398,
    "Chamber of Commerce": 307
  },
  "topIndustries": [...],
  "timeSeriesData": [...],
  "conversionMetrics": {...}
}
```

### Get Governance Status
```
GET /api/phase7/governance
Authorization: Bearer <token>

Response (200):
{
  "policyStatus": "active",
  "auditLog": [
    {
      "timestamp": "2026-03-08T10:00:00Z",
      "action": "lead_created",
      "userId": "user-123",
      "details": {...}
    }
  ],
  "dataRetention": {
    "policyDays": 365,
    "lastCleanup": "2026-03-01T00:00:00Z"
  }
}
```

---

## Phase 8: Analytics

### Get Analytics Metrics
```
GET /api/phase8/analytics?period=30d
Authorization: Bearer <token>

Response (200):
{
  "totalLeads": 1247,
  "enrichedLeads": 1156,
  "enrichmentRate": 92.7,
  "leadsBySource": {...},
  "topIndustries": [...],
  "budgetAnalytics": {
    "totalSpent": 4892.50,
    "costPerLead": 3.92,
    "costPerEnrichedLead": 4.23,
    "remainingBudget": 5107.50
  },
  "qualityMetrics": {
    "avgLeadScore": 7.2,
    "dataCompletenessRate": 89.3,
    "duplicateRate": 2.1
  }
}
```

### Generate Report
```
POST /api/phase8/reports
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "detailed",
  "period": "30d",
  "format": "pdf",
  "includeCharts": true,
  "breakdownBy": "source"
}

Response (200):
{
  "id": "report-1709891400000",
  "type": "detailed",
  "generatedAt": "2026-03-08T10:00:00Z",
  "fileName": "leads-report-detailed-2026-03-08.pdf",
  "downloadUrl": "/api/phase8/reports/report-123/download",
  "expiresAt": "2026-03-15T10:00:00Z"
}
```

---

## Phase 9: Workflows

### List Workflows
```
GET /api/phase9/workflows
Authorization: Bearer <token>

Response (200):
[
  {
    "id": "wf-001",
    "name": "Daily Enrichment Pipeline",
    "trigger": "scheduled",
    "schedule": "0 2 * * *",
    "enabled": true,
    "actions": [...],
    "runCount": 36,
    "successCount": 35
  }
]
```

### Create Workflow
```
POST /api/phase9/workflows
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Export Qualified Leads",
  "description": "Export qualified leads daily to CRM",
  "trigger": "scheduled",
  "schedule": "0 4 * * *",
  "actions": [
    {
      "type": "filter",
      "config": {"status": "qualified", "quality": "high"},
      "order": 1
    },
    {
      "type": "webhook",
      "config": {"url": "https://crm.example.com/import"},
      "order": 2
    }
  ]
}

Response (201):
{
  "id": "wf-new-123",
  "name": "Export Qualified Leads",
  "enabled": true,
  "createdAt": "2026-03-08T10:00:00Z"
}
```

### Trigger Workflow
```
POST /api/phase9/workflows/{id}/trigger
Authorization: Bearer <token>

Response (200):
{
  "workflowId": "wf-001",
  "executionId": "exec-123",
  "status": "running",
  "startedAt": "2026-03-08T10:00:00Z"
}
```

---

## Phase 10: Security

### Get Audit Logs
```
GET /api/phase10/security/audit-logs?limit=100
Authorization: Bearer <token>

Response (200):
{
  "logs": [
    {
      "id": "audit-001",
      "timestamp": "2026-03-08T10:00:00Z",
      "eventType": "authentication",
      "action": "User login successful",
      "userId": "user-123",
      "result": "success"
    }
  ],
  "total": 3,
  "limit": 100
}
```

### Get Security Policies
```
GET /api/phase10/security/policies
Authorization: Bearer <token>

Response (200):
[
  {
    "id": "policy-001",
    "name": "Production Security Policy",
    "enabled": true,
    "rules": [
      {
        "id": "rule-001",
        "type": "require_mfa",
        "config": {"enabled": true, "gracePeriodDays": 7}
      }
    ]
  }
]
```

### Get Rate Limit Config
```
GET /api/phase10/security/rate-limit
Authorization: Bearer <token>

Response (200):
{
  "enabled": true,
  "requestsPerMinute": 60,
  "requestsPerHour": 1000,
  "burstLimit": 100
}
```

---

## Phase 11: AI Intelligence

### Get AI Insights
```
GET /api/phase11/insights?type=prediction&limit=10
Authorization: Bearer <token>

Response (200):
[
  {
    "id": "insight-001",
    "type": "prediction",
    "title": "High-Quality Leads Detected",
    "description": "45 leads with 85%+ conversion probability",
    "confidence": 0.92,
    "impact": "high",
    "actionItems": [...]
  }
]
```

### Get Lead Score Prediction
```
GET /api/phase11/predictions/lead-scoring/{leadId}
Authorization: Bearer <token>

Response (200):
{
  "leadId": "lead-123",
  "score": 0.87,
  "scoreLabel": "High Quality",
  "probability": {
    "highQuality": 0.87,
    "mediumQuality": 0.11,
    "lowQuality": 0.02
  },
  "factors": [
    {
      "name": "Company Size",
      "impact": 0.25,
      "value": "Large (500+ employees)"
    }
  ],
  "recommendedActions": [
    "Fast-track to sales team",
    "Schedule high-priority follow-up"
  ]
}
```

### Get AI Models
```
GET /api/phase11/models
Authorization: Bearer <token>

Response (200):
[
  {
    "id": "model-001",
    "name": "Lead Scoring Model v3",
    "type": "lead_scoring",
    "accuracy": 0.91,
    "precision": 0.89,
    "enabled": true,
    "lastTrainedAt": "2026-03-05T08:00:00Z"
  }
]
```

### Get Recommendations
```
GET /api/phase11/recommendations
Authorization: Bearer <token>

Response (200):
{
  "immediate": [
    {
      "id": "rec-001",
      "priority": "high",
      "title": "Fix API Rate Limiting",
      "estimatedImpact": "Prevent 200+ leads/week from failing"
    }
  ],
  "shortTerm": [...],
  "longTerm": [...]
}
```

---

## Phase 12: Health

### System Health Check
```
GET /api/phase12/health

Response (200):
{
  "status": "healthy",
  "timestamp": "2026-03-08T10:00:00Z",
  "checks": [
    {
      "name": "Database Connection",
      "status": "healthy",
      "responseTime": 45
    },
    {
      "name": "Cache (Redis)",
      "status": "healthy",
      "responseTime": 12
    }
  ],
  "metrics": {
    "uptime": 99.97,
    "requestsPerSecond": 1234,
    "errorRate": 0.003
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created |
| 204 | No Content | Resource deleted |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

### Error Response Format

```json
{
  "error": "Unauthorized",
  "code": 401,
  "message": "Invalid or expired token",
  "details": {
    "reason": "token_expired",
    "expiresAt": "2026-03-08T12:00:00Z"
  }
}
```

---

## Rate Limiting

### Limits

- **Per Minute**: 60 requests
- **Per Hour**: 1,000 requests
- **Burst**: 100 requests

### Headers

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1709891400
```

### Exceeding Limits

```
HTTP 429 Too Many Requests

{
  "error": "Too Many Requests",
  "code": 429,
  "retryAfter": 12,
  "message": "Rate limit exceeded. Retry after 12 seconds"
}
```

---

## Pagination

### Request

```
GET /api/leads?limit=20&offset=40
```

### Parameters

- `limit`: Items per page (default: 20, max: 100)
- `offset`: Items to skip (default: 0)

### Response

```json
{
  "leads": [...],
  "total": 1247,
  "limit": 20,
  "offset": 40,
  "hasMore": true
}
```

---

## Filtering & Searching

### Lead Filters

```bash
GET /api/leads?status=qualified&quality=high&source=google
```

### Available Filters

- `status`: new | contacted | interested | qualified | converted
- `quality`: high | medium | low
- `source`: google | yelp | chamber | all
- `industry`: Technology | Healthcare | Finance | etc.
- `location`: City, State

---

## Webhooks

### Register Webhook

```
POST /api/webhooks
Authorization: Bearer <token>

{
  "url": "https://your-app.com/webhooks/leadgen",
  "events": ["lead.created", "lead.enriched"],
  "active": true
}
```

### Webhook Events

- `lead.created` – New lead created
- `lead.enriched` – Lead enrichment completed
- `lead.status_changed` – Lead status changed
- `workflow.executed` – Workflow executed
- `report.generated` – Report generated

---

## Examples

### Complete Workflow Example

```bash
#!/bin/bash

# 1. Get token
TOKEN=$(curl -s http://localhost:3000/api/phase7/token | jq -r '.token')

# 2. Check health
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/phase7/health

# 3. Get analytics
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/phase8/analytics

# 4. Create workflow
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Export",
    "trigger": "scheduled",
    "schedule": "0 4 * * *",
    "actions": [
      {"type": "filter", "config": {"status": "qualified"}, "order": 1},
      {"type": "export", "config": {"format": "csv"}, "order": 2}
    ]
  }' \
  http://localhost:3000/api/phase9/workflows
```

---

## Support

- **Issues**: https://github.com/mubasher100/leadgen/issues
- **Documentation**: See `/docs` directory
- **Email**: support@leadgen.com

---

**Last Updated**: 2026-03-08  
**Version**: 1.0.0
