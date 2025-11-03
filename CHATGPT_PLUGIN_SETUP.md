# ChatGPT Plugin Setup Guide

This guide explains how to set up HubLab as a ChatGPT plugin so users can build and deploy web applications directly through ChatGPT.

## What is a ChatGPT Plugin?

A ChatGPT plugin allows ChatGPT to interact with external APIs. When installed, ChatGPT can:
- Create projects from templates
- Add UI components (capsules) like tables, charts, forms
- Integrate with services (Supabase, Stripe, Firebase)
- Export projects to code (Next.js, React, HTML, Vue)
- Deploy to hosting platforms (Vercel, Netlify, Cloudflare)

## Files Created

### 1. Plugin Manifest
**Location:** `/public/.well-known/ai-plugin.json`

This file tells ChatGPT:
- Plugin name and description
- Authentication method (Bearer token)
- Where to find the API specification
- Contact and legal information

### 2. OpenAPI Specification
**Location:** `/public/.well-known/openapi.yaml`

This file describes:
- All available API endpoints
- Request/response schemas
- Authentication requirements
- Parameter validation

## Setup Steps

### Step 1: Environment Variables

Add the required environment variable to `.env.local`:

```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Get this from:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `kfssgrzqtnxuhfiqmjhu`
3. Go to Project Settings → API
4. Copy the `service_role` key (SECRET, not public!)

### Step 2: Run Database Schema

Execute the schema from `lib/api/schema.sql` in your Supabase SQL Editor:

1. Go to Supabase Dashboard → SQL Editor
2. Create new query
3. Paste contents of `lib/api/schema.sql`
4. Run the query

This creates:
- `api_keys` table for authentication
- `projects` table for storing projects
- Row Level Security policies
- Indexes for performance

### Step 3: Generate API Key

Run this SQL in Supabase SQL Editor to create a test API key:

```sql
INSERT INTO api_keys (user_id, key_hash, tier)
VALUES (
  'test-user-id',
  'hublab_sk_test_' || encode(gen_random_bytes(32), 'hex'),
  'free'
)
RETURNING key_hash;
```

Copy the returned key (starts with `hublab_sk_test_`).

### Step 4: Deploy to Production

The plugin files need to be accessible at:
- `https://hublab.dev/.well-known/ai-plugin.json`
- `https://hublab.dev/.well-known/openapi.yaml`

Deploy your site:

```bash
# Using Netlify
netlify deploy --prod

# Or using Vercel
vercel --prod
```

### Step 5: Install in ChatGPT

1. Go to ChatGPT → Settings → Beta Features
2. Enable "Plugins"
3. Go to Plugin Store
4. Click "Develop your own plugin"
5. Enter your domain: `hublab.dev`
6. ChatGPT will fetch `/.well-known/ai-plugin.json`
7. Enter your API key when prompted

## Testing the Plugin

### Example 1: Create a Dashboard

```
Create a dashboard project called "Analytics Dashboard" with a stats grid showing:
- Users: 1,234
- Revenue: $45.6k
- Projects: 89
- Completion: 94%
```

ChatGPT will:
1. Call `POST /api/v1/projects` to create the project
2. Call `POST /api/v1/projects/{id}/capsules` to add the stats grid
3. Return the project ID and details

### Example 2: Add Data Table

```
Add a data table to my project showing user data from Supabase table 'users' with columns: name, email, status, created_at
```

ChatGPT will:
1. Call `POST /api/v1/projects/{id}/capsules` with type `data-table`
2. Configure the data source to connect to Supabase
3. Call `POST /api/v1/projects/{id}/integrations` to add Supabase integration

### Example 3: Export and Deploy

```
Export my project to Next.js and deploy it to Vercel
```

ChatGPT will:
1. Call `POST /api/v1/projects/{id}/export` with format `nextjs`
2. Call `POST /api/v1/projects/{id}/deploy` with platform `vercel`
3. Return the deployment URL

## Available Commands for ChatGPT

When users chat with ChatGPT with the HubLab plugin installed, they can say things like:

### Creating Projects
- "Create a dashboard project"
- "Build a landing page for my SaaS product"
- "Start an e-commerce store project"

