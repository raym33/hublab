#!/bin/bash

echo "🚀 HubLab - Deploy Complete"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Build the app
echo -e "${BLUE}📦 Step 1: Building Next.js app...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"
echo ""

# Step 2: Deploy to Netlify
echo -e "${BLUE}🌐 Step 2: Deploying to Netlify...${NC}"
netlify deploy --prod

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}❌ Deploy failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Deployed to Netlify!${NC}"
echo ""

# Step 3: Build SDK
echo -e "${BLUE}📚 Step 3: Building TypeScript SDK...${NC}"
cd sdk/typescript
npm install
npm run build 2>/dev/null || tsc

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  SDK build skipped (no build script)${NC}"
else
    echo -e "${GREEN}✅ SDK built!${NC}"
fi

cd ../..
echo ""

# Done
echo -e "${GREEN}✨ All done!${NC}"
echo ""
echo "Next steps:"
echo "1. Test your API at: https://hublab.dev/api/v1/themes"
echo "2. Install ChatGPT plugin from: https://hublab.dev"
echo "3. Publish SDK to NPM: cd sdk/typescript && npm publish"
echo ""
