# HubLab API - Setup Instructions

Complete guide to get the HubLab API up and running so AI agents can use it.

## Overview

You now have a complete REST API that allows AI agents (ChatGPT, Claude, etc.) to programmatically:
- Create and manage web application projects
- Add UI components (capsules) like tables, charts, forms
- Integrate third-party services (Supabase, Stripe, Firebase, etc.)
- Export projects to code (Next.js, React, HTML, Vue)
- Deploy to hosting platforms (Vercel, Netlify, Cloudflare)

## What's Included

### API Endpoints (31 total)

**Projects (5 endpoints)**
- `GET /api/v1/projects` - List projects with filtering
- `POST /api/v1/projects` - Create new project
- `GET /api/v1/projects/:id` - Get project details
- `PUT /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project

**Capsules (5 endpoints)**
- `GET /api/v1/projects/:id/capsules` - List capsules
- `POST /api/v1/projects/:id/capsules` - Add capsule
- `GET /api/v1/projects/:id/capsules/:capsuleId` - Get capsule
- `PUT /api/v1/projects/:id/capsules/:capsuleId` - Update capsule
- `DELETE /api/v1/projects/:id/capsules/:capsuleId` - Delete capsule

**Integrations (4 endpoints)**
- `GET /api/v1/projects/:id/integrations` - List integrations
- `POST /api/v1/projects/:id/integrations` - Add integration
- `GET /api/v1/projects/:id/integrations/:type` - Get integration
- `DELETE /api/v1/projects/:id/integrations/:type` - Delete integration

**Export & Deploy (3 endpoints)**
- `POST /api/v1/projects/:id/export` - Export to code
- `POST /api/v1/projects/:id/deploy` - Deploy to platform
- `POST /api/v1/projects/:id/preview` - Generate preview URL

**Themes (2 endpoints)**
- `GET /api/v1/themes` - List all themes
- `GET /api/v1/themes/:id` - Get specific theme

**Catalog (2 endpoints)**
- `GET /api/v1/catalog/capsules` - Browse capsules
- `GET /api/v1/catalog/capsules/:type` - Get capsule details

### Files Created

**API Routes (16 files)**
- `/app/api/v1/projects/route.ts`
- `/app/api/v1/projects/[id]/route.ts`
- `/app/api/v1/projects/[id]/capsules/route.ts`
- `/app/api/v1/projects/[id]/capsules/[capsuleId]/route.ts`
- `/app/api/v1/projects/[id]/integrations/route.ts`
- `/app/api/v1/projects/[id]/integrations/[type]/route.ts`
- `/app/api/v1/projects/[id]/export/route.ts`
- `/app/api/v1/projects/[id]/deploy/route.ts`
- `/app/api/v1/projects/[id]/preview/route.ts`
- `/app/api/v1/themes/route.ts`
- `/app/api/v1/themes/[id]/route.ts`
- `/app/api/v1/catalog/capsules/route.ts`
- `/app/api/v1/catalog/capsules/[type]/route.ts`

**Infrastructure (5 files)**
- `/types/api/index.ts` - TypeScript type definitions
- `/lib/api/auth.ts` - Authentication & rate limiting
- `/lib/api/middleware.ts` - API middleware
- `/lib/api/code-generator.ts` - Code generation
- `/lib/api/capsule-catalog.ts` - Capsule definitions
- `/lib/api/schema.sql` - Database schema

**SDK (8 files)**
- `/sdk/typescript/src/client.ts` - Main SDK client
- `/sdk/typescript/src/types.ts` - TypeScript types
- `/sdk/typescript/src/resources/projects.ts` - Projects resource
- `/sdk/typescript/src/resources/themes.ts` - Themes resource
- `/sdk/typescript/src/resources/catalog.ts` - Catalog resource
- `/sdk/typescript/package.json` - NPM package config
- `/sdk/typescript/README.md` - SDK documentation

**ChatGPT Plugin (2 files)**
- `/public/.well-known/ai-plugin.json` - Plugin manifest
- `/public/.well-known/openapi.yaml` - OpenAPI spec

**Documentation (5 files)**
- `/lib/api/API_COMPLETE.md` - Complete API reference
- `/lib/api/README.md` - Technical documentation
- `/lib/api/examples.md` - Code examples
- `/AI_QUICK_START.md` - Guide for AI agents
- `/CHATGPT_PLUGIN_SETUP.md` - ChatGPT plugin setup

**Testing**
- `/test-api.js` - Automated API test script

## Setup Steps

### 1. Add Environment Variable

Open `.env.local` and add your Supabase service role key:

```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**How to get it:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `kfssgrzqtnxuhfiqmjhu`
3. Go to **Project Settings → API**
4. Copy the **`service_role`** key (keep it secret!)

