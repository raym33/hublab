# 🚀 HubLab Deployment Guide

Complete guide to deploy HubLab to production on Netlify, Vercel, or any hosting platform.

**Last Updated:** November 12, 2025
**Version:** 2.0
**Production Ready:** ✅ Yes

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Supabase project created and configured
- [ ] Database migrations executed (001 + 002)
- [ ] `.env.local` working locally
- [ ] Local dev server running without errors
- [ ] All tests passing (`npm run test`)

---

## 🎯 Quick Deploy (Recommended)

### Option 1: Deploy to Netlify (Recommended)

**Why Netlify:**
- ✅ Free tier generous (100GB bandwidth)
- ✅ Automatic builds from GitHub
- ✅ Built-in CDN
- ✅ Simple environment variables
- ✅ Instant rollbacks

#### Steps:

1. **Push to GitHub** (already done ✅)

2. **Connect to Netlify:**
   - Visit [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import from Git"
   - Connect GitHub account
   - Select `raym33/hublab` repository
   - Branch: `main`

3. **Build Settings:**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **Environment Variables:**

   Click "Site settings" → "Environment variables" → Add:

   **Required:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   GROQ_API_KEY=gsk_...
   NEXT_PUBLIC_BASE_URL=https://your-site.netlify.app
   ```

   **Optional (Recommended):**
   ```
   # Sentry (Error Tracking)
   NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   NEXT_PUBLIC_SENTRY_ENVIRONMENT=production

   # Upstash Redis (Rate Limiting)
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=AxxxYourToken

   # Supabase (API Keys)
   SUPABASE_SERVICE_KEY=eyJ...service-role-key
   ```

5. **Deploy:**
   - Click "Deploy site"
   - Wait 3-5 minutes
   - Visit your live URL!

---

## 🔧 Required External Services

### 1. Supabase (Database) - REQUIRED

Already set up if you followed testing guide.

**Verify:**
- [ ] Project created
- [ ] Migration 001 executed
- [ ] Migration 002 executed
- [ ] Env vars copied

### 2. Sentry (Error Tracking) - RECOMMENDED

Setup time: 5 minutes

See [docs/MONITORING.md](./docs/MONITORING.md)

### 3. Upstash Redis (Rate Limiting) - RECOMMENDED

Setup time: 5 minutes

See [docs/API_SECURITY.md](./docs/API_SECURITY.md)

### 4. Groq API (AI) - REQUIRED

Get key from [console.groq.com](https://console.groq.com)

---

## ✅ Post-Deployment Checklist

- [ ] Homepage loads
- [ ] API endpoints work
- [ ] Studio V2 functional
- [ ] Sentry receiving events
- [ ] Rate limiting active
- [ ] Custom domain (if applicable)

---

## 📚 Documentation

- [Monitoring Guide](./docs/MONITORING.md)
- [API Security Guide](./docs/API_SECURITY.md)
- [Testing Guide](./TESTING.md)

---

**🤖 Generated with [Claude Code](https://claude.com/claude-code)**
