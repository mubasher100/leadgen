Phase 2 Rollout Plan (Enrichment, Analytics, RBAC)

Overview
- Build on Phase 1 foundation to deliver enrichment, additional data sources, analytics, and robust authentication.

Goals
- Add licensed enrichment providers and 2-4 new discovery sources.
- Create rich analytics dashboards for ROI, funnel metrics, lifecycle times, and source performance.
- Implement robust admin authentication and RBAC using Supabase Auth for multi-admin access.
- Provide production bootstrap scripts and a safe, monitored rollout plan.

Scope (Phase 2)
- Data sources: Chamber of Commerce, local business registries, 2–4 additional licensed providers.
- Enrichment: integrate enrichment providers (with consent and legal compliance).
- Analytics: dashboards and API endpoints to feed dashboards.
- Security: Active RBAC; admin activity auditing; rate limiting.
- Deployment: automated bootstrap scripts to create staging/production environments; migrations; env vars.
- Testing: Jest/Vitest unit tests; Playwright end-to-end tests for Phase 2.

Milestones
- M1: RBAC and Admin UI groundwork (auth, roles, admin routes)
- M2: Enrichment integration and source onboarding
- M3: Analytics dashboards and reporting APIs
- M4: Production bootstrap scripts and staging-to-production rollout plan
- M5: Testing strategy and rollout verification

Timeline (prototype)
- 2–4 weeks for Phase 2, depending on licenses and provider access

Risks & mitigations
- Licensing: ensure terms of use for enrichment providers and data sources
- Consent: ensure opt-in/out flows are in place for outreach data
- Data retention: define and enforce retention policies
- Rollback: ensure quick fallback if enrichment or analytics cause issues

Testing plan
- Unit tests for phase2 API endpoints
- Playwright tests covering Phase 2 flows: admin login, enrichment trigger, analytics page, cadence end-to-end
- End-to-end tests with staging data

Rollout plan
- Stage 0: local dev and manual testing
- Stage 1: staging environment with separate DB/schema
- Stage 2: production rollout with feature flags and phased enablement
- Rollback: revert to previous feature state if anomalies arise
- Milestone 6: Production rollout and monitoring for Phase 2 features
- Phase 2 success metrics:
-  - Lead enrichment completion rate
-  - Data source ROI by phase
-  - Admin RBAC adoption rate
-  Rollout: staging → production with feature flags and progressive rollout
- Rollback:
-  - Fast revert to previous commit or deploy a hotfix branch if anomalies arise

Operational readiness details (production):
- Ensure RBAC is enabled for admin users and activity is auditable
- Use a dedicated production Supabase project with isolated database/schema, and a staging project for testing
- Have a production bootstrap script to provisioning, migrations, and env vars
- Establish a health check endpoint and metrics dashboard (ingestion health, cadence throughput, export counts)
- Document rollback plan and runbooks for incident response
