# HubLab Deployment Guide

## Deploy to Netlify

### Prerequisites
- GitHub account
- Netlify account (free tier works)
- Supabase project set up
- Namecheap domain (hublab.dev)

### Step 1: Push to GitHub

```bash
cd /Users/c/hublab
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hublab.git
git push -u origin main
```

### Step 2: Deploy to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Click "Deploy site"

### Step 3: Configure Environment Variables in Netlify

In Netlify dashboard → Site settings → Environment variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
NEXT_PUBLIC_SITE_URL=https://hublab.dev
```

### Step 4: Configure Custom Domain in Netlify

1. In Netlify dashboard → Domain settings
2. Click "Add custom domain"
3. Enter: `hublab.dev`
4. Netlify will provide DNS configuration

### Step 5: Configure DNS in Namecheap

1. Log in to [Namecheap](https://www.namecheap.com/)
2. Go to Domain List → Manage for hublab.dev
3. Go to "Advanced DNS" tab
4. Delete all existing records
5. Add these records:

**A Record:**
- Type: `A Record`
- Host: `@`
- Value: `75.2.60.5` (Netlify load balancer)
- TTL: Automatic

**CNAME Record for www:**
- Type: `CNAME Record`
- Host: `www`
- Value: `YOUR-NETLIFY-SUBDOMAIN.netlify.app`
- TTL: Automatic

**Alternative: Use Netlify DNS (Recommended)**

1. In Netlify → Domain settings → "Use Netlify DNS"
2. Netlify will provide nameservers (e.g., `dns1.p01.nsone.net`)
3. In Namecheap → Domain → Nameservers → Custom DNS
4. Add all Netlify nameservers
5. Wait 24-48 hours for propagation

### Step 6: Enable HTTPS

1. In Netlify → Domain settings → HTTPS
2. Click "Verify DNS configuration"
3. Enable "Force HTTPS"
4. Netlify will automatically provision SSL certificate

### Step 7: Create Waitlist Table in Supabase

Run this SQL in Supabase SQL Editor:

```sql
-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified BOOLEAN DEFAULT FALSE,
  notified_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can view waitlist" ON waitlist
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Service role can update waitlist" ON waitlist
  FOR UPDATE TO service_role USING (true);
```

## Troubleshooting

### Build fails on Netlify
- Check Node version (should be 18+)
- Verify all environment variables are set
- Check build logs for specific errors

### Domain not resolving
- DNS propagation takes 24-48 hours
- Use `dig hublab.dev` to check DNS records
- Verify nameservers are correctly configured

### Images not loading
- Check Supabase storage bucket is public
- Verify `next.config.js` has correct image domains

## Useful Commands

```bash
# Test build locally
npm run build
npm start

# Check for errors
npm run lint

# Deploy preview
# Push to any branch and Netlify will create preview
```

## Post-Deployment Checklist

- [ ] Site loads at https://hublab.dev
- [ ] SSL certificate is active (green padlock)
- [ ] www.hublab.dev redirects to hublab.dev
- [ ] Waitlist form submits successfully
- [ ] Cookie banner appears on first visit
- [ ] All legal pages load correctly
- [ ] Dithering animation works on landing page
- [ ] Navigation menu works on mobile
- [ ] Images load from Unsplash
- [ ] Marketplace page displays all prototypes

## Monitoring

- Netlify Analytics: Site traffic and performance
- Supabase Dashboard: Database queries and user activity
- Netlify Deploy Logs: Build and deployment status

## Support

For issues:
- Netlify: https://answers.netlify.com/
- Namecheap: https://www.namecheap.com/support/
- Supabase: https://supabase.com/docs
