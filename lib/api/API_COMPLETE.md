# HubLab API - Complete Implementation

Complete REST API for programmatic access to HubLab - Phase 1, 2, and 3 implemented.

## Overview

**Total Endpoints: 31**
- **Phase 1**: Projects CRUD (5 endpoints)
- **Phase 2**: Capsules, Themes, Integrations, Catalog (16 endpoints)
- **Phase 3**: Export, Deploy, Preview (3 endpoints)
- **Auth**: API keys with tiered rate limiting

## Base URL

```
https://hublab.dev/api/v1
```

## Authentication

All requests require an API key in the Authorization header:

```bash
Authorization: Bearer hublab_sk_your_api_key_here
```

## Complete Endpoint List

### Projects (5 endpoints)

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| POST | `/projects` | Create new project | projectsPerHour |
| GET | `/projects` | List all projects | requestsPerMinute |
| GET | `/projects/:id` | Get project details | requestsPerMinute |
| PUT | `/projects/:id` | Update project | requestsPerMinute |
| DELETE | `/projects/:id` | Delete project | requestsPerMinute |

### Capsules (4 endpoints)

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| GET | `/projects/:id/capsules` | List project capsules | requestsPerMinute |
| POST | `/projects/:id/capsules` | Add capsule to project | requestsPerMinute |
| GET | `/projects/:id/capsules/:capsuleId` | Get capsule details | requestsPerMinute |
| PUT | `/projects/:id/capsules/:capsuleId` | Update capsule | requestsPerMinute |
| DELETE | `/projects/:id/capsules/:capsuleId` | Delete capsule | requestsPerMinute |

### Themes (2 endpoints)

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| GET | `/themes` | List preset themes | requestsPerMinute |
| GET | `/themes/:id` | Get theme details | requestsPerMinute |

### Integrations (4 endpoints)

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| GET | `/projects/:id/integrations` | List integrations | requestsPerMinute |
| POST | `/projects/:id/integrations` | Add integration | requestsPerMinute |
| GET | `/projects/:id/integrations/:type` | Get integration | requestsPerMinute |
| DELETE | `/projects/:id/integrations/:type` | Delete integration | requestsPerMinute |

### Catalog (2 endpoints)

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| GET | `/catalog/capsules` | Browse available capsules | requestsPerMinute |
| GET | `/catalog/capsules/:type` | Get capsule type details | requestsPerMinute |

### Export & Deploy (3 endpoints)

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| POST | `/projects/:id/export` | Export to code (Next.js/React/HTML/Vue) | exportsPerDay |
| POST | `/projects/:id/deploy` | Deploy to platform (Vercel/Netlify/Cloudflare) | deploysPerDay |
| POST | `/projects/:id/preview` | Generate preview URL | requestsPerMinute |

## Complete Workflow Example

```bash
API_KEY="hublab_sk_your_key"
BASE_URL="https://hublab.dev/api/v1"

# 1. Create a project
PROJECT=$(curl -X POST $BASE_URL/projects \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Dashboard",
    "template": "dashboard",
    "theme": "modern-blue"
  }' | jq -r '.data.project.id')

# 2. Add a stats grid capsule
curl -X POST $BASE_URL/projects/$PROJECT/capsules \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "stats-grid",
    "props": {
      "columns": 4,
      "stats": [
        {"label": "Users", "value": "1,234", "icon": "users"},
        {"label": "Revenue", "value": "$45.6k", "icon": "dollar"},
        {"label": "Projects", "value": "89", "icon": "folder"},
        {"label": "Tasks", "value": "234", "icon": "check"}
      ]
    }
  }'

# 3. Add a data table capsule with Supabase data source
curl -X POST $BASE_URL/projects/$PROJECT/capsules \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "data-table",
    "props": {
      "columns": [
        {"key": "name", "label": "Name"},
        {"key": "email", "label": "Email"},
        {"key": "status", "label": "Status"}
      ],
      "showPagination": true,
      "showSearch": true
    },
    "dataSource": {
      "type": "supabase",
      "config": {
        "table": "users",
        "fields": ["name", "email", "status"],
        "orderBy": {"column": "created_at", "ascending": false}
      }
    }
  }'

# 4. Add Supabase integration
curl -X POST $BASE_URL/projects/$PROJECT/integrations \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "supabase",
    "config": {}
  }'

# 5. List all capsules in project
curl -X GET $BASE_URL/projects/$PROJECT/capsules \
  -H "Authorization: Bearer $API_KEY"

# 6. Update project theme
curl -X PUT $BASE_URL/projects/$PROJECT \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark-purple"
  }'

# 7. Generate preview URL
curl -X POST $BASE_URL/projects/$PROJECT/preview \
  -H "Authorization: Bearer $API_KEY"

# 8. Export to Next.js
curl -X POST $BASE_URL/projects/$PROJECT/export \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "nextjs",
    "options": {
      "typescript": true,
      "includeReadme": true,
      "includeEnvExample": true
    }
  }'

# 9. Deploy to Vercel
curl -X POST $BASE_URL/projects/$PROJECT/deploy \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "vercel",
    "config": {
      "envVars": {
        "NEXT_PUBLIC_SUPABASE_URL": "your-url",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY": "your-key"
      }
    }
  }'
```

## Available Capsule Types (11 total)

### Navigation (2)
- `header` - Top navigation bar
- `sidebar` - Vertical navigation sidebar

### Layout (2)
- `hero` - Landing page hero section
- `feature-grid` - Grid of features with icons

