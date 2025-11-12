# Security Policy

## 🔐 Security Overview

HubLab takes security seriously. This document outlines our security practices, how to report vulnerabilities, and what measures are in place to protect users.

---

## 🛡️ Security Measures Implemented

### 1. API Security

#### Rate Limiting ✅
- **Implementation:** Upstash Redis with sliding window algorithm
- **Tiers:**
  - Strict: 10 requests / 10 seconds (authentication)
  - Standard: 30 requests / minute (general APIs)
  - Generous: 100 requests / minute (public endpoints)
  - AI: 20 requests / hour (expensive operations)
- **Protection:** DDoS mitigation, brute-force prevention

#### Request Validation ✅
- **Implementation:** Zod schemas for type-safe validation
- **Coverage:** All API endpoints validate inputs
- **Protection:** SQL injection, XSS, malformed requests

#### Authentication ✅
- **API Keys:** Secure key-based authentication with permissions
- **Supabase Auth:** Row Level Security (RLS) policies
- **NextAuth:** OAuth integration for user authentication
- **Protection:** Unauthorized access prevention

### 2. Data Protection

#### Environment Variables ⚠️
- **Storage:** Never committed to git (`.gitignore`)
- **Distribution:** `.env.example` template without secrets
- **Production:** Stored in hosting platform (Netlify/Vercel)
- **Service Keys:** Separate from public keys

#### Database Security ✅
- **RLS Policies:** Users can only access their own data
- **Encryption:** Supabase handles encryption at rest
- **API Keys Table:** Hashed storage (planned upgrade)
- **Migrations:** Version controlled and auditable

#### Sensitive Data Filtering ✅
- **Sentry:** Automatic redaction of tokens, passwords, API keys
- **Logs:** No sensitive data in production logs
- **Headers:** Authorization and Cookie headers removed from error reports

### 3. Frontend Security

#### CORS Configuration ⚠️
- **Current:** `Access-Control-Allow-Origin: "*"` (development)
- **Production TODO:** Restrict to specific domains
  ```toml
  Access-Control-Allow-Origin = "https://hublab.dev, https://www.hublab.dev"
  ```

#### Content Security ✅
- **React:** Automatic XSS protection
- **Next.js:** Server-side rendering security
- **Headers:** Security headers configured in `netlify.toml`

#### Error Boundaries ✅
- **Implementation:** React Error Boundary component
- **Privacy:** Production errors don't expose stack traces to users
- **Monitoring:** Errors sent to Sentry for debugging

### 4. Dependencies

#### npm Audit ✅
```bash
# Current vulnerabilities: 4 moderate (dev-only)
npm audit
```

**Status:**
- ✅ All production dependencies secure
- ⚠️ Dev dependencies (esbuild, vitest) have moderate vulnerabilities
- ✅ No impact on production (not included in build)

**Update Schedule:**
- Production deps: Monthly security checks
- Dev deps: Quarterly updates
- Critical patches: Immediate

---

## 🚨 Reporting a Vulnerability

### How to Report

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, email: **security@hublab.dev** (or repository owner)

Include:
1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

### Response Timeline

- **Acknowledgment:** Within 48 hours
- **Initial Assessment:** Within 1 week
- **Fix & Release:** Depends on severity
  - Critical: Within 24-48 hours
  - High: Within 1 week
  - Medium: Within 2 weeks
  - Low: Next scheduled release

### Disclosure Policy

- We will notify you when the vulnerability is fixed
- Credit will be given in release notes (unless you prefer anonymity)
- We follow responsible disclosure practices
- Public disclosure after fix is deployed

---

## 🔑 Secrets Management

### What Should Never Be Committed

❌ **Never commit these to git:**
- `SUPABASE_SERVICE_KEY`
- `OPENAI_API_KEY` / `GROQ_API_KEY`
- `NEXTAUTH_SECRET`
- `HUBSPOT_CLIENT_SECRET`
- `RESEND_API_KEY`
- `UPSTASH_REDIS_REST_TOKEN`
- `SENTRY_AUTH_TOKEN`
- Any API keys, tokens, or passwords

### How to Check

```bash
# Verify no secrets in git history
git log --all -S 'SUPABASE_SERVICE_KEY' --oneline
# Should return empty

# Check current files
git grep -i 'api.key\|secret\|token' -- '*.js' '*.ts' '*.tsx'
# Review output carefully
```

### If You Accidentally Commit a Secret

1. **Immediately rotate the key** (generate new one)
2. Invalidate the old key in the service dashboard
3. Update environment variables in hosting
4. Use `git filter-branch` or BFG Repo-Cleaner to remove from history
5. Force push (if no collaborators) or create new repository

---

## 🔒 Production Security Checklist

### Pre-Deployment

- [ ] All secrets in environment variables (not code)
- [ ] `.env.local` in `.gitignore`
- [ ] CORS restricted to production domains
- [ ] RLS policies tested in Supabase
- [ ] API rate limiting configured
- [ ] Sentry monitoring enabled

### Post-Deployment

