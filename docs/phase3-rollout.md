Phase 3 Rollout Plan (RBAC, enrichment, analytics)

- Overview: finalize admin RBAC, production-grade enrichment, and analytics.
- Prereqs: production-grade auth, enrichment providers licenses, and CI/CD hooks configured.
- Patch plan: a single, all-in-one Phase 3 patch with admin RBAC, Phase 3 enrichment endpoints, analytics enhancements, and a bootstrap script.
- Testing: Playwright tests for Phase 3 admin paths, enrich endpoint, and analytics pages.
- Rollout: staging → prod with feature flags; ensure rollback plan is defined.
