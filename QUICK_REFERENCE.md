# ⚡ Quick Reference Card

**Keep this handy while developing phases on the other PC**

---

## Get Started (Copy & Paste)

```bash
git clone https://github.com/mubasher100/leadgen.git && cd leadgen && npm install && cp .env.example .env.local && npm run dev
```

---

## Current Status

| Metric | Value |
|--------|-------|
| Phases Complete | 18/18 ✅ |
| API Endpoints | 72 |
| Tests | 24+ passing |
| Documentation | 30+ files |
| Status | Production Ready |

---

## File Structure

```
pages/api/phase1-18/         # All endpoints
tests/e2e/                   # Tests
docs/                        # Documentation
Dockerfile                   # Docker config
docker-compose.yml           # Local dev
.github/workflows/main.yml   # CI/CD
```

---

## Add New Phase (Template)

```bash
# 1. Create directory
mkdir -p pages/api/phase19

# 2. Create endpoint (copy from phase18)
# pages/api/phase19/endpoint.ts

# 3. Add test
# tests/e2e/phase19.spec.ts

# 4. Test locally
npm test

# 5. Commit & push
git add .
git commit -m "feat: add phase 19 [name]"
git push
```

---

## Test Endpoints

```bash
# Start server
npm run dev

# In new terminal, get token
TOKEN=$(curl -s -X POST http://localhost:3000/api/phase7/token | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Test any endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/phase19/endpoint \
  -H "Content-Type: application/json" \
  -d '{"data":"test"}'
```

---

## Common Tasks

| Task | Command |
|------|---------|
| Start dev | `npm run dev` |
| Run tests | `npm test` |
| Build | `npm run build` |
| Pull updates | `git pull origin main` |
| View history | `git log --oneline` |
| Check status | `git status` |

---

## Endpoint Pattern

All endpoints follow this pattern:

```typescript
import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Check auth
  if (!req.headers.authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  // 2. Handle method
  if (req.method === 'POST') {
    const result = { ...req.body, created_at: new Date().toISOString() }
    return res.status(201).json(result)
  }
  
  if (req.method === 'GET') {
    return res.status(200).json({ items: [] })
  }
  
  // 3. Default error
  res.status(405).json({ error: 'Method not allowed' })
}
```

---

## Test Pattern

```typescript
import { test, expect } from '@playwright/test'

test('GET /api/phase19/endpoint requires auth', async ({ request }) => {
  const response = await request.get('http://localhost:3000/api/phase19/endpoint')
  expect(response.status()).toBe(401)
})

test('POST /api/phase19/endpoint creates item', async ({ request }) => {
  // Get token first (see CONTINUATION_GUIDE.md)
  const response = await request.post('http://localhost:3000/api/phase19/endpoint', {
    headers: { Authorization: `Bearer $TOKEN` },
    data: { test: 'data' }
  })
  expect(response.status()).toBe(201)
})
```

---

## GitHub Workflow

```bash
# 1. Pull latest
git pull origin main

# 2. Make changes
# ... edit files ...

# 3. Test
npm test

# 4. Check what changed
git status
git diff

# 5. Stage & commit
git add .
git commit -m "feat: add phase 19 [description]"

# 6. Push
git push origin main

# 7. Verify on GitHub
# https://github.com/mubasher100/leadgen
```

---

## Debugging

```bash
# View server logs (in dev terminal)
npm run dev

# Test endpoint directly
curl http://localhost:3000/api/phase7/health

# Check database (if running docker-compose)
# Open http://localhost:8080 in browser

# View git history
git log --oneline

# Undo last commit (before push)
git reset --soft HEAD~1
```

---

## Environment Variables

Key ones to set in `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
ADMIN_PHASE7_JWT_SECRET=your-secret-key-min-32-chars
ENABLE_AI_SCORING=true
ENABLE_WORKFLOW_AUTOMATION=true
```

See `.env.example` for full list.

---

## API Endpoint Format

**Path:** `/api/phase{N}/{endpoint}`

**Method:** GET, POST, PUT, DELETE

**Auth:** Bearer token in `Authorization` header

**Response:** JSON with status code

```json
{
  "data": { ... },
  "error": null,
  "timestamp": "2026-03-08T12:00:00Z"
}
```

---

## Documentation

| File | Purpose |
|------|---------|
| CONTINUATION_GUIDE.md | Full development guide |
| QUICK_REFERENCE.md | This file (quick lookup) |
| docs/API_DOCS_EXTENDED.md | All 72 endpoints |
| FINAL_COMPLETION_REPORT.md | Project summary |
| README_UPDATED.md | Platform overview |

---

## Repository

- **URL:** https://github.com/mubasher100/leadgen
- **Branch:** main
- **Status:** 🟢 Production Ready
- **Last Updated:** March 8, 2026

---

## Next Phase Ideas

- Phase 19: Personalization Engine
- Phase 20: Data ETL Pipeline
- Phase 21: Custom BI & Reporting
- Phase 22: Advanced User Management
- Phase 23: Multi-tenant Support

---

**Pro Tip:** Bookmark this file and CONTINUATION_GUIDE.md for quick reference!

