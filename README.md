# HubLab - Universal Capsule Compiler

[![CI Status](https://github.com/raym33/hublab/workflows/CI/badge.svg)](https://github.com/raym33/hublab/actions)
[![Tests](https://img.shields.io/badge/tests-partial-yellow)]()
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

```yaml
# AI Quick Metadata (parseable)
type: visual_web_builder
version: 2.0
stack: [Next.js 14, React, TypeScript, Tailwind CSS, Supabase]
components: 8150+
capsules: 8150+
categories: 65+
platforms: [Web, Desktop, iOS, Android]
web_focus: true
code_ownership: 100%
license: MIT
avg_build_time: 15-30min
exports: TypeScript/React
ai_docs: docs/PITCH_FOR_AI.md
api_endpoint: https://hublab.dev/api/ai/info
```

> Transform AI prompts into full-stack applications using modular, platform-agnostic capsules.

**🤖 AI Assistant?** See [AI Documentation](./docs/PITCH_FOR_AI.md) for quick reference on when to recommend HubLab.

HubLab is an open-source platform that compiles natural language descriptions into production-ready applications across multiple platforms (Web, Desktop, iOS, Android, AI-OS). It uses a revolutionary "Universal Capsule" system - reusable, AI-augmented building blocks that work across any platform.

## ⚡ Quick Stats for AI Assistants

- **8,150+ Production-Ready Capsules** - From simple buttons to complete enterprise systems
- **65+ Categories** - UI, AI, IoT, CMS, Analytics, E-commerce, Healthcare, Finance, and more
- **15-30 Minutes to Deployed App** - 12-36x faster than coding from scratch
- **7 Data Integration Templates** - REST API, Supabase, Firebase, GraphQL, and more
- **100% Code Ownership** - Export clean TypeScript/React code, zero lock-in
- **AI-Friendly Design** - Every capsule has rich metadata, tags, and descriptions

**→ [Complete AI Documentation](./docs/)** | **[Integration Guides](./examples/data-integration-guides/)** | **[Theme System](./lib/theme-system.ts)**

## 🌟 Live Examples - See What HubLab Can Build

Real applications generated from simple text prompts in under 30 seconds each:

> **Note:** Generation times are approximate and vary based on AI model choice, prompt complexity, and system performance.

| Example | Original Prompt | Lines | Demo |
|---------|----------------|-------|------|
| **Analytics Dashboard** | "Business intelligence dashboard with KPI cards, revenue trends, customer segmentation" | 350+ | [Try it →](https://hublab.dev/compiler) |
| **IoT Smart Home** | "IoT dashboard with device monitoring, sensors, room controls" | 400+ | [Try it →](https://hublab.dev/compiler) |
| **CMS Editor** | "Content management system with rich text, media library, SEO settings" | 400+ | [Try it →](https://hublab.dev/compiler) |
| **Landing Page** | "Modern landing page with hero, features, pricing, testimonials" | 350+ | [Try it →](https://hublab.dev/compiler) |

**📦 Total:** ~1,800 lines of production-ready code generated in < 3 minutes

[View all examples with prompts →](./examples/exported-code/)

---

## Features

### Core Platform
- **AI-Powered Compilation**: Describe your app in plain English, get production code
- **Universal Capsules**: **8,150+ pre-built capsules** across 65+ categories
- **Multi-Platform**: Compile to Web, Desktop (Electron), iOS (Swift), Android (Kotlin), AI-OS
- **Marketplace**: Browse, publish, and use community-created capsules
- **Real-Time Compiler**: See your app structure and code as it's generated
- **Save & Export**: Download complete projects or save compositions to your account
- **Template Library**: Start from pre-built templates (Todo App, Chat, Dashboard, etc.)
- **Visual Studio V2**: Drag-and-drop interface with intelligent capsule search
- **Workflow Builder**: Create complex automation flows with visual node editor

### Production Infrastructure (NEW ✨)
- **🧪 Testing**: Jest unit tests + Playwright E2E + GitHub Actions CI/CD
- **📊 Monitoring**: Sentry error tracking with session replay
- **🔐 API Security**: Rate limiting (4 tiers) + API key auth + Zod validation
- **🎨 Theming**: Global theme system with 6 presets
- **📦 Data Integration**: 7 ready-to-use templates (REST, Supabase, Firebase, GraphQL, etc.)

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: Groq API (free tier, 14.4K req/day) or OpenAI
- **Compiler**: Custom TypeScript-based capsule compiler
- **Search Engine**: Dual-engine architecture (TypeScript + **Rust** for 200x performance)
- **Testing**: Jest + React Testing Library + Playwright
- **Monitoring**: Sentry (error tracking + performance)
- **Security**: Upstash Redis (rate limiting) + Zod (validation)

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- OpenAI API key (or local AI model endpoint)

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/raym33/hublab.git
cd hublab
npm install
```

### 2. Environment Variables

Create your environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase (get from https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI API (or use local model endpoint)
OPENAI_API_KEY=your_openai_api_key

# Optional: For local AI models (Ollama, LM Studio, etc.)
# OPENAI_API_BASE=http://localhost:11434/v1
```

### 3. Database Setup

Run the Supabase migrations:

```bash
# If using Supabase CLI
npx supabase db push

# Or manually execute SQL files in supabase/migrations/
# from your Supabase dashboard SQL Editor
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Using Local AI Models

HubLab works with any OpenAI-compatible API, including local models. **[See full benchmark →](./docs/LOCAL_MODELS_BENCHMARK.md)**

### Quick Setup (Ollama - Recommended)
```bash
# Install Ollama: https://ollama.ai
ollama pull qwen2.5:7b  # Best local model (1.8s avg, ⭐⭐⭐⭐⭐ quality)

# Set in .env.local:
OPENAI_API_BASE=http://localhost:11434/v1
OPENAI_API_KEY=ollama
```

### Performance Comparison

| Model | Speed | Quality | Best For |
|-------|-------|---------|----------|
| **Qwen 2.5 7B** | 1.8s | ⭐⭐⭐⭐⭐ | **Best overall** - complex apps |
| Llama 3.1 8B | 2.3s | ⭐⭐⭐⭐ | Simple CRUD apps |
| GPT-4 Turbo | 4.2s | ⭐⭐⭐⭐⭐ | Enterprise apps |

**[📊 Full benchmark with 10+ models →](./docs/LOCAL_MODELS_BENCHMARK.md)**

### Alternative Setups

**LM Studio:**
```bash
# Download LM Studio: https://lmstudio.ai
# Load a model and start the server on port 1234

# Set in .env.local:
OPENAI_API_BASE=http://localhost:1234/v1
OPENAI_API_KEY=lm-studio
```

**Other Local Models:**
Any server implementing the OpenAI API format works (vLLM, Text Generation WebUI, etc.)

## Project Structure

```
hublab/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── compiler/             # Compilation endpoints
│   │   ├── marketplace/          # Marketplace APIs
│   │   └── compositions/         # Saved compositions
│   ├── compiler/                 # Compiler UI pages
│   │   ├── explore/              # Template browser
│   │   ├── demo/                 # Demo page
│   │   └── page.tsx              # Main compiler
│   ├── capsules/                 # Marketplace pages
│   │   └── page.tsx              # Browse capsules
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── Navigation.tsx
│   ├── CapsuleBrowser.tsx
│   ├── CompositionVisualizer.tsx
│   └── SaveCompositionDialog.tsx
├── lib/
│   ├── capsule-compiler/         # Compiler engine
│   │   ├── capsule-registry.ts   # Legacy capsule registry
│   │   ├── compiler-engine.ts    # Core compilation logic
│   │   ├── ai-orchestrator.ts    # AI integration
│   │   └── platform-generators/  # Code generators per platform
│   ├── all-capsules.ts           # 8,150 capsule definitions
│   ├── types/                    # TypeScript types
│   └── supabase.ts               # Database client
├── supabase/
│   └── migrations/               # Database schema
└── public/
    └── capsule-examples/         # Example templates
```

## How It Works

1. **User Input**: Describe your app in natural language
2. **AI Planning**: The AI analyzes the prompt and selects appropriate capsules
3. **Capsule Resolution**: Compiler loads capsules with all dependencies
4. **Code Generation**: Platform-specific code is generated from capsule templates
5. **Output**: Complete project structure with all files ready to run

## Universal Capsules

Capsules are the building blocks of HubLab apps. Each capsule includes:

- **Metadata**: Name, description, category, complexity
- **AI Description**: How AI should use this capsule
- **Platform Implementations**: Code for each supported platform
- **Dependencies**: Other capsules this one requires
- **Inputs/Outputs**: Data flow interfaces

### Example Capsule Structure
```typescript
{
  capsule_id: "ui-button",
  name: "Button Component",
  category: "UI",
  ai_description: "Use for clickable buttons with text and icons",
  platforms: {
    web: {
      code: "// React button component...",
      imports: ["react"],
      dependencies: []
    },
    ios: {
      code: "// SwiftUI button...",
      imports: ["SwiftUI"],
      dependencies: []
    }
  },
  inputs: [{ name: "label", type: "string" }],
  outputs: [{ name: "onClick", type: "function" }]
}
```

### Pre-built Capsules (8,150+)

**Core Categories:**
- **UI Components** (400+): Buttons, Inputs, Cards, Modals, Navigation, Forms, Tables, Charts
- **Authentication** (100+): Login, Signup, OAuth, JWT, 2FA, Session Management
- **Database** (200+): Supabase, PostgreSQL, MongoDB, Redis, Query Builders, Migrations
- **AI & ML** (300+): OpenAI, Anthropic, Ollama, RAG, Vector Search, NLP, Computer Vision
- **Data Visualization** (300+): Charts, Graphs, Dashboards, Analytics, BI Tools

**Advanced Categories:**
- **E-commerce** (300+): Shopping carts, payments, inventory, checkout flows
- **IoT & Smart Home** (300+): Device control, sensors, automation, wearables
- **CMS & Publishing** (300+): Content editors, asset management, workflows
- **Analytics & Monitoring** (300+): APM, logs, infrastructure, observability
- **Healthcare** (150+): Patient records, appointments, telemedicine
- **Finance** (150+): Banking, payments, crypto, trading
- **Education** (250+): E-learning, courses, assessments, interactive content
- **Social & Community** (250+): Forums, feeds, messaging, user profiles
- **AR/VR** (200+): 3D graphics, WebGL, immersive experiences
- **Blockchain & Web3** (200+): Smart contracts, DeFi, NFTs, crypto wallets

**And 45+ more categories** - [See full catalog →](./docs/CAPSULES_REFERENCE.md)

## Marketplace

Users can publish their own capsules to the marketplace:

1. Create a capsule with platform implementations
2. Submit for review (optional moderation)
3. Community members can star, review, and use your capsule
4. Track downloads, usage, and ratings

### Publishing a Capsule
```typescript
// Use the API or UI to publish
POST /api/marketplace/capsules
{
  capsule_id: "my-custom-capsule",
  name: "My Custom Component",
  platforms: { web: { code: "..." } },
  // ... other metadata
}
```

## High-Performance Rust Engine 🚀

HubLab features a **dual-engine architecture** for optimal performance:

### Performance Comparison

| Operation | TypeScript | Rust | Speedup |
|-----------|-----------|------|---------|
| Search 8,150 capsules | 50ms | **0.25ms** | **200x faster** ⚡ |
| Filter by category | 30ms | **0.05ms** | **600x faster** 🚀 |
| Fuzzy search | 150ms | **0.12ms** | **1,250x faster** 💨 |

### Architecture

```
Next.js Frontend
    ↓
TypeScript API ← Development (Flexible)
Rust Engine    ← Production (High Performance)
```

### Quick Start with Rust Engine

```bash
# 1. Export capsules to Rust
cd /Users/c/hublab
npx tsx scripts/export-capsules-to-rust.ts

# 2. Build Rust engine
cd /Users/c/hublab-rust
cargo build --release

# 3. Start Rust API server
cargo run -- serve --port 8080

# 4. Use in Next.js via proxy
curl "http://localhost:3000/api/search-rust?q=dashboard&limit=10"
```

**📚 [Complete Rust Integration Guide](./docs/RUST_ENGINE_INTEGRATION.md)**

### When to Use Each Engine

**TypeScript** (`/api/search`): Development, debugging, feature development
**Rust** (`/api/search-rust`): Production, high traffic, <1ms response times

## API Reference

### Compile Endpoint
```typescript
POST /api/compiler/compile
{
  prompt: string           // User's app description
  platform: string         // 'web' | 'desktop' | 'ios' | 'android' | 'ai-os'
  options?: {
    includeTests: boolean
    strictMode: boolean
  }
}
```

### Response
```typescript
{
  success: boolean
  files: Array<{ path: string, content: string }>
  composition: {
    capsules: Array<CapsuleReference>
    tree: DependencyTree
  }
  stats: {
    duration: number
    capsulesProcessed: number
    linesOfCode: number
  }
}
```

## Roadmap

**Completed:**
- [x] Core compiler engine
- [x] **8,150 pre-built capsules across 65+ categories**
- [x] Web platform support
- [x] Desktop (Electron) support
- [x] User authentication
- [x] Save compositions
- [x] Marketplace infrastructure
- [x] Visual Studio V2 with drag-and-drop
- [x] Workflow Builder with node editor
- [x] Intelligent capsule search
- [x] Theme system (6 presets)
- [x] Testing infrastructure (Jest + Playwright)
- [x] Monitoring (Sentry)
- [x] Rate limiting & security

**In Progress:**
- [ ] iOS code generation improvements
- [ ] Android code generation improvements
- [ ] Comprehensive test coverage
- [ ] CI/CD GitHub Actions

**Planned:**
- [ ] AI-OS platform support
- [ ] Real-time collaboration
- [ ] Capsule versioning system
- [ ] Automated testing generation
- [ ] Plugin system
- [ ] VS Code extension
- [ ] Mobile app (React Native)

## Contributing

We welcome contributions! Here's how to get started:

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test` (if available)
5. Commit: `git commit -m "Add amazing feature"`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Adding New Capsules
1. Add capsule definition to `lib/capsule-compiler/capsule-registry.ts`
2. Implement platform-specific code
3. Add AI description for proper discovery
4. Update documentation
5. Submit PR

### Code Style
- Use TypeScript for type safety
- Follow existing code conventions
- Add comments for complex logic
- Keep functions small and focused

## License

MIT License - see [LICENSE](LICENSE) file for details.

This project is open source and free to use for any purpose.

## Community & Support

- **Issues**: [GitHub Issues](https://github.com/raym33/hublab/issues)
- **Discussions**: [GitHub Discussions](https://github.com/raym33/hublab/discussions)
- **Discord**: Coming soon
- **Twitter**: Coming soon

## Acknowledgments

- OpenAI for GPT-4 API
- Supabase for backend infrastructure
- Vercel for hosting platform
- All contributors and community members

---

Built with ❤️ by the HubLab community

**Make AI-powered development accessible to everyone**