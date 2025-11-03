# HubLab API Implementation

Complete REST API implementation for programmatic access to HubLab.

## Overview

The HubLab API allows AI agents and developers to create, manage, and deploy web applications programmatically. This implementation includes:

- ✅ RESTful API endpoints
- ✅ API key authentication with tiered rate limiting
- ✅ CRUD operations for projects
- ✅ Template-based project creation
- ✅ Theme customization
- ✅ Comprehensive error handling
- ✅ CORS support
- ✅ Type-safe TypeScript implementation

## Architecture

```
/Users/c/hublab/
├── types/api/
│   └── index.ts              # Complete API type definitions
├── lib/api/
│   ├── auth.ts               # API key authentication & validation
│   ├── middleware.ts         # Auth & rate limiting middleware
│   ├── schema.sql            # Supabase database schema
│   ├── examples.md           # API usage examples
│   └── README.md             # This file
└── app/api/v1/
    └── projects/
        ├── route.ts          # GET (list), POST (create)
        └── [id]/
            └── route.ts      # GET, PUT, DELETE (single project)
```

## Database Schema

The API uses Supabase (PostgreSQL) with the following tables:

### `api_keys`
- Stores API keys with tier-based rate limits
- Row Level Security (RLS) enabled
- Users can only access their own keys

### `api_usage`
- Tracks API usage for rate limiting
- Automatically cleaned up after 30 days
- Indexed for efficient queries

### Setup

Run the SQL schema:
```bash
psql $DATABASE_URL < lib/api/schema.sql
```

Or in Supabase SQL Editor:
1. Go to SQL Editor
2. Paste contents of `lib/api/schema.sql`
3. Run query

## Environment Variables

Required environment variables:

```bash
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Service role key for API operations (add this)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get the service role key from:
- Supabase Dashboard → Settings → API → service_role key

## API Endpoints

### Projects

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| POST | `/api/v1/projects` | Create new project | projectsPerHour |
| GET | `/api/v1/projects` | List all projects | requestsPerMinute |
| GET | `/api/v1/projects/:id` | Get project details | requestsPerMinute |
| PUT | `/api/v1/projects/:id` | Update project | requestsPerMinute |
| DELETE | `/api/v1/projects/:id` | Delete project | requestsPerMinute |

## Rate Limits

| Tier | Projects/Hour | Exports/Day | Deploys/Day | Requests/Minute |
|------|---------------|-------------|-------------|-----------------|
| Free | 10 | 50 | 5 | 30 |
| Pro | 100 | 500 | 50 | 120 |
| Enterprise | 1000 | 5000 | 500 | 600 |

## Authentication

All API requests require an API key in the Authorization header:

```bash
Authorization: Bearer hublab_sk_your_api_key_here
```

### API Key Format

- Prefix: `hublab_sk_`
- Length: 64 hexadecimal characters
- Example: `hublab_sk_a1b2c3d4e5f6...`

### Creating API Keys

API keys are created through the dashboard UI (to be implemented) or programmatically:

```typescript
import { createAPIKey } from '@/lib/api/auth'

const { success, apiKey, error } = await createAPIKey(
  userId,
  'My API Key',
  'pro' // tier: 'free' | 'pro' | 'enterprise'
)
```

## Templates

Available project templates:

- `blank` - Empty project
- `dashboard` - Analytics dashboard with sidebar, stats, and charts
- `landing` - Marketing landing page with hero and features
- `ecommerce` - Online store with product grid and cart
- `admin` - Admin panel with data table and user management
- `blog` - Blog with post grid and categories

Each template includes:
- Pre-configured capsules (components)
- Recommended integrations
- Default theme

## Themes

### Preset Themes

- `modern-blue` - Blue color scheme, Inter font
- `dark-purple` - Dark background, purple/pink accents
- `minimal` - Black and white, clean design

### Custom Themes

You can provide a custom theme object:

```json
{
  "name": "Custom Theme",
  "colors": {
    "primary": "#ff6b6b",
    "secondary": "#4ecdc4",
    "accent": "#ffe66d",
    "background": "#1a1a2e",
    "foreground": "#ffffff"
  },
  "typography": {
    "fontFamily": "Poppins",
    "headingFont": "Playfair Display"
  },
  "spacing": "relaxed",
  "borderRadius": "lg"
}
```

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional additional context
  }
}
```

