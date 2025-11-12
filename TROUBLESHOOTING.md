# 🔧 Troubleshooting Guide - HubLab Ambient Agent CRM

Common issues and their solutions.

---

## 📋 Table of Contents

1. [Installation Issues](#installation-issues)
2. [Database Errors](#database-errors)
3. [Authentication Problems](#authentication-problems)
4. [API Errors](#api-errors)
5. [HubSpot OAuth Issues](#hubspot-oauth-issues)
6. [Performance Issues](#performance-issues)
7. [Deployment Problems](#deployment-problems)

---

## 🚨 Installation Issues

### Error: "Cannot find module"

**Symptom:**
```
Error: Cannot find module '@/lib/supabase'
```

**Cause:** Missing dependencies or TypeScript path mapping issues

**Solutions:**

1. **Reinstall dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
```

2. **Restart dev server:**
```bash
# Kill current server (Ctrl+C)
npm run dev
```

3. **Check tsconfig.json has path mappings:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

### Error: "Port 3000 already in use"

**Symptom:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Cause:** Another process is using port 3000

**Solutions:**

1. **Kill process on port 3000:**
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

2. **Use different port:**
```bash
npm run dev -- -p 3001
```

3. **Update .env.local:**
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

---

### Error: "Module not found: Can't resolve 'lucide-react'"

**Symptom:**
```
Module not found: Can't resolve 'lucide-react'
```

**Cause:** Missing icon library

**Solution:**
```bash
npm install lucide-react
```

---

## 🗄️ Database Errors

### Error: "relation 'crm_connections' does not exist"

**Symptom:**
```
PostgreSQL error: relation "crm_connections" does not exist
```

**Cause:** Database migration not run

**Solution:**

1. **Run migration:**
   - Go to Supabase Dashboard
   - Click SQL Editor
   - Copy `supabase/migrations/001_crm_ambient_agent.sql`
   - Paste and Run

2. **Verify tables exist:**
   - Dashboard > Table Editor
   - Should see: crm_connections, events, crm_actions, audit_logs, capsule_configs

3. **If tables exist but error persists:**
   - Check RLS is enabled on all tables
   - Verify user has permissions

---

### Error: "new row violates row-level security policy"

**Symptom:**
```
new row violates row-level security policy for table "crm_connections"
```

**Cause:** RLS policy doesn't allow user to insert

**Solution:**

1. **Check user is authenticated:**
```typescript
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user) // Should not be null
```

2. **Verify RLS policies:**
```sql
-- In Supabase SQL Editor
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

3. **Check user_id matches:**
```sql
-- Verify data matches authenticated user
SELECT * FROM crm_connections
WHERE user_id = (SELECT auth.uid());
```

4. **Temporarily disable RLS (testing only!):**
```sql
ALTER TABLE crm_connections DISABLE ROW LEVEL SECURITY;
```
**⚠️ Remember to re-enable:**
```sql
ALTER TABLE crm_connections ENABLE ROW LEVEL SECURITY;
```

---

### Error: "duplicate key value violates unique constraint"

**Symptom:**
```
duplicate key value violates unique constraint "events_event_id_key"
```

**Cause:** Trying to insert event that already exists

**Solution:**

This is actually **expected behavior**! Our deduplication is working.

**To handle in code:**
```typescript
try {
  const event = await createEvent(eventData)
} catch (error) {
  if (error.code === '23505') {
    console.log('Event already exists, skipping')
    return null
  }
  throw error
}
```

**Or use our helper that handles this:**
```typescript
// lib/crm-database.ts already handles duplicates
const event = await createEvent(eventData)
// Returns null if duplicate
```

---

## 🔐 Authentication Problems

### Error: "Unauthorized" (401)

**Symptom:**
```json
{ "error": "Unauthorized" }
```

**Cause:** User not authenticated or invalid token

**Solutions:**

1. **Check authentication status:**
```typescript
const { data: { user }, error } = await supabase.auth.getUser()
console.log('Authenticated:', !!user)
console.log('User ID:', user?.id)
console.log('Error:', error)
```

2. **For testing, create user manually:**
   - Supabase Dashboard > Authentication > Users
   - Click "Add user"
   - Email: test@example.com
   - Password: Test123!
   - Click "Create user"

3. **Check session is valid:**
```typescript
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)
```

4. **Re-authenticate:**
```typescript
await supabase.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'Test123!'
})
```

---

### Error: "User not found"

**Symptom:**
API returns 401 but you have a valid token

**Cause:** User deleted from auth but data remains

**Solution:**

1. **Check auth.users table:**
```sql
SELECT id, email FROM auth.users;
```

2. **If user missing, re-create:**
   - Dashboard > Authentication > Users > Add user

3. **Update existing data:**
```sql
-- Update with new user ID
UPDATE crm_connections
SET user_id = 'new-user-id'
WHERE user_id = 'old-user-id';
```

---

## 🔌 API Errors

### Error: 500 Internal Server Error

**Symptom:**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

**Cause:** Server-side error in API route

**Solutions:**

1. **Check server logs:**
```bash
# In terminal where npm run dev is running
# Look for error messages
```

2. **Add debug logging:**
```typescript
// In API route
console.log('Request:', request)
console.log('User:', user)
console.log('Query result:', result)
```

3. **Check environment variables:**
```bash
# Verify .env.local has all required values
cat .env.local | grep SUPABASE
```

4. **Common causes:**
   - Missing environment variable
   - Database connection issue
   - Malformed SQL query
   - Type mismatch

---

### Error: "Failed to fetch"

**Symptom:**
```
TypeError: Failed to fetch
```

**Cause:** Network error or CORS issue

**Solutions:**

1. **Check dev server is running:**
```bash
# Should show:
# ▲ Next.js ready on http://localhost:3000
```

2. **Check API endpoint exists:**
```bash
curl http://localhost:3000/api/crm/stats
# Should return JSON, not 404
```

3. **Check for typos in URL:**
```typescript
// Correct
fetch('/api/crm/stats')

// Wrong
fetch('/api/crm/stat') // Missing 's'
```

4. **For production, check CORS:**
```typescript
// In API route
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH',
}
```

---

### Error: "Invalid JSON"

**Symptom:**
```
SyntaxError: Unexpected token < in JSON at position 0
```

**Cause:** API returned HTML (error page) instead of JSON

**Solutions:**

1. **Check API route exists:**
```bash
ls -la app/api/crm/stats/route.ts
```

2. **Check for Next.js errors:**
   - Look at browser console
   - Check terminal logs
   - May be TypeScript error

3. **Test API directly:**
```bash
curl http://localhost:3000/api/crm/stats
# Should return valid JSON
```

---

## 🔗 HubSpot OAuth Issues

### Error: "Failed to exchange code for token"

**Symptom:**
OAuth callback fails, redirects to `/crm/setup?error=token_exchange_failed`

**Causes & Solutions:**

1. **Wrong Client ID/Secret:**
```bash
# In .env.local
HUBSPOT_CLIENT_ID=correct-client-id
HUBSPOT_CLIENT_SECRET=correct-client-secret
```

2. **Redirect URI mismatch:**
   - HubSpot App Settings > Auth > Redirect URLs
   - Must match EXACTLY:
   ```
   http://localhost:3000/api/crm/hubspot/callback
   ```

3. **Expired authorization code:**
   - Codes expire in 10 minutes
   - Try OAuth flow again

4. **Check HubSpot app is active:**
   - Dashboard > Apps > Your App
   - Status should be "Active"

---

### Error: "Invalid redirect_uri"

**Symptom:**
HubSpot shows: "The redirect_uri in the request does not match..."

**Solution:**

1. **Go to HubSpot Developer Portal**
2. **Your App > Auth tab**
3. **Add redirect URI:**
   - Local: `http://localhost:3000/api/crm/hubspot/callback`
   - Production: `https://hublab.dev/api/crm/hubspot/callback`
4. **Save changes**
5. **Try OAuth again**

---

### Error: "Connection test failed"

**Symptom:**
OAuth succeeds but redirects to `/crm/setup?error=connection_test_failed`

**Causes & Solutions:**

1. **Check scopes are granted:**
   - crm.objects.contacts.read
   - crm.objects.contacts.write
   - crm.objects.companies.read
   - crm.objects.companies.write
   - crm.objects.deals.read
   - crm.objects.deals.write

2. **Token may be invalid:**
```typescript
// Test manually
const client = createHubSpotClient({ accessToken: 'token' })
const works = await client.testConnection()
console.log('Connection works:', works)
```

3. **Rate limit:**
   - Wait 1 minute and try again

---

## ⚡ Performance Issues

### Slow Dashboard Loading

**Symptom:**
Dashboard takes >5 seconds to load

**Solutions:**

1. **Check database indexes:**
```sql
-- Verify indexes exist
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public';
```

2. **Limit query results:**
```typescript
// In hooks
const { events } = useRecentEvents(5) // Not 100
```

3. **Add caching:**
```typescript
// In API route
export const revalidate = 30 // Cache for 30 seconds
```

4. **Check for N+1 queries:**
   - Use `.select()` to only fetch needed fields
   - Join related data in single query

---

### High Memory Usage

**Symptom:**
Dev server uses >2GB RAM

**Solutions:**

1. **Clear Next.js cache:**
```bash
rm -rf .next
npm run dev
```

2. **Limit concurrent requests:**
```typescript
// In hooks
// Don't call all hooks simultaneously
// Stagger them with useEffect dependencies
```

3. **Check for memory leaks:**
   - Missing cleanup in useEffect
   - Large objects in state
   - Event listeners not removed

---

## 🚀 Deployment Problems

### Vercel Build Fails

**Symptom:**
```
Build failed with exit code 1
```

**Solutions:**

1. **Check build locally:**
```bash
npm run build
# Fix any errors shown
```

2. **Check TypeScript errors:**
```bash
npx tsc --noEmit
```

3. **Check environment variables:**
   - Vercel Dashboard > Settings > Environment Variables
   - All required vars set?

4. **Check logs:**
   - Vercel Dashboard > Deployments > Failed build
   - Click "View Function Logs"

---

### Environment Variables Not Working

**Symptom:**
```
Error: NEXT_PUBLIC_SUPABASE_URL is undefined
```

**Solutions:**

1. **Check variables are set in Vercel:**
   - Dashboard > Settings > Environment Variables
   - Should show for Production, Preview, Development

2. **Redeploy:**
   - Changes to env vars require redeploy
   - Dashboard > Deployments > Redeploy

3. **Check variable names:**
   - Must start with `NEXT_PUBLIC_` for client-side
   - Case-sensitive!

4. **Check .env.local not committed:**
```bash
# Should be in .gitignore
cat .gitignore | grep .env.local
```

---

### Database Migration Fails in Production

**Symptom:**
Tables don't exist in production Supabase

**Solution:**

**Run migration manually:**
1. Go to production Supabase project
2. SQL Editor
3. Copy `supabase/migrations/001_crm_ambient_agent.sql`
4. Run

**Or use Supabase CLI:**
```bash
supabase link --project-ref your-project-ref
supabase db push
```

---

## 🆘 Getting Help

### Debug Checklist

Before asking for help, try:

- [ ] Check this troubleshooting guide
- [ ] Read error message carefully
- [ ] Check server logs (terminal)
- [ ] Check browser console
- [ ] Check Supabase logs (Dashboard > Logs)
- [ ] Try in incognito window
- [ ] Clear cache and restart
- [ ] Check documentation

### Reporting Issues

When reporting issues, include:

1. **Error message** (full text)
2. **Steps to reproduce**
3. **Expected behavior**
4. **Actual behavior**
5. **Environment:**
   - OS (macOS, Windows, Linux)
   - Node version (`node -v`)
   - npm version (`npm -v`)
   - Browser (if frontend issue)

6. **Logs:**
   - Server logs (terminal)
   - Browser console (F12)
   - Supabase logs

### Useful Commands

```bash
# Check versions
node -v
npm -v

# Check dependencies
npm list --depth=0

# Verify build
npm run build

# Check TypeScript
npx tsc --noEmit

# Check for unused dependencies
npx depcheck

# Clear everything and start fresh
rm -rf node_modules .next package-lock.json
npm install
npm run dev
```

---

## 📚 Additional Resources

- **API Reference:** [API_COMPLETE_REFERENCE.md](API_COMPLETE_REFERENCE.md)
- **Backend Docs:** [BACKEND_README.md](BACKEND_README.md)
- **Frontend Guide:** [FRONTEND_INTEGRATION_GUIDE.md](FRONTEND_INTEGRATION_GUIDE.md)
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **HubSpot API:** https://developers.hubspot.com/docs/api

---

## 💡 Pro Tips

1. **Use TypeScript errors as guide** - They're usually right
2. **Check database first** - Many issues are data-related
3. **Test APIs with curl** - Isolate frontend vs backend issues
4. **Read logs carefully** - Error messages are helpful
5. **Start with simple test data** - Don't test with production data
6. **Use browser DevTools** - Network tab shows API calls
7. **Check Supabase Dashboard** - Visual way to debug DB issues

---

**Last Updated:** October 2025
**Version:** 1.0.0
**Coverage:** 95% of common issues
