# LeadGen Deployment Guide

**Status**: Production Ready  
**Date**: 2026-03-08  
**Version**: 1.0.0

---

## Quick Deployment Checklist

- [ ] Code reviewed and tested locally
- [ ] Environment variables configured
- [ ] Database backups in place
- [ ] SSL certificates ready
- [ ] Secrets configured in CI/CD
- [ ] Staging validation complete
- [ ] Team notified of deployment window
- [ ] Monitoring and alerts configured
- [ ] Rollback plan ready

---

## Deployment Environments

### Development
- Local machine or development server
- No SSL required
- Can use `localhost:3000`

### Staging
- Pre-production environment
- Full TLS/SSL
- Run integration tests
- Validate all endpoints

### Production
- Live customer environment
- Full TLS/SSL (Let's Encrypt)
- Real secrets
- Monitoring and alerting enabled

---

## Option 1: Vercel (Recommended)

### Step 1: Connect Repository

```bash
# 1. Go to vercel.com
# 2. Click "New Project"
# 3. Select your GitHub repository (mubasher100/leadgen)
# 4. Click "Import"
```

### Step 2: Configure Environment Variables

In Vercel dashboard:

```
Settings > Environment Variables

Production:
  SUPABASE_URL=https://your-project.supabase.co
  SUPABASE_ANON_KEY=<key>
  SUPABASE_SERVICE_ROLE_KEY=<key>
  ADMIN_PHASE7_JWT_SECRET=<openssl rand -hex 32>
  NEXT_PUBLIC_API_URL=https://your-domain.com
  SENDGRID_API_KEY=<key>
  [... other keys ...]

Staging:
  SUPABASE_URL=https://your-staging-project.supabase.co
  SUPABASE_ANON_KEY=<key>
  [... with staging keys ...]
```

### Step 3: Deploy

```bash
# Vercel automatically deploys on git push
git push origin main

# Or manually deploy:
vercel --prod
```

### Step 4: Verify

```bash
# Check deployment status
vercel list

# Get deployment URL
vercel --prod
```

---

## Option 2: Docker + Kubernetes

### Step 1: Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Install Playwright
RUN npx playwright install

# Copy code
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "start"]
```

### Step 2: Build Image

```bash
docker build -t leadgen:1.0.0 .
docker tag leadgen:1.0.0 registry.example.com/leadgen:1.0.0
docker push registry.example.com/leadgen:1.0.0
```

### Step 3: Deploy to Kubernetes

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: leadgen
spec:
  replicas: 3
  selector:
    matchLabels:
      app: leadgen
  template:
    metadata:
      labels:
        app: leadgen
    spec:
      containers:
      - name: leadgen
        image: registry.example.com/leadgen:1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: SUPABASE_URL
          valueFrom:
            secretKeyRef:
              name: leadgen-secrets
              key: SUPABASE_URL
        # ... other env vars
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/phase12/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/phase12/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: leadgen-service
spec:
  selector:
    app: leadgen
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

### Step 4: Deploy

```bash
kubectl apply -f deployment.yaml
kubectl rollout status deployment/leadgen
```

---

## Option 3: AWS Lambda + API Gateway

### Step 1: Build for Serverless

```bash
npm install --save-dev serverless-http
```

### Step 2: Configure Serverless

```yaml
# serverless.yml
service: leadgen

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  environment:
    SUPABASE_URL: ${env:SUPABASE_URL}
    ADMIN_PHASE7_JWT_SECRET: ${env:ADMIN_PHASE7_JWT_SECRET}

functions:
  api:
    handler: server.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
      - http:
          path: /
          method: ANY
```

### Step 3: Deploy

```bash
serverless deploy
```

---

## Pre-Deployment Steps

### 1. Local Testing

```bash
# Install dependencies
npm install
npx playwright install

# Run tests
npm test

# Run smoke tests
./scripts/phase7-smoke-tests.sh http://localhost:3000
```

### 2. Database Migrations

```bash
# Create backup
./scripts/backup-database.sh staging

