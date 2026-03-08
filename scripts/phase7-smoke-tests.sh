#!/bin/bash

# Phase 7 Smoke Test Script
# Validates all Phase 7 endpoints against a staging or production URL
# Usage: ./phase7-smoke-tests.sh <BASE_URL> [--verbose]

set -e

BASE_URL="${1:?Error: BASE_URL required. Usage: $0 <BASE_URL>}"
VERBOSE="${2:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functions
log_test() {
  echo -e "${BLUE}[TEST]${NC} $1"
}

log_pass() {
  echo -e "${GREEN}[PASS]${NC} $1"
  ((TESTS_PASSED++))
}

log_fail() {
  echo -e "${RED}[FAIL]${NC} $1"
  ((TESTS_FAILED++))
}

log_info() {
  echo -e "${YELLOW}[INFO]${NC} $1"
}

# Extract HTTP status code
get_status_code() {
  echo "$1" | grep -oP '^HTTP/\d\.\d \K\d+'
}

# Test 1: Token Endpoint (No Auth)
test_token_endpoint() {
  log_test "Token endpoint: GET $BASE_URL/api/phase7/token"
  
  response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/phase7/token")
  body=$(echo "$response" | head -n -1)
  status=$(echo "$response" | tail -n 1)
  
  if [ "$status" = "200" ]; then
    token=$(echo "$body" | jq -r '.token' 2>/dev/null || echo "")
    if [ -n "$token" ] && [ "$token" != "null" ]; then
      log_pass "Token generated successfully"
      echo "$token"  # Return token for use in other tests
    else
      log_fail "Token endpoint returned 200 but no token in response"
      [ "$VERBOSE" ] && echo "Response: $body"
    fi
  else
    log_fail "Token endpoint returned HTTP $status (expected 200)"
    [ "$VERBOSE" ] && echo "Response: $body"
  fi
}

# Test 2: Health Endpoint (No Token - Should Fail)
test_health_without_token() {
  log_test "Health endpoint (no token): GET $BASE_URL/api/phase7/health"
  
  response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/phase7/health")
  status=$(echo "$response" | tail -n 1)
  body=$(echo "$response" | head -n -1)
  
  if [ "$status" = "401" ]; then
    log_pass "Health endpoint correctly rejected request without token (401)"
  else
    log_fail "Health endpoint returned HTTP $status (expected 401 without token)"
    [ "$VERBOSE" ] && echo "Response: $body"
  fi
}

# Test 3: Health Endpoint (With Valid Token)
test_health_with_token() {
  local token="$1"
  log_test "Health endpoint (with token): GET $BASE_URL/api/phase7/health"
  
  response=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $token" "$BASE_URL/api/phase7/health")
  body=$(echo "$response" | head -n -1)
  status=$(echo "$response" | tail -n 1)
  
  if [ "$status" = "200" ]; then
    ok=$(echo "$body" | jq -r '.ok' 2>/dev/null)
    if [ "$ok" = "true" ]; then
      log_pass "Health endpoint returned OK with valid token"
    else
      log_fail "Health endpoint returned 200 but ok != true"
      [ "$VERBOSE" ] && echo "Response: $body"
    fi
  else
    log_fail "Health endpoint returned HTTP $status (expected 200 with token)"
    [ "$VERBOSE" ] && echo "Response: $body"
  fi
}

# Test 4: Enrichment Endpoint (No Token - Should Fail)
test_enrichment_without_token() {
  log_test "Enrichment endpoint (no token): POST $BASE_URL/api/phase7/enrich-lead"
  
  response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/phase7/enrich-lead" \
    -H "Content-Type: application/json" \
    -d '{"id":"test-lead-123"}')
  status=$(echo "$response" | tail -n 1)
  body=$(echo "$response" | head -n -1)
  
  if [ "$status" = "401" ]; then
    log_pass "Enrichment endpoint correctly rejected request without token (401)"
  else
    log_fail "Enrichment endpoint returned HTTP $status (expected 401 without token)"
    [ "$VERBOSE" ] && echo "Response: $body"
  fi
}

