# HubLab API - Quick Start Guide 🚀

## Current Status

✅ **Deployed to production**: https://hublab.dev
✅ **ChatGPT Plugin ready**: Manifest accessible
✅ **TypeScript SDK built**: Ready to publish

## What You Need to Do (5 minutes)

### Step 1: Setup Production Database

Open Supabase SQL Editor:
👉 https://supabase.com/dashboard/project/eqhwodxgahtxdfxtpsbq/sql/new

Execute this file:
📁 `/Users/c/hublab/lib/api/production-setup.sql`

```bash
# Or copy-paste from terminal:
cat /Users/c/hublab/lib/api/production-setup.sql
```

### Step 2: Test Production API

```bash
cd /Users/c/hublab
node test-production.js
```

Expected output:
```
✅ Success! Found 3 themes
✅ Success! Created project
✅ Success! Retrieved project details
✅ Success! Found 1 projects
🎉 Production API is working perfectly!
```

### Step 3: Install ChatGPT Plugin (Optional)

1. Open ChatGPT
2. Settings → Beta Features → Plugins → Plugin Store
3. "Develop your own plugin"
4. Enter: `hublab.dev`
5. Done! ✨

### Step 4: Publish SDK to NPM (Optional)

```bash
cd /Users/c/hublab/sdk/typescript
npm login
npm publish --access public
```

---

## Your API Key

Generate your API key from the dashboard or environment variables:

```bash
# In production, use environment variables
export HUBLAB_API_KEY=hublab_sk_your_api_key_here
```

**⚠️ SECURITY WARNING:** Never hardcode API keys in your code or commit them to version control.

Use it in the `Authorization: Bearer <key>` header.

---

## API Endpoints

**Base URL**: `https://hublab.dev/api/v1`

### Themes
- `GET /themes` - List all themes
- `GET /themes/:id` - Get theme details

### Projects
- `GET /projects` - List all projects
- `POST /projects` - Create a new project
- `GET /projects/:id` - Get project details
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Capsules (Components)
- `GET /projects/:id/capsules` - List project capsules
- `POST /projects/:id/capsules` - Add capsule to project
- `PATCH /projects/:id/capsules/:capsuleId` - Update capsule
- `DELETE /projects/:id/capsules/:capsuleId` - Remove capsule

### Export & Deploy
- `POST /projects/:id/export` - Export to code
- `POST /projects/:id/deploy` - Deploy to hosting
- `POST /projects/:id/preview` - Generate preview

### Catalog
- `GET /catalog/capsules` - Browse all available capsules
- `GET /catalog/capsules/:type` - Get capsules by type

---

## Example Usage

### Create a Project

```bash
curl -X POST https://hublab.dev/api/v1/projects \
  -H "Authorization: Bearer hublab_sk_..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Dashboard",
    "template": "dashboard",
    "theme": {
      "name": "modern-blue",
      "colors": {
        "primary": "#3B82F6",
        "secondary": "#10B981"
      }
    }
  }'
```

### Add a Chart Component

```bash
curl -X POST https://hublab.dev/api/v1/projects/{PROJECT_ID}/capsules \
  -H "Authorization: Bearer hublab_sk_..." \
  -H "Content-Type: application/json" \
  -d '{
    "capsuleId": "line-chart",
    "inputs": {
      "data": [10, 20, 30, 40, 50],
      "labels": ["Jan", "Feb", "Mar", "Apr", "May"],
      "title": "Monthly Sales"
    }
  }'
```

### Export to Next.js

```bash
curl -X POST https://hublab.dev/api/v1/projects/{PROJECT_ID}/export \
  -H "Authorization: Bearer hublab_sk_..." \
  -H "Content-Type: application/json" \
  -d '{
    "format": "nextjs",
    "includeApi": true
  }'
```

---

## Using the TypeScript SDK

```typescript
import { HubLab } from '@hublab/sdk'

const client = new HubLab({
  apiKey: 'hublab_sk_...'
})

// Create a project
const project = await client.projects.create({
  name: 'My Dashboard',
  template: 'dashboard',
  theme: 'modern-blue'
})

// Add a chart
await client.projects.capsules.add(project.id, {
  capsuleId: 'line-chart',
  inputs: {
    data: [10, 20, 30],
    labels: ['A', 'B', 'C']
  }
})

// Export to code
const code = await client.projects.export(project.id, {
  format: 'nextjs'
})

console.log(code.files)
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `DEPLOYMENT_COMPLETE.md` | Full deployment documentation |
| `QUICK_START.md` | This file - quick reference |
| `lib/api/production-setup.sql` | SQL to setup production DB |
| `test-production.js` | Test script for production API |
| `deploy-all.sh` | Automated deployment script |
| `sdk/typescript/` | TypeScript SDK source |

---

## Troubleshooting

### API returns "Invalid or inactive API key"
- Make sure you executed the production SQL in Supabase
- Check that the `api_keys` table exists in your production database
- Verify the `rate_limit` column was added

### API returns "Table 'projects' does not exist"
- You forgot to execute the production SQL
- Go to Step 1 above

### ChatGPT plugin not loading
- Check that https://hublab.dev/.well-known/ai-plugin.json is accessible
- Verify your domain name is correct

---

## Support

Read the full documentation:
- `/Users/c/hublab/DEPLOYMENT_COMPLETE.md`

Check the API docs:
- https://hublab.dev/api-docs

---

**That's it! Execute the SQL and start building! 🚀**
