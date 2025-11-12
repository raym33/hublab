# HubLab Technical Architecture

Complete technical documentation of the HubLab platform architecture.

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Systems](#core-systems)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)
7. [Deployment](#deployment)
8. [Performance](#performance)

---

## 🏗️ System Overview

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Studio V2  │  │   Capsules   │  │  Marketplace │     │
│  │  (Builder)   │  │   Library    │  │    (Beta)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                           │                                 │
└───────────────────────────┼─────────────────────────────────┘
                            │
                   ┌────────┴────────┐
                   │   API Routes    │
                   │  (Next.js 14)   │
                   └────────┬────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    ┌────▼────┐      ┌──────▼──────┐    ┌─────▼─────┐
    │ Supabase │      │  GROQ API   │    │  Netlify  │
    │   (DB)   │      │  (AI Chat)  │    │  (Deploy) │
    └──────────┘      └─────────────┘    └───────────┘
```

### Key Components

1. **Studio V2**: Visual builder with drag & drop
2. **Capsule Library**: 180+ reusable components
3. **AI Assistant**: Built-in chat helper
4. **Code Export**: Multi-format code generation
5. **Marketplace**: Community capsules (coming soon)

---

## 💻 Technology Stack

### Frontend

```json
{
  "framework": "Next.js 14.2.33",
  "language": "TypeScript 5.x",
  "ui_library": "React 18",
  "styling": "Tailwind CSS 3.x",
  "state_management": "React Hooks",
  "canvas": "React Flow 11.x",
  "forms": "Native HTML5",
  "http_client": "Fetch API"
}
```

### Backend & Services

```json
{
  "runtime": "Node.js (Vercel/Netlify)",
  "api": "Next.js API Routes",
  "database": "Supabase (PostgreSQL)",
  "auth": "Supabase Auth",
  "ai_model": "GROQ (llama-3.3-70b-versatile)",
  "deployment": "Netlify",
  "cdn": "Netlify Edge",
  "analytics": "Built-in"
}
```

### Development Tools

```json
{
  "package_manager": "npm",
  "linter": "ESLint",
  "formatter": "Prettier (optional)",
  "type_checking": "TypeScript",
  "git": "GitHub",
  "ci_cd": "Netlify Build"
}
```

---

## 📁 Project Structure

```
hublab/
├── app/                          # Next.js 14 App Router
│   ├── api/                      # API Routes
│   │   ├── ai/                   # AI endpoints
│   │   │   └── status/
│   │   ├── auth/                 # Authentication
│   │   │   └── google/
│   │   ├── canvas-assistant/     # AI canvas helper
│   │   ├── compiler/             # Code generation
│   │   │   ├── async/
│   │   │   ├── generate/
│   │   │   ├── improve/
│   │   │   ├── quick/
│   │   │   └── v2/
│   │   ├── compositions/         # Saved projects
│   │   │   └── [id]/
│   │   ├── crm/                  # CRM integration
│   │   │   ├── actions/
│   │   │   ├── approvals/
│   │   │   ├── events/
│   │   │   ├── hubspot/
│   │   │   └── stats/
│   │   └── marketplace/          # Capsule marketplace
│   │       └── capsules/
│   ├── builder/                  # Legacy builder
│   │   └── page.tsx
│   ├── canvas/                   # Canvas editor
│   │   └── page.tsx
│   ├── capsules/                 # Capsule library viewer
│   │   └── page.tsx
│   ├── compiler/                 # Code compiler UI
│   │   ├── page.tsx
│   │   ├── demo/
│   │   └── explore/
│   ├── compiler-v2/              # Compiler V2
│   │   └── page.tsx
│   ├── crm/                      # CRM pages
│   │   ├── approvals/
│   │   ├── dashboard/
│   │   └── setup/
│   ├── demos/                    # Example apps
│   │   └── page.tsx
│   ├── login/                    # Auth page
│   │   └── page.tsx
│   ├── marketplace/              # Marketplace UI
│   │   └── page.tsx
│   ├── prototype/                # Live prototypes
│   │   └── [id]/
│   ├── studio/                   # Studio V1
│   │   └── page.tsx
│   ├── studio-v2/                # Studio V2 (Main)
│   │   └── page.tsx
│   ├── test-capsules/            # Testing page
│   │   └── page.tsx
│   ├── upload/                   # File upload
│   │   └── page.tsx
│   ├── waitlist/                 # Waitlist page
│   │   ├── page.tsx
│   │   └── success/
│   ├── workflow/                 # Workflow builder
│   │   └── page.tsx
│   ├── workspace/                # User workspace
│   │   └── page.tsx
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles
│   └── middleware.ts             # Edge middleware
│
├── lib/                          # Core library
│   ├── capsules-v2/              # Capsule definitions
│   │   ├── types.ts              # TypeScript types
│   │   ├── definitions.ts        # Core capsules
│   │   ├── definitions-advanced.ts
│   │   ├── definitions-advanced-ui.ts
│   │   ├── definitions-ai-ml.ts
│   │   ├── definitions-animation.ts
│   │   ├── definitions-card.ts
│   │   ├── definitions-chart.ts
│   │   ├── definitions-content.ts
│   │   ├── definitions-data.ts
│   │   ├── definitions-dataviz.ts
│   │   ├── definitions-ecommerce.ts
│   │   ├── definitions-extended.ts  # All capsules aggregator
│   │   ├── definitions-extra.ts
│   │   ├── definitions-feedback.ts
│   │   ├── definitions-form.ts
│   │   ├── definitions-forms.ts
│   │   ├── definitions-input.ts
│   │   ├── definitions-interaction.ts
│   │   ├── definitions-layout.ts
│   │   ├── definitions-list.ts
│   │   ├── definitions-media.ts
│   │   ├── definitions-modal.ts
│   │   ├── definitions-navigation.ts
│   │   ├── definitions-social.ts
│   │   └── definitions-utilities.ts
│   │
│   ├── supabase/                 # Supabase client
│   │   ├── client.ts
│   │   └── server.ts
│   │
│   └── utils/                    # Utility functions
│       ├── code-generator.ts
│       ├── capsule-helpers.ts
│       └── validation.ts
│
├── components/                   # Shared React components
│   ├── ui/                       # UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   └── ...
│   ├── crm/                      # CRM components
│   └── ...
│
├── public/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── ...
│
├── supabase/                     # Supabase config
│   ├── migrations/               # Database migrations
│   └── seed.sql                  # Seed data
│
├── .env.local                    # Environment variables
├── .env.production               # Production env
├── next.config.js                # Next.js config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
├── netlify.toml                  # Netlify config
└── README.md                     # Project readme
```

---

## ⚙️ Core Systems

### 1. Capsule System

#### Capsule Definition

Located in `/lib/capsules-v2/`

```typescript
// types.ts
export interface CapsuleDefinition {
  id: string
  name: string
  description: string
  category: string
  props: PropDefinition[]
  dependencies: string[]
  code: string
}

export interface PropDefinition {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  required: boolean
  default: any
  description: string
}
```

#### Capsule Registry

```typescript
// definitions-extended.ts
export const ALL_CAPSULES = [
  ...CAPSULE_DEFINITIONS,      // Core 21 capsules
  ...UI_CAPSULES_EXTENDED,     // Extended UI
  ...ADVANCED_CAPSULES,        // Advanced patterns
  ...EXTRA_CAPSULES,           // Extra utilities
  ...INTERACTION_CAPSULES,     // Interactions
  ...ADVANCED_UI_CAPSULES,     // Advanced UI
  ...AI_ML_CAPSULES,           // AI components
  ...MEDIA_CAPSULES,           // Media handling
  ...DATAVIZ_CAPSULES,         // Data visualization
  ...FORMS_CAPSULES,           // Advanced forms
  ...UTILITIES_CAPSULES,       // Utilities
  ...LAYOUT_CAPSULES,          // Layouts
  ...ANIMATION_CAPSULES,       // Animations
  ...SOCIAL_CAPSULES,          // Social media
  ...ECOMMERCE_CAPSULES,       // E-commerce
  ...FORM_CAPSULES,            // Form inputs
  ...NAVIGATION_CAPSULES,      // Navigation
  ...DATA_CAPSULES,            // Data display
  ...FEEDBACK_CAPSULES,        // Feedback
  ...CONTENT_CAPSULES,         // Content
  ...MODAL_CAPSULES,           // Modals
  ...CARD_CAPSULES,            // Cards
  ...INPUT_CAPSULES,           // Inputs
  ...CHART_CAPSULES,           // Charts
  ...LIST_CAPSULES             // Lists
]

export function getAllCapsulesExtended() {
  return ALL_CAPSULES
}

export function getCapsuleByIdExtended(id: string) {
  return ALL_CAPSULES.find(c => c.id === id)
}
```

### 2. Studio V2 System

#### React Flow Integration

```typescript
// Studio V2 uses React Flow for canvas
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  useReactFlow
} from 'reactflow'

// Node represents a capsule on canvas
interface CapsuleNode extends Node {
  data: {
    capsule: CapsuleDefinition
    props: Record<string, any>
  }
}
```

#### Drag & Drop

```typescript
const onDragStart = (event, capsule) => {
  event.dataTransfer.setData('application/reactflow', JSON.stringify(capsule))
  event.dataTransfer.effectAllowed = 'move'
}

const onDrop = (event) => {
  const capsuleData = JSON.parse(event.dataTransfer.getData('application/reactflow'))
  const position = screenToFlowPosition({
    x: event.clientX,
    y: event.clientY
  })

  const newNode = {
    id: `node-${Date.now()}`,
    type: 'capsule',
    position,
    data: { capsule: capsuleData, props: {} }
  }

  setNodes((nds) => nds.concat(newNode))
}
```

### 3. Code Generation System

#### Compiler Pipeline

```typescript
// /app/api/compiler/v2/route.ts
export async function POST(request: Request) {
  const { nodes, format } = await request.json()

  // 1. Parse nodes into capsules
  const capsules = nodes.map(node => ({
    definition: node.data.capsule,
    props: node.data.props
  }))

  // 2. Resolve dependencies
  const deps = resolveDependencies(capsules)

  // 3. Generate imports
  const imports = generateImports(deps)

  // 4. Generate components
  const components = generateComponents(capsules)

  // 5. Generate main component
  const mainComponent = generateMainComponent(capsules, format)

  // 6. Combine and format
  const code = formatCode({
    imports,
    components,
    mainComponent
  })

  return NextResponse.json({ code })
}
```

#### Code Templates

**React Component:**
```typescript
const REACT_TEMPLATE = `
import React from 'react'
${imports}

${components}

export default function App() {
  return (
    <div>
      ${renderedComponents}
    </div>
  )
}
`
```

**Next.js Page:**
```typescript
const NEXTJS_TEMPLATE = `
${imports}

export default function Page() {
  return (
    <main className="min-h-screen">
      ${renderedComponents}
    </main>
  )
}

${components}
`
```

**HTML:**
```typescript
const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Page</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  ${htmlComponents}
  ${scripts}
</body>
</html>
`
```

### 4. AI Assistant System

#### Canvas Assistant API

```typescript
// /app/api/canvas-assistant/route.ts
export async function POST(request: Request) {
  const { messages } = await request.json()

  // Call GROQ API
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  })

  const data = await response.json()
  return NextResponse.json(data)
}
```

#### System Prompt

```typescript
const SYSTEM_PROMPT = `
You are an AI assistant helping users build web applications using HubLab.

Available capsules: ${ALL_CAPSULES.map(c => c.name).join(', ')}

When users ask for help:
1. Suggest relevant capsules
2. Explain how to configure them
3. Show how to arrange them
4. Provide code snippets if needed

Be concise and helpful.
`
```

---

## 🔌 API Endpoints

### Public Endpoints

```
GET  /api/ai/status
POST /api/canvas-assistant
POST /api/compiler/generate
POST /api/compiler/quick
POST /api/compiler/v2
GET  /api/compositions
POST /api/compositions
GET  /api/compositions/[id]
PUT  /api/compositions/[id]
DELETE /api/compositions/[id]
POST /api/compositions/[id]/fork
POST /api/compositions/[id]/like
POST /api/contact
POST /api/waitlist
```

### Authenticated Endpoints

```
GET  /api/auth/google
GET  /api/auth/google/callback
POST /api/marketplace/capsules
GET  /api/marketplace/capsules/[id]
POST /api/marketplace/capsules/[id]/publish
POST /api/marketplace/capsules/[id]/star
```

### CRM Endpoints

```
GET  /api/crm/stats
GET  /api/crm/actions/recent
GET  /api/crm/events/recent
GET  /api/crm/approvals
POST /api/crm/approvals
PATCH /api/crm/approvals
GET  /api/crm/hubspot/connect
GET  /api/crm/hubspot/callback
```

---

## 🗄️ Database Schema

### Supabase Tables

#### compositions
```sql
CREATE TABLE compositions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  nodes JSONB NOT NULL,
  edges JSONB NOT NULL,
  thumbnail TEXT,
  is_public BOOLEAN DEFAULT false,
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### marketplace_capsules
```sql
CREATE TABLE marketplace_capsules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES auth.users(id),
  capsule_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  code TEXT NOT NULL,
  props JSONB,
  dependencies JSONB,
  downloads INTEGER DEFAULT 0,
  stars INTEGER DEFAULT 0,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### crm_connections
```sql
CREATE TABLE crm_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  provider TEXT NOT NULL, -- 'hubspot', 'salesforce'
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  connected_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Deployment

### Netlify Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables

```bash
# .env.local (Development)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
GROQ_API_KEY=gsk_xxx...
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx...

# .env.production (Production)
# Same variables but production values
```

### Build Process

```bash
# Install dependencies
npm install

# Run type checking
npm run type-check

# Build for production
npm run build

# Deploy to Netlify
netlify deploy --prod
```

---

## ⚡ Performance

### Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Total Bundle Size**: ~400KB (gzipped)
- **API Response Time**: < 200ms (average)

### Optimizations

#### Code Splitting

```typescript
// Lazy load heavy components
const StudioV2 = dynamic(() => import('./studio-v2/page'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})
```

#### Image Optimization

```typescript
import Image from 'next/image'

<Image
  src="/hero.jpg"
  width={1200}
  height={600}
  alt="Hero"
  priority
/>
```

#### Caching Strategy

```typescript
// API routes use caching
export const revalidate = 3600 // 1 hour

// Static pages
export const dynamic = 'force-static'

// ISR (Incremental Static Regeneration)
export const revalidate = 60 // 1 minute
```

---

## 🔒 Security

### Authentication

- Supabase Auth (OAuth, Email)
- JWT tokens
- Secure cookie storage

### API Security

- Rate limiting (100 req/min per IP)
- CORS configuration
- Input validation
- SQL injection prevention (Supabase RLS)

### Data Protection

- Row Level Security (RLS) on all tables
- Encrypted connections (HTTPS)
- Environment variable protection
- No sensitive data in frontend

---

**Complete technical architecture for HubLab platform** 🏗️