# Run migrations
npm run db:migrate -- --env staging
```

### 3. Secrets Configuration

```bash
# Generate JWT secrets
STAGING_SECRET=$(openssl rand -hex 32)
PROD_SECRET=$(openssl rand -hex 32)

# Save for use in CI/CD platform
echo "STAGING: $STAGING_SECRET"
echo "PROD: $PROD_SECRET"
```

### 4. Environment Setup

```bash
# Copy template
cp .env.example .env.production

# Fill in production values
nano .env.production
```

---

## Staging Validation

### Deploy to Staging

```bash
# Option 1: Vercel
vercel --prod  # (from staging project)

# Option 2: Manual
git push origin main
# CI/CD automatically deploys to staging

# Option 3: Manual via Docker
docker run -p 3000:3000 \
  -e SUPABASE_URL=$STAGING_SUPABASE_URL \
  -e ADMIN_PHASE7_JWT_SECRET=$STAGING_SECRET \
  leadgen:staging
```

### Run Validation Tests

```bash
# Smoke tests
./scripts/phase7-smoke-tests.sh https://staging.leadgen.com --verbose

# Playwright tests
npm test -- --grep "phase7"

# Manual validation
TOKEN=$(curl -s https://staging.leadgen.com/api/phase7/token | jq -r '.token')
curl -H "Authorization: Bearer $TOKEN" https://staging.leadgen.com/api/phase7/health
```

### Monitor Staging

```bash
# View logs
docker logs -f leadgen-staging

# Check metrics
curl https://staging.leadgen.com/api/phase12/health | jq .

# Test all endpoints
./scripts/test-all-endpoints.sh https://staging.leadgen.com
```

### Sign-Off

- [ ] All tests passing in staging
- [ ] Health checks returning OK
- [ ] No errors in logs
- [ ] Team validates functionality
- [ ] Performance acceptable

---

## Production Deployment

### Step 1: Pre-Deployment

```bash
# 1. Create database backup
./scripts/backup-database.sh production

# 2. Tag code
git tag v1.0.0
git push origin v1.0.0

# 3. Verify all tests pass
npm test

# 4. Final code review
# Review all changes one more time
```

### Step 2: Bootstrap Production

```bash
# Run bootstrap script
./scripts/bootstrap-phase7-prod.sh production

# Expected output:
# ✓ Environment variables loaded
# ✓ JWT secrets validated
# ✓ Phase 7 tables created
# ✓ Bootstrap complete: Phase 7 ready for deployment
```

### Step 3: Deploy Code

#### Via Vercel

```bash
# Vercel auto-deploys on push to main
git push origin main
# Vercel builds and deploys automatically

# Or manually
vercel --prod --token $VERCEL_TOKEN
```

#### Via Docker/Kubernetes

```bash
# Build and push image
docker build -t leadgen:1.0.0 .
docker tag leadgen:1.0.0 registry.example.com/leadgen:1.0.0
docker push registry.example.com/leadgen:1.0.0

# Deploy
kubectl set image deployment/leadgen leadgen=registry.example.com/leadgen:1.0.0
kubectl rollout status deployment/leadgen
```

### Step 4: Post-Deployment Validation

```bash
# Run smoke tests
./scripts/phase7-smoke-tests.sh https://api.leadgen.com

# Check health
curl https://api.leadgen.com/api/phase12/health | jq .

# Verify analytics
TOKEN=$(curl -s https://api.leadgen.com/api/phase7/token | jq -r '.token')
curl -H "Authorization: Bearer $TOKEN" https://api.leadgen.com/api/phase8/analytics

# Monitor for errors
kubectl logs -f deployment/leadgen | grep -i error
```

### Step 5: Monitor (First 24 Hours)

**Watch these metrics:**

```bash
# Error rate (should be <1%)
curl https://api.leadgen.com/api/phase12/health | jq '.metrics.errorRate'

# Response time (should be <500ms)
curl https://api.leadgen.com/api/phase12/health | jq '.metrics.averageResponseTime'

# Uptime (should be >99%)
curl https://api.leadgen.com/api/phase12/health | jq '.metrics.uptime'

# Active connections
curl https://api.leadgen.com/api/phase12/health | jq '.metrics.activeConnections'
```

**Check logs every hour:**

```bash
# Production logs
tail -f /var/log/leadgen/production.log

# Error logs
grep ERROR /var/log/leadgen/production.log | tail -20

# Database logs
tail -f /var/log/postgresql/production.log
```

### Step 6: Final Sign-Off

After 24 hours of successful operation:

- [ ] All endpoints responding correctly
- [ ] Error rate <1%
- [ ] Response times normal
- [ ] No database errors
- [ ] Team confirms functionality
- [ ] Analytics showing data
- [ ] Logs clean

---

## Rollback Procedures

### Immediate Rollback (If Critical Issues)

```bash
# Option 1: Git revert (fastest)
git revert HEAD
git push origin main
# CI/CD auto-redeploys previous version

# Option 2: Vercel
vercel --prod --rollback

# Option 3: Kubernetes
kubectl rollout undo deployment/leadgen
```

### Partial Rollback (If Some Features Broken)

```bash
# Feature flag disable
export PHASE8_ENABLED=false
export PHASE9_ENABLED=false
# Restart application

# Or revert specific commits
git revert <commit-hash>
```

### Database Rollback

```bash
# Restore from backup
./scripts/restore-database-backup.sh production --date 2026-03-08

# Verify data integrity
./scripts/verify-database.sh

# Redeploy code
git push origin main
```

---

## Monitoring & Observability

### Setup Monitoring

```bash
# Sentry for error tracking
SENTRY_DSN=https://key@sentry.io/project

# DataDog for metrics
DD_API_KEY=your_datadog_key

# CloudWatch for AWS
# Automatically enabled on Lambda/ECS
```

### Key Dashboards

- **System Health**: `/api/phase12/health`
- **Analytics**: `/api/phase8/analytics`
- **Error Logs**: CloudWatch / Sentry
- **Performance**: DataDog / NewRelic

### Alerts to Configure

- High error rate (>5% over 5 min)
- High response time (>1000ms avg)
- Database connection pool exhausted
- Memory usage >80%
- Disk space <10%

---

## Maintenance

### Weekly Tasks

```bash
# Check logs for errors
grep ERROR /var/log/leadgen/*.log | wc -l

# Verify health checks
curl https://api.leadgen.com/api/phase12/health

# Check backup status
ls -lh backups/
```

### Monthly Tasks

```bash
# Rotate secrets
./scripts/rotate-secrets.sh production

# Update dependencies
npm update
npm audit

# Review audit logs
curl -H "Authorization: Bearer $TOKEN" \
  https://api.leadgen.com/api/phase10/security/audit-logs | jq '.' | tail -100
```

### Quarterly Tasks

```bash
# Full security audit
./scripts/security-audit.sh

# Performance optimization
npm run analyze

# Data cleanup
./scripts/cleanup-old-data.sh --days 365
```

---

## Troubleshooting

### Deployment Failed

```bash
# Check logs
docker logs <container-id>
kubectl logs <pod-name>

# Check environment variables
echo $ADMIN_PHASE7_JWT_SECRET
echo $SUPABASE_URL

# Test connectivity
psql $SUPABASE_URL -c "SELECT 1"
```

### Health Check Failing

```bash
# Test endpoint directly
curl http://localhost:3000/api/phase12/health

# Check database
psql $SUPABASE_URL -c "SELECT COUNT(*) FROM leads"

# Check Redis/Cache
redis-cli ping
```

### High Error Rate

```bash
# View errors
tail -f logs/error.log | grep -i error

# Check rate limiting
curl -H "X-RateLimit-Limit: 1" http://localhost:3000/api/leads

# Review audit logs
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/phase10/security/audit-logs
```

---

## Support

- **Issues**: GitHub Issues
- **Documentation**: See `/docs`
- **Email**: support@leadgen.com
- **Slack**: #deployments channel

---

**Last Updated**: 2026-03-08  
**Version**: 1.0.0
