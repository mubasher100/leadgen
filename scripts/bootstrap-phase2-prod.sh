#!/usr/bin/env bash
set -e

echo "Phase 2 prod bootstrap: create staging/prod resources, run migrations, seed data, and validate" 
echo "1) Create/attach a production Supabase project; ensure separate DB/schema from Phase 1" 
echo "2) Run required Phase 2 migrations against the production DB" 
echo "3) Configure enrichment providers and licenses; wire up API endpoints" 
echo "4) Enable Supabase Auth RBAC for admin users" 
echo "5) Configure Vercel production deployment, set env vars for Phase 2" 
echo "6) Run Playwright tests in CI for production and monitor" 
echo "7) Prepare rollback plan (revert to previous release or switch flag)" 
