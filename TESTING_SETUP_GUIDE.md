# 🧪 Testing Setup Guide - Ambient Agent CRM

**Quick Test Setup (No HubSpot OAuth Required)**

Last Updated: October 29, 2025

---

## 📋 Overview

This guide walks you through setting up the Ambient Agent CRM for local testing. We'll start with a **Quick Test** (Option A) that verifies the integration works without requiring HubSpot OAuth setup.

### What We'll Test
- ✅ Frontend-backend API integration
- ✅ React hooks fetching real data
- ✅ Dashboard displaying statistics
- ✅ Approvals workflow (approve/reject)
- ✅ Events and actions feeds
- ✅ Authentication with Supabase
- ⏭️ HubSpot OAuth (later, optional)

---

## 🚀 Option A: Quick Test (Recommended)

### Prerequisites
- [x] Node.js 18+ installed
- [x] npm or yarn
- [ ] Supabase account (free tier works)

---

## Step 1: Create Supabase Project

### 1.1 Sign up for Supabase
1. Visit: https://supabase.com
2. Click "Start your project" or "Sign in"
3. Create a new organization (if first time)

### 1.2 Create New Project
1. Click "New Project"
2. Fill in:
   - **Name:** hublab-crm
   - **Database Password:** (save this securely!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free
3. Click "Create new project"
4. Wait 2-3 minutes for provisioning

### 1.3 Get API Keys
Once project is ready:

1. Go to **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL** (looks like: https://abc123.supabase.co)
   - **anon/public key** (starts with eyJ...)
   - **service_role key** (starts with eyJ...)

⚠️ **Keep service_role key secret!** Never commit to git.

---

## Step 2: Run Database Migration

### 2.1 Open SQL Editor
1. In Supabase Dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**

### 2.2 Execute Migration
1. Copy the migration file:
   - File: supabase/migrations/001_crm_ambient_agent.sql
   - 346 lines total

2. Paste into Supabase SQL Editor

3. Click **Run** (or press Cmd/Ctrl + Enter)

4. You should see: "Success. No rows returned"

### 2.3 Verify Tables Created
Go to **Table Editor** → You should see 5 new tables:
- crm_connections
- events
- crm_actions
- audit_logs
- capsule_configs

---

## Step 3: Configure Environment Variables

### 3.1 Copy Environment Template
```bash
cd /Users/c/hublab
cp .env.example .env.local
```

### 3.2 Edit .env.local
Replace these values with your Supabase keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
SUPABASE_SERVICE_KEY=eyJ...your-service-role-key

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# HubSpot OAuth (SKIP FOR NOW)
HUBSPOT_CLIENT_ID=skip_for_now
HUBSPOT_CLIENT_SECRET=skip_for_now
HUBSPOT_REDIRECT_URI=http://localhost:3000/api/crm/hubspot/callback
```

---

## Step 4: Install Dependencies & Start Server

```bash
npm install
npm run dev
```

Open: http://localhost:3000

---

## Step 5: Create Test User

### Via Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Email: test@example.com
4. Password: TestPassword123!
5. **Auto Confirm User:** ✅ Check this!
6. Copy the **User UID** (you'll need this)

---

## Step 6: Create Test Data

Run these in Supabase **SQL Editor** (replace USER_ID_HERE with your actual user ID):

### 6.1 Test Event
```sql
INSERT INTO events (
  user_id,
  event_id,
  event_type,
  source,
  raw_data,
  fingerprint,
  processed,
  normalized_data
) VALUES (
  'USER_ID_HERE',
  'test-event-001',
  'email',
  'gmail',
  '{"from": "customer@acme.com", "subject": "Purchase Order #12345"}',
  'fingerprint-001',
  true,
  '{"subject": "Purchase Order #12345", "confidence": 0.92}'::jsonb
);
```

### 6.2 Mock CRM Connection
```sql
INSERT INTO crm_connections (
  user_id,
  crm_type,
  oauth_token,
  refresh_token,
  token_expires_at
) VALUES (
  'USER_ID_HERE',
  'hubspot',
  'mock_token_for_testing',
  'mock_refresh_token',
  NOW() + INTERVAL '30 days'
);
```

### 6.3 Test CRM Action
```sql
INSERT INTO crm_actions (
  user_id,
  event_id,
  crm_connection_id,
  action_type,
  resource_type,
  payload,
  status,
  confidence,
  justification,
  requires_approval
) VALUES (
  'USER_ID_HERE',
  (SELECT id FROM events WHERE event_id = 'test-event-001' LIMIT 1),
  (SELECT id FROM crm_connections WHERE user_id = 'USER_ID_HERE' LIMIT 1),
  'create_deal',
  'deal',
  '{"dealname": "ACME Corp - Enterprise License", "amount": 50000}'::jsonb,
  'pending',
  0.87,
  'Email contains purchase order with clear pricing.',
  true
);
```

---

## Step 7: Test CRM Pages

### 7.1 Dashboard
Visit: http://localhost:3000/crm/dashboard

**Expected:**
- ✅ Stats show: 1 event, 0 updates, 1 pending
- ✅ Recent events feed shows test event
- ✅ No console errors

### 7.2 Approvals
Visit: http://localhost:3000/crm/approvals

**Expected:**
- ✅ One pending action card
- ✅ Shows "ACME Corp - Enterprise License"
- ✅ Confidence badge shows "87%"
- ✅ Risk level shows "Medium"

**Test:**
1. Click **Approve**
2. Action disappears from list
3. Check DB: status should be "approved"

### 7.3 Setup
Visit: http://localhost:3000/crm/setup

**Expected:**
- ✅ CRM connection cards visible
- ✅ HubSpot shows "Connected"
- ✅ Data source toggles visible

---

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] Migration executed (5 tables created)
- [ ] Test user created
- [ ] Test data inserted
- [ ] .env.local configured
- [ ] Dev server running
- [ ] Dashboard loads without errors
- [ ] Stats show correct numbers
- [ ] Approvals page shows test action
- [ ] Approve button works
- [ ] No console errors

---

## 🚫 Known Limitations (Quick Test)

Since we skipped HubSpot OAuth:
- ❌ Can't connect real HubSpot account
- ❌ Can't execute real CRM updates

**This is expected!** The integration testing is complete.

---

## 🎯 Next Steps

**Option 1: Merge & Deploy**
```bash
git checkout main
git merge claude-agent-frontend
git push origin main
```

**Option 2: Add HubSpot OAuth**
- Create HubSpot developer app
- Get OAuth credentials
- Update .env.local
- Test full OAuth flow

---

## 🐛 Troubleshooting

### "Authentication required" errors
```bash
# Check Supabase keys
cat .env.local
# Restart dev server
npm run dev
```

### Tables not found
```sql
-- Verify tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
```

### No data showing
- Verify test data was inserted
- Check user_id matches authenticated user
- Check browser console for errors

---

**Completion Time:** ~15-20 minutes

**Ready to test!** 🚀
