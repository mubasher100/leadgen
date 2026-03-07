Phase 2 Rollout Plan (Enrichment, Analytics, RBAC)
- Goals:
  - Integrate licensed enrichment providers and multiple data sources
  - Build analytics dashboards (ROI, funnel, lifecycle)
  - Harden admin access with Supabase Auth RBAC
- Steps:
 1) Create a staging environment and a production-backed Supabase project with separate data schemas
 2) Implement enrichment provider integration (phase 2): API calls, data mapping, consent handling
 3) Build analytics dashboards using liveroll patterns or a lightweight charting library
 4) Implement RBAC roles and tests; add admin user management UI
 5) Add tests (Jest for API, Playwright for E2E)
- Rollout:
  - Staging → QA → Production with feature flags and monitoring
- Rollback:
  - Fast revert to previous commit or branch; verify data integrity after rollback
