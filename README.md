# leadgen

Status: Phase 1 DM prototype complete and running

Phase 1 (Digital Marketing): Phase 1 patches for DM lead generation
- Data sources: Google Places API, Yelp Fusion (licensed access)
- Phase 1 DB: Leads table with discovery fields (via scripts/migrate-leads-phase1.sql)
- API: /api/leads, /api/leads/discover, /api/leads/export
- Frontend: LeadMultiStepForm.tsx (Phase 1), AdminLeadTable.tsx (skeleton)
- Discovery: ingestor skeletons (google_places_ingestor.ts, Yelp_ingestor.ts)
- Admin/auth: simple password guard (upgrade path noted)
- Email: SendGrid/Mailgun integration plan (config via env vars)
- CSV export: supported in Phase 1
- Admin: basic login, protected admin route, live lead list with a detail pane
- Cadence: Google Places and Yelp ingestion scaffolds with a cadence runner
- Phase 2: plan for enrichment providers and deeper analytics (see docs/PHASE2.md)

What you can do now
- Run locally: ensure environment vars and Postgres are ready, then start the dev server
- Open admin at /admin/login to verify login and dashboard
- Submit a lead via the Phase 1 DM form and confirm it appears in the admin list
- Run cadence locally: node scripts/ingestCadence.js
- Export leads: use the Admin UI or hit /api/leads/export

Next steps (Phase 2 and hardening)
- Replace the simple admin login with Supabase Auth and RBAC for multi-user access
- Flesh out the ingestion cadence with robust error handling, retries, and monitoring
- Add integration tests and end-to-end tests
- Provide a production bootstrap guide for Vercel + Supabase and a Phase 2 kickoff plan

PR status
- This branch feat/phase1-dm contains the final Phase 1 changes and is ready for a final PR merge to main.
- PR URL: https://github.com/mubasher100/leadgen/compare/main...feat/phase1-dm?expand=1
- Admin UI: Added /admin/download for CSV export and /admin seed for populating test data
