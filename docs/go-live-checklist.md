Production Go-Live Checklist (Phase 6+)

- Prerequisites
  - All Phase 6 patches merged to main and staging validated
  - RBAC/auth wired for admin users (Supabase Auth preferred for production)
  - Licensed enrichment providers selected and consent policies in place
  - Staging tests pass for Phase 6 and 5 pipelines
  - Environment variables and secrets configured in production CI/CD

- Pre-Deploy Checks
  - Migrations applied to production DB
  - Health checks endpoints return healthy
  - Logging and observability hooks are active (cadence health, ingestion health)

- Deployment Steps (Production)
  - Trigger production deployment (CI/CD or manual)
  - Validate preview/production URLs after deployment
  - Run Playwright end-to-end tests in prod staging path
  - Confirm admin access and exhaustively test lead flows

- Post-Deployment Validation
  - Confirm data pipelines and cadence are functioning
  - Validate lead creation, enrichment, and export endpoints
  - Check governance dashboards for compliance metrics

- Rollback Plan
  - If issues arise, rollback to the previous production commit/branch
  - Disable new features via feature flags if applicable
  - Restore previous migrations and data if needed
