# 🚀 Production Deployment Checklist

**HubLab - Ready for Production**

Use this checklist to ensure a smooth production deployment.

**Estimated Time:** 30-45 minutes

---

## ✅ Pre-Deployment (5-10 minutes)

### Code & Build
- [x] Code pushed to `main` branch
- [x] Build succeeds locally (`npm run build`)
- [x] Tests pass (`npm run test`)
- [x] No hardcoded secrets in codebase
- [x] `.env.local` excluded from git

### Documentation Review
- [x] [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [x] [SECURITY.md](./SECURITY.md) - Security policies
- [x] [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) - Known limitations
- [x] [docs/MONITORING.md](./docs/MONITORING.md) - Monitoring setup
- [x] [docs/API_SECURITY.md](./docs/API_SECURITY.md) - API security

---

## 🗄️ Database Setup (5-10 minutes)

### Supabase Configuration
- [ ] Project created at [supabase.com](https://supabase.com)
- [ ] Region selected (closest to users)
- [ ] Pricing plan: Free tier (or paid if needed)

### Run Migrations
- [ ] Execute `001_crm_ambient_agent.sql` in SQL Editor
- [ ] Execute `002_api_keys.sql` in SQL Editor
- [ ] Verify tables created:
  ```sql
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public';
  ```
  Expected: `crm_connections`, `events`, `crm_actions`, `audit_logs`, `capsule_configs`, `api_keys`

### Get Credentials
- [ ] Copy **Project URL** (Settings → API)
- [ ] Copy **anon/public key** (Settings → API)
- [ ] Copy **service_role key** (Settings → API) ⚠️ KEEP SECRET

---

## 🤖 AI Configuration (2 minutes)

### Groq API (Recommended - Free)
- [ ] Sign up at [console.groq.com](https://console.groq.com)
- [ ] Create API key
- [ ] Copy key (starts with `gsk_`)
- [ ] Free tier: 14,400 requests/day ✅

**Alternative:** OpenAI API (paid)
- [ ] Get key from [platform.openai.com](https://platform.openai.com)

---

## 🌐 Hosting Setup (10-15 minutes)

### Option A: Netlify (Recommended)

#### 1. Connect Repository
- [ ] Go to [app.netlify.com](https://app.netlify.com)
- [ ] Click "Add new site" → "Import from Git"
- [ ] Connect GitHub account
- [ ] Select `raym33/hublab`
- [ ] Branch: `main`

#### 2. Build Settings
- [ ] Build command: `npm run build`
- [ ] Publish directory: `.next`
- [ ] Node version: 18.17.0 (auto-detected from `netlify.toml`)

#### 3. Environment Variables

**REQUIRED:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
GROQ_API_KEY=gsk_...
NEXT_PUBLIC_BASE_URL=https://your-site.netlify.app
```

**OPTIONAL (Recommended):**
```bash
# Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=Axxx

# Supabase (API Keys)
SUPABASE_SERVICE_KEY=eyJ...service-role-key
```

#### 4. Deploy
- [ ] Click "Deploy site"
- [ ] Wait 3-5 minutes
- [ ] Note deployment URL

### Option B: Vercel

#### 1. Import Project
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click "Add New" → "Project"
- [ ] Import `raym33/hublab` from GitHub

#### 2. Configure
- [ ] Framework: Next.js (auto-detected)
- [ ] Root Directory: `./`
- [ ] Build Command: Default
- [ ] Output Directory: Default

#### 3. Environment Variables
(Same as Netlify - see above)

#### 4. Deploy
- [ ] Click "Deploy"
- [ ] Wait 2-3 minutes

---

## 🔧 External Services (Optional - 10-15 minutes)

### Sentry (Error Monitoring) - RECOMMENDED

**Setup:**
- [ ] Sign up at [sentry.io](https://sentry.io)
- [ ] Create project (Platform: Next.js)
- [ ] Copy DSN
- [ ] Add to hosting env vars:
  ```
  NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
  NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
  ```
- [ ] Redeploy site
- [ ] Verify events in Sentry dashboard

**Time:** 5 minutes
**Cost:** Free tier (5K errors/month)

### Upstash Redis (Rate Limiting) - RECOMMENDED

**Setup:**
- [ ] Sign up at [console.upstash.com](https://console.upstash.com)
- [ ] Create database (Regional or Global)
- [ ] Copy REST URL and Token
- [ ] Add to hosting env vars:
  ```
  UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
  UPSTASH_REDIS_REST_TOKEN=Axxx
  ```
- [ ] Redeploy site
- [ ] Test with 31+ requests to `/api/v1/capsules`

**Time:** 5 minutes
**Cost:** Free tier (10K commands/day)

---

## 🧪 Post-Deployment Testing (5 minutes)

### Smoke Tests

**Homepage:**
- [ ] Visit `https://your-site.netlify.app/`
- [ ] Page loads without errors
- [ ] No console errors in browser

**API Health:**
- [ ] Visit `/api/health`
- [ ] Returns 200 OK

**Studio V2:**
- [ ] Visit `/studio-v2`
- [ ] UI loads correctly
- [ ] Can select capsules
- [ ] Try AI compilation (if Groq key added)

**API Endpoints:**
- [ ] Visit `/api/v1/catalog/capsules`
- [ ] Returns capsule list
- [ ] Rate limit headers present

### Error Monitoring
- [ ] Trigger test error (if Sentry configured)
- [ ] Check Sentry dashboard for event
- [ ] Verify error details captured

### Rate Limiting
- [ ] Make 31+ requests quickly to `/api/v1/capsules`
- [ ] 31st request returns 429 Too Many Requests
- [ ] Rate limit headers show limits

---

## 🔒 Security Configuration (5 minutes)

### Supabase CORS
- [ ] Go to Settings → API in Supabase
- [ ] Add production URL to allowed origins:
  ```
  https://your-site.netlify.app
  https://hublab.dev
  ```

### Supabase Auth URLs
- [ ] Go to Authentication → URL Configuration
- [ ] Add redirect URLs:
  ```
  https://your-site.netlify.app/auth/callback
  https://hublab.dev/auth/callback
  ```

### CORS Headers (If Custom Domain)
- [ ] Edit `netlify.toml` locally
- [ ] Change line 43:
  ```toml
  Access-Control-Allow-Origin = "https://hublab.dev, https://www.hublab.dev"
  ```
- [ ] Commit and push
- [ ] Redeploy

---

## 🌍 Custom Domain (Optional - 10-20 minutes)

### Purchase Domain
- [ ] Register domain (Namecheap, Google Domains, etc.)
- [ ] Verify ownership

### Configure DNS

**Netlify:**
- [ ] In Netlify: Domain management → Add domain
- [ ] Add DNS records:
  ```
  A     @     75.2.60.5
  CNAME www   your-site.netlify.app
  ```
- [ ] Wait for DNS propagation (10 min - 24 hrs)

**Vercel:**
- [ ] In Vercel: Settings → Domains → Add
- [ ] Follow DNS instructions
- [ ] Verify domain

### Update Environment
- [ ] Update `NEXT_PUBLIC_BASE_URL`:
  ```
  NEXT_PUBLIC_BASE_URL=https://hublab.dev
  ```
- [ ] Redeploy

### SSL Certificate
- [ ] Automatic with Netlify/Vercel
- [ ] Verify HTTPS works
- [ ] Force HTTPS redirect enabled

---

## 📊 Monitoring Setup (5 minutes)

### Sentry Alerts
- [ ] Go to Alerts in Sentry dashboard
- [ ] Create "New Issue Alert"
  - When: First seen
  - Action: Email notification
- [ ] Create "Error Spike Alert"
  - When: 10x increase in 1 hour
  - Action: Email notification

### Upstash Monitoring
- [ ] Check dashboard for request stats
- [ ] Verify rate limiting working
- [ ] Note daily command usage

### Health Checks
- [ ] Set up external monitoring (UptimeRobot, Pingdom)
- [ ] Monitor `/api/health` endpoint
- [ ] Alert on downtime

---

## 📝 Final Verification Checklist

### Functionality
- [ ] All pages load without errors
- [ ] Studio V2 functional
- [ ] AI compilation works
- [ ] API endpoints respond
- [ ] Authentication works (if configured)
- [ ] Database queries succeed

### Performance
- [ ] Page load < 3 seconds
- [ ] API responses < 500ms
- [ ] No console errors
- [ ] Lighthouse score > 80

### Security
- [ ] No secrets in client-side code
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting active
- [ ] RLS policies working

### Monitoring
- [ ] Sentry receiving events
- [ ] Errors captured correctly
- [ ] Performance data visible
- [ ] Alerts configured

---

## 🎉 Launch!

### Announcement
- [ ] Update GitHub README with live URL
- [ ] Tweet/post about launch
- [ ] Share on Product Hunt (optional)
- [ ] Share on Show HN (optional)

### Documentation
- [ ] Add production URL to docs
- [ ] Update screenshots if needed
- [ ] Create changelog entry

### Team Notification
- [ ] Notify team of launch
- [ ] Share monitoring dashboards
- [ ] Review incident response plan

---

## 📞 Support & Resources

**If Something Goes Wrong:**

1. **Build fails:**
   - Check [KNOWN_ISSUES.md](./KNOWN_ISSUES.md)
   - Verify environment variables
   - Check Netlify/Vercel build logs

2. **Database errors:**
   - Verify migrations ran
   - Check Supabase logs
   - Verify RLS policies

3. **API not working:**
   - Check rate limiting (429 responses)
   - Verify API keys if using authentication
   - Check CORS configuration

4. **Get Help:**
   - GitHub Issues: [github.com/raym33/hublab/issues](https://github.com/raym33/hublab/issues)
   - Documentation: Check `/docs/` folder
   - Email: support@hublab.dev

---

## ✅ Completion Status

**Deployment Complete When:**
- [ ] All checkboxes above marked
- [ ] Site accessible at production URL
- [ ] No critical errors in Sentry
- [ ] Rate limiting verified working
- [ ] Team notified

**Estimated Total Time:** 30-60 minutes

---

**Last Updated:** November 12, 2025
**Version:** 1.0
**Status:** Production Ready ✅

🤖 Generated with [Claude Code](https://claude.com/claude-code)
