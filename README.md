# HubLab - Universal Capsule Compiler

> Transform AI prompts into full-stack applications using modular, platform-agnostic capsules.

HubLab is an open-source platform that compiles natural language descriptions into production-ready applications across multiple platforms (Web, Desktop, iOS, Android, AI-OS). It uses a revolutionary "Universal Capsule" system - reusable, AI-augmented building blocks that work across any platform.

## Features

- **AI-Powered Compilation**: Describe your app in plain English, get production code
- **Universal Capsules**: 68+ pre-built capsules (UI, Auth, Database, Payments, AI, etc.)
- **Multi-Platform**: Compile to Web, Desktop (Electron), iOS (Swift), Android (Kotlin), AI-OS
- **Marketplace**: Browse, publish, and use community-created capsules
- **Real-Time Compiler**: See your app structure and code as it's generated
- **Save & Export**: Download complete projects or save compositions to your account
- **Template Library**: Start from pre-built templates (Todo App, Chat, Dashboard, etc.)

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: OpenAI API (configurable for local models)
- **Compiler**: Custom TypeScript-based capsule compiler

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

HubLab works with any OpenAI-compatible API, including local models:

### Ollama
```bash
# Install Ollama: https://ollama.ai
ollama pull llama3.1:8b

# Set in .env.local:
OPENAI_API_BASE=http://localhost:11434/v1
OPENAI_API_KEY=ollama
```

### LM Studio
```bash
# Download LM Studio: https://lmstudio.ai
# Load a model and start the server on port 1234

# Set in .env.local:
OPENAI_API_BASE=http://localhost:1234/v1
OPENAI_API_KEY=lm-studio
```

### Other Local Models
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
│   │   ├── capsule-registry.ts   # 68 capsule definitions
│   │   ├── compiler-engine.ts    # Core compilation logic
│   │   ├── ai-orchestrator.ts    # AI integration
│   │   └── platform-generators/  # Code generators per platform
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

### Pre-built Capsules (68+)
- **UI**: Button, Input, Card, Modal, Navigation, Form, Table, Chart
- **Auth**: Login, Signup, OAuth (Google, GitHub), JWT, Session Management
- **Database**: Supabase, PostgreSQL, MongoDB, Redis, Local Storage
- **Payments**: Stripe, PayPal, Subscription Management
- **AI**: OpenAI, Anthropic, Ollama, RAG, Vector Search, Chat Interface
- **Media**: Image Upload, Video Player, Audio Recorder, File Storage
- **Communication**: Email, SMS, Push Notifications, WebSockets
- **And 50+ more...**

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

- [x] Core compiler engine
- [x] 68 pre-built capsules
- [x] Web platform support
- [x] Desktop (Electron) support
- [x] User authentication
- [x] Save compositions
- [x] Marketplace infrastructure
- [ ] iOS code generation improvements
- [ ] Android code generation improvements
- [ ] AI-OS platform support
- [ ] Visual capsule editor
- [ ] Real-time collaboration
- [ ] Capsule versioning system
- [ ] Automated testing generation
- [ ] CI/CD integration
- [ ] Plugin system
- [ ] VS Code extension

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