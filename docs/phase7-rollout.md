# Phase 7 Production Rollout & Rollback Runbook

## Overview

Phase 7 is a comprehensive all-in-one release that consolidates RBAC scaffolding, enrichment (Phase 7 enricher), analytics, governance, and bootstrap into a single cohesive production rollout. This document provides step-by-step procedures for staging validation, production deployment, and rollback.

## Objective

- Deploy Phase 7 all-in-one to production with RBAC-guarded endpoints
- Validate all Phase 7 endpoints (token, health, enrichment, analytics, governance) in staging
- Establish confidence in token-based auth and role-based access control
- Provide auditable rollback procedures if issues arise

## Preconditions

**Before proceeding to production:**

1. ✅ Phase 7 all-in-one PR merged to main
   - RBAC scaffolding (lib/auth7.ts, lib/auth7_rbac.ts)
   - Phase 7 API endpoints (token, health, enrich-lead, analytics, governance)
   - Phase 7 enricher (ingestors/phase7_enricher.ts)
   - CI/CD workflow with Playwright tests (phase7.yml)
   - Bootstrap script (scripts/bootstrap-phase7-prod.sh)

2. ✅ Staging validation complete
   - All Playwright end-to-end tests pass in CI
   - Manual smoke tests pass for all Phase 7 endpoints

3. ✅ Secrets and environment variables configured
   - ADMIN_PHASE7_JWT_SECRET set in staging and production
   - SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY configured
   - API base URLs configured (NEXT_PUBLIC_API_URL, etc.)

4. ✅ Database migrations completed
   - All necessary tables and schemas in place for Phase 7 features
   - Audit tables ready for governance logging

## Staging Validation Checklist

### 1. Verify Phase 7 CI Workflow (5 min)

```bash
# Check that the phase7.yml workflow exists and is properly configured
git show HEAD:.github/workflows/phase7.yml | grep -A 10 "Install Playwright"

# Verify Playwright browsers are installed in CI environment
# (This is automatic in CI via `npx playwright install` step)
```

**Expected**: CI workflow includes browser install step and runs all Phase 7 tests.

### 2. Run Staging Smoke Tests (15 min)

**Test Token Endpoint:**
```bash
curl -X GET http://staging.example.com/api/phase7/token
# Expected response: { "token": "eyJ..." }
```

**Test Health Endpoint:**
```bash
TOKEN=$(curl -s http://staging.example.com/api/phase7/token | jq -r '.token')
curl -X GET http://staging.example.com/api/phase7/health \
  -H "Authorization: Bearer $TOKEN"
# Expected response: { "ok": true, "version": "7.0.0" }
```

**Test Enrichment Endpoint:**
```bash
TOKEN=$(curl -s http://staging.example.com/api/phase7/token | jq -r '.token')
curl -X POST http://staging.example.com/api/phase7/enrich-lead \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id": "test-lead-123"}'
# Expected response: { "enrichment": { "phase7": true, "domain": "...", ... } }
```

**Test Analytics Endpoint:**
```bash
TOKEN=$(curl -s http://staging.example.com/api/phase7/token | jq -r '.token')
curl -X GET http://staging.example.com/api/phase7/analytics \
  -H "Authorization: Bearer $TOKEN"
# Expected response: { "totalLeads": N, "enrichedCount": M, ... }
```

**Test Governance Endpoint:**
```bash
TOKEN=$(curl -s http://staging.example.com/api/phase7/token | jq -r '.token')
curl -X GET http://staging.example.com/api/phase7/governance \
  -H "Authorization: Bearer $TOKEN"
# Expected response: { "policyStatus": "active", "auditLog": [...], ... }
```

### 3. Verify RBAC Guards (10 min)

**Test unauthorized access (no token):**
```bash
curl -X GET http://staging.example.com/api/phase7/health
# Expected response: 401 Unauthorized
```

**Test with invalid token:**
```bash
curl -X GET http://staging.example.com/api/phase7/health \
  -H "Authorization: Bearer invalid_token_xyz"
# Expected response: 401 Unauthorized or 403 Forbidden
```

