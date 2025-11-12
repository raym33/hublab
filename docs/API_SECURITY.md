# 🔐 API Security Guide - HubLab

Complete guide to securing your HubLab API with rate limiting, validation, and authentication.

## 📋 Overview

HubLab API security includes:
- ✅ **Rate Limiting** - Prevent abuse with request limits
- ✅ **Request Validation** - Type-safe validation with Zod
- ✅ **API Key Authentication** - Secure programmatic access
- ✅ **Permission System** - Granular access control

---

## 🚀 Quick Setup

### Step 1: Set Up Upstash Redis (Rate Limiting)

1. Visit [console.upstash.com](https://console.upstash.com/)
2. Create a new Redis database:
   - **Type:** Regional or Global
   - **Region:** Choose closest to your users
   - **Plan:** Free (10,000 commands/day)

3. Copy credentials:
   - **UPSTASH_REDIS_REST_URL**
   - **UPSTASH_REDIS_REST_TOKEN**

4. Add to `.env.local`:
```bash
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AxxxYourTokenHere
```

### Step 2: Run API Keys Migration

1. Go to Supabase Dashboard → SQL Editor
2. Run the migration:
   - File: `supabase/migrations/002_api_keys.sql`
3. Verify table created: `api_keys`

### Step 3: Add Service Key

Add to `.env.local`:
```bash
SUPABASE_SERVICE_KEY=eyJ...your-service-role-key
```

⚠️ **IMPORTANT:** Never commit service key to git or expose to client!

### Step 4: Restart Server

```bash
npm run dev
```

---

## 🛡️ Rate Limiting

### Available Tiers

| Tier | Limit | Use Case |
|------|-------|----------|
| **Strict** | 10 requests / 10 seconds | Auth endpoints, sensitive operations |
| **Standard** | 30 requests / minute | Most API endpoints |
| **Generous** | 100 requests / minute | Public endpoints, GET requests |
| **AI** | 20 requests / hour | Expensive AI operations |

### Usage Example

```typescript
// app/api/example/route.ts
import { NextRequest } from 'next/server'
import { withRateLimit } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  return withRateLimit(
    request,
    async () => {
      // Your API logic here
      return NextResponse.json({ message: 'Success' })
    },
    'standard' // Rate limit tier
  )
}
```

### Rate Limit Headers

All responses include:
```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 28
X-RateLimit-Reset: 1699564800000
```

### 429 Response

When rate limited:
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again later.",
  "limit": 30,
  "remaining": 0,
  "reset": "2024-11-12T12:00:00.000Z"
}
```

---

## ✅ Request Validation

### Using Zod Schemas

```typescript
import { withValidation, schemas } from '@/lib/api-validation'

export async function POST(request: NextRequest) {
  return withValidation(
    request,
    schemas.createCapsule,
    async (data) => {
      // data is fully typed and validated!
      const { name, description, category } = data

      // Your logic here
      return NextResponse.json({ success: true })
    }
  )
}
```

### Built-in Schemas

```typescript
// Pagination
schemas.pagination
// → { page: number, limit: number }

// Search
schemas.search
// → { q: string, category?: string }

// ID validation
schemas.id
// → { id: string (UUID) }

// Capsule creation
schemas.createCapsule
// → { name, description?, category, tags?, isPublic? }

// Project creation
schemas.createProject
// → { name, description?, framework? }

// AI compilation
schemas.aiCompile
// → { prompt, context?, streaming? }

// GitHub import
schemas.githubImport
// → { url, embedType? }
```

### Custom Schema

```typescript
import { z } from 'zod'
import { withValidation } from '@/lib/api-validation'

const mySchema = z.object({
  email: z.string().email(),
  age: z.number().min(18).max(120),
  role: z.enum(['user', 'admin']),
})

export async function POST(request: NextRequest) {
  return withValidation(request, mySchema, async (data) => {
    // data is typed as { email: string, age: number, role: 'user' | 'admin' }
    return NextResponse.json({ success: true })
  })
}
```

### Validation Error Response

```json
{
  "error": "Validation Error",
  "message": "name: String must contain at least 1 character(s)"
}
```

---

## 🔑 API Key Authentication

### Creating API Keys

#### Via API Endpoint

Create endpoint: `app/api/auth/keys/route.ts`

```typescript
import { generateAPIKey } from '@/lib/api-auth'
import { getServerSession } from 'next-auth'

export async function POST(request: NextRequest) {
  const session = await getServerSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, permissions, expiresInDays } = await request.json()

  const result = await generateAPIKey(
    session.user.id,
    name,
    permissions,
    'standard',
    expiresInDays
  )

  if (!result) {
    return NextResponse.json({ error: 'Failed to create key' }, { status: 500 })
  }

  return NextResponse.json({
    key: result.key,
    id: result.id,
  })
}
```

#### Example Request

```bash
curl -X POST https://hublab.dev/api/auth/keys \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production API Key",
    "permissions": ["capsules:*", "projects:read"],
    "expiresInDays": 365
  }'
```

### Using API Keys

**Option 1: Header**
```bash
curl https://hublab.dev/api/v1/capsules \
  -H "X-API-Key: sk_yourApiKeyHere"
```

**Option 2: Bearer Token**
```bash
curl https://hublab.dev/api/v1/capsules \
  -H "Authorization: Bearer sk_yourApiKeyHere"
```

### Protecting Endpoints

```typescript
import { withAPIAuth, Permissions } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  return withAPIAuth(
    request,
    async (apiKey) => {
      // apiKey contains user_id, permissions, rate_limit_tier, etc.

      return NextResponse.json({
        message: 'Authenticated!',
        userId: apiKey.user_id,
      })
    },
    {
      requiredPermission: Permissions.CAPSULES_READ,
    }
  )
}
```

### Permission System

#### Available Permissions

```typescript
// Capsules
'capsules:read'    // View capsules
'capsules:create'  // Create capsules
'capsules:update'  // Update capsules
'capsules:delete'  // Delete capsules
'capsules:*'       // All capsule operations

