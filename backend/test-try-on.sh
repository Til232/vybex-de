#!/bin/bash

# Test Kling AI Virtual Try-On Integration

API_BASE="http://localhost:5001"

echo "=========================================="
echo "Kling AI Virtual Try-On API Tests"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file has Kling AI credentials
echo "${YELLOW}Checking Kling AI credentials...${NC}"
if grep -q "KLING_AI_API_KEY=" ../.env 2>/dev/null; then
  echo -e "${GREEN}✓ Kling AI credentials found in .env${NC}"
else
  echo -e "${RED}✗ Kling AI credentials NOT found in .env${NC}"
  echo ""
  echo "To set up Kling AI:"
  echo "1. Sign up at: https://app.klingai.com/"
  echo "2. Get your API key and secret key"
  echo "3. Add them to .env file:"
  echo ""
  echo "   KLING_AI_API_KEY=your_key_here"
  echo "   KLING_AI_SECRET_KEY=your_secret_here"
  echo ""
fi

echo ""
echo "${YELLOW}API Endpoints available:${NC}"
echo "1. POST   /api/try-on/generate"
echo "   Body: { sourceImagePath, referenceImagePath, category }"
echo ""
echo "2. POST   /api/try-on/upload-and-generate"
echo "   Files: sourceImage (person), referenceImage (garment)"
echo ""
echo "3. GET    /api/try-on/status/:taskId"
echo "   Get the status and results of a try-on task"
echo ""

echo "${YELLOW}Example usage with curl:${NC}"
echo ""
echo "# Upload and generate try-on:"
echo 'curl -X POST http://localhost:5001/api/try-on/upload-and-generate \'
echo '  -F "sourceImage=@path/to/person.jpg" \'
echo '  -F "referenceImage=@path/to/garment.jpg" \'
echo '  -F "category=upper_body"'
echo ""
echo "# Categories: upper_body, lower_body, dress"
echo ""

echo "${YELLOW}Next steps:${NC}"
echo "1. Install dependencies: npm install"
echo "2. Update .env with Kling AI credentials"
echo "3. Start backend: npm run dev"
echo "4. Make API calls to generate try-ons"
echo ""

echo "=========================================="