### 2. Run Database Schema

Execute the SQL schema to create the required tables:

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `/lib/api/schema.sql`
4. Paste into the editor
5. Click **Run**

This creates:
- `api_keys` table - For API authentication
- `projects` table - For storing projects
- RLS policies - For security
- Indexes - For performance

### 3. Generate an API Key

Run this SQL in the Supabase SQL Editor to create a test API key:

```sql
INSERT INTO api_keys (user_id, key_hash, tier, name)
VALUES (
  'test-user-' || gen_random_uuid()::text,
  'hublab_sk_test_' || encode(gen_random_bytes(32), 'hex'),
  'free',
  'Test API Key'
)
RETURNING key_hash, user_id;
```

**Save the returned key** - it starts with `hublab_sk_test_...`

### 4. Test the API Locally

Start the development server:

```bash
cd /Users/c/hublab
npm run dev
```

Run the test script:

```bash
# Set your API key
export HUBLAB_API_KEY="hublab_sk_test_your_key_here"

# Run tests
node test-api.js
```

The test script will:
- Test all 15 major endpoints
- Create a test project
- Add capsules and integrations
- Export and deploy
- Clean up after itself

### 5. Test Manually with cURL

**Create a project:**
```bash
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Authorization: Bearer hublab_sk_test_your_key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Dashboard",
    "template": "dashboard",
    "theme": "modern-blue"
  }'
```

**Add a stats grid:**
```bash
curl -X POST http://localhost:3000/api/v1/projects/PROJECT_ID/capsules \
  -H "Authorization: Bearer hublab_sk_test_your_key" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "stats-grid",
    "props": {
      "columns": 4,
      "stats": [
        {"label": "Users", "value": "1,234", "icon": "users"},
        {"label": "Revenue", "value": "$45.6k", "icon": "dollar"}
      ]
    }
  }'
```

**Export to Next.js:**
```bash
curl -X POST http://localhost:3000/api/v1/projects/PROJECT_ID/export \
  -H "Authorization: Bearer hublab_sk_test_your_key" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "nextjs",
    "options": {"typescript": true, "includeReadme": true}
  }'
```

### 6. Deploy to Production

Build and deploy your application:

```bash
# Build the application
npm run build

# Deploy to Netlify
netlify deploy --prod

# Or deploy to Vercel
vercel --prod
```

After deployment, the ChatGPT plugin files will be available at:
- `https://hublab.dev/.well-known/ai-plugin.json`
- `https://hublab.dev/.well-known/openapi.yaml`

### 7. Set Up ChatGPT Plugin (Optional)

Follow the guide in `CHATGPT_PLUGIN_SETUP.md` to enable ChatGPT to use your API.

## Rate Limits

The API enforces rate limiting based on tier:

**Free Tier:**
- 10 projects/hour
- 5 exports/day
- 2 deploys/day
- 60 requests/minute

**Pro Tier:**
- 50 projects/hour
- 50 exports/day
- 20 deploys/day
- 300 requests/minute

**Enterprise Tier:**
- Unlimited projects
- Unlimited exports
- Unlimited deploys
- 1000 requests/minute

**Upgrade a key:**
```sql
UPDATE api_keys
SET tier = 'pro'  -- or 'enterprise'
WHERE key_hash = 'hublab_sk_test_your_key';
```

## Available Resources

### 6 Templates
- `blank` - Start from scratch
- `dashboard` - Analytics dashboard with sidebar
- `landing` - Marketing landing page
- `ecommerce` - Online store
- `admin` - Admin panel
- `blog` - Blog layout