### Adding Components
- "Add a stats grid showing [metrics]"
- "Add a data table connected to my Supabase table"
- "Add a contact form"
- "Add a product grid for my store"
- "Add a bar chart showing sales data"

### Managing Integrations
- "Connect to Supabase"
- "Add Stripe payment integration"
- "Set up Firebase authentication"

### Exporting & Deploying
- "Export my project to Next.js"
- "Export as React with Vite"
- "Deploy to Vercel"
- "Deploy to Netlify"
- "Generate a preview URL"

### Browsing Catalog
- "What capsule types are available?"
- "Show me all chart components"
- "What themes can I use?"

## Plugin Capabilities

The ChatGPT plugin can:

✅ **Create Projects**
- From templates (dashboard, landing, ecommerce, admin, blog)
- With custom themes
- List and filter existing projects

✅ **Manage Capsules**
- Add 11 types of UI components
- Configure props for each capsule
- Connect data sources (Supabase, Firebase, REST API)
- Nest capsules (e.g., cards inside a grid)

✅ **Integrate Services**
- 15 integrations available
- Supabase, Stripe, Firebase, SendGrid, Twilio, etc.

✅ **Export Code**
- 4 formats: Next.js, React, HTML, Vue
- With TypeScript support
- Includes README and .env.example

✅ **Deploy**
- 3 platforms: Vercel, Netlify, Cloudflare
- Custom domains
- Environment variables

✅ **Browse Catalog**
- View all available capsules
- Filter by category
- See examples and props

## Rate Limits

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

## Troubleshooting

### Plugin Not Found
- Ensure files are deployed to production
- Check that `.well-known` directory is publicly accessible
- Verify URLs return JSON/YAML (not HTML)

### Authentication Fails
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set
- Verify API key is valid in `api_keys` table
- Ensure Bearer token is in correct format: `hublab_sk_...`

### Rate Limited
- Check user's tier in `api_keys` table
- Upgrade tier if needed
- Wait for rate limit to reset

### CORS Errors
- All endpoints include CORS headers
- Check that middleware is applied to all routes
- Verify OPTIONS requests are handled

## Security Notes

⚠️ **Important:**
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to clients
- API keys should start with `hublab_sk_` prefix
- Use Row Level Security (RLS) policies
- Rate limiting is enforced on all endpoints
- All requests require authentication

## Support

For issues or questions:
- Documentation: https://hublab.dev/api-docs
- Email: support@hublab.dev
- GitHub: https://github.com/hublab/hublab

## Next Steps

1. **Create More API Keys:** Generate keys for different users/tiers
2. **Monitor Usage:** Track API calls and rate limits
3. **Add Analytics:** Monitor which endpoints are most used
4. **Enhance Security:** Add request signing, IP allowlisting
5. **Scale Infrastructure:** Add caching, CDN, load balancing

## Example ChatGPT Conversation

```
User: I need a dashboard for my SaaS app

ChatGPT: I'll create a dashboard project for you using HubLab.
[Calls createProject with template='dashboard']

Your dashboard has been created! What features would you like to add?

User: Add KPI stats for users, revenue, and conversion rate

ChatGPT: I'll add a stats grid with those metrics.
[Calls addCapsule with type='stats-grid']

Done! I've added a stats grid displaying:
- Active Users
- Total Revenue
- Conversion Rate

Would you like to add more components like charts or data tables?

User: Yes, add a table showing recent signups from my Supabase database

ChatGPT: I'll add a data table connected to your Supabase.
[Calls addCapsule with type='data-table' and dataSource]
[Calls addIntegration with type='supabase']

I've added a data table showing recent signups. To complete the setup:
1. Add your Supabase credentials when deploying
2. Make sure you have a 'signups' table in your database

Ready to deploy?

User: Yes, deploy to Vercel

ChatGPT: Deploying your dashboard to Vercel now...
[Calls deployProject with platform='vercel']

Deployed successfully! 🎉
Your dashboard is live at: https://your-dashboard.vercel.app

Would you like me to export the source code as well?
```

This is the power of the HubLab ChatGPT plugin!
