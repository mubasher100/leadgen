# Extended API Documentation - Phases 13-18

## Phase 13: Advanced Lead Scoring & Segmentation

Advanced algorithmic lead scoring with multi-factor analysis and dynamic segmentation.

### Endpoints

#### POST /api/phase13/scoring
Calculate lead quality score based on multiple factors.

**Request:**
```json
{
  "lead_id": "lead-001",
  "lead_data": {
    "annual_revenue": 25000000,
    "interactions": 8,
    "days_since_contact": 3,
    "industry": "Technology",
    "response_rate": 0.8
  }
}
```

**Response:**
```json
{
  "lead_id": "lead-001",
  "score": 85,
  "category": "hot",
  "timestamp": "2026-03-08T12:00:00Z"
}
```

#### GET /api/phase13/scoring?action=segments
Get lead segments and distribution.

**Response:**
```json
{
  "segments": [
    {
      "id": "high-value",
      "name": "High Value Leads",
      "size": 1243,
      "average_score": 85
    }
  ],
  "total_leads": 10298,
  "timestamp": "2026-03-08T12:00:00Z"
}
```

---

## Phase 14: Real-time Notifications & Event Streaming

Event-driven architecture with real-time notifications across multiple channels.

### Endpoints

#### POST /api/phase14/notifications
Create and stream events.

#### GET /api/phase14/notifications?action=events
Get event stream with filtering.

**Query Parameters:**
- `type` - Event type filter (e.g., "lead.*")
- `limit` - Number of events to return (default: 10)

#### POST /api/phase14/notifications?action=subscriptions
Subscribe to specific event types.

**Request:**
```json
{
  "user_id": "user-001",
  "event_type": "lead.*",
  "channel": "email"
}
```

---

## Phase 15: Multi-channel Campaign Management

Unified campaign management across email, SMS, social, and more.

### Endpoints

#### POST /api/phase15/campaigns
Create new campaign.

**Request:**
```json
{
  "name": "Q2 Enterprise Push",
  "description": "Target enterprise leads",
  "channels": ["email", "linkedin"],
  "target_segment": "high-value",
  "budget": 50000,
  "start_date": "2026-04-01T00:00:00Z",
  "end_date": "2026-06-30T23:59:59Z"
}
```

#### GET /api/phase15/campaigns?action=analytics&campaign_id=camp-001
Get campaign performance metrics.

**Response:**
```json
{
  "analytics": {
    "sent": 5000,
    "opened": 1250,
    "clicked": 350,
    "converted": 42,
    "open_rate": 25.0,
    "click_rate": 28.0,
    "conversion_rate": 12.0,
    "roas": 7.2
  }
}
```

---

## Phase 16: Advanced CRM Integration & Sync

Bidirectional CRM synchronization with conflict resolution.

### Endpoints

#### POST /api/phase16/crm-sync?action=sync&integration_id=integ-001
Trigger immediate CRM sync.

#### GET /api/phase16/crm-sync?action=sync-status&integration_id=integ-001
Get real-time sync status.

**Response:**
```json
{
  "status": "success",
  "total_records": 15000,
  "synced_records": 15000,
  "errors": 0,
  "last_sync_duration_ms": 45000,
  "next_sync": "2026-03-08T13:00:00Z"
}
```

#### POST /api/phase16/crm-sync?action=field-mapping
Map custom fields between systems.

**Request:**
```json
{
  "integration_id": "integ-001",
  "mapping": {
    "lead_score": "Custom_Score__c",
    "lead_source": "LeadSource",
    "company_size": "Company_Size__c"
  }
}
```

---

## Phase 17: Advanced Compliance & GDPR

Comprehensive compliance management with GDPR and data privacy controls.

### Endpoints

#### POST /api/phase17/compliance?action=consent
Record user consent.

**Request:**
```json
{
  "lead_id": "lead-001",
  "consent_type": "marketing",
  "status": "opted_in",
  "channel": "email"
}
```

#### POST /api/phase17/compliance?action=right-to-be-forgotten
Delete all personal data (GDPR right to be forgotten).

**Request:**
```json
{
  "lead_id": "lead-001"
}
```

**Response:**
```json
{
  "message": "Data deletion initiated",
  "deletion_request_id": "del-1234567890",
  "status": "processing",
  "estimated_completion": "2026-03-15T12:00:00Z"
}
```

#### GET /api/phase17/compliance?action=compliance-report
Generate compliance report.

**Response:**
```json
{
  "total_leads": 50000,
  "consented_leads": 45000,
  "non_consented_leads": 5000,
  "gdpr_requests_processed": 127,
  "deletion_requests_completed": 89,
  "data_exports_completed": 38,
  "compliance_score": 94.2,
  "generated_at": "2026-03-08T12:00:00Z"
}
```

#### GET /api/phase17/compliance?action=audit-trail&resource=lead&days=90
Get audit trail for compliance verification.

---

## Phase 18: Predictive Analytics & Forecasting

AI-powered predictive analytics and forecasting.

### Endpoints

#### POST /api/phase18/analytics?action=forecast
Generate forecast for any metric.

**Request:**
```json
{
  "metric": "leads_per_day",
  "period": "monthly"
}
```

**Response:**
```json
{
  "forecast": {
    "metric": "leads_per_day",
    "predicted_value": 450,
    "confidence_interval": [420, 480],
    "model_version": "v2.1"
  }
}
```

#### POST /api/phase18/analytics?action=churn-prediction
Predict lead churn probability.

**Request:**
```json
{
  "lead_id": "lead-001"
}
```

**Response:**
```json
{
  "prediction": {
    "lead_id": "lead-001",
    "churn_probability": 0.78,
    "risk_level": "high",
    "key_factors": [
      "No contact in 45 days",
      "Declining engagement",
      "Competitor engagement detected"
    ],
    "recommended_actions": [
      "Send personalized re-engagement campaign",
      "Offer special discount",
      "Schedule executive check-in"
    ]
  }
}
```

#### GET /api/phase18/analytics?action=revenue-forecast&months=3
Forecast revenue for next N months.

#### GET /api/phase18/analytics?action=insights
Get AI-generated business insights.

**Response:**
```json
{
  "insights": [
    {
      "title": "High-value segment emerging",
      "description": "Tech companies with 500+ employees show 3x higher conversion rate",
      "impact": "high",
      "confidence": 94
    }
  ]
}
```

---

## Authentication

All Phase 13-18 endpoints require Bearer token authentication:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://api.example.com/api/phase18/analytics?action=insights
```

Generate a test token:
```bash
curl -X POST http://localhost:3000/api/phase7/token
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Resource not found"
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 202: Accepted (async processing)
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 405: Method Not Allowed
- 500: Server Error

---

## Rate Limiting

All endpoints are rate-limited to 100 requests/minute per API token.

Header: `X-RateLimit-Remaining: 87`

---

## Webhooks

Register webhooks to receive real-time events:

```json
{
  "url": "https://your-domain.com/webhooks/leadgen",
  "events": ["lead.created", "lead.updated", "campaign.completed"]
}
```

Events are sent as POST requests with:
- `X-Signature` header for verification
- JSON payload with event data
- Automatic retry with exponential backoff

