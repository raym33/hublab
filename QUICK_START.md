# ⚡ Quick Start Guide - HubLab Ambient Agent CRM

Get up and running in **15 minutes**.

---

## 📋 Prerequisites

- **Node.js** 18+ installed
- **Git** installed
- **Supabase account** (free tier OK)
- **Code editor** (VS Code recommended)

---

## 🚀 Step-by-Step Setup

### Step 1: Clone Repository (2 minutes)

```bash
# Clone the repo
git clone https://github.com/hublabdev/hublab.git
cd hublab

# Install dependencies
npm install
```

Expected output:
```
added 500+ packages in 45s
```

---

### Step 2: Create Supabase Project (3 minutes)

1. Go to https://supabase.com
2. Click "New Project"
3. Fill in details:
   - **Name:** hublab-crm
   - **Database Password:** Choose strong password
   - **Region:** Choose closest to you
4. Wait ~2 minutes for project to be ready

---

### Step 3: Get Supabase Credentials (2 minutes)

In your Supabase dashboard:

1. Go to **Settings** > **API**
2. Copy these three values:
   - `Project URL` → This is your SUPABASE_URL
   - `anon public` key → This is your ANON_KEY
   - `service_role` key → This is your SERVICE_KEY

---

### Step 4: Configure Environment (2 minutes)

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local with your editor
code .env.local  # or nano .env.local
```

Replace these values:

```bash
# ===========================================
# REQUIRED - Supabase Configuration
# ===========================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ===========================================
# REQUIRED - Application URLs
# ===========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ===========================================
# OPTIONAL - HubSpot (skip for now)
# ===========================================
HUBSPOT_CLIENT_ID=skip_for_now
HUBSPOT_CLIENT_SECRET=skip_for_now
HUBSPOT_REDIRECT_URI=http://localhost:3000/api/crm/hubspot/callback
```

Save and close the file.

---

### Step 5: Run Database Migration (3 minutes)

1. Go to Supabase Dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy entire contents of `supabase/migrations/001_crm_ambient_agent.sql`
5. Paste into SQL Editor
6. Click **Run** (bottom right)
7. Wait for success message

Expected output:
```
Success. No rows returned
```

You should now see 5 new tables:
- crm_connections
- events
- crm_actions
- audit_logs
- capsule_configs

---

### Step 6: Start Development Server (1 minute)

```bash
npm run dev
```

Expected output:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

---

### Step 7: Test the Application (2 minutes)

Open your browser and visit:

**1. Main Dashboard:**
```
http://localhost:3000/crm/dashboard
```

You should see:
- ✅ 4 stat cards (all showing 0s - that's normal!)
- ✅ Recent Events section (empty - that's normal!)
- ✅ CRM Actions section (empty - that's normal!)

**2. Approvals Page:**
```
http://localhost:3000/crm/approvals
```

You should see:
- ✅ Stats bar with 0 pending approvals
- ✅ "No pending approvals" message

**3. Setup Page:**
```
http://localhost:3000/crm/setup
```

You should see:
- ✅ HubSpot card (Not connected)
- ✅ Salesforce card (Coming soon)

---

## ✅ Success Checklist

- [ ] Project cloned and dependencies installed
- [ ] Supabase project created
- [ ] .env.local configured with credentials
- [ ] Database migration ran successfully
- [ ] Dev server starts without errors
- [ ] Dashboard page loads
- [ ] Approvals page loads
- [ ] Setup page loads

**If all checked, you're ready to go!** 🎉

---

## 🧪 Optional: Test with Sample Data

Want to see the UI with data? Let's add some test data!

### Add Test Event

1. Go to Supabase Dashboard
2. Click **SQL Editor**
3. Click **New Query**
4. Paste this:

```sql
-- Get your user ID first
SELECT id, email FROM auth.users LIMIT 1;

-- Copy your user ID from the result, then run this:
-- Replace 'YOUR-USER-ID-HERE' with your actual user ID

INSERT INTO events (
  user_id,
  event_id,
  event_type,
  source,
  raw_data,
  normalized_data,
  fingerprint,
  processed
) VALUES (
  'YOUR-USER-ID-HERE',
  'test-event-001',
  'email',
  'gmail',
  '{"subject": "RE: Enterprise Demo", "from": "john@acme.com"}',
  '{"contacts": [{"email": "john@acme.com", "name": "John Doe"}], "companies": [{"domain": "acme.com", "name": "ACME"}]}',
  'fingerprint-001',
  true
);

