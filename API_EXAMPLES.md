# 🔌 HubLab Ambient Agent CRM - API Examples

Complete examples for all API endpoints and common use cases.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Approvals API](#approvals-api)
3. [HubSpot OAuth](#hubspot-oauth)
4. [Database Operations](#database-operations)
5. [Event Processing](#event-processing)
6. [Common Workflows](#common-workflows)

---

## 🔐 Authentication

All API requests require authentication via Supabase Auth.

### Server-Side (API Routes)

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  // Get authenticated user
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Use user.id for database queries
  console.log('User ID:', user.id)

  // Your logic here...
}
```

### Client-Side (React Components)

```typescript
// In a React component
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export function MyComponent() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  // Use user.id for API calls
  const fetchData = async () => {
    const response = await fetch('/api/crm/approvals')
    const data = await response.json()
  }
}
```

---

## ✅ Approvals API

### Example 1: Get All Pending Approvals

**Request:**

```bash
curl -X GET 'http://localhost:3000/api/crm/approvals' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "actions": [
      {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "user_id": "user-uuid",
        "event_id": "event-uuid",
        "crm_connection_id": "connection-uuid",
        "action_type": "create_deal",
        "resource_type": "deal",
        "resource_id": null,
        "payload": {
          "dealname": "ACME Corp - Enterprise License",
          "amount": 85000,
          "dealstage": "proposal",
          "closedate": "2025-12-31"
        },
        "status": "pending",
        "confidence": 0.87,
        "justification": "Email from john@acme.com contains purchase order attachment with deal details. Amount extracted from PO document. Company ACME Corp exists in CRM.",
        "requires_approval": true,
        "approved_by": null,
        "approved_at": null,
        "executed_at": null,
        "error_message": null,
        "created_at": "2025-10-29T10:30:00.000Z"
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

### Example 2: Filter Only Actions Requiring Approval

**Request:**

```bash
curl -X GET 'http://localhost:3000/api/crm/approvals?requires_approval=true' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Example 3: Approve an Action

**Request:**

```bash
curl -X POST 'http://localhost:3000/api/crm/approvals' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "action_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "decision": "approve"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Action approved successfully",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "status": "approved",
    "approved_by": "user-uuid",
    "approved_at": "2025-10-29T10:35:00.000Z",
    "executed_at": null
  }
}
```

### Example 4: Reject an Action

**Request:**

```bash
curl -X POST 'http://localhost:3000/api/crm/approvals' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "action_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "decision": "reject"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Action rejected",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "status": "failed",
    "approved_by": "user-uuid",
    "approved_at": "2025-10-29T10:36:00.000Z",
    "error_message": "Rejected by user"
  }
}
```

### Example 5: Batch Approve Multiple Actions

**Request:**

```bash
curl -X PATCH 'http://localhost:3000/api/crm/approvals' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "action_ids": [
      "action-uuid-1",
      "action-uuid-2",
      "action-uuid-3"
    ],
    "decision": "approve"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "3 actions approved successfully",
  "data": {
    "processed": [
      { "id": "action-uuid-1", "status": "approved" },
      { "id": "action-uuid-2", "status": "approved" },
      { "id": "action-uuid-3", "status": "approved" }
    ],
    "errors": []
  }
}
```

### Example 6: React Hook Integration

```typescript
// hooks/usePendingApprovals.ts
import { useState, useEffect } from 'react'
import { CRMAction } from '@/lib/types/crm'

interface ApprovalStats {
  total: number
  high_risk: number
  medium_risk: number
  low_risk: number
  avg_confidence: number
}

export function usePendingApprovals() {
  const [approvals, setApprovals] = useState<CRMAction[]>([])
  const [stats, setStats] = useState<ApprovalStats>({
    total: 0,
    high_risk: 0,
    medium_risk: 0,
    low_risk: 0,
    avg_confidence: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchApprovals = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/crm/approvals?requires_approval=true')

      if (!response.ok) {
        throw new Error('Failed to fetch approvals')
      }

      const result = await response.json()
      setApprovals(result.data.actions)
      setStats(result.data.stats)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApprovals()
  }, [])

  const approve = async (actionId: string) => {
    try {
      const response = await fetch('/api/crm/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_id: actionId,
          decision: 'approve',
        }),
      })

      if (!response.ok) throw new Error('Failed to approve action')

      // Refresh approvals list
      await fetchApprovals()
    } catch (err) {
      console.error('Error approving action:', err)
      throw err
    }
  }

  const reject = async (actionId: string) => {
    try {
      const response = await fetch('/api/crm/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_id: actionId,
          decision: 'reject',
        }),
      })

      if (!response.ok) throw new Error('Failed to reject action')

      await fetchApprovals()
    } catch (err) {
      console.error('Error rejecting action:', err)
      throw err
    }
  }

  const batchApprove = async (actionIds: string[]) => {
    try {
      const response = await fetch('/api/crm/approvals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_ids: actionIds,
          decision: 'approve',
        }),
      })

      if (!response.ok) throw new Error('Failed to batch approve')

      await fetchApprovals()
    } catch (err) {
      console.error('Error batch approving:', err)
      throw err
    }
  }

  return {
    approvals,
    stats,
    loading,
    error,
    approve,
    reject,
    batchApprove,
    refresh: fetchApprovals,
  }
}
```

**Usage in Component:**

```typescript
// app/crm/approvals/page.tsx
'use client'

