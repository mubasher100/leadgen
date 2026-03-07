Bootstrap Guide: Supabase + Vercel for Phase 1 DM
- Prereqs: Node.js, Git, access to GitHub repo, a Supabase project
- 1) Create Supabase project and database
- 2) Create a new database schema based on scripts/migrate-leads-phase1.sql
- 3) Obtain API keys: anon/public keys, service role if needed
- 4) Add environment vars to your Vercel project:
-   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, GOOGLE_PLACES_API_KEY, YELP_API_KEY, SENDGRID_API_KEY or MAILGUN_API_KEY, ADMIN_PASSWORD
- 5) Deploy frontend to Vercel and set env vars there as well
- 6) Run cadence in a serverless cron or CI job to ingest discoveries on a schedule
- 7) Verify admin login and DM lead form flows in staging before production
