Deployment Guide (Vercel + Supabase)
- Prereqs:
  - GitHub repo with Phase 1 DM scaffold on branch feat/phase1-dm (or main)
  - Supabase project created with a PostgreSQL database
- Local development:
  1. Install dependencies: npm install
 2. Create a .env.local with:
     NEXT_PUBLIC_SUPABASE_URL="<your-supabase-url>"
     NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon-key>"
     ADMIN_PASSWORD="<strong-password>"
     SENDGRID_API_KEY="<sendgrid-key>" OR MAILGUN_API_KEY="<mailgun-key>"
     ADMIN_EMAIL="<owner-email>"
  3. Run migrations (from repo root): psql -h <host> -d <db> -f scripts/migrate-leads-phase1.sql
  4. Start dev server: npm run dev
- Supabase setup:
  - Create a new project, grab the URL and anon key, add to env vars
  - Paste the SQL from scripts/migrate-leads-phase1.sql into the database to create the leads table
- Production:
  - On Vercel, set environment variables for the same keys
  - Ensure the admin password is set via ADMIN_PASSWORD and read by the login API
  - Optional: configure SendGrid/Mailgun in production for lead notifications

Notes
- This is Phase 1 deployment guidance; Phase 2 will introduce richer ingestion, enrichment, and analytics.
- This is Phase 1 deployment guidance; Phase 2 will introduce richer ingestion, enrichment, and analytics.
- The Phase 2 guide is in docs/PHASE2.md (Phase 2 plan and milestones).
- This is Phase 1 deployment guidance; Phase 2 will introduce richer ingestion, enrichment, and analytics.
- The Phase 2 guide is in docs/PHASE2.md (Phase 2 plan and milestones).
- Admin UI: Basic protected admin route on /admin with a simple login flow; consider upgrading to Supabase Auth later.
- Ingestion cadence: Configure a cron/CI job to run scripts/ingestCadence.js on a schedule; ensure API keys are secured.
- The Phase 2 plan doc is PHASE2.md; update as you implement.
- Add a verification checklist for deployment (DNS, TLS, env vars, etc.).
- Add admin export page (UI) and a dedicated download route under /admin/download.
- Ingestion cadence: Configure a cron/CI job to run scripts/ingestCadence.js on a schedule; ensure API keys are secured.
- The Phase 2 plan doc is PHASE2.md; update as you implement.
- Add a verification checklist for deployment (DNS, TLS, env vars, etc.).
- Ingestion cadence: Configure a cron/CI job to run scripts/ingestCadence.js on a schedule; ensure API keys are secured.