import { usePendingApprovals } from '@/hooks/usePendingApprovals'

export default function ApprovalsPage() {
  const { approvals, stats, loading, approve, reject } = usePendingApprovals()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Pending Approvals ({stats.total})</h1>

      {approvals.map((action) => (
        <div key={action.id}>
          <h3>{action.action_type}</h3>
          <p>Confidence: {(action.confidence * 100).toFixed(0)}%</p>
          <p>{action.justification}</p>

          <button onClick={() => approve(action.id)}>
            Approve
          </button>
          <button onClick={() => reject(action.id)}>
            Reject
          </button>
        </div>
      ))}
    </div>
  )
}
```

---

## 🔗 HubSpot OAuth

### Example 1: Initiate OAuth Flow

**Browser URL:**

```
http://localhost:3000/api/crm/hubspot/connect
```

This will redirect to HubSpot authorization page.

### Example 2: Handle OAuth Callback

HubSpot will redirect back to:

```
http://localhost:3000/api/crm/hubspot/callback?code=AUTHORIZATION_CODE&state=USER_STATE
```

The callback route automatically:
1. Exchanges code for token
2. Tests connection
3. Saves to database
4. Redirects to `/crm/setup?success=hubspot_connected`

### Example 3: React Button Component

```typescript
// components/HubSpotConnectButton.tsx
'use client'

import { useState } from 'react'

export function HubSpotConnectButton() {
  const [connecting, setConnecting] = useState(false)

  const handleConnect = () => {
    setConnecting(true)
    // Redirect to OAuth flow
    window.location.href = '/api/crm/hubspot/connect'
  }

  return (
    <button
      onClick={handleConnect}
      disabled={connecting}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      {connecting ? 'Connecting...' : 'Connect HubSpot'}
    </button>
  )
}
```

### Example 4: Check Connection Status

```typescript
// hooks/useHubSpotConnection.ts
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { getCRMConnectionByType } from '@/lib/crm-database'

export function useHubSpotConnection() {
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const connection = await getCRMConnectionByType(user.id, 'hubspot')
        setConnected(!!connection && connection.is_active)
      } catch (err) {
        console.error('Error checking connection:', err)
      } finally {
        setLoading(false)
      }
    }

    checkConnection()
  }, [])

  return { connected, loading }
}
```

---

## 🗄️ Database Operations

### Example 1: Create Event

```typescript
import { createEvent } from '@/lib/crm-database'
import { createNormalizer } from '@/lib/capsules/normalizer'

// Raw event from Gmail API
const rawEvent = {
  id: 'gmail-msg-181234567890',
  threadId: 'thread-123',
  from: { email: 'john@acme.com', name: 'John Doe' },
  to: [{ email: 'sales@hublab.dev', name: 'Sales Team' }],
  subject: 'RE: Enterprise License Pricing',
  body: 'Thanks for the demo! We\'d like to proceed with the $50K package. Can you send over the contract by Friday?',
  timestamp: '2025-10-29T10:00:00Z',
}

// Normalize event
const normalizer = createNormalizer()
const normalized = normalizer.normalize(rawEvent)
const fingerprint = normalizer.generateFingerprint(rawEvent)

// Save to database
const event = await createEvent({
  user_id: userId,
  event_id: rawEvent.id,
  event_type: 'email',
  source: 'gmail',
  raw_data: rawEvent,
  normalized_data: normalized,
  fingerprint,
  processed: false,
})

console.log('Event created:', event.id)
```

### Example 2: Create CRM Action from Event

```typescript
import { createCRMAction } from '@/lib/crm-database'