### 11 Capsule Types
- `header` - Top navigation
- `sidebar` - Vertical menu
- `hero` - Landing page hero
- `feature-grid` - Features grid
- `data-table` - Sortable table
- `stats-grid` - KPI metrics
- `form` - Custom form
- `bar-chart` - Bar chart
- `product-grid` - Products
- `cart` - Shopping cart
- More in `/lib/api/capsule-catalog.ts`

### 15 Integrations
- `supabase` - Database
- `firebase` - Backend services
- `stripe` - Payments
- `nextauth` - Authentication
- `resend` - Emails
- `twilio` - SMS
- `aws-s3` - File storage
- `vercel-kv` - Key-value store
- `cloudinary` - Media management
- `sendgrid` - Email delivery
- `algolia` - Search
- `sentry` - Error tracking
- `pusher` - Real-time
- `rest-api` - Custom REST API
- `graphql` - GraphQL API

### 3 Preset Themes
- `modern-blue` - Blue color scheme
- `dark-purple` - Dark with purple accents
- `minimal` - Black & white minimalist

### 4 Export Formats
- `nextjs` - Next.js 14 App Router
- `react` - React with Vite
- `html` - Static HTML/CSS
- `vue` - Vue 3 with Vite

### 3 Deploy Platforms
- `vercel` - Best for Next.js
- `netlify` - Great for static sites
- `cloudflare` - Cloudflare Pages

## Using the TypeScript SDK

Install the SDK:

```bash
npm install @hublab/sdk
```

Use in your code:

```typescript
import { HubLab } from '@hublab/sdk'

const hublab = new HubLab({
  apiKey: process.env.HUBLAB_API_KEY
})

// Create a dashboard
const project = await hublab.projects.create({
  name: 'Analytics Dashboard',
  template: 'dashboard',
  theme: 'modern-blue'
})

// Add stats
await hublab.projects.addCapsule(project.id, {
  type: 'stats-grid',
  props: {
    columns: 4,
    stats: [
      { label: 'Users', value: '1,234', icon: 'users' },
      { label: 'Revenue', value: '$45.6k', icon: 'dollar' }
    ]
  }
})

// Export and deploy
const exported = await hublab.projects.export(project.id, {
  format: 'nextjs'
})

const deployment = await hublab.projects.deploy(project.id, {
  platform: 'vercel'
})

console.log(`Deployed at: ${deployment.url}`)
```

## Troubleshooting

### "SUPABASE_SERVICE_ROLE_KEY is not defined"
- Make sure you added it to `.env.local`
- Restart the dev server after adding it

### "Invalid API key"
- Check that the key is in the `api_keys` table
- Ensure key starts with `hublab_sk_`
- Use full key, not abbreviated

### "Table 'api_keys' does not exist"
- Run the schema from `/lib/api/schema.sql`
- Check Supabase logs for errors

### "Rate limit exceeded"
- Check your tier in the `api_keys` table
- Upgrade to pro/enterprise if needed
- Wait for the limit to reset

### CORS errors
- All endpoints include CORS headers
- Check that middleware is applied
- Verify OPTIONS requests work

## Next Steps

1. **Create more API keys** for different users/services
2. **Monitor usage** via Supabase dashboard
3. **Set up production keys** with proper tiers
4. **Install ChatGPT plugin** to test AI integration
5. **Build your first app** using the SDK

## Documentation

- **Complete API Reference**: `/lib/api/API_COMPLETE.md`
- **SDK Documentation**: `/sdk/typescript/README.md`
- **AI Quick Start**: `/AI_QUICK_START.md`
- **ChatGPT Plugin Setup**: `/CHATGPT_PLUGIN_SETUP.md`
- **Code Examples**: `/lib/api/examples.md`

## Support

- Interactive API Docs: `https://hublab.dev/api-docs`
- GitHub Issues: `https://github.com/hublab/hublab/issues`
- Email: `support@hublab.dev`

## Summary

You now have:
✅ Complete REST API with 31 endpoints
✅ TypeScript SDK for easy integration
✅ ChatGPT plugin for AI agents
✅ Comprehensive documentation
✅ Test suite for validation
✅ Authentication & rate limiting
✅ Code generation for 4 frameworks
✅ Deployment to 3 platforms

**Your API is ready for AI agents to build web applications programmatically!** 🎉