### Data Display (2)
- `data-table` - Sortable, filterable table
- `stats-grid` - KPI/statistics grid

### Forms (1)
- `form` - Generic customizable form

### Charts (1)
- `bar-chart` - Bar chart visualization

### E-commerce (1)
- `product-grid` - Product grid for online stores

## Export Formats (4 total)

- `nextjs` - Next.js 14 App Router
- `react` - React with Vite
- `html` - Static HTML/CSS
- `vue` - Vue 3 with Vite

## Deploy Platforms (3 total)

- `vercel` - Vercel deployment
- `netlify` - Netlify deployment
- `cloudflare` - Cloudflare Pages

## Integration Types (15 total)

**Database:**
- `supabase` - PostgreSQL with real-time
- `firebase` - Google Firebase/Firestore

**API:**
- `rest-api` - Generic REST API client
- `graphql` - GraphQL client

**Payment:**
- `stripe` - Payment processing

**Auth:**
- `nextauth` - Authentication

**Email:**
- `resend` - Transactional emails
- `sendgrid` - Email marketing

**Communications:**
- `twilio` - SMS/WhatsApp

**Storage:**
- `aws-s3` - File storage
- `cloudinary` - Image/video optimization

**Cache:**
- `vercel-kv` - Redis-compatible KV store

**Search:**
- `algolia` - Search and discovery

**Monitoring:**
- `sentry` - Error tracking

**Real-time:**
- `pusher` - WebSocket communication

## Theme Presets (3 total)

**modern-blue**
```json
{
  "name": "Modern Blue",
  "colors": {
    "primary": "#3b82f6",
    "secondary": "#8b5cf6",
    "accent": "#06b6d4",
    "background": "#ffffff",
    "foreground": "#0f172a"
  },
  "typography": {"fontFamily": "Inter"},
  "spacing": "normal",
  "borderRadius": "md"
}
```

**dark-purple**
```json
{
  "name": "Dark Purple",
  "colors": {
    "primary": "#a855f7",
    "secondary": "#ec4899",
    "accent": "#f59e0b",
    "background": "#0f172a",
    "foreground": "#f8fafc"
  },
  "typography": {"fontFamily": "Inter"},
  "spacing": "normal",
  "borderRadius": "lg"
}
```

**minimal**
```json
{
  "name": "Minimal",
  "colors": {
    "primary": "#000000",
    "secondary": "#404040",
    "accent": "#737373",
    "background": "#ffffff",
    "foreground": "#000000"
  },
  "typography": {"fontFamily": "Inter"},
  "spacing": "relaxed",
  "borderRadius": "none"
}
```

## Rate Limits

| Tier | Projects/Hour | Exports/Day | Deploys/Day | Requests/Minute |
|------|---------------|-------------|-------------|-----------------|
| Free | 10 | 50 | 5 | 30 |
| Pro | 100 | 500 | 50 | 120 |
| Enterprise | 1000 | 5000 | 500 | 600 |

## Response Format

All successful responses:
```json
{
  "success": true,
  "data": { /* response data */ },
  "rateLimit": {
    "limit": 30,
    "remaining": 28,
    "resetAt": "2025-01-15T11:00:00Z"
  }
}
```

All error responses:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": { /* optional */ }
  }
}
```

## Error Codes

- `UNAUTHORIZED` (401) - Invalid/missing API key
- `FORBIDDEN` (403) - Access denied
- `NOT_FOUND` (404) - Resource not found
- `RATE_LIMIT_EXCEEDED` (429) - Too many requests
- `VALIDATION_ERROR` (400) - Invalid request data
- `INTERNAL_ERROR` (500) - Server error

## Files Structure

```
/Users/c/hublab/
├── types/api/
│   └── index.ts (394 lines) - All type definitions
├── lib/api/
│   ├── auth.ts - API key auth & rate limiting
│   ├── middleware.ts - Auth & rate limit middleware
│   ├── schema.sql - Database schema
│   ├── code-generator.ts - Export code generator
│   ├── capsule-catalog.ts - Available capsules catalog
│   ├── examples.md - Usage examples
│   └── README.md - Technical docs
└── app/api/v1/
    ├── projects/
    │   ├── route.ts - GET (list), POST (create)
    │   └── [id]/
    │       ├── route.ts - GET, PUT, DELETE
    │       ├── capsules/
    │       │   ├── route.ts - GET (list), POST (add)
    │       │   └── [capsuleId]/route.ts - GET, PUT, DELETE
    │       ├── integrations/
    │       │   ├── route.ts - GET (list), POST (add)
    │       │   └── [type]/route.ts - GET, DELETE
    │       ├── export/route.ts - POST (export)
    │       ├── deploy/route.ts - POST (deploy)
    │       └── preview/route.ts - POST (preview)
    ├── themes/
    │   ├── route.ts - GET (list)
    │   └── [id]/route.ts - GET
    └── catalog/
        └── capsules/
            ├── route.ts - GET (list)
            └── [type]/route.ts - GET

Total: 20 files created
```

## Next Steps (Phase 4 - Optional)

- TypeScript SDK (`@hublab/sdk`)
- Claude MCP server integration
- ChatGPT plugin
- CLI tool (`hublab-cli`)
- GitHub Actions workflow
- Webhook support
- Real-time collaboration API
- Template marketplace API

## Documentation

- **Interactive Docs**: https://hublab.dev/api-docs
- **Examples**: /lib/api/examples.md
- **Technical**: /lib/api/README.md
- **This File**: /lib/api/API_COMPLETE.md

Built with ❤️ by HubLab
