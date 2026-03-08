#!/usr/bin/env bash
set -euo pipefail
echo "Verifying Phase 3 setup prerequisites..."
REQUIRED=( NODE npm GOOG.. )
echo "Node version: $(node -v)"
command -v npm >/dev/null 2>&1 || { echo >&2 "npm is required"; exit 1; }
command -v node >/dev/null 2>&1 || { echo >&2 "node is required"; exit 1; }
echo "Environment checks:"
REQUIRED_VARS=(ADMIN_PASSWORD ADMIN_JWT_SECRET NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY GOOGLE_PLACES_API_KEY YELP_API_KEY VERCEL_TOKEN VERCEL_ORG_ID VERCEL_PROJECT_ID STAGING_BASE_URL) 
for v in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!v:-}" ]; then
    echo "Missing env var: $v"
  else
    echo "OK: $v=${!v}"
  fi
done
echo "Phase 3 setup verification completed."