### Error Codes

- `UNAUTHORIZED` - Invalid or missing API key (401)
- `FORBIDDEN` - Access denied (403)
- `NOT_FOUND` - Resource not found (404)
- `RATE_LIMIT_EXCEEDED` - Too many requests (429)
- `VALIDATION_ERROR` - Invalid request data (400)
- `INTERNAL_ERROR` - Server error (500)

## CORS

The API supports CORS for browser-based requests:

- Origin: `*` (allow all)
- Methods: `GET, POST, PUT, DELETE, PATCH, OPTIONS`
- Headers: `Content-Type, Authorization`

## Response Headers

All responses include:

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 8
X-RateLimit-Reset: 2025-01-15T11:00:00Z
Access-Control-Allow-Origin: *
```

## Usage Examples

See [examples.md](./examples.md) for comprehensive examples including:

- Creating projects with different templates
- Listing and filtering projects
- Updating projects
- Error handling
- Python examples
- JavaScript/TypeScript examples
- Postman collection

## Security Features

1. **API Key Authentication**: All requests validated against database
2. **Rate Limiting**: Prevents abuse with tiered limits
3. **User Isolation**: Users can only access their own resources (RLS)
4. **Input Validation**: All inputs validated before processing
5. **SQL Injection Protection**: Using Supabase prepared statements
6. **HTTPS Only**: API only accessible via HTTPS

## Next Steps

### Phase 2: Additional Operations
- [ ] Add capsule management endpoints
- [ ] Theme configuration endpoints
- [ ] Data source management
- [ ] Integration configuration

### Phase 3: Export & Deploy
- [ ] Export endpoints (Next.js, React, HTML, Vue)
- [ ] Deploy endpoints (Vercel, Netlify, Cloudflare)
- [ ] Preview URL generation

### Phase 4: SDK & Tools
- [ ] TypeScript SDK (`@hublab/sdk`)
- [ ] Claude MCP server
- [ ] ChatGPT plugin
- [ ] CLI tool

## Testing

### Manual Testing

1. Set API key environment variable:
```bash
export HUBLAB_API_KEY="hublab_sk_..."
```

2. Test create project:
```bash
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Authorization: Bearer $HUBLAB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Dashboard",
    "template": "dashboard",
    "theme": "modern-blue"
  }'
```

3. Verify response includes project ID and capsules

### Integration Tests

Create test suite:
```typescript
import { createAPIKey } from '@/lib/api/auth'

describe('HubLab API', () => {
  let apiKey: string

  beforeAll(async () => {
    const { apiKey: key } = await createAPIKey(testUserId, 'Test Key', 'free')
    apiKey = key
  })

  test('creates project', async () => {
    const response = await fetch('/api/v1/projects', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test Project',
        template: 'blank'
      })
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
  })
})
```

## Documentation

- **API Docs Page**: `/api-docs` - Interactive documentation with examples
- **Examples File**: `lib/api/examples.md` - Complete curl, Python, and JS examples
- **Type Definitions**: `types/api/index.ts` - Full TypeScript types

## Monitoring

Monitor API usage:

```sql
-- Recent API usage
SELECT
  ak.name,
  ak.tier,
  COUNT(*) as requests,
  MAX(au.created_at) as last_request
FROM api_usage au
JOIN api_keys ak ON au.api_key_id = ak.id
WHERE au.created_at > NOW() - INTERVAL '1 hour'
GROUP BY ak.id, ak.name, ak.tier
ORDER BY requests DESC;

-- Rate limit violations
SELECT
  api_key_id,
  action_type,
  COUNT(*) as count,
  DATE_TRUNC('hour', created_at) as hour
FROM api_usage
GROUP BY api_key_id, action_type, hour
HAVING COUNT(*) > 100
ORDER BY hour DESC;
```

## Support

- **Documentation**: https://hublab.dev/api-docs
- **Examples**: lib/api/examples.md
- **Issues**: GitHub repository
- **Email**: support@hublab.dev