// After processing an event, create an action
const action = await createCRMAction({
  user_id: userId,
  event_id: event.id,
  crm_connection_id: hubspotConnectionId,
  action_type: 'create_deal',
  resource_type: 'deal',
  payload: {
    dealname: 'ACME Corp - Enterprise License',
    amount: 50000,
    dealstage: 'proposal',
    closedate: '2025-12-31',
  },
  confidence: 0.92,
  justification: 'Email mentions $50K package and intent to proceed. Customer requested contract by Friday.',
  requires_approval: false, // High confidence, auto-approve
})

console.log('Action created:', action.id)
```

### Example 3: Get Dashboard Stats

```typescript
import { getDashboardStats } from '@/lib/crm-database'
import { supabase } from '@/lib/supabase'

async function fetchDashboardData() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const stats = await getDashboardStats(user.id)

  console.log('Dashboard Stats:', {
    'Events today': stats.events_processed_today,
    'CRM updates': stats.crm_updates_today,
    'Pending approvals': stats.pending_approvals,
    'Auto-approval rate': `${stats.auto_approval_rate}%`,
  })
}
```

### Example 4: Query Recent Events

```typescript
import { getRecentEvents } from '@/lib/crm-database'

const events = await getRecentEvents(userId, 20)

events.forEach((event) => {
  console.log(`Event: ${event.event_type} from ${event.source}`)
  console.log(`Processed: ${event.processed}`)
  console.log(`Normalized data:`, event.normalized_data)
})
```

### Example 5: Update Action Status

```typescript
import { updateActionStatus } from '@/lib/crm-database'

// Approve action
const approved = await updateActionStatus(actionId, {
  status: 'approved',
  approved_by: userId,
})

// Mark as executed
const executed = await updateActionStatus(actionId, {
  status: 'executed',
})

// Mark as failed
const failed = await updateActionStatus(actionId, {
  status: 'failed',
  error_message: 'HubSpot API returned 429 (rate limit)',
})
```

---

## 🔄 Event Processing

### Complete Event Processing Flow

```typescript
import { createEvent, createCRMAction } from '@/lib/crm-database'
import { createNormalizer } from '@/lib/capsules/normalizer'

async function processIncomingEvent(rawEvent: any, userId: string) {
  // Step 1: Normalize event
  const normalizer = createNormalizer()
  const normalized = normalizer.normalize(rawEvent)
  const fingerprint = normalizer.generateFingerprint(rawEvent)

  // Step 2: Save to database (with dedupe)
  const event = await createEvent({
    user_id: userId,
    event_id: rawEvent.id,
    event_type: 'email',
    source: 'gmail',
    raw_data: rawEvent,
    normalized_data: normalized,
    fingerprint,
  })

  if (!event) {
    console.log('Event already exists, skipping')
    return
  }

  // Step 3: Classify intent and extract data
  const hasDeals = normalized.deals && normalized.deals.length > 0
  const hasHighValueDeal = normalized.deals?.some(d => (d.amount || 0) > 10000)

  if (hasDeals && hasHighValueDeal) {
    // Step 4: Create CRM action
    const deal = normalized.deals![0]

    const action = await createCRMAction({
      user_id: userId,
      event_id: event.id,
      crm_connection_id: 'hubspot-connection-id',
      action_type: 'create_deal',
      resource_type: 'deal',
      payload: {
        dealname: `${normalized.companies[0]?.name || 'New'} - ${deal.stage || 'Opportunity'}`,
        amount: deal.amount,
        dealstage: deal.stage || 'qualification',
      },
      confidence: hasHighValueDeal ? 0.85 : 0.75,
      justification: `Email contains deal amount of $${deal.amount}. ${
        normalized.contacts.length
      } contact(s) identified from ${normalized.companies[0]?.domain}.`,
      requires_approval: deal.amount! > 50000, // High value requires approval
    })

    console.log('Created action:', action.id)
  }

  // Step 5: Mark event as processed
  await markEventAsProcessed(event.id)
}
```

---

## 🔗 HubSpot Client Usage

### Example 1: Upsert Contact

```typescript
import { createHubSpotClient } from '@/lib/crm/hubspot-client'
import { getCRMConnectionByType } from '@/lib/crm-database'

