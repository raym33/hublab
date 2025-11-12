# Deployment Guides

Complete guides for deploying your HubLab-generated applications to popular platforms.

## 🚀 Supported Platforms

### 1. [Vercel](./vercel.md) ⭐ Recommended for Next.js
- **Best for:** Next.js applications
- **Time to deploy:** 2-3 minutes
- **Free tier:** Yes (generous)
- **Features:** Automatic HTTPS, CDN, serverless functions
- **Difficulty:** ⭐ Easy

### 2. [Netlify](./netlify.md) ⭐ Recommended for Static Sites
- **Best for:** React SPAs, static sites
- **Time to deploy:** 2-3 minutes
- **Free tier:** Yes (100GB bandwidth/month)
- **Features:** Forms, functions, split testing
- **Difficulty:** ⭐ Easy

### 3. [AWS Amplify](./aws-amplify.md)
- **Best for:** AWS ecosystem integration
- **Time to deploy:** 5-10 minutes
- **Free tier:** Yes (first 12 months)
- **Features:** CI/CD, custom domains, SSR
- **Difficulty:** ⭐⭐ Medium

### 4. [Docker + Any Host](./docker.md)
- **Best for:** Custom infrastructure, self-hosting
- **Time to deploy:** 10-15 minutes
- **Free tier:** Depends on host
- **Features:** Complete control
- **Difficulty:** ⭐⭐⭐ Advanced

### 5. [GitHub Pages](./github-pages.md)
- **Best for:** Simple static sites, portfolios
- **Time to deploy:** 3-5 minutes
- **Free tier:** Yes (unlimited)
- **Features:** Simple, reliable
- **Difficulty:** ⭐ Easy

---

## 📋 Quick Start Matrix

| Your App Type | Recommended Platform | Deploy Time |
|---------------|---------------------|-------------|
| Next.js with API routes | Vercel | 2 min |
| React SPA | Netlify or Vercel | 2 min |
| Static HTML/CSS | GitHub Pages or Netlify | 3 min |
| Full-stack with backend | AWS Amplify or Docker | 10 min |
| Custom domain + SSL | Any (all support it) | +2 min |

---

## 🎯 Step-by-Step Deployment

### Option 1: Vercel (Next.js)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Navigate to your project
cd my-hublab-app

# 3. Deploy
vercel

# Follow prompts:
# - Setup and deploy: Y
# - Which scope: [Your account]
# - Link to existing project: N
# - Project name: [Enter name]
# - Directory: ./
# - Build settings: auto-detected

# 4. Done! Your site is live at:
# https://my-hublab-app.vercel.app
```

**Time:** ~2 minutes

---

### Option 2: Netlify (React/Static)

```bash
# 1. Install Netlify CLI
npm i -g netlify-cli

# 2. Navigate to your project
cd my-hublab-app

# 3. Build your app
npm run build

# 4. Deploy
netlify deploy --prod --dir=build

# Or for Next.js:
netlify deploy --prod --dir=.next

# 5. Done! Your site is live
```

**Time:** ~2 minutes

---

### Option 3: GitHub Pages (Static)

```bash
# 1. Create GitHub repository
gh repo create my-hublab-app --public

# 2. Add deployment script to package.json
{
  "scripts": {
    "deploy": "gh-pages -d build"
  }
}

# 3. Install gh-pages
npm install --save-dev gh-pages

# 4. Build and deploy
npm run build
npm run deploy

# 5. Enable GitHub Pages in repo settings
# Settings → Pages → Source: gh-pages branch

# Done! Live at: https://yourusername.github.io/my-hublab-app
```

**Time:** ~3-5 minutes

---

## 🔧 Configuration Examples

### Vercel (vercel.json)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url"
  }
}
```

### Netlify (netlify.toml)

```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  REACT_APP_API_URL = "https://api.example.com"
```

### Docker (Dockerfile)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

---

