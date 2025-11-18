# Rust Engine Integration Guide

## 🎯 Overview

HubLab uses a **dual-engine architecture** to provide both flexibility and performance:

- **TypeScript Engine** (Node.js): Full-featured, easy to modify, good for development
- **Rust Engine** (Actix-web): Ultra-high performance, optimized for production search

## 📊 Performance Comparison

| Operation | TypeScript (Node.js) | Rust | Speedup |
|-----------|---------------------|------|---------|
| Search 8,150 capsules | ~50ms | **0.25ms** | **200x faster** ⚡ |
| Filter by category | ~30ms | **0.05ms** | **600x faster** 🚀 |
| Fuzzy search | ~150ms | **0.12ms** | **1,250x faster** 💨 |

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Next.js Frontend                │
│         (React/TypeScript)              │
└─────────────────┬───────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
┌────────▼────────┐ ┌─────▼──────────────┐
│ TypeScript API  │ │   Rust Engine      │
│ /api/search     │ │ /api/search-rust   │
│                 │ │                    │
│ • Development   │ │ • Production       │
│ • Flexibility   │ │ • Performance      │
│ • Full features │ │ • Optimized        │
└─────────────────┘ └────────────────────┘
```

## 🚀 Quick Start

### 1. Start Rust Engine (Development)

```bash
cd /Users/c/hublab-rust
cargo run -- serve --port 8080
```

The Rust API will be available at `http://localhost:8080`

### 2. Start Next.js Frontend

```bash
cd /Users/c/hublab
npm run dev
```

The frontend will be at `http://localhost:3000`

### 3. Test Integration

```bash
# Test Rust engine directly
curl "http://localhost:8080/api/search?q=dashboard&limit=5"

# Test through Next.js proxy
curl "http://localhost:3000/api/search-rust?q=dashboard&limit=5"

# Health check
curl -I "http://localhost:3000/api/search-rust"
```

## 📡 API Endpoints

### Next.js Proxy Endpoints

#### Standard Search
```
GET /api/search-rust?q={query}&category={category}&limit={limit}
```

Example:
```bash
curl "http://localhost:3000/api/search-rust?q=analytics&category=Dashboard&limit=10"
```

Response:
```json
{
  "query": "analytics",
  "total": 5,
  "elapsed_ms": 0.234,
  "results": [
    {
      "id": "dashboard-analytics",
      "name": "Analytics Dashboard",
      "category": "Dashboard",
      "tags": ["analytics", "dashboard"],
      "code": "export default function...",
      "platform": "react"
    }
  ],
  "engine": "rust",
  "rust_version": "0.1.0"
}
```

#### Fuzzy Search (Typo Tolerance)
```
GET /api/search-rust/fuzzy?q={query}&threshold={0-1}&limit={limit}
```

Example:
```bash
curl "http://localhost:3000/api/search-rust/fuzzy?q=dashbord&threshold=0.8"
```

Finds "dashboard" even with typo!

### Direct Rust Engine Endpoints

When running Rust engine on port 8080:

```bash
GET /health                           # Health check
GET /api/search?q=...                 # Standard search
GET /api/search/fuzzy?q=...           # Fuzzy search
GET /api/capsules/:id                 # Get single capsule
GET /api/categories                   # List all categories
GET /api/stats                        # Statistics
```

## 🔧 Configuration

### Environment Variables

Add to `/Users/c/hublab/.env.local`:

```bash
# Rust Engine URL (development)
RUST_ENGINE_URL=http://localhost:8080

# Production (when deployed to Shuttle.rs or Fly.io)
# RUST_ENGINE_URL=https://hublab-engine.shuttle.app
```

### Development vs Production

**Development** (use TypeScript for flexibility):
```typescript
// app/api/search/route.ts
const results = await searchCapsules(query)
```

**Production** (use Rust for performance):
```typescript
// Use the Rust proxy
const response = await fetch('/api/search-rust?q=' + query)
const results = await response.json()
```

## 📦 Deployment

### Rust Engine Deployment Options

#### Option 1: Shuttle.rs (Recommended)

```bash
cd /Users/c/hublab-rust

# Install Shuttle CLI
cargo install cargo-shuttle

# Login
cargo shuttle login

# Deploy (FREE tier available)
cargo shuttle deploy
```