async function syncContactToHubSpot(userId: string, contact: Contact) {
  // Get HubSpot connection
  const connection = await getCRMConnectionByType(userId, 'hubspot')
  if (!connection) throw new Error('HubSpot not connected')

  // Create client
  const client = createHubSpotClient({
    accessToken: connection.oauth_token,
    refreshToken: connection.refresh_token,
  })

  // Upsert contact
  const hubspotContact = await client.upsertContact({
    email: contact.email,
    name: contact.name,
    phone: contact.phone,
  })

  console.log('Contact synced to HubSpot:', hubspotContact.id)
  return hubspotContact
}
```

### Example 2: Create Deal with Contact Association

```typescript
async function createDealInHubSpot(userId: string, dealData: Deal, contactEmail: string) {
  const connection = await getCRMConnectionByType(userId, 'hubspot')
  const client = createHubSpotClient({
    accessToken: connection!.oauth_token,
  })

  // 1. Upsert contact first
  const contact = await client.upsertContact({ email: contactEmail })

  // 2. Create deal
  const deal = await client.createDeal({
    name: dealData.name!,
    amount: dealData.amount,
    stage: dealData.stage || 'qualification',
    close_date: dealData.close_date,
  })

  // 3. Log a note on the deal
  await client.logNote({
    body: `Deal created automatically from email. Contact: ${contactEmail}`,
    dealId: deal.id,
    contactId: contact.id,
  })

  return deal
}
```

### Example 3: Log Post-Meeting Activity

```typescript
async function logMeetingToHubSpot(
  userId: string,
  meeting: {
    title: string
    startTime: string
    endTime: string
    notes: string
    attendees: string[]
  }
) {
  const connection = await getCRMConnectionByType(userId, 'hubspot')
  const client = createHubSpotClient({
    accessToken: connection!.oauth_token,
  })

  // Find/create contacts for attendees
  const contacts = await Promise.all(
    meeting.attendees.map((email) =>
      client.upsertContact({ email })
    )
  )

  // Log meeting
  await client.logMeeting({
    title: meeting.title,
    body: meeting.notes,
    startTime: meeting.startTime,
    endTime: meeting.endTime,
    contactId: contacts[0]?.id,
  })

  console.log('Meeting logged to HubSpot')
}
```

---

## 🎯 Common Workflows

### Workflow 1: Post-Meeting CRM Update

```typescript
import { createEvent, createCRMAction } from '@/lib/crm-database'
import { createNormalizer } from '@/lib/capsules/normalizer'

async function handlePostMeeting(meetingData: any, userId: string) {
  // 1. Create event
  const normalizer = createNormalizer()
  const normalized = normalizer.normalize(meetingData)

  const event = await createEvent({
    user_id: userId,
    event_id: meetingData.meeting_id,
    event_type: 'meeting',
    source: 'google_calendar',
    raw_data: meetingData,
    normalized_data: normalized,
    fingerprint: normalizer.generateFingerprint(meetingData),
  })

  if (!event) return // Already processed

  // 2. Extract action items
  const tasks = normalized.tasks || []

  // 3. Create actions for each task
  for (const task of tasks) {
    await createCRMAction({
      user_id: userId,
      event_id: event.id,
      crm_connection_id: 'hubspot-connection-id',
      action_type: 'create_task',
      resource_type: 'task',
      payload: {
        subject: task.title,
        due_date: task.due_date,
        priority: task.priority,
      },
      confidence: 0.95,
      justification: `Task extracted from meeting notes: "${meetingData.notes}"`,
      requires_approval: false,
    })
  }

  // 4. Log activity
  await createCRMAction({
    user_id: userId,
    event_id: event.id,
    crm_connection_id: 'hubspot-connection-id',
    action_type: 'log_activity',
    resource_type: 'activity',
    payload: {
      type: 'meeting',
      title: meetingData.title,
      notes: meetingData.notes,
      timestamp: meetingData.start_time,
    },
    confidence: 1.0,
    justification: 'Meeting completed, logging activity',
    requires_approval: false,
  })
}
```

### Workflow 2: Email with Purchase Order

```typescript
async function handlePurchaseOrderEmail(emailData: any, userId: string) {
  const normalizer = createNormalizer()
  const normalized = normalizer.normalize(emailData)

  // Check if this looks like a PO
  const hasPOKeywords = /purchase order|po\s+\d+|order confirmation/i.test(
    emailData.subject + ' ' + emailData.body
  )

  if (!hasPOKeywords) return

  // Create event
  const event = await createEvent({
    user_id: userId,
    event_id: emailData.id,
    event_type: 'email',
    source: 'gmail',
    raw_data: emailData,
    normalized_data: normalized,
    fingerprint: normalizer.generateFingerprint(emailData),
  })

  if (!event) return

  // Create deal
  const deal = normalized.deals?.[0]
  if (deal && deal.amount) {
    await createCRMAction({
      user_id: userId,
      event_id: event.id,
      crm_connection_id: 'hubspot-connection-id',
      action_type: 'create_deal',
      resource_type: 'deal',
      payload: {
        dealname: `PO from ${normalized.companies[0]?.name || 'Unknown'}`,
        amount: deal.amount,
        dealstage: 'closedwon',
        closedate: new Date().toISOString().split('T')[0],
      },
      confidence: 0.88,
      justification: `Email contains purchase order with amount $${deal.amount}`,
      requires_approval: deal.amount > 100000, // High value POs need approval
    })
  }
}
```

### Workflow 3: Batch Process Pending Events

```typescript
import { getPendingEvents, markEventAsProcessed } from '@/lib/crm-database'

