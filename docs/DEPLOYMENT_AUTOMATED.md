# Automated Deployment Guide

## Quick Start (Recommended)

### Option 1: Deploy to Vercel (30 seconds)

1. **Connect GitHub to Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Configure Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.example`

3. **Auto-deploy on push:**
   - Any push to `main` automatically deploys to production
   - Any push to `staging` deploys to staging environment

### Option 2: Docker Deployment (2 minutes)

```bash
# Build
docker build -t leadgen:latest .

# Run locally
docker run -p 3000:3000 \
  -e ADMIN_PHASE7_JWT_SECRET=your-secret \
  leadgen:latest

# Deploy to Docker registry
docker push your-registry/leadgen:latest
```

### Option 3: AWS Lambda (Cold Start <2s)

1. **Install Serverless Framework:**
   ```bash
   npm install -g serverless
   serverless config credentials --provider aws
   ```

2. **Deploy:**
   ```bash
   serverless deploy
   ```

3. **Logs:**
   ```bash
   serverless logs -f next
   ```

---

## CI/CD Pipeline

### GitHub Actions Workflow

The platform includes automated CI/CD via `.github/workflows/main.yml`:

```yaml
name: Build & Deploy
on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main, staging]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Setup CI/CD Secrets

1. **Go to GitHub Settings → Secrets and Variables → Actions**

2. **Add these secrets:**
   - `VERCEL_TOKEN` - From Vercel account settings
   - `VERCEL_ORG_ID` - Your Vercel organization ID
   - `VERCEL_PROJECT_ID` - Your project ID
   - `SUPABASE_URL` - Database URL
   - `SUPABASE_ANON_KEY` - Public key
   - `SUPABASE_SERVICE_ROLE_KEY` - Service key
   - `ADMIN_PHASE7_JWT_SECRET` - JWT secret (min 32 chars)

3. **Verify Workflow:**
   ```bash
   git push
   # Check GitHub Actions tab for build status
   ```

---

## Environment Configuration

### Development (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
SUPABASE_URL=http://localhost:54321
RATE_LIMIT_ENABLED=false
ENABLE_AI_SCORING=true
```

### Staging (.env.staging)
```bash
NEXT_PUBLIC_API_URL=https://staging.yourdomain.com
SUPABASE_URL=https://your-project.supabase.co
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=500
```

### Production (.env.production)
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
SUPABASE_URL=https://your-project.supabase.co
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=100
ENABLE_AUDIT_LOGGING=true
```

---

## Monitoring & Health Checks

### Health Check Endpoint
```bash
GET /api/phase12/health
```

Response indicates:
- ✅ Database connectivity
- ✅ External API status
- ✅ Cache availability
- ✅ Message queue status

### Automated Monitoring

1. **Datadog Integration:**
   ```bash
   echo "DATADOG_API_KEY=xxx" >> .env.local
   ```

2. **Sentry Error Tracking:**
   ```bash
   echo "SENTRY_DSN=xxx" >> .env.local
   ```

3. **PagerDuty Alerts:**
   - Critical errors → Page on-call
   - Warning errors → Slack notification

---

## Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] JWT secret generated (min 32 chars)
- [ ] SSL/TLS certificate valid
- [ ] Rate limiting enabled in production
- [ ] Audit logging enabled
- [ ] Monitoring tools connected
- [ ] Backup strategy in place
- [ ] Disaster recovery plan documented
- [ ] Security scan completed

---

## Rollback Procedure

### Vercel
```bash
vercel --prod --scope=your-org
# Or use Vercel dashboard to revert to previous deployment
```

### Docker
```bash
docker ps
docker kill <container-id>
docker run -p 3000:3000 leadgen:previous
```

### AWS Lambda
```bash
serverless deploy function -f next --stage prod
```

---

## Performance Optimization

### CDN Caching
- Static assets: 1 year (immutable)
- HTML pages: 5 minutes
- API responses: Vary by endpoint

### Database Optimization
- Connection pooling enabled
- Query optimization via indexes
- Automated backups every 6 hours

### API Rate Limiting
- Requests: 100/minute per token
- Burst: Up to 200 requests
- Throttle response: 429 Too Many Requests

---

## Security Hardening

### HTTPS/TLS
- Enforce TLS 1.2+
- Automatic certificate renewal
- HSTS headers enabled

### API Security
- CORS properly configured
- CSRF protection enabled
- Input validation on all endpoints
- SQL injection prevention

### Data Protection
- Encryption at rest (AES-256)
- Encryption in transit (TLS)
- Audit logging of all access
- Regular security audits

---

## Support & Documentation

- **API Docs:** `/docs/API_DOCS_EXTENDED.md`
- **Architecture:** `/docs/ARCHITECTURE.md`
- **Troubleshooting:** `/docs/TROUBLESHOOTING.md`
- **FAQ:** `/docs/FAQ.md`

