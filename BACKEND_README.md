# 🤖 HubLab Ambient Agent CRM - Backend Documentation

**Version:** 1.0.0
**Date:** October 2025
**Branch:** `claude-agent-backend`

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [API Routes](#api-routes)
5. [Data Access Layer](#data-access-layer)
6. [Capsules](#capsules)
7. [CRM Integrations](#crm-integrations)
8. [Setup & Installation](#setup--installation)
9. [Testing](#testing)
10. [Deployment](#deployment)

---

## 🎯 Overview

The HubLab Ambient Agent CRM backend provides the infrastructure for:

- **Event Processing**: Collecting and normalizing events from multiple sources (Gmail, Calendar, Slack)
- **CRM Integration**: Connecting to external CRMs (HubSpot, Salesforce) via OAuth
- **Action Workflow**: Proposing, approving, and executing CRM updates
- **Audit Trail**: Immutable logging of all CRM changes
- **Modular Capsules**: Pluggable processing units for extensibility

### Key Features

✅ **5 Core Tables** - Optimized schema with RLS policies
✅ **Type-Safe** - Full TypeScript coverage
✅ **OAuth 2.0** - Secure CRM authentication
✅ **Event Deduplication** - Fingerprint-based idempotency
✅ **Approval Workflow** - Human-in-the-loop for high-risk actions
✅ **Audit Logging** - Complete change history
✅ **RESTful APIs** - Standard HTTP endpoints

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
│            React Components + Hooks + UI Pages              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Routes (Next.js)                      │
│  /api/crm/approvals      /api/crm/hubspot/connect          │
│  /api/crm/hubspot/callback                                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Data Access Layer (TypeScript)                 │
│  lib/crm-database.ts - CRUD operations                      │
│  lib/types/crm.ts - Type definitions                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  Database (Supabase)                        │
│  PostgreSQL + Row Level Security + Triggers                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 External CRMs (OAuth)                       │
│  HubSpot    Salesforce    Pipedrive    Zoho                │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript
- **Authentication**: Supabase Auth
- **External APIs**: HubSpot, Salesforce (via OAuth 2.0)
- **ORM**: Supabase Client (direct SQL)

---

## 🗄️ Database Schema

### Tables Overview

| Table | Purpose | Records |
|-------|---------|---------|
| `crm_connections` | OAuth tokens and CRM configs | ~5 per user |
| `events` | Event queue from watchers | ~1000s per user |
| `crm_actions` | Proposed/executed CRM updates | ~100s per user |
| `audit_logs` | Immutable change history | ~1000s per user |
| `capsule_configs` | Per-user capsule settings | ~10 per user |

### Schema Details

#### 1. `crm_connections`

Stores OAuth credentials for external CRMs.

```sql
CREATE TABLE crm_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crm_type TEXT NOT NULL CHECK (crm_type IN ('hubspot', 'salesforce', 'pipedrive', 'zoho')),
  oauth_token TEXT NOT NULL,  -- Encrypted
  refresh_token TEXT,
  instance_url TEXT,  -- For Salesforce
  field_mappings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, crm_type)
);
```

**Indexes:**
- `idx_crm_connections_user_id` on `user_id`
- `idx_crm_connections_is_active` on `is_active`

**RLS Policies:**
- Users can only view/modify their own connections

---

#### 2. `events`

Event queue with deduplication via fingerprints.

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id TEXT UNIQUE NOT NULL,  -- External ID for idempotency
  event_type TEXT NOT NULL CHECK (event_type IN ('email', 'meeting', 'slack', 'call')),
  source TEXT NOT NULL,
  raw_data JSONB NOT NULL,
  normalized_data JSONB,
  fingerprint TEXT NOT NULL,  -- SHA256 hash for dedupe
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
- `idx_events_user_id` on `user_id`
- `idx_events_event_id` on `event_id`
- `idx_events_fingerprint` on `fingerprint`
- `idx_events_processed` on `processed`
- `idx_events_user_processed` on `(user_id, processed)`

**Deduplication:**
- Primary: `event_id` (unique constraint)
- Secondary: `fingerprint` (content hash)

---

#### 3. `crm_actions`

Proposed and executed CRM updates with approval workflow.

```sql
CREATE TABLE crm_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  crm_connection_id UUID REFERENCES crm_connections(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,  -- ID in external CRM
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'executed', 'failed')),
  confidence FLOAT CHECK (confidence >= 0 AND confidence <= 1),
  justification TEXT,
  requires_approval BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  executed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Action Types:**
- `upsert_contact` - Create/update contact
- `upsert_company` - Create/update company
- `create_deal` - Create new deal
- `update_deal_stage` - Move deal stage
- `log_activity` - Add note/meeting
- `create_task` - Create follow-up task

**Status Flow:**
```
pending → approved → executed
       ↘ failed
```

---

#### 4. `audit_logs`

Immutable audit trail for compliance and rollback.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_id UUID REFERENCES crm_actions(id) ON DELETE SET NULL,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  crm_type TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  changes JSONB NOT NULL,  -- { before: {...}, after: {...} }
  justification TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Auto-Logging Trigger:**

When a `crm_actions` status changes to `executed`, a trigger automatically creates an audit log entry.

---

#### 5. `capsule_configs`

Per-user configuration for modular capsules.

```sql
CREATE TABLE capsule_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  capsule_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, capsule_name)
);
```

**Capsule Names:**
- `watcher-gmail`
- `watcher-calendar`
- `normalizer`
- `intent-classifier`
- `crm-hubspot`
- etc.

---

## 🔌 API Routes

### Authentication

All API routes require authentication via Supabase Auth:

```typescript
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

---

### 1. Get Pending Approvals

**Endpoint:** `GET /api/crm/approvals`

**Query Parameters:**
- `requires_approval` (optional): `"true"` to filter only actions requiring approval

**Response:**

```json
{
  "success": true,
  "data": {
    "actions": [
      {
        "id": "uuid",
        "action_type": "create_deal",
        "resource_type": "deal",
        "payload": {
          "dealname": "ACME Corp - Enterprise",
          "amount": 50000
        },
        "status": "pending",
        "confidence": 0.87,
        "justification": "Email contains PO with deal details",
        "requires_approval": true,
        "created_at": "2025-10-29T10:30:00Z"
      }
    ],
    "stats": {
      "total": 3,
      "high_risk": 1,
      "medium_risk": 1,
      "low_risk": 1,
      "avg_confidence": 0.86
    }
  }
}
```

**Risk Levels:**
- `high_risk`: confidence < 0.7
- `medium_risk`: 0.7 ≤ confidence < 0.9
- `low_risk`: confidence ≥ 0.9

---

### 2. Approve/Reject Action

**Endpoint:** `POST /api/crm/approvals`

**Request Body:**

```json
{
  "action_id": "uuid",
  "decision": "approve"  // or "reject"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Action approved successfully",
  "data": {
    "id": "uuid",
    "status": "approved",
    "approved_by": "user-uuid",
    "approved_at": "2025-10-29T10:35:00Z"
  }
}
```

---

### 3. Batch Approve/Reject

**Endpoint:** `PATCH /api/crm/approvals`

**Request Body:**

```json
{
  "action_ids": ["uuid1", "uuid2", "uuid3"],
  "decision": "approve"
}
```

**Response:**

```json
{
  "success": true,
  "message": "3 actions approved successfully",
  "data": {
    "processed": [...],
    "errors": []
  }
}
```

---

### 4. HubSpot OAuth Connect

**Endpoint:** `GET /api/crm/hubspot/connect`

**Flow:**
1. User visits this endpoint
2. Redirects to HubSpot OAuth page
3. User authorizes
4. HubSpot redirects to callback

**Required Env Vars:**
- `HUBSPOT_CLIENT_ID`
- `HUBSPOT_REDIRECT_URI`

---

### 5. HubSpot OAuth Callback

**Endpoint:** `GET /api/crm/hubspot/callback`

**Query Parameters:**
- `code`: Authorization code from HubSpot
- `state`: CSRF protection token

**Flow:**
1. Receives `code` from HubSpot
2. Exchanges code for access token
3. Tests connection
4. Saves to `crm_connections` table
5. Redirects to `/crm/setup?success=hubspot_connected`

---

## 📚 Data Access Layer

All database operations are in `lib/crm-database.ts`.

### CRM Connections

```typescript
import { createCRMConnection, getCRMConnections } from '@/lib/crm-database'

// Create connection
await createCRMConnection({
  user_id: userId,
  crm_type: 'hubspot',
  oauth_token: 'encrypted_token',
  refresh_token: 'refresh_token',
})

// Get all active connections
const connections = await getCRMConnections(userId)
```

### Events

```typescript
import { createEvent, getPendingEvents } from '@/lib/crm-database'

// Create event (with dedupe)
const event = await createEvent({
  user_id: userId,
  event_id: 'gmail-msg-123',
  event_type: 'email',
  source: 'gmail',
  raw_data: { ... },
  fingerprint: 'sha256hash',
})

// Get pending events
const pending = await getPendingEvents(userId, 50)
```

### CRM Actions

```typescript
import {
  createCRMAction,
  getPendingActions,
  updateActionStatus
} from '@/lib/crm-database'

// Create action
await createCRMAction({
  user_id: userId,
  event_id: eventId,
  crm_connection_id: connectionId,
  action_type: 'create_deal',
  resource_type: 'deal',
  payload: { dealname: 'ACME Corp', amount: 50000 },
  confidence: 0.87,
  justification: 'Email contains PO',
  requires_approval: true,
})

// Approve action
await updateActionStatus(actionId, {
  status: 'approved',
  approved_by: userId,
})
```

### Dashboard Stats

```typescript
import { getDashboardStats } from '@/lib/crm-database'

const stats = await getDashboardStats(userId)
// Returns:
// {
//   events_processed_today: 247,
//   crm_updates_today: 89,
//   pending_approvals: 3,
//   auto_approval_rate: 94
// }
```

---

## 🧩 Capsules

Capsules are modular processing units. Currently implemented:

### Normalizer Capsule

**File:** `lib/capsules/normalizer.ts`

**Purpose:** Normalize events from different sources into consistent format.

**Usage:**

```typescript
import { createNormalizer } from '@/lib/capsules/normalizer'

const normalizer = createNormalizer()

// Normalize event
const normalized = normalizer.normalize(rawEvent)
// Returns:
// {
//   event_id: 'gmail-msg-123',
//   type: 'email',
//   timestamp: '2025-10-29T10:00:00Z',
//   contacts: [{ email: 'john@acme.com', name: 'John Doe' }],
//   companies: [{ domain: 'acme.com', name: 'ACME' }],
//   deals: [{ amount: 50000, stage: 'proposal' }],
//   tasks: [{ title: 'Send proposal by Friday', priority: 'high' }]
// }

// Generate fingerprint for dedupe
const fingerprint = normalizer.generateFingerprint(rawEvent)
```

**Extraction Capabilities:**
- ✅ Email addresses (with regex)
- ✅ Company domains (excluding common providers)
- ✅ Deal amounts ($50K, €1,000, etc.)
- ✅ Deal stages (demo, proposal, negotiation)
- ✅ Tasks ("next step:", "follow up", "schedule")
- ✅ Due dates ("by Friday", "next week")

---

## 🔗 CRM Integrations

### HubSpot Client

**File:** `lib/crm/hubspot-client.ts`

**Usage:**

```typescript
import { createHubSpotClient } from '@/lib/crm/hubspot-client'

const client = createHubSpotClient({
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
})

// Test connection
const isConnected = await client.testConnection()

// Contacts
const contact = await client.upsertContact({
  email: 'john@acme.com',
  name: 'John Doe',
  phone: '+1234567890',
})

// Companies
const company = await client.upsertCompany({
  domain: 'acme.com',
  name: 'ACME Corp',
  industry: 'Technology',
})

// Deals
const deal = await client.createDeal({
  name: 'ACME Corp - Enterprise License',
  amount: 50000,
  stage: 'proposal',
  close_date: '2025-12-31',
})

// Update deal stage
await client.updateDealStage(dealId, 'negotiation')

// Log note
await client.logNote({
  body: 'Great demo call. Next step: send proposal.',
  contactId: 'contact-123',
  dealId: 'deal-456',
})

// Log meeting
await client.logMeeting({
  title: 'Demo with ACME',
  body: 'Showed enterprise features',
  startTime: '2025-10-29T14:00:00Z',
  endTime: '2025-10-29T15:00:00Z',
  contactId: 'contact-123',
})
```

**OAuth Methods:**

```typescript
// Exchange code for token
const tokens = await HubSpotClient.exchangeCodeForToken(code)

// Refresh token
const newTokens = await HubSpotClient.refreshAccessToken(refreshToken)
```

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18+
- Supabase account
- HubSpot developer account (for OAuth)

### Environment Variables

Create `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# HubSpot OAuth
HUBSPOT_CLIENT_ID=your_hubspot_client_id
HUBSPOT_CLIENT_SECRET=your_hubspot_client_secret
HUBSPOT_REDIRECT_URI=https://yourdomain.com/api/crm/hubspot/callback

# App URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Database Migration

1. Go to Supabase SQL Editor
2. Copy contents of `supabase/migrations/001_crm_ambient_agent.sql`
3. Execute the migration

Or use Supabase CLI:

```bash
supabase migration up
```

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

---

## 🧪 Testing

### Test API Endpoints

Use Thunder Client or Postman:

**1. Test Approvals API:**

```bash
curl http://localhost:3000/api/crm/approvals \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN"
```

**2. Test HubSpot Connect:**

```bash
# Visit in browser:
http://localhost:3000/api/crm/hubspot/connect
```

### Test Database Functions

```typescript
// In a test file or script
import { createEvent } from '@/lib/crm-database'

const event = await createEvent({
  user_id: 'test-user-uuid',
  event_id: 'test-event-123',
  event_type: 'email',
  source: 'gmail',
  raw_data: { subject: 'Test' },
  fingerprint: 'test-fingerprint',
})

console.log('Event created:', event)
```

---

## 🚀 Deployment

### Vercel Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Supabase Setup

1. Run migration in Supabase SQL editor
2. Enable RLS on all tables (already in migration)
3. Configure authentication

### HubSpot App Setup

1. Create app in HubSpot Developer Portal
2. Configure OAuth redirect URI: `https://yourdomain.com/api/crm/hubspot/callback`
3. Add required scopes:
   - `crm.objects.contacts.read`
   - `crm.objects.contacts.write`
   - `crm.objects.companies.read`
   - `crm.objects.companies.write`
   - `crm.objects.deals.read`
   - `crm.objects.deals.write`

---

## 📊 Performance Considerations

### Database Indexes

All critical queries have indexes:
- `events` by `user_id` and `processed`
- `crm_actions` by `user_id` and `status`
- Compound indexes for common query patterns

### Rate Limiting

HubSpot API limits:
- 10 requests/second
- 250,000 daily limit

Implement rate limiting in production with Redis or similar.

### Caching

Consider caching:
- Dashboard stats (1 minute TTL)
- Recent events (30 seconds TTL)
- CRM connection status (5 minutes TTL)

---

## 🔐 Security

### OAuth Token Storage

⚠️ **Important:** Current implementation stores tokens as plain text. In production:

1. Encrypt tokens using AES-256
2. Use Supabase Vault for key management
3. Rotate tokens regularly

### Row Level Security

All tables have RLS policies ensuring users can only access their own data.

### CSRF Protection

OAuth state parameter includes:
- User ID
- Timestamp
- Random nonce

Verify state in callback to prevent CSRF attacks.

---

## 📝 Next Steps

### Phase 2 (Future):

1. **Watchers** - Implement Gmail/Calendar polling
2. **Intent Classifier** - Add rule-based classification
3. **LLM Reasoning** - Integrate Claude/GPT for extraction
4. **Salesforce** - Add second CRM connector
5. **Event Bus** - Postgres NOTIFY for real-time
6. **Webhooks** - Calendar/Gmail webhooks instead of polling

---

## 🐛 Troubleshooting

### "Unauthorized" errors

- Check Supabase auth token
- Verify user is logged in
- Check RLS policies are enabled

### HubSpot OAuth fails

- Verify `HUBSPOT_CLIENT_ID` and `HUBSPOT_CLIENT_SECRET`
- Check redirect URI matches exactly
- Ensure scopes are correct in HubSpot app

### Database errors

- Run migration: `supabase migration up`
- Check table exists: `SELECT * FROM crm_connections LIMIT 1;`
- Verify RLS: `SELECT tablename, policyname FROM pg_policies;`

---

## 📞 Support

- **Documentation**: See `AMBIENT_AGENT_CRM_ARCHITECTURE.md`
- **API Reference**: See this file
- **Frontend Integration**: See `CRM_UI_DESIGN.md`

---

**Last Updated:** October 2025
**Version:** 1.0.0
**Status:** Production Ready (Phase 1)
