Phase 4 Governance and Compliance

Overview
- This phase focuses on data governance, privacy, retention, and compliance across the Lead Gen platform.

Key Areas
- Data minimization: collect only what is needed for outreach and analytics
- Opt-in/consent: explicit user consent flow for outreach data; implement in UI and backend
- Retention: define data retention windows and purge/anonymize as needed
- Data lineage: keep traceability of data from source to storage and processing
- Access control: RBAC and audit trails; plan for Supabase Auth RBAC
- Privacy policy: ensure policy reflects automated data collection and outreach

Phased plan
- Phase 4.1: Draft privacy policy and opt-in flow for leads via forms
- Phase 4.2: Implement opt-out and data deletion requests
- Phase 4.3: Add audit logs and basic data access controls
- Phase 4.4: Full RBAC with production-ready auth

Deliverables
- Governance policy doc
- Opt-in/out and deletion workflow
- Audit logs and simple RBAC scaffolding
- Compliance tests and checks