### 4. Run Playwright End-to-End Tests in Staging (20 min)

```bash
# Trigger Phase 7 CI workflow in staging via workflow_dispatch
gh workflow run phase7.yml \
  -f run_type=staging \
  -r main

# Wait for workflow to complete and verify all tests pass
# Expected: 24/24 tests passing (Phase 7 + Phase 1-6 regression tests)
```

### 5. Validate UI Navigation (5 min)

- Navigate to http://staging.example.com/admin/phase7
- Verify Phase 7 hub page loads with admin dashboard
- Confirm token, analytics, governance sections are accessible

**Sign-off**: Once all staging smoke tests pass, document results and proceed to production deployment.

---

## Production Deployment Steps

### 1. Pre-Deployment Verification (10 min)

**Checklist:**
- [ ] Phase 7 all-in-one PR merged to main
- [ ] All staging smoke tests pass
- [ ] Production secrets configured (ADMIN_PHASE7_JWT_SECRET, etc.)
- [ ] Database migrations completed in production
- [ ] Rollback plan reviewed and ready
- [ ] Team notified of deployment window

### 2. Bootstrap Production Environment (10 min)

```bash
# Run Phase 7 production bootstrap script
./scripts/bootstrap-phase7-prod.sh

# Expected output:
#   - Environment variables loaded
#   - JWT secrets validated
#   - Phase 7 tables created (if not exists)
#   - Audit logging initialized
#   - Bootstrap complete: Phase 7 ready for deployment
```

**Or via CI/CD:**
```bash
# Trigger production deployment via CI/CD
gh workflow run phase7.yml \
  -f run_type=production \
  -r main

# Monitor deployment logs
gh run watch <RUN_ID>
```

### 3. Deploy to Production (5-15 min)

**Via Docker / Vercel / Cloud Platform:**
```bash
# Example: Vercel
vercel --prod

# Example: Docker
docker build -t leadgen-phase7:latest .
docker push registry.example.com/leadgen-phase7:latest
kubectl set image deployment/leadgen leadgen=registry.example.com/leadgen-phase7:latest

# Verify deployment
kubectl rollout status deployment/leadgen
```

### 4. Post-Deployment Validation (15 min)

**Run Playwright Tests Against Production:**
```bash
# Set environment to production
export STAGING_BASE_URL=https://prod.example.com

# Run full test suite
npm test

# Expected: All tests pass, including Phase 7 endpoints
```

**Manual Smoke Tests (Production):**

(Repeat the staging smoke tests from section "Staging Validation" but against production URL)

```bash
# Example: Token endpoint
curl -X GET https://prod.example.com/api/phase7/token
```

**Check Production Logs:**
```bash
# Monitor logs for errors
kubectl logs -f deployment/leadgen | grep -i "phase7\|error"

# Check for any RBAC authentication failures
kubectl logs -f deployment/leadgen | grep -i "401\|403\|unauthorized"
```

### 5. Verify Business Metrics (10 min)

- [ ] Phase 7 health check returns OK
- [ ] Token generation working (no auth errors in logs)
- [ ] Enrichment endpoint responding with valid data
- [ ] Analytics endpoint showing non-zero data (if applicable)
- [ ] Governance endpoint accessible and audit logs appearing
- [ ] No spike in error rates compared to Phase 6

### 6. Final Sign-Off (5 min)

- [ ] All smoke tests pass
- [ ] No critical errors in logs
- [ ] Business metrics look healthy
- [ ] Team validates functionality in production UI
- **Deployment Status: ✅ SUCCESSFUL**

---

## Rollback Procedures

### Scenario A: Immediate Rollback (First 30 minutes)

**If critical issues detected immediately after deployment:**

#### Via Git Revert (Fastest)
```bash
# Identify the Phase 7 merge commit
git log --oneline | head -20

# Revert Phase 7 commit
git revert <PHASE7_MERGE_COMMIT> -m 1
git push origin main

# Trigger redeployment
# (CI/CD will automatically redeploy on push to main)
```

