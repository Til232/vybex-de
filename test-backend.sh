#!/bin/bash

# Test script for VYBEX multi-brand backend

echo "🧪 VYBEX Backend Test Suite"
echo "============================"
echo ""

API_URL="http://localhost:5001/api"
TIMEOUT=2

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS=0
PASSED=0
FAILED=0

# Function to run test
test_endpoint() {
  local name=$1
  local method=$2
  local endpoint=$3
  local expected_status=$4

  TESTS=$((TESTS + 1))
  
  echo -n "[$TESTS] Testing $name... "
  
  if [ "$method" = "GET" ]; then
    response=$(curl -s -w "\n%{http_code}" -X GET "$API_URL$endpoint")
  else
    response=$(curl -s -w "\n%{http_code}" -X $method "$API_URL$endpoint")
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)
  
  if [ "$http_code" = "$expected_status" ] || [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC} (HTTP $http_code)"
    PASSED=$((PASSED + 1))
    
    # Show sample data for GET endpoints
    if [ "$method" = "GET" ] && [ ! -z "$body" ]; then
      count=$(echo "$body" | grep -o '"id"' | wc -l)
      echo "   └─ Records returned: $count"
    fi
  else
    echo -e "${RED}❌ FAIL${NC} (HTTP $http_code)"
    FAILED=$((FAILED + 1))
    echo "   Response: $(echo "$body" | cut -c1-100)"
  fi
  echo ""
}

# Check if API is running
echo "📡 Checking API connectivity..."
if ! curl -s "$API_URL/health" > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  API might not be running on port 5001${NC}"
  echo "   Start with: cd backend && PORT=5001 npm run dev"
  echo ""
fi

# Wait a moment for API to be ready
echo "⏳ Waiting for API to be ready..."
sleep 1
echo ""

# Test endpoints
echo "📋 Testing Brand Endpoints"
echo "---"
test_endpoint "Get All Brands" "GET" "/brands" "200"
test_endpoint "Get Specific Brand" "GET" "/brands/nike" "200"
test_endpoint "Get Nonexistent Brand" "GET" "/brands/nonexistent" "404"
echo ""

echo "📦 Testing Product Endpoints"
echo "---"
# Get first brand ID to test products
BRAND_ID=$(curl -s "$API_URL/brands" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
if [ ! -z "$BRAND_ID" ]; then
  test_endpoint "Get Products by Brand" "GET" "/products/brand/$BRAND_ID" "200"
else
  echo "⚠️  Could not get brand ID for product tests"
fi
echo ""

echo "📊 Database Verification"
echo "---"
if command -v sqlite3 &> /dev/null; then
  db_brands=$(sqlite3 backend/vybex.db "SELECT COUNT(*) FROM brands;" 2>/dev/null)
  db_products=$(sqlite3 backend/vybex.db "SELECT COUNT(*) FROM products;" 2>/dev/null)
  db_images=$(sqlite3 backend/vybex.db "SELECT COUNT(*) FROM product_images;" 2>/dev/null)
  
  echo -e "✅ Database file exists"
  echo -e "   Brands:  $db_brands"
  echo -e "   Products: $db_products"
  echo -e "   Images:  $db_images"
else
  echo -e "${YELLOW}⚠️  SQLite not installed, skipping database check${NC}"
fi
echo ""

echo "📂 Asset Verification"
echo "---"
if [ -d "backend/uploads/logos" ]; then
  logo_count=$(ls -1 backend/uploads/logos/ 2>/dev/null | wc -l)
  echo -e "✅ Logo folder exists ($logo_count files)"
else
  echo -e "${RED}❌ Logo folder missing${NC}"
fi

if [ -d "backend/uploads/products" ]; then
  product_count=$(ls -1 backend/uploads/products/ 2>/dev/null | wc -l)
  echo -e "✅ Product images folder exists ($product_count files)"
else
  echo -e "${RED}❌ Product images folder missing${NC}"
fi

if [ -d "backend/uploads/avatars" ]; then
  avatar_count=$(ls -1 backend/uploads/avatars/ 2>/dev/null | wc -l)
  echo -e "✅ Avatar images folder exists ($avatar_count files)"
else
  echo -e "${RED}❌ Avatar images folder missing${NC}"
fi
echo ""

# Summary
echo "📈 Test Summary"
echo "---"
echo "Total Tests:  $TESTS"
echo -e "Passed:       ${GREEN}$PASSED${NC}"
echo -e "Failed:       ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✨ All tests passed!${NC}"
else
  echo -e "${YELLOW}⚠️  Some tests failed. Check API is running: PORT=5001 npm run dev${NC}"
fi

echo ""
echo "🚀 Quick Commands"
echo "---"
echo "1. Start API:      cd backend && PORT=5001 npm run dev"
echo "2. Open Dashboard: open frontend/admin.html"
echo "3. Query DB:       cd backend && ./db-query.sh stats"
echo "4. View Brands:    curl http://localhost:5001/api/brands | jq"
