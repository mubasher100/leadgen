#!/usr/bin/env bash
set -euo pipefail
echo "Phase 6 go-live preflight checks"
echo "- Check required env vars: ADMIN_PASSWORD, ADMIN_JWT_SECRET, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, GOOGLE_PLACES_API_KEY, YELP_API_KEY"
echo "- Check staging URL is reachable? (ping)"
echo "- Basic health checks: /api/phase6/health and /api/phase6/health_full if available"
echo "- Start a quick admin login flow to ensure cookies/token issuance works"
echo "- If any of the above fail, halt and report"
exit 0
