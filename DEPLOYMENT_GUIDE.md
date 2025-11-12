# 🚀 Deployment Guide - HubLab Ambient Agent CRM

Complete guide to deploying HubLab to production.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Vercel Deployment](#vercel-deployment)
3. [Supabase Production Setup](#supabase-production-setup)
4. [Environment Variables](#environment-variables)
5. [HubSpot OAuth Setup](#hubspot-oauth-setup)
6. [Post-Deployment Testing](#post-deployment-testing)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Rollback Procedures](#rollback-procedures)

---

## ✅ Prerequisites

Before deploying, ensure you have:

- [ ] Code tested locally
- [ ] All features working in development
- [ ] Supabase production project ready
- [ ] Domain name (optional but recommended)
- [ ] Vercel account (free tier OK)
- [ ] HubSpot developer account (if using OAuth)
- [ ] Git repository (GitHub, GitLab, Bitbucket)

---

## 🌐 Vercel Deployment

### Step 1: Prepare Repository (5 min)

1. **Ensure clean git status:**
```bash
git status
# Should show: nothing to commit, working tree clean
```

2. **Merge all branches:**
```bash
git checkout main
git merge claude-agent-frontend  # Contains both backend + frontend
git push origin main
```

3. **Verify build works locally:**
```bash
npm run build
# Should complete without errors
```

---

### Step 2: Create Vercel Project (5 min)

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click "Add New" > "Project"

2. **Import Git Repository:**
   - Select your Git provider (GitHub recommended)
   - Find and select your repository
   - Click "Import"

3. **Configure Project:**
   - **Project Name:** hublab (or your choice)
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** ./
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

4. **Don't deploy yet!** Click "Configure Project" first

---

### Step 3: Configure Environment Variables (10 min)

In Vercel project settings:

1. **Click "Environment Variables" tab**

2. **Add required variables:**

```bash
# ===========================================
# Supabase Configuration (REQUIRED)
# ===========================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ===========================================
# Application URLs (REQUIRED)
# ===========================================
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# ===========================================
# HubSpot OAuth (OPTIONAL)
# ===========================================
HUBSPOT_CLIENT_ID=your-production-client-id
HUBSPOT_CLIENT_SECRET=your-production-client-secret
HUBSPOT_REDIRECT_URI=https://your-domain.vercel.app/api/crm/hubspot/callback

# ===========================================
# Email (OPTIONAL)
# ===========================================
RESEND_API_KEY=your-resend-api-key

# ===========================================
# Payments (OPTIONAL)
# ===========================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-key
STRIPE_SECRET_KEY=your-stripe-secret
```

3. **Select environments for each variable:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Click "Add" for each variable**

---

### Step 4: Deploy (5 min)

1. **Click "Deploy"**

2. **Wait for build:**
   - Takes ~2-5 minutes
   - Watch logs for errors

3. **If successful:**
   - You'll see "Congratulations! Your project is live"
   - Note your URL: `https://your-project.vercel.app`

4. **If failed:**
   - Click "View Function Logs"
   - Fix errors
   - Redeploy

---

## 🗄️ Supabase Production Setup

### Step 1: Create Production Project (5 min)

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard

2. **Create new project:**
   - **Organization:** Select or create
   - **Name:** hublab-production
   - **Database Password:** Strong password (save it!)
   - **Region:** Choose closest to your users
   - **Plan:** Pro recommended for production ($25/mo)

3. **Wait for project to initialize** (~2 minutes)

---

### Step 2: Run Database Migration (5 min)

1. **Go to SQL Editor:**
   - Left sidebar > SQL Editor
   - Click "New Query"

2. **Copy migration file:**
```bash
# On your computer
cat supabase/migrations/001_crm_ambient_agent.sql
# Copy entire contents
```

3. **Paste and run:**
   - Paste into SQL Editor
   - Click "Run" (bottom right)
   - Wait for "Success. No rows returned"

4. **Verify tables:**
   - Left sidebar > Table Editor
   - Should see 5 tables:
     - crm_connections
     - events
     - crm_actions
     - audit_logs
     - capsule_configs

---

### Step 3: Configure Authentication (5 min)

1. **Enable email authentication:**
   - Authentication > Providers
   - Enable "Email"
   - Configure email templates (optional)

2. **Configure redirect URLs:**
   - Authentication > URL Configuration
   - **Site URL:** `https://your-domain.vercel.app`
   - **Redirect URLs:**
     - `https://your-domain.vercel.app/**`
     - `https://your-domain.vercel.app/auth/callback`

3. **Set JWT expiry:**
   - Authentication > Settings
   - **JWT Expiry:** 3600 seconds (1 hour) recommended

---

### Step 4: Get Production Credentials (2 min)

1. **Go to Settings > API:**

2. **Copy these values:**
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → Use for `SUPABASE_SERVICE_KEY`

3. **Update Vercel environment variables**
   (if not done already in Step 3)

---

## 🔐 Environment Variables

### Required Variables

| Variable | Source | Example |
|----------|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Settings > API | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Settings > API | `eyJhbGci...` |
| `SUPABASE_SERVICE_KEY` | Supabase Settings > API | `eyJhbGci...` |
| `NEXT_PUBLIC_APP_URL` | Your Vercel domain | `https://hublab.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel domain | `https://hublab.vercel.app` |

### Optional Variables (HubSpot)

| Variable | Source | Example |
|----------|--------|---------|
| `HUBSPOT_CLIENT_ID` | HubSpot Developer Portal | `abc123...` |
| `HUBSPOT_CLIENT_SECRET` | HubSpot Developer Portal | `def456...` |
| `HUBSPOT_REDIRECT_URI` | Your callback URL | `https://hublab.vercel.app/api/crm/hubspot/callback` |

### How to Update Variables

**In Vercel:**
1. Dashboard > Your Project > Settings
2. Environment Variables
3. Edit or add variables
4. Click "Save"
5. **Redeploy** for changes to take effect

---

## 🔗 HubSpot OAuth Setup

### Step 1: Create Production App (10 min)

1. **Go to HubSpot Developer Portal:**
   - https://developers.hubspot.com/
   - Login or create account

2. **Create new app:**
   - Apps > "Create app"
   - **App name:** HubLab Ambient Agent CRM
   - **Description:** Automated CRM updates from emails and meetings

3. **Configure Auth:**
   - Click "Auth" tab
   - **Redirect URLs:** Add:
     ```
     https://your-domain.vercel.app/api/crm/hubspot/callback
     ```
   - **Scopes:** Select:
     - ✅ crm.objects.contacts.read
     - ✅ crm.objects.contacts.write
     - ✅ crm.objects.companies.read
     - ✅ crm.objects.companies.write
     - ✅ crm.objects.deals.read
     - ✅ crm.objects.deals.write
     - ✅ crm.schemas.contacts.read
     - ✅ crm.schemas.companies.read
     - ✅ crm.schemas.deals.read

4. **Save changes**

---

### Step 2: Get OAuth Credentials (2 min)

1. **Go to "Auth" tab**

2. **Copy credentials:**
   - **Client ID** → Use for `HUBSPOT_CLIENT_ID`
   - **Client Secret** → Click "Show" and copy → Use for `HUBSPOT_CLIENT_SECRET`

3. **Update Vercel environment variables:**
```bash
HUBSPOT_CLIENT_ID=your-actual-client-id
HUBSPOT_CLIENT_SECRET=your-actual-client-secret
HUBSPOT_REDIRECT_URI=https://your-domain.vercel.app/api/crm/hubspot/callback
```

4. **Redeploy Vercel project** for changes to take effect

---

## ✅ Post-Deployment Testing

### Test Checklist

- [ ] **Homepage loads**
  - Visit: `https://your-domain.vercel.app`
  - Should load without errors

- [ ] **API endpoints respond**
  ```bash
  curl https://your-domain.vercel.app/api/crm/stats
  # Should return JSON (may require auth)
  ```

- [ ] **Dashboard page loads**
  - Visit: `https://your-domain.vercel.app/crm/dashboard`
  - Should show UI (empty data is OK)

- [ ] **Approvals page loads**
  - Visit: `https://your-domain.vercel.app/crm/approvals`
  - Should show UI

- [ ] **Setup page loads**
  - Visit: `https://your-domain.vercel.app/crm/setup`
  - Should show CRM connection cards

- [ ] **HubSpot OAuth works** (if configured)
  - Click "Connect HubSpot"
  - Should redirect to HubSpot
  - Authorize
  - Should redirect back successfully

- [ ] **Database operations work**
  - Create test user in Supabase
  - Sign in
  - Try creating test data

- [ ] **Logs are clean**
  - Vercel Dashboard > Deployments > View Function Logs
  - Check for errors

---

## 📊 Monitoring & Maintenance

### Set Up Monitoring

**1. Vercel Analytics (Built-in)**
- Automatically enabled
- Dashboard > Analytics
- Shows: Page views, errors, performance

**2. Vercel Speed Insights**
- Dashboard > Speed Insights
- Enable "Speed Insights"
- Shows: Core Web Vitals, Performance scores

**3. Error Tracking (Optional)**
Add Sentry:
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

---

### Regular Maintenance

**Weekly:**
- [ ] Check Vercel logs for errors
- [ ] Review Supabase usage (Dashboard > Usage)
- [ ] Check API response times
- [ ] Review security alerts

**Monthly:**
- [ ] Update dependencies:
  ```bash
  npm outdated
  npm update
  ```
- [ ] Review and optimize database
- [ ] Check for new Next.js releases
- [ ] Review Supabase storage usage

**Quarterly:**
- [ ] Security audit
- [ ] Performance optimization
- [ ] Review and update documentation
- [ ] Backup database

---

### Performance Optimization

**1. Enable Caching:**
```typescript
// In API routes
export const revalidate = 60 // Cache for 60 seconds
```

**2. Add Edge Config (Optional):**
- Vercel Dashboard > Storage > Edge Config
- Store frequently accessed config
- ~100x faster than database

**3. Optimize Images:**
```typescript
// Use Next.js Image component
import Image from 'next/image'
<Image src="/logo.png" width={100} height={100} />
```

**4. Database Indexes:**
- All critical indexes already added in migration
- Monitor slow queries: Supabase Dashboard > Performance

---

## 🔄 Rollback Procedures

### If Something Goes Wrong

**Quick Rollback (1 min):**
1. Vercel Dashboard > Deployments
2. Find last working deployment
3. Click "..." menu > "Promote to Production"
4. Confirm

**Database Rollback:**
```sql
-- If you need to undo migration (BE CAREFUL!)
-- This drops all tables and data!
DROP TABLE IF EXISTS capsule_configs CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS crm_actions CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS crm_connections CASCADE;

-- Then re-run old migration
```

**Environment Variable Rollback:**
1. Vercel > Settings > Environment Variables
2. Edit variable back to old value
3. Save
4. Redeploy

---

## 🌐 Custom Domain Setup

### Step 1: Add Domain to Vercel (5 min)

1. **Vercel Dashboard > Your Project > Settings > Domains**

2. **Add domain:**
   - Enter: `hublab.dev` (or your domain)
   - Click "Add"

3. **Vercel will show DNS records to add**

---

### Step 2: Configure DNS (10 min)

**At your DNS provider (Cloudflare, Namecheap, etc.):**

**For apex domain (hublab.dev):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Wait for DNS propagation** (5-60 minutes)

---

### Step 3: Update Environment Variables

```bash
# Update these in Vercel
NEXT_PUBLIC_APP_URL=https://hublab.dev
NEXT_PUBLIC_SITE_URL=https://hublab.dev
HUBSPOT_REDIRECT_URI=https://hublab.dev/api/crm/hubspot/callback
```

Redeploy after updating.

---

### Step 4: Update HubSpot Redirect URI

1. **HubSpot Developer Portal > Your App > Auth**
2. **Add redirect URL:**
   ```
   https://hublab.dev/api/crm/hubspot/callback
   ```
3. **Save**

---

### Step 5: Update Supabase URLs

1. **Supabase Dashboard > Authentication > URL Configuration**
2. **Update Site URL:** `https://hublab.dev`
3. **Update Redirect URLs:** `https://hublab.dev/**`

---

## 📋 Pre-Launch Checklist

- [ ] All environment variables set in Vercel
- [ ] Database migration run in production
- [ ] Supabase RLS policies enabled
- [ ] HubSpot OAuth configured (if using)
- [ ] Custom domain configured (if using)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] All pages load without errors
- [ ] API endpoints tested
- [ ] Authentication works
- [ ] Error monitoring configured
- [ ] Backup strategy in place
- [ ] Documentation up to date
- [ ] Team trained on maintenance
- [ ] Rollback plan ready

---

## 🎯 Post-Launch

### Day 1
- [ ] Monitor logs constantly
- [ ] Test all features with real users
- [ ] Check error rates
- [ ] Verify email notifications work
- [ ] Monitor Supabase usage

### Week 1
- [ ] Review analytics
- [ ] Collect user feedback
- [ ] Fix critical bugs
- [ ] Optimize performance
- [ ] Document issues

### Month 1
- [ ] Security audit
- [ ] Performance review
- [ ] Update documentation
- [ ] Plan Phase 2 features

---

## 🆘 Emergency Contacts

**Vercel Support:**
- Email: support@vercel.com
- Docs: https://vercel.com/docs

**Supabase Support:**
- Email: support@supabase.com
- Discord: https://discord.supabase.com

**HubSpot Support:**
- Forum: https://community.hubspot.com
- Support: https://help.hubspot.com

---

## 📚 Additional Resources

- **Vercel Deployment:** https://vercel.com/docs/deployments/overview
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Supabase Production:** https://supabase.com/docs/guides/platform/going-into-prod
- **HubSpot OAuth:** https://developers.hubspot.com/docs/api/oauth-quickstart

---

**Last Updated:** October 2025
**Version:** 1.0.0
**Estimated Time:** 45 minutes
**Difficulty:** Medium