# Test 5: Enrichment Endpoint (With Valid Token)
test_enrichment_with_token() {
  local token="$1"
  log_test "Enrichment endpoint (with token): POST $BASE_URL/api/phase7/enrich-lead"
  
  response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/phase7/enrich-lead" \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" \
    -d '{"id":"test-lead-123"}')
  body=$(echo "$response" | head -n -1)
  status=$(echo "$response" | tail -n 1)
  
  if [ "$status" = "200" ]; then
    enrichment=$(echo "$body" | jq -r '.enrichment' 2>/dev/null)
    if [ "$enrichment" != "null" ]; then
      log_pass "Enrichment endpoint returned data with valid token"
    else
      log_fail "Enrichment endpoint returned 200 but no enrichment data"
      [ "$VERBOSE" ] && echo "Response: $body"
    fi
  else
    log_fail "Enrichment endpoint returned HTTP $status (expected 200 with token)"
    [ "$VERBOSE" ] && echo "Response: $body"
  fi
}

# Test 6: Analytics Endpoint (No Token - Should Fail)
test_analytics_without_token() {
  log_test "Analytics endpoint (no token): GET $BASE_URL/api/phase7/analytics"
  
  response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/phase7/analytics")
  status=$(echo "$response" | tail -n 1)
  body=$(echo "$response" | head -n -1)
  
  if [ "$status" = "401" ]; then
    log_pass "Analytics endpoint correctly rejected request without token (401)"
  else
    log_fail "Analytics endpoint returned HTTP $status (expected 401 without token)"
    [ "$VERBOSE" ] && echo "Response: $body"
  fi
}

# Test 7: Analytics Endpoint (With Valid Token)
test_analytics_with_token() {
  local token="$1"
  log_test "Analytics endpoint (with token): GET $BASE_URL/api/phase7/analytics"
  
  response=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $token" "$BASE_URL/api/phase7/analytics")
  body=$(echo "$response" | head -n -1)
  status=$(echo "$response" | tail -n 1)
  
  if [ "$status" = "200" ]; then
    log_pass "Analytics endpoint responded with valid token"
  else
    log_fail "Analytics endpoint returned HTTP $status (expected 200 with token)"
    [ "$VERBOSE" ] && echo "Response: $body"
  fi
}

# Test 8: Governance Endpoint (No Token - Should Fail)
test_governance_without_token() {
  log_test "Governance endpoint (no token): GET $BASE_URL/api/phase7/governance"
  
  response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/phase7/governance")
  status=$(echo "$response" | tail -n 1)
  body=$(echo "$response" | head -n -1)
  
  if [ "$status" = "401" ]; then
    log_pass "Governance endpoint correctly rejected request without token (401)"
  else
    log_fail "Governance endpoint returned HTTP $status (expected 401 without token)"
    [ "$VERBOSE" ] && echo "Response: $body"
  fi
}

# Test 9: Governance Endpoint (With Valid Token)
test_governance_with_token() {
  local token="$1"
  log_test "Governance endpoint (with token): GET $BASE_URL/api/phase7/governance"
  
  response=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $token" "$BASE_URL/api/phase7/governance")
  body=$(echo "$response" | head -n -1)
  status=$(echo "$response" | tail -n 1)
  
  if [ "$status" = "200" ]; then
    log_pass "Governance endpoint responded with valid token"
  else
    log_fail "Governance endpoint returned HTTP $status (expected 200 with token)"
    [ "$VERBOSE" ] && echo "Response: $body"
  fi
}

# Main test execution
echo "=========================================="
echo "Phase 7 Smoke Test Suite"
echo "=========================================="
echo "Target: $BASE_URL"
echo ""

# Test token generation
log_info "Step 1: Generating token for authenticated tests..."
TOKEN=$(test_token_endpoint)
if [ -z "$TOKEN" ]; then
  log_fail "Could not generate token; aborting further tests"
  exit 1
fi
echo ""

# Test health (no token)
log_info "Step 2: Testing RBAC guards (should reject without token)..."
test_health_without_token
test_enrichment_without_token
test_analytics_without_token
test_governance_without_token
echo ""

# Test all endpoints with token
log_info "Step 3: Testing all endpoints with valid token..."
test_health_with_token "$TOKEN"
test_enrichment_with_token "$TOKEN"
test_analytics_with_token "$TOKEN"
test_governance_with_token "$TOKEN"
echo ""

# Summary
echo "=========================================="
echo "Test Results"
echo "=========================================="
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ ALL TESTS PASSED${NC}"
  exit 0
else
  echo -e "${RED}❌ SOME TESTS FAILED${NC}"
  exit 1
fi