**Expected outcome:** Production rolls back to Phase 6 within 2-5 minutes.

#### Via Feature Flag (If Available)
```bash
# Set feature flag to disable Phase 7 endpoints
export PHASE7_ENABLED=false
# Redeploy or restart services
```

### Scenario B: Delayed Rollback (30 min - 24 hours)

**If issues discovered after initial validation:**

#### Step 1: Create Hotfix Branch
```bash
# Create hotfix from production/main
git checkout -b hotfix/phase7-revert
git revert <PHASE7_MERGE_COMMIT> -m 1
git commit -m "hotfix: revert Phase 7 due to [issue description]"
git push origin hotfix/phase7-revert
```

#### Step 2: Create Rollback PR
```bash
# Create PR from hotfix branch to main
# Title: "hotfix: rollback Phase 7 due to [issue]"
# Description: Include issue details, logs, and steps taken
gh pr create --head hotfix/phase7-revert --base main \
  --title "hotfix: rollback Phase 7" \
  --body "..."
```

#### Step 3: Merge and Redeploy
```bash
# Merge hotfix PR
gh pr merge <PR_NUMBER> --merge

# Redeploy to production (automatic via CI/CD on main merge)
```

### Scenario C: Database Rollback (If Data Issues)

**If Phase 7 caused data corruption or migration issues:**

```bash
# Restore from pre-deployment backup
./scripts/restore-database-backup.sh --date <DEPLOYMENT_DATE> --env production

# Verify data integrity
SELECT COUNT(*) FROM audit_logs WHERE phase = 'phase7';

# Confirm RBAC tables are in correct state
SELECT * FROM rbac_roles LIMIT 5;

# Redeploy with hotfix applied
```

---

## Troubleshooting Guide

### Issue: "401 Unauthorized" on all Phase 7 endpoints

**Likely Cause:** JWT secret not configured correctly

**Fix:**
```bash
# Verify ADMIN_PHASE7_JWT_SECRET is set in production
kubectl get secret/leadgen-secrets -o yaml | grep ADMIN_PHASE7_JWT_SECRET

# If missing, add it:
kubectl set env deployment/leadgen ADMIN_PHASE7_JWT_SECRET=<SECRET_VALUE>

# Restart pods
kubectl rollout restart deployment/leadgen
```

### Issue: "Token endpoint returns a token, but enrichment fails with 403"

**Likely Cause:** RBAC role verification failing

**Fix:**
```bash
# Check RBAC verification logic in logs
kubectl logs -f deployment/leadgen | grep -i "rbac\|role"

# Verify token payload includes required role claims
# Check lib/auth7_rbac.ts for role extraction logic

# If token format is wrong, revert to Phase 6
git revert <PHASE7_MERGE_COMMIT> -m 1
```

### Issue: Health endpoint works but analytics/governance endpoints fail

**Likely Cause:** Database connection or schema issue for analytics/governance tables

**Fix:**
```bash
# Check if analytics_events and governance_logs tables exist
psql -c "SELECT * FROM information_schema.tables WHERE table_name LIKE 'analytics%' OR table_name LIKE 'governance%';"

# If missing, run migrations
npm run db:migrate -- --env production

# Restart application
kubectl rollout restart deployment/leadgen
```

### Issue: CI tests pass but production tests fail

**Likely Cause:** Environment variable or configuration mismatch

**Fix:**
```bash
# Verify production environment matches staging
export STAGING_BASE_URL=https://prod.example.com
npm test

# Compare production config with staging
kubectl get configmap leadgen-config -o yaml

# If config differs, update production ConfigMap and restart
kubectl apply -f config/production-config.yaml
kubectl rollout restart deployment/leadgen
```

---

## Monitoring & Post-Deployment

### Key Metrics to Watch (First 24 hours)

- **Token Generation Rate:** Should remain stable (~1-2 tokens/min if load is stable)
- **Enrichment Success Rate:** Target >95% for Phase 7 enriched leads
- **Auth Error Rate:** Should be near 0% for valid tokens; <1% for invalid attempts
- **API Response Times:** Token (~50ms), Health (~100ms), Enrichment (~500-2000ms)
- **Error Logs:** No unexpected 5xx errors; only expected 401/403 for auth failures