## 🌐 Custom Domain Setup

### Vercel
```bash
# Add custom domain
vercel domains add yourdomain.com

# Add DNS records (Vercel provides instructions)
# Type: A
# Name: @
# Value: 76.76.21.21
```

### Netlify
```bash
# Add custom domain
netlify domains:add yourdomain.com

# Update DNS:
# Type: CNAME
# Name: www
# Value: [your-site].netlify.app
```

---

## 🔒 Environment Variables

### All Platforms Support Environment Variables

**Vercel:**
```bash
vercel env add NEXT_PUBLIC_API_URL
# Enter value when prompted
```

**Netlify:**
```bash
netlify env:set API_URL "https://api.example.com"
```

**GitHub Actions:**
```yaml
env:
  REACT_APP_API_URL: ${{ secrets.API_URL }}
```

---

## 📊 Performance Optimization

### Before Deployment Checklist

- [ ] Run production build locally
- [ ] Test all routes/pages
- [ ] Optimize images (use next/image or lazy loading)
- [ ] Remove console.logs
- [ ] Enable compression
- [ ] Set up analytics
- [ ] Configure error tracking (Sentry)
- [ ] Test on mobile devices

### Build Optimization

```json
// next.config.js
module.exports = {
  swcMinify: true,
  compress: true,
  images: {
    formats: ['image/webp'],
  },
  // For static export:
  output: 'export',
}
```

---

## 🐛 Troubleshooting

### Common Issues

**1. Build fails with "Module not found"**
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**2. API routes don't work after deployment**
```bash
# Solution: Check if platform supports serverless functions
# Vercel: ✅ Yes (automatic)
# Netlify: ✅ Yes (put in netlify/functions/)
# GitHub Pages: ❌ No (static only)
```

**3. Environment variables not working**
```bash
# Solution: Check prefix
# Next.js: NEXT_PUBLIC_*
# Create React App: REACT_APP_*
# Rebuild after adding env vars
```

**4. 404 on page refresh (SPAs)**
```bash
# Solution: Add redirect rules
# Vercel: Automatic
# Netlify: Add to netlify.toml (see above)
# GitHub Pages: Use HashRouter instead of BrowserRouter
```

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid Plans Start At |
|----------|-----------|---------------------|
| Vercel | 100GB bandwidth | $20/month (Pro) |
| Netlify | 100GB bandwidth | $19/month (Pro) |
| AWS Amplify | 5GB storage, 15GB bandwidth | Pay as you go |
| GitHub Pages | Unlimited (public repos) | Free |

**Recommendation:** Start with free tier, upgrade when needed.

---

## 🚀 CI/CD Setup

### GitHub Actions (Auto-deploy on push)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm ci
      - run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📱 Mobile App Deployment (Bonus)

### Convert to PWA

```javascript
// Add to your app
// manifest.json
{
  "name": "My HubLab App",
  "short_name": "HubLab",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3B82F6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

## ✅ Post-Deployment Checklist

- [ ] Test all pages and functionality
- [ ] Verify custom domain works
- [ ] Check mobile responsiveness
- [ ] Test form submissions
- [ ] Verify API integrations
- [ ] Set up monitoring (UptimeRobot, etc.)
- [ ] Configure CDN if needed
- [ ] Enable HTTPS (automatic on most platforms)
- [ ] Add to search engines
- [ ] Set up analytics

---

## 🆘 Need Help?

- **Vercel:** [docs.vercel.com](https://docs.vercel.com)
- **Netlify:** [docs.netlify.com](https://docs.netlify.com)
- **AWS:** [docs.aws.amazon.com/amplify](https://docs.aws.amazon.com/amplify)
- **HubLab Community:** [Discord/GitHub]

---

**Next Steps:**
1. Choose your platform
2. Follow the quick start guide
3. Deploy your app
4. Share your creation!

**Deployment time:** 2-15 minutes depending on platform
