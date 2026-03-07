# leadgen

Phase 1 (Digital Marketing): Phase 1 patches for DM lead generation
- Data sources: Google Places API, Yelp Fusion (licensed access)
- Phase 1 DB: Leads table with discovery fields (via scripts/migrate-leads-phase1.sql)
- API: /api/leads, /api/leads/discover, /api/leads/export
- Frontend: LeadMultiStepForm.tsx (Phase 1), AdminLeadTable.tsx (skeleton)
- Discovery: ingestor skeletons (google_places_ingestor.ts, Yelp_ingestor.ts)
- Admin/auth: simple password guard (upgrade path noted)
- Email: SendGrid/Mailgun integration plan (config via env vars)
- CSV export: supported in Phase 1
- Admin UI: Added /admin/download for CSV export and /admin seed for populating test data