### Dashboards & Alerts

```bash
# Monitor Phase 7 logs in real-time
kubectl logs -f deployment/leadgen --tail=100 | grep "phase7\|token\|rbac"

# Set up alerts for:
# - Phase 7 endpoint errors (500)
# - Auth failures (401, 403)
# - Enrichment timeout
# - Database connection pool exhaustion
```

### Escalation Contact

If issues arise that can't be resolved via troubleshooting:

1. **Immediate:** Trigger rollback (Scenario A: Git Revert)
2. **Notify:** Engineering lead and product owner
3. **Document:** Create incident ticket with timestamps, logs, and steps taken
4. **Post-Mortem:** After rollback, review root cause and design improvements

---

## Sign-Off & Documentation

### Deployment Record

```
Date: [YYYY-MM-DD]
Time: [HH:MM UTC]
Deployed by: [Name]
Approver: [Name]
Status: ✅ SUCCESSFUL / ⚠️ PARTIAL / ❌ ROLLED BACK

Pre-Deployment Checks:
- [ ] Phase 7 merged
- [ ] Staging tests pass
- [ ] Secrets configured
- [ ] Migrations ready

Post-Deployment Validation:
- [ ] Health check: OK
- [ ] Token generation: OK
- [ ] Enrichment: OK
- [ ] Analytics: OK
- [ ] Governance: OK
- [ ] UI navigation: OK

Issues Encountered: [None / List any issues]
Resolution: [If rollback: date/time; if hotfix: PR number]
Notes: [Additional context]
```

### Team Communication

Template for deployment notification:

```
Subject: Phase 7 Production Deployment Complete

Phase 7 all-in-one has been successfully deployed to production at [TIME UTC].

Endpoints now live:
- GET  /api/phase7/token           – Generate JWT tokens
- GET  /api/phase7/health          – Health check (requires token)
- POST /api/phase7/enrich-lead     – Enrichment API (requires token)
- GET  /api/phase7/analytics       – Analytics dashboard (requires token)
- GET  /api/phase7/governance      – Governance status (requires token)
- GET  /admin/phase7               – Phase 7 admin hub UI

All endpoints require bearer token auth. Tokens generated via /api/phase7/token.

Monitoring: [Link to dashboards]
Status: All metrics healthy
Next review: [Date + time]
Rollback contact: [Name]
```

---

## Appendix

### Phase 7 Endpoint Reference

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| /api/phase7/token | GET | None | Generate JWT token for Phase 7 API access |
| /api/phase7/health | GET | Bearer Token | Health check; returns OK if service healthy |
| /api/phase7/enrich-lead | POST | Bearer Token | Enrich lead data via Phase 7 enricher |
| /api/phase7/analytics | GET | Bearer Token | Fetch analytics metrics for Phase 7 |
| /api/phase7/governance | GET | Bearer Token | Fetch governance and audit log status |
| /admin/phase7 | GET | Session Auth | Admin UI hub for Phase 7 features |

### File & Script Reference

| File | Purpose |
|------|---------|
| lib/auth7.ts | JWT token generation & verification for Phase 7 |
| lib/auth7_rbac.ts | RBAC role verification for Phase 7 token claims |
| pages/api/phase7/*.ts | Phase 7 API endpoints |
| ingestors/phase7_enricher.ts | Phase 7 enrichment logic |
| scripts/bootstrap-phase7-prod.sh | Production environment bootstrap |
| .github/workflows/phase7.yml | CI/CD workflow for tests & deployment |
| tests/e2e/phase7*.spec.ts | End-to-end Playwright tests |

### Emergency Contacts

- **On-call Engineer:** [Name + phone]
- **Engineering Lead:** [Name + email]
- **Product Owner:** [Name + email]
- **DevOps:** [Name + email]

---

**Document Version:** 1.0  
**Last Updated:** 2026-03-08  
**Next Review:** Post-deployment (24 hours after go-live)