-- Add a test action
INSERT INTO crm_actions (
  user_id,
  action_type,
  resource_type,
  payload,
  status,
  confidence,
  justification,
  requires_approval
) VALUES (
  'YOUR-USER-ID-HERE',
  'create_deal',
  'deal',
  '{"dealname": "ACME Corp - Enterprise", "amount": 50000}',
  'pending',
  0.87,
  'Email contains purchase intent and deal amount',
  true
);
```

5. Click **Run**
6. Refresh Dashboard: http://localhost:3000/crm/dashboard
7. You should now see:
   - Events Today: 1
   - Recent event in feed
   - Recent action in feed

### Add Test Approval

Already added in previous step! Visit:
```
http://localhost:3000/crm/approvals
```

You should see 1 pending approval for the ACME Corp deal.

---

## 🎯 Next Steps

### Learn the System

1. **Read Documentation:**
   - [README_DOCS.md](README_DOCS.md) - Documentation index
   - [PROJECT_STATUS_FINAL.md](PROJECT_STATUS_FINAL.md) - Project overview
   - [API_COMPLETE_REFERENCE.md](API_COMPLETE_REFERENCE.md) - API reference

2. **Explore the Code:**
   - `lib/crm-database.ts` - Database operations
   - `hooks/useCRMStats.ts` - Dashboard hook
   - `app/api/crm/stats/route.ts` - Stats API

3. **Test Features:**
   - Create more test data in Supabase
   - Try approving/rejecting actions
   - Explore the normalizer capsule

### Connect HubSpot (Optional)

1. Create HubSpot developer account
2. Create new app
3. Get OAuth credentials
4. Update `.env.local` with real values
5. Visit: http://localhost:3000/crm/setup
6. Click "Connect HubSpot"

See [HUBSPOT_SETUP.md](#) for detailed instructions.

### Deploy to Production

When ready to deploy:

1. **Read:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
2. **Setup:** Vercel account
3. **Deploy:** Push to main branch
4. **Configure:** Environment variables in Vercel

---

## 🆘 Troubleshooting

### "Cannot find module '@/lib/supabase'"

**Solution:**
```bash
# Restart dev server
npm run dev
```

### "Unauthorized" errors

**Solution:**
1. Check `.env.local` has correct Supabase credentials
2. Verify you're logged in (auth flow not yet implemented in quick start)
3. For testing, create a user in Supabase:
   - Dashboard > Authentication > Users > Add user

### Database errors

**Solution:**
1. Verify migration ran successfully
2. Check tables exist: Dashboard > Table Editor
3. Re-run migration if needed

### Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Nothing shows on Dashboard

**Solution:**
This is normal! You need data:
1. Follow "Test with Sample Data" section above
2. Or connect HubSpot and let events flow in
3. Or build a watcher to collect events

---

## 📞 Need Help?

### Resources

- **Documentation Index:** [README_DOCS.md](README_DOCS.md)
- **Troubleshooting Guide:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **API Reference:** [API_COMPLETE_REFERENCE.md](API_COMPLETE_REFERENCE.md)
- **GitHub Issues:** https://github.com/hublabdev/hublab/issues

### Common Questions

**Q: Why is everything empty?**
A: You need to either add test data or connect a real CRM. The system is working, just no events yet!

**Q: Do I need HubSpot to test?**
A: No! You can test with sample data first. HubSpot is optional for full CRM integration.

**Q: How do I add authentication?**
A: Supabase Auth is already configured. You can add login UI or test with direct DB inserts.

**Q: Can I use PostgreSQL instead of Supabase?**
A: Supabase *is* PostgreSQL! It's a hosted Postgres with extras (Auth, Storage, Realtime).

---

## ⏱️ Time Breakdown

- Clone & Install: 2 min
- Supabase Setup: 3 min
- Credentials: 2 min
- Environment: 2 min
- Migration: 3 min
- Start Server: 1 min
- Test App: 2 min

**Total:** ~15 minutes

---

## 🎉 You're Ready!

Congratulations! You have:
- ✅ Local development environment running
- ✅ Database configured and migrated
- ✅ All pages loading correctly
- ✅ API endpoints responding

**Next:**
- Add test data
- Explore the code
- Read the documentation
- Build new features
- Deploy to production

**Happy coding!** 🚀

---

**Last Updated:** October 2025
**Version:** 1.0.0
**Estimated Time:** 15 minutes
