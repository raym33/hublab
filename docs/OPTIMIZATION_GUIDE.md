# HubLab Optimization Guide

## 📊 Current Status

**Bundle Size:** ~645MB .next directory
**Largest Pages:**
- Studio V2: 403 kB First Load JS
- Workflow: 354 kB First Load JS
- Test Canvas: 366 kB First Load JS

## 🎯 Priority Optimizations

### 1. Critical: Lazy Load Capsule Libraries (HIGH IMPACT)

**Problem:** All 8,144 capsules are loaded at application startup via `lib/all-capsules.ts`

**Current Code:**
```typescript
// lib/all-capsules.ts
import { capsulesBatch1 } from './extended-capsules-batch1'
import { capsulesBatch2 } from './extended-capsules-batch2'
// ... 26 more imports

export const allCapsules = [
  ...capsulesBatch1,
  ...capsulesBatch2,
  // ... all 8,144 capsules
]
```

**Optimized Approach:**
```typescript
// lib/capsule-loader.ts
export const capsulesByCategory = {
  'Dashboard': () => import('./categories/dashboard-capsules'),
  'Forms': () => import('./categories/form-capsules'),
  'AI': () => import('./categories/ai-capsules'),
  // ... etc
}

export async function loadCapsules(category?: string) {
  if (!category) {
    // Load only metadata, not full code
    return await import('./capsules-metadata.json')
  }

  const loader = capsulesByCategory[category]
  if (!loader) throw new Error(`Unknown category: ${category}`)

  const module = await loader()
  return module.default
}
```

**Benefits:**
- Reduce initial bundle by ~80-90%
- Faster page loads
- Lower memory usage

**Estimated Effort:** 4-6 hours
**Impact:** 🟢🟢🟢🟢🟢 (Critical)

---

### 2. Implement Virtual Scrolling for Large Lists

**Problem:** Studio V2 and Marketplace render all items at once

**Solution:** Use `react-window` or `react-virtualized`

```bash
npm install react-window
```

```typescript
// Example: components/CapsuleList.tsx
import { FixedSizeList } from 'react-window'

function CapsuleList({ capsules }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={capsules.length}
      itemSize={100}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <CapsuleCard capsule={capsules[index]} />
        </div>
      )}
    </FixedSizeList>
  )
}
```

**Benefits:**
- Only render visible items
- Smooth scrolling with 1000+ items
- Lower memory footprint

**Estimated Effort:** 2-3 hours per page
**Impact:** 🟢🟢🟢🟢 (High)

---

### 3. Code Splitting by Route

**Current:** All route code bundled together

**Solution:** Use Next.js dynamic imports

```typescript
// app/studio-v2/page.tsx
import dynamic from 'next/dynamic'

const CapsuleStudio = dynamic(() => import('@/components/CapsuleStudio'), {
  loading: () => <LoadingSpinner />,
  ssr: false  // If component doesn't need SSR
})

export default function StudioPage() {
  return <CapsuleStudio />
}
```

**Apply to:**
- `/studio-v2` components
- `/workflow` node editor
- `/testcanva` preview components

**Benefits:**
- Split large components into separate bundles
- Load only when needed
- Faster initial page load

**Estimated Effort:** 1 hour per page
**Impact:** 🟢🟢🟢 (Medium-High)

---

### 4. Optimize Dependencies

**Large Dependencies Found:**
- `react-flow` (workflow editor): ~200 kB
- Multiple UI libraries imported together

**Solution 1: Tree Shaking**
```typescript
// ❌ Bad: Imports entire library
import * as Icons from 'lucide-react'

// ✅ Good: Imports only what's needed
import { Home, Settings, User } from 'lucide-react'
```

**Solution 2: Replace Heavy Libraries**
- Consider lighter alternatives for one-off uses
- Move heavy dependencies to dynamic imports

**Estimated Effort:** 3-4 hours
**Impact:** 🟢🟢🟢 (Medium)

---

### 5. Image Optimization

**Current:** `unoptimized: true` in next.config.js for Netlify free tier

**Solution:** Use Cloudinary or similar CDN

```bash
npm install next-cloudinary
```

```typescript
// next.config.js
module.exports = {
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/your-cloud-name/image/upload/',
  },
}
```

**Benefits:**
- Automatic WebP/AVIF conversion
- Responsive images
- CDN caching

**Estimated Effort:** 2 hours
**Impact:** 🟢🟢 (Medium)

---

### 6. Capsule Metadata Extraction

**Idea:** Separate code from metadata for search

```typescript
// capsules-metadata.json (lightweight)
[
  {
    "id": "button-primary",
    "name": "Primary Button",
    "category": "UI",
    "tags": ["button", "ui"],
    "description": "...",
    // NO CODE HERE - just metadata for search
  }
]

// Load full code only when needed
async function loadCapsuleCode(id: string) {
  const module = await import(`./capsules/${id}`)
  return module.default
}
```

**Benefits:**
- Search/filter works on small JSON
- Code loaded only when capsule is used
- Dramatically smaller initial bundle

**Estimated Effort:** 1 day (need to update export scripts)
**Impact:** 🟢🟢🟢🟢🟢 (Critical)

---

## 🔧 How to Analyze Bundle

```bash
# Build with analysis
npm run build:analyze

# Opens interactive bundle analyzer in browser
# Shows which modules are taking up space
```

**What to look for:**
- Modules > 100 kB (candidates for code splitting)
- Duplicate dependencies (consolidate)
- Unused code (remove)

---

## 📏 Performance Budget

Set limits to prevent regressions:

```typescript
// next.config.js
module.exports = {
  experimental: {
    bundlePagesRouterDependencies: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.performance = {
        maxAssetSize: 200000, // 200 kB
        maxEntrypointSize: 400000, // 400 kB
        hints: 'warning'
      }
    }
    return config
  }
}
```

---

## 🎯 Target Metrics

| Metric | Current | Target | Priority |
|--------|---------|--------|----------|
| First Load JS (homepage) | 96.1 kB | < 100 kB | ✅ Good |
| First Load JS (Studio V2) | 403 kB | < 250 kB | 🔴 Critical |
| Time to Interactive | ~3s | < 2s | 🟡 Medium |
| Largest Contentful Paint | ~2.5s | < 2s | 🟡 Medium |
| Total Bundle Size | 645 MB | < 200 MB | 🔴 Critical |

---

## ✅ Quick Wins Checklist

**Completed:**
- [x] Bundle analyzer enabled
- [x] Error boundaries added
- [x] CORS fixed
- [x] Env validation

**To Do:**
- [ ] Implement capsule lazy loading (1 day)
- [ ] Add virtual scrolling to Studio V2 (3 hours)
- [ ] Extract capsule metadata from code (1 day)
- [ ] Dynamic imports for heavy components (4 hours)
- [ ] Optimize lucide-react imports (1 hour)
- [ ] Set up Cloudinary for images (2 hours)
- [ ] Add webpack performance budget (30 min)

---

## 📚 Resources

- [Next.js Bundle Analysis](https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer)
- [React Window (Virtual Scrolling)](https://github.com/bvaughn/react-window)
- [Next.js Dynamic Imports](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)

---

**Last Updated:** November 18, 2025
**Status:** 3/6 quick wins completed, 3 remaining