async function processPendingEvents(userId: string) {
  // Get up to 50 pending events
  const events = await getPendingEvents(userId, 50)

  console.log(`Processing ${events.length} pending events...`)

  for (const event of events) {
    try {
      // Process based on event type
      if (event.event_type === 'email') {
        await handlePurchaseOrderEmail(event.raw_data, userId)
      } else if (event.event_type === 'meeting') {
        await handlePostMeeting(event.raw_data, userId)
      }

      // Mark as processed
      await markEventAsProcessed(event.id)
    } catch (error) {
      console.error(`Failed to process event ${event.id}:`, error)
      // Don't mark as processed so it can be retried
    }
  }
}

// Run every 5 minutes
setInterval(() => processPendingEvents(userId), 5 * 60 * 1000)
```

---

## 🧪 Testing Examples

### Test 1: End-to-End Approval Flow

```typescript
import { createEvent, createCRMAction, updateActionStatus } from '@/lib/crm-database'

async function testApprovalFlow() {
  const userId = 'test-user-id'

  // 1. Create test event
  const event = await createEvent({
    user_id: userId,
    event_id: 'test-event-123',
    event_type: 'email',
    source: 'gmail',
    raw_data: { subject: 'Test' },
    fingerprint: 'test-fingerprint-123',
  })

  // 2. Create action requiring approval
  const action = await createCRMAction({
    user_id: userId,
    event_id: event!.id,
    crm_connection_id: 'test-connection-id',
    action_type: 'create_deal',
    resource_type: 'deal',
    payload: { dealname: 'Test Deal', amount: 100000 },
    confidence: 0.75,
    justification: 'Test action',
    requires_approval: true,
  })

  console.log('Action created:', action.id)
  console.assert(action.status === 'pending')

  // 3. Approve action
  const approved = await updateActionStatus(action.id, {
    status: 'approved',
    approved_by: userId,
  })

  console.log('Action approved:', approved.id)
  console.assert(approved.status === 'approved')
  console.assert(approved.approved_by === userId)

  // 4. Execute action
  const executed = await updateActionStatus(action.id, {
    status: 'executed',
  })

  console.log('Action executed:', executed.id)
  console.assert(executed.status === 'executed')
  console.assert(executed.executed_at !== null)
}
```

### Test 2: Normalizer Extraction

```typescript
import { createNormalizer } from '@/lib/capsules/normalizer'

function testNormalizer() {
  const normalizer = createNormalizer()

  const rawEvent = {
    id: 'test-123',
    subject: 'RE: Enterprise Deal',
    body: `Hi there,

    Thanks for the demo yesterday! We're excited to move forward with the $50,000 enterprise package.

    Our team (john@acme.com, sarah@acme.com) would like to schedule a follow-up call next Tuesday to discuss implementation.

    Please send the contract by Friday.

    Best,
    John Doe
    VP of Sales, ACME Corp`,
    timestamp: new Date().toISOString(),
  }

  const normalized = normalizer.normalize(rawEvent)

  console.log('Extracted contacts:', normalized.contacts)
  // Expected: [{ email: 'john@acme.com' }, { email: 'sarah@acme.com' }]

  console.log('Extracted companies:', normalized.companies)
  // Expected: [{ domain: 'acme.com', name: 'Acme' }]

  console.log('Extracted deals:', normalized.deals)
  // Expected: [{ amount: 50000, stage: 'proposal' }]

  console.log('Extracted tasks:', normalized.tasks)
  // Expected: [
  //   { title: 'schedule a follow-up call next Tuesday', priority: 'medium' },
  //   { title: 'send the contract by Friday', priority: 'high', due_date: '...' }
  // ]
}
```

---

**Last Updated:** October 2025
**Version:** 1.0.0
