# 📊 Monitoring Setup Guide - HubLab

Complete guide to setting up error tracking and performance monitoring with Sentry.

## 📋 Overview

HubLab uses Sentry for:
- ✅ **Error Tracking** - Catch and report runtime errors
- ✅ **Performance Monitoring** - Track API response times
- ✅ **Session Replay** - Debug issues with video playback
- ✅ **Release Tracking** - Monitor deployments

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Sentry Project

1. Visit [sentry.io](https://sentry.io) and sign up (free tier available)
2. Create a new project:
   - **Platform:** Next.js
   - **Project Name:** hublab
   - **Alert Frequency:** Default

3. Copy your **DSN** (Data Source Name)
   - Format: `https://xxxx@xxxx.ingest.sentry.io/xxxxx`

### Step 2: Configure Environment Variables

Add to `.env.local`:

```bash
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
```

**Environment values:**
- `development` - Local dev
- `staging` - Staging/test environment
- `production` - Live production

### Step 3: Restart Server

```bash
npm run dev
```

That's it! Sentry is now monitoring your app.

---

## 🎯 What Gets Tracked

### Client-Side Errors
- React component crashes
- Unhandled promise rejections
- Network request failures
- Console errors

### Server-Side Errors
- API route exceptions
- Database connection errors
- External API failures
- Unhandled Node.js errors

### Performance Metrics
- Page load times
- API response times
- Database query performance
- Asset loading times

### User Sessions (Replay)
- Mouse movements and clicks
- Console logs
- Network requests
- Page navigation

---

## 🔧 Configuration Files

### 1. `sentry.client.config.ts`
Monitors browser errors:
```typescript
Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 0.1,  // 10% of transactions
  replaysSessionSampleRate: 0.1,  // 10% of sessions
  replaysOnErrorSampleRate: 1.0,  // 100% when error occurs
})
```

### 2. `sentry.server.config.ts`
Monitors server errors:
```typescript
Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 0.05,  // 5% of transactions
})
```

### 3. `sentry.edge.config.ts`
Monitors Edge Runtime (middleware):
```typescript
Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 0.01,  // 1% of transactions
})
```

### 4. `instrumentation.ts`
Registers Sentry on app startup (Next.js 14 feature)

---

## 🛡️ Error Boundary Usage

Wrap components to catch React errors:

```tsx
import ErrorBoundary from '@/components/ErrorBoundary'

export default function Page() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  )
}
```

**Custom Fallback:**
```tsx
<ErrorBoundary
  fallback={
    <div>Oops! Something went wrong.</div>
  }
>
  <YourComponent />
</ErrorBoundary>
```

---

## 🧪 Testing Error Tracking

### Test Client Error

Create a test page:

```tsx
// app/test-sentry/page.tsx
'use client'

export default function TestSentry() {
  return (
    <button onClick={() => {
      throw new Error('Test Sentry client error')
    }}>
      Trigger Error
    </button>
  )
}
```

Visit `/test-sentry` → Click button → Check Sentry dashboard

### Test Server Error

```tsx
// app/api/test-error/route.ts
export async function GET() {
  throw new Error('Test Sentry server error')
}
```

Visit `/api/test-error` → Check Sentry dashboard

### Manual Error Capture

```typescript
import * as Sentry from '@sentry/nextjs'

try {
  // Some risky code
  await riskyOperation()
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'payment',
    },
    extra: {
      userId: user.id,
      amount: 100,
    },
  })
}
```

---

## 📊 Sentry Dashboard

### Key Sections

1. **Issues** - All caught errors
   - Click on issue to see:
     - Stack trace
     - User context
     - Device info
     - Breadcrumbs (events leading to error)

2. **Performance** - Transaction monitoring
   - API endpoint response times
   - Database query performance
   - Slow pages

3. **Replays** - Video playback of user sessions
   - See exactly what user did before error
   - Console logs and network requests

4. **Releases** - Track deployments
   - Associate errors with specific versions
   - See error trends per release

---

## 🔐 Privacy & Security

### Sensitive Data Filtering

**Automatic:**
- Authorization headers removed
- Cookie headers removed
- Environment variables with `SECRET`, `KEY`, `TOKEN`, `PASSWORD` redacted

**Manual:**
```typescript
beforeSend(event) {
  // Remove sensitive query params
  if (event.request?.url) {
    const url = new URL(event.request.url)
    url.searchParams.delete('api_key')
    event.request.url = url.toString()
  }
  return event
}
```

### Ignore Noisy Errors

Already configured to ignore:
- `ResizeObserver loop limit exceeded`
- `Loading chunk` errors
- `ChunkLoadError`
- Network timeouts (ETIMEDOUT, ECONNRESET)

---

## 💰 Pricing & Quotas

### Free Tier
- 5,000 errors/month
- 10,000 performance transactions/month
- 50 replays/month
- 1 project
- 7 day retention

**Good for:**
- Development
- Small projects
- Testing

### Paid Plans
Start at $26/month:
- More errors
- More transactions
- Longer retention
- Multiple projects
- Advanced features

**Recommendation:** Start with free tier, upgrade when needed.

---

## 📈 Sample Rates Explained

### `tracesSampleRate`
Percentage of transactions to monitor:
- `1.0` = 100% (all requests tracked)
- `0.1` = 10% (1 in 10 requests)

**Why sample?**
- Reduce costs
- Avoid quota limits
- Production: 5-10% is enough

### `sampleRate`
Percentage of errors to capture:
- `1.0` = 100% (capture all errors) ✅ Recommended

### `replaysSessionSampleRate`
Percentage of sessions to record:
- `0.1` = 10% (1 in 10 sessions)

**Storage intensive!** Keep low in production.

### `replaysOnErrorSampleRate`
Percentage of error sessions to record:
- `1.0` = 100% (always record when error occurs) ✅ Recommended

---

## 🚨 Alerts Setup

### Recommended Alerts

1. **New Issue Alert**
   - When: First seen
   - Action: Email + Slack
   - Use: Catch new bugs immediately

2. **Error Spike Alert**
   - When: 10x increase in 1 hour
   - Action: Email + Slack
   - Use: Detect major incidents

3. **Performance Degradation**
   - When: P95 > 2 seconds
   - Action: Email
   - Use: Catch slow endpoints

### Setup in Sentry Dashboard
1. Go to **Alerts** → **Create Alert**
2. Choose alert type
3. Configure conditions
4. Add integrations (Email, Slack, etc.)

---

## 🔗 Integrations

### Slack
1. Sentry Dashboard → **Settings** → **Integrations**
2. Click **Slack** → **Add Workspace**
3. Choose channel for alerts
4. Test notification

### GitHub
1. Link GitHub repository
2. Auto-create issues from Sentry errors
3. Link commits to releases
4. See suspect commits in error details

### Vercel/Netlify
1. Auto-deploy tracking
2. Source maps upload
3. Release association

---

## 🐛 Troubleshooting

### No errors showing in Sentry

**Check:**
1. DSN is correct in `.env.local`
2. Restarted dev server after adding DSN
3. Test with manual error:
   ```typescript
   Sentry.captureException(new Error('Test'))
   ```

### Source maps not working

**Solution:**
Add to `next.config.js`:
```javascript
const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: 'your-org',
    project: 'hublab',
  }
)
```

### Too many errors

**Common causes:**
1. Check ignored errors list
2. Add more filters in `beforeSend`
3. Fix actual bugs 😊

---

## ✅ Checklist

Setup complete when:
- [ ] Sentry project created
- [ ] DSN added to `.env.local`
- [ ] Test error appears in Sentry dashboard
- [ ] Error Boundary implemented on key pages
- [ ] Alerts configured
- [ ] Team invited to Sentry project

---

## 📚 Additional Resources

- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Error Boundary Docs](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Session Replay](https://docs.sentry.io/product/session-replay/)

---

**Last Updated:** November 12, 2025
**Version:** 1.0
**Status:** Production Ready
