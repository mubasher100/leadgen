# Phase 7 Environment Configuration Template

## STAGING ENVIRONMENT (.env.staging)

# API Configuration
NEXT_PUBLIC_API_URL=https://staging.example.com
STAGING_BASE_URL=https://staging.example.com

# Phase 7 JWT Secret (used for signing/verifying Phase 7 tokens)
# Generate via: openssl rand -hex 32
ADMIN_PHASE7_JWT_SECRET=<your_staging_jwt_secret_here>

# Supabase Configuration (Database & Auth)
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_ANON_KEY=<your_supabase_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_supabase_service_role_key>

# Logging & Monitoring
LOG_LEVEL=debug
SENTRY_DSN=<optional_sentry_dsn_for_error_tracking>

# Feature Flags
PHASE7_ENABLED=true

---

## PRODUCTION ENVIRONMENT (.env.production)

# API Configuration
NEXT_PUBLIC_API_URL=https://api.example.com
STAGING_BASE_URL=https://api.example.com

# Phase 7 JWT Secret (MUST be different from staging!)
# Generate via: openssl rand -hex 32
ADMIN_PHASE7_JWT_SECRET=<your_production_jwt_secret_here>

# Supabase Configuration (Production Database & Auth)
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_ANON_KEY=<your_production_supabase_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_production_supabase_service_role_key>

# Logging & Monitoring
LOG_LEVEL=info
SENTRY_DSN=<production_sentry_dsn>

# Feature Flags
PHASE7_ENABLED=true

---

## How to Use

### 1. Generate JWT Secret
```bash
# Staging secret
openssl rand -hex 32 > ADMIN_PHASE7_JWT_SECRET_STAGING.txt

# Production secret (DIFFERENT!)
openssl rand -hex 32 > ADMIN_PHASE7_JWT_SECRET_PROD.txt
```

### 2. Set Environment Variables in CI/CD Platform

**GitHub Actions (Recommended):**
```bash
# Go to: Settings > Secrets and variables > Actions

# Add these secrets:
gh secret set ADMIN_PHASE7_JWT_SECRET_STAGING --body "$(cat ADMIN_PHASE7_JWT_SECRET_STAGING.txt)"
gh secret set ADMIN_PHASE7_JWT_SECRET_PRODUCTION --body "$(cat ADMIN_PHASE7_JWT_SECRET_PROD.txt)"
gh secret set SUPABASE_URL_STAGING --body "https://<project>.supabase.co"
gh secret set SUPABASE_ANON_KEY_STAGING --body "..."
# ... repeat for production

# Then reference in workflow:
env:
  ADMIN_PHASE7_JWT_SECRET: ${{ secrets.ADMIN_PHASE7_JWT_SECRET_STAGING }}
```

**Vercel/Other Platforms:**
- Go to Environment Variables settings
- Add each variable with appropriate environment (staging/production)
- Ensure sensitive values use the platform's secret management

### 3. Local Development
```bash
cp .env.example .env.local
# Edit .env.local with staging values for local testing
npm run dev
```

### 4. Verify Configuration
```bash
# Check that required variables are set
echo "API URL: $NEXT_PUBLIC_API_URL"
echo "JWT Secret set: $([ -z $ADMIN_PHASE7_JWT_SECRET ] && echo 'NOT SET' || echo 'SET')"

# Test token endpoint (requires running server)
curl -X GET http://localhost:3000/api/phase7/token
```

---

## Required Secrets Checklist

### Staging
- [ ] ADMIN_PHASE7_JWT_SECRET (32-byte hex)
- [ ] SUPABASE_URL
- [ ] SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] NEXT_PUBLIC_API_URL

### Production
- [ ] ADMIN_PHASE7_JWT_SECRET (DIFFERENT from staging)
- [ ] SUPABASE_URL
- [ ] SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] NEXT_PUBLIC_API_URL

---

## Security Notes

1. **Never commit .env files** – Use .gitignore (already configured)
2. **Rotate secrets quarterly** – Regenerate JWT secrets every 3 months
3. **Use different secrets per environment** – Staging and production must have different JWT secrets
4. **Restrict access** – Only approved engineers can view/update production secrets
5. **Audit logs** – Enable secret access logging in your CI/CD platform
6. **Rollback ready** – Keep previous JWT secret for token rotation during emergency

---

## Troubleshooting

### "401 Unauthorized" on all Phase 7 endpoints
- Check that ADMIN_PHASE7_JWT_SECRET is set and matches the deployed server
- Verify JWT secret is not truncated or corrupted
- Test locally: `curl http://localhost:3000/api/phase7/token`

### Token generation works but enrichment fails
- Check that SUPABASE_URL and service role key are correct
- Verify database tables exist: `SELECT * FROM information_schema.tables WHERE table_name LIKE 'phase7%';`
- Check logs for database connection errors

### Tests fail in CI but pass locally
- Ensure CI environment variables are set (GitHub Secrets)
- Compare CI environment with local .env.local
- Run CI job with debug logging: `LOG_LEVEL=debug`

---

**Last Updated**: 2026-03-08
**Phase 7 Readiness**: 🟢 Ready for staging deployment