// Projects
'projects:read'
'projects:create'
'projects:update'
'projects:delete'
'projects:*'

// AI
'ai:compile'
'ai:improve'
'ai:*'

// Admin
'admin:*'

// All permissions
'*'
```

#### Wildcard Permissions

- `*` - Full access to everything
- `capsules:*` - All capsule operations
- `projects:*` - All project operations

#### Permission Check

```typescript
import { hasPermission } from '@/lib/api-auth'

if (hasPermission(apiKey, 'capsules:create')) {
  // User can create capsules
}
```

---

## 🔗 Combining Security Layers

### Complete Protected Endpoint

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit } from '@/lib/rate-limit'
import { withAPIAuth, Permissions } from '@/lib/api-auth'
import { withValidation, schemas } from '@/lib/api-validation'

export async function POST(request: NextRequest) {
  // Layer 1: Rate limiting
  return withRateLimit(
    request,
    async () => {
      // Layer 2: API key authentication
      return withAPIAuth(
        request,
        async (apiKey) => {
          // Layer 3: Request validation
          return withValidation(
            request,
            schemas.createCapsule,
            async (data) => {
              // All checks passed! Execute logic

              // data is typed and validated
              // apiKey contains user info
              // Rate limit headers added automatically

              return NextResponse.json({
                success: true,
                capsule: data,
              })
            }
          )
        },
        {
          requiredPermission: Permissions.CAPSULES_CREATE,
        }
      )
    },
    apiKey.rate_limit_tier // Use tier from API key
  )
}
```

---

## 📊 Database Schema

### `api_keys` Table

```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  permissions TEXT[] DEFAULT ARRAY['*'],
  rate_limit_tier TEXT DEFAULT 'standard',
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

Users can only:
- View their own API keys
- Create API keys for themselves
- Update their own API keys
- Delete their own API keys

---

## 🧪 Testing

### Test Rate Limiting

```bash
# Make 31 requests quickly (exceeds standard limit of 30/min)
for i in {1..31}; do
  curl https://hublab.dev/api/example
done

# Last request should return 429 Too Many Requests
```

### Test Validation

```bash
# Valid request
curl -X POST https://hublab.dev/api/example \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "category": "UI"}'

# Invalid request (should return 400)
curl -X POST https://hublab.dev/api/example \
  -H "Content-Type: application/json" \
  -d '{"name": "", "category": "INVALID"}'
```

### Test API Key

```bash
# Without API key (should return 401)
curl https://hublab.dev/api/protected

# With API key (should succeed)
curl https://hublab.dev/api/protected \
  -H "X-API-Key: sk_yourApiKeyHere"

# With expired/invalid key (should return 401)
curl https://hublab.dev/api/protected \
  -H "X-API-Key: sk_invalid"
```

---

## 🔐 Security Best Practices

### API Keys

1. **Never commit keys to git**
   - Add `.env.local` to `.gitignore`
   - Use environment variables

2. **Rotate keys regularly**
   - Set expiration dates
   - Delete unused keys

3. **Use least privilege**
   - Grant only necessary permissions
   - Avoid using `*` permission in production

4. **Monitor usage**
   - Check `last_used_at` timestamps
   - Set up alerts for suspicious activity

### Rate Limiting

1. **Choose appropriate tiers**
   - Strict for auth
   - Standard for most APIs
   - Generous for public reads
   - AI for expensive operations

2. **Handle 429 responses**
   - Implement exponential backoff
   - Display friendly error messages
   - Cache responses when possible

### Request Validation

1. **Validate all inputs**
   - Use Zod schemas
   - Don't trust client data
   - Sanitize strings

2. **Return clear errors**
   - Show which field failed
   - Explain validation rules
   - Don't expose internal details

---

## 💰 Upstash Pricing

### Free Tier
- 10,000 commands/day
- 256 MB storage
- Worldwide replication

**Good for:**
- Development
- Small projects
- Low-traffic APIs

### Paid Plans
Start at $10/month:
- 1M+ commands/month
- More storage
- Advanced features

**Recommendation:** Start free, upgrade when needed.

---

## 🚨 Common Issues

### Rate limiting not working

**Symptoms:** No 429 errors even with many requests

**Solutions:**
1. Check Redis credentials in `.env.local`
2. Verify Upstash database is active
3. Check console for warnings
4. Restart dev server

### API key validation failing

**Symptoms:** Always returns 401 Unauthorized

**Solutions:**
1. Check `SUPABASE_SERVICE_KEY` is set
2. Verify API key exists in database
3. Check key hasn't expired
4. Ensure RLS policies are correct

### Validation always failing

**Symptoms:** Always returns 400 Bad Request

**Solutions:**
1. Check request `Content-Type: application/json`
2. Verify JSON is valid
3. Check schema requirements
4. Look at error message for field details

---

## ✅ Checklist

Setup complete when:
- [ ] Upstash Redis configured
- [ ] API keys migration run
- [ ] Service key added to `.env.local`
- [ ] Test endpoint protected
- [ ] Rate limiting tested (429 response)
- [ ] API key created and tested
- [ ] Validation tested (400 response)
- [ ] Production keys created with expiration

---

## 📚 Additional Resources

- [Upstash Redis Docs](https://docs.upstash.com/redis)
- [Zod Documentation](https://zod.dev/)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [API Security Best Practices](https://owasp.org/www-project-api-security/)

---

**Last Updated:** November 12, 2025
**Version:** 1.0
**Status:** Production Ready