- [ ] Test authentication flows
- [ ] Verify rate limiting works (make 31+ requests)
- [ ] Check Sentry receives errors
- [ ] Test API key authentication
- [ ] Review Supabase logs for errors
- [ ] Monitor for unusual traffic patterns

### Regular Maintenance

- [ ] Weekly: Review Sentry errors
- [ ] Monthly: Run `npm audit` and update deps
- [ ] Quarterly: Review and rotate API keys
- [ ] Annually: Security audit of codebase

---

## 🔐 Authentication & Authorization

### API Key System

**Format:** `sk_[48 random characters]`

**Permissions:**
- Granular permissions (e.g., `capsules:read`, `projects:create`)
- Wildcard support (`capsules:*`, `*`)
- Per-key rate limit tiers

**Storage:**
- Stored in Supabase `api_keys` table
- User ID association
- Expiration dates supported
- Last used tracking

**Security:**
- Keys never logged
- RLS policies prevent cross-user access
- Automatic cleanup of expired keys

### User Authentication

**Supabase Auth:**
- Email/password with confirmation
- OAuth providers (Google, GitHub)
- Magic link authentication
- Session management

**Row Level Security:**
```sql
-- Example policy
CREATE POLICY "Users can view their own data"
  ON table_name
  FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 📊 Security Monitoring

### Sentry Integration ✅

**What's Monitored:**
- All runtime errors (client & server)
- Performance degradation
- Failed API requests
- Authentication failures

**Privacy:**
- Sensitive data filtered before sending
- User data anonymized
- No passwords or tokens captured

### Upstash Redis ✅

**What's Monitored:**
- Request rates per IP/API key
- Rate limit violations
- Unusual traffic patterns

**Alerts:**
- Spike in 429 responses
- Sudden traffic increase
- Potential DDoS attempts

---

## 🛠️ Security Best Practices for Developers

### When Adding New Features

1. **Validate All Inputs**
   ```typescript
   import { z } from 'zod'
   const schema = z.object({
     email: z.string().email(),
     // Never trust user input
   })
   ```

2. **Use Type-Safe APIs**
   ```typescript
   // Good
   const { data } = await validateRequest(req, schema)

   // Bad
   const data = await req.json() // No validation!
   ```

3. **Implement Rate Limiting**
   ```typescript
   return withRateLimit(req, async () => {
     // Your API logic
   }, 'strict')
   ```

4. **Check Permissions**
   ```typescript
   return withAPIAuth(req, async (apiKey) => {
     if (!hasPermission(apiKey, 'capsules:create')) {
       return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
     }
   })
   ```

### Code Review Checklist

- [ ] No hardcoded secrets or API keys
- [ ] All user inputs validated
- [ ] Authentication required for protected routes
- [ ] Rate limiting on expensive operations
- [ ] Errors don't expose sensitive info
- [ ] Database queries use RLS or explicit user filtering
- [ ] CORS headers appropriate for endpoint
- [ ] No SQL injection vulnerabilities
- [ ] XSS protection in place

---

## 📝 Incident Response Plan

### If a Security Breach Occurs

1. **Immediate Actions** (0-1 hour)
   - Identify affected systems
   - Isolate compromised components
   - Rotate all potentially exposed credentials
   - Enable maintenance mode if necessary

2. **Assessment** (1-4 hours)
   - Determine scope of breach
   - Identify data accessed/modified
   - Review logs (Sentry, Supabase, hosting)
   - Document timeline of events

3. **Containment** (4-24 hours)
   - Patch vulnerability
   - Deploy security fixes
   - Verify breach is contained
   - Monitor for further attempts

4. **Communication** (24-48 hours)
   - Notify affected users
   - Publish security advisory
   - Update status page
   - Inform regulators if required

5. **Recovery** (1-2 weeks)
   - Restore from backups if needed
   - Implement additional security measures
   - Conduct post-mortem analysis
   - Update security documentation

---

## 🎓 Security Training Resources

### For Developers

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/security)
- [Supabase Security Guide](https://supabase.com/docs/guides/security)

### For Users

- Use strong, unique passwords
- Enable 2FA when available
- Review API key permissions regularly
- Rotate API keys quarterly
- Report suspicious activity

---

## 📋 Compliance

### Standards

- **GDPR:** User data deletion on request
- **CCPA:** California privacy compliance
- **SOC 2:** Following best practices (in progress)

### Data Handling

- **User Data:** Stored in Supabase (EU or US regions)
- **Logs:** Retained for 90 days
- **Backups:** Encrypted and access-controlled
- **Deletion:** Permanent deletion within 30 days of request

---

## ✅ Security Status

**Last Security Audit:** November 12, 2025
**Next Scheduled Audit:** February 12, 2026

**Current Security Level:** 🟢 **GOOD**

**Known Issues:** See [KNOWN_ISSUES.md](./KNOWN_ISSUES.md)

---

## 📞 Contact

**Security Team:** security@hublab.dev
**General Support:** support@hublab.dev
**Bug Reports:** [GitHub Issues](https://github.com/raym33/hublab/issues)

---

**Last Updated:** November 12, 2025
**Version:** 1.0

🤖 Generated with [Claude Code](https://claude.com/claude-code)