Your Rust API will be at: `https://hublab-engine.shuttle.app`

#### Option 2: Fly.io

```bash
cd /Users/c/hublab-rust

# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Deploy
fly launch
fly deploy
```

#### Option 3: Docker

```bash
cd /Users/c/hublab-rust

# Build Docker image
docker build -t hublab-rust .

# Run locally
docker run -p 8080:8080 hublab-rust

# Deploy to any container platform (AWS ECS, GCP Cloud Run, etc.)
```

### Next.js Deployment

Update environment variable on Vercel/Netlify:

```bash
RUST_ENGINE_URL=https://hublab-engine.shuttle.app
```

## 🔄 Data Synchronization

When capsules are updated in TypeScript, export to Rust:

```bash
cd /Users/c/hublab

# Export updated capsules
npx tsx scripts/export-capsules-to-rust.ts

# Rebuild Rust engine
cd /Users/c/hublab-rust
cargo build --release

# Redeploy
cargo shuttle deploy
```

## 🧪 Testing

### Unit Tests

```bash
cd /Users/c/hublab-rust
cargo test
```

### Integration Tests

```bash
# Start Rust engine
cargo run -- serve --port 8080 &

# Test from Next.js
cd /Users/c/hublab
npm run test:integration
```

### Benchmarks

```bash
cd /Users/c/hublab-rust
cargo bench
```

## 🎛️ When to Use Each Engine

### Use TypeScript Engine (`/api/search`) when:

✅ Developing new features
✅ Need full HubLab API features
✅ Modifying search logic
✅ Debugging
✅ Local development

### Use Rust Engine (`/api/search-rust`) when:

✅ Production search with high traffic
✅ Need <1ms response times
✅ Handling 1000+ requests/second
✅ Mobile apps (reduce latency)
✅ Cost optimization (lower compute usage)

## 📈 Performance Tips

### 1. Use Rust for Read-Heavy Operations

```typescript
// ❌ Slow (TypeScript)
const results = await searchCapsules(query)

// ✅ Fast (Rust via proxy)
const results = await fetch('/api/search-rust?q=' + query).then(r => r.json())
```

### 2. Cache Frequently Searched Queries

```typescript
import { cache } from 'react'

const getCapsules = cache(async (query: string) => {
  const res = await fetch('/api/search-rust?q=' + query)
  return res.json()
})
```

### 3. Use Edge Runtime for Proxy

```typescript
// app/api/search-rust/route.ts
export const runtime = 'edge' // Deploy to edge for lower latency
```

## 🔍 Monitoring

Track which engine is being used:

```typescript
// Client-side
const results = await fetch('/api/search-rust?q=' + query).then(r => r.json())

console.log('Engine used:', results.engine) // "rust" or "typescript"
console.log('Response time:', results.elapsed_ms) // milliseconds
```

## 🆘 Troubleshooting

### Rust Engine Not Responding

```bash
# Check if running
curl http://localhost:8080/health

# Check logs
cd /Users/c/hublab-rust
cargo run -- serve --port 8080

# Rebuild if needed
cargo clean
cargo build --release
```

### CORS Errors

Ensure Rust engine allows your Next.js origin:

```rust
// src/shuttle.rs
Cors::default()
    .allowed_origin("http://localhost:3000")
    .allowed_origin("https://hublab.dev")
```

### Data Out of Sync

Re-export capsules:

```bash
cd /Users/c/hublab
npx tsx scripts/export-capsules-to-rust.ts

cd /Users/c/hublab-rust
cargo build --release
```

## 🎯 Best Practices

1. **Development**: Use TypeScript engine for flexibility
2. **Production**: Use Rust engine for performance
3. **Fallback**: Always have TypeScript as backup if Rust is down
4. **Monitoring**: Track response times and errors
5. **Updates**: Re-export capsules after schema changes
6. **Testing**: Test both engines for consistency

## 📚 Additional Resources

- [Rust Engine README](/Users/c/hublab-rust/README.md)
- [HubLab API Documentation](/Users/c/hublab/docs/API.md)
- [Performance Benchmarks](/Users/c/hublab-rust/benches/)

---

**Built with ⚡ Rust and 🚀 TypeScript for optimal performance and developer experience**
