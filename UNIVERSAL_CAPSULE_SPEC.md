# Universal Capsule Specification v1.0

## Vision

**Capsules are meta-components**: platform-agnostic, reusable, AI-compatible building blocks that compile to native code for any platform (web, desktop, mobile, IoT, future AI OS).

## Core Principles

1. **Write Once, Run Anywhere** - Same capsule → web app, desktop app, mobile app, future OS
2. **AI-First** - Designed for AI to discover, compose, and generate apps
3. **Type-Safe** - Strong typing ensures compatibility across millions of capsules
4. **Composable** - Capsules connect to other capsules infinitely
5. **Future-Proof** - When AI becomes OS, apps speak native AI language

---

## Capsule Structure

### Universal Capsule Format (UCF)

```typescript
{
  // Identity
  "id": "button-primary",
  "name": "Primary Button",
  "version": "1.0.0",
  "author": "user@example.com",
  "registry": "hublab.dev/capsules",

  // Classification (for AI discovery)
  "category": "ui-components",
  "tags": ["button", "primary", "cta", "interactive"],
  "aiDescription": "A primary call-to-action button component with click handling",

  // Platform Targets
  "platforms": {
    "web": {
      "engine": "react",
      "code": "./implementations/web.tsx"
    },
    "desktop": {
      "engine": "electron",
      "code": "./implementations/desktop.tsx"
    },
    "ios": {
      "engine": "react-native",
      "code": "./implementations/native.tsx"
    },
    "android": {
      "engine": "react-native",
      "code": "./implementations/native.tsx"
    },
    "ai-os": {
      "engine": "intent",
      "code": "./implementations/intent.json"
    }
  },

  // Type System
  "inputs": [
    {
      "name": "label",
      "type": "string",
      "required": true,
      "aiDescription": "The text displayed on the button"
    },
    {
      "name": "onClick",
      "type": "function",
      "signature": "() => void",
      "required": true,
      "aiDescription": "Function called when button is clicked"
    },
    {
      "name": "disabled",
      "type": "boolean",
      "default": false
    }
  ],

  "outputs": [
    {
      "name": "element",
      "type": "component",
      "aiDescription": "Rendered button component"
    }
  ],

  // Dependencies
  "dependencies": {
    "capsules": ["theme-provider", "icon-library"],
    "npm": {
      "react": "^18.0.0"
    }
  },

  // AI Compatibility
  "aiMetadata": {
    "usageExamples": [
      "Create a submit button",
      "Add a primary CTA button",
      "Show a disabled button"
    ],
    "semanticEmbedding": "vector-id-12345",
    "relatedCapsules": ["button-secondary", "icon-button", "link-button"]
  },

  // Verification
  "tests": "./tests/button.test.ts",
  "verified": true,
  "verifiedBy": "hublab-ai-validator",
  "usageCount": 1500000
}
```

---

## Platform Compilation

### How Capsules Compile to Different Platforms

#### 1. Web (React/Vue/Svelte)
```typescript
// web.tsx
export const ButtonPrimary = ({ label, onClick, disabled }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg"
    >
      {label}
    </button>
  )
}
```

#### 2. Desktop (Electron)
```typescript
// desktop.tsx - Same as web, but with desktop-specific optimizations
export const ButtonPrimary = ({ label, onClick, disabled }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg cursor-default"
    >
      {label}
    </button>
  )
}
```

#### 3. Mobile (React Native)
```typescript
// native.tsx
import { TouchableOpacity, Text } from 'react-native'

export const ButtonPrimary = ({ label, onClick, disabled }: Props) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled}
      style={{ paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#2563eb', borderRadius: 8 }}
    >
      <Text style={{ color: 'white', fontSize: 16 }}>{label}</Text>
    </TouchableOpacity>
  )
}
```

#### 4. AI OS (Intent-Based)
```json
// intent.json - For future AI operating systems
{
  "intent": "render-interactive-element",
  "semantics": {
    "element": "button",
    "priority": "primary",
    "action": "execute-callback",
    "accessibility": "focusable"
  },
  "properties": {
    "label": "{input.label}",
    "disabled": "{input.disabled}",
    "onActivate": "{input.onClick}"
  },
  "aiInstructions": "This is a primary action button. When activated, execute the onClick callback."
}
```

---

## Capsule Registry

### Registry Structure

```
hublab.dev/capsules/
├── ui-components/
│   ├── button-primary/
│   ├── button-secondary/
│   ├── input-text/
│   └── ... (millions more)
├── data/
│   ├── api-fetch/
│   ├── database-query/
│   └── ...
├── ai/
│   ├── chat-gpt/
│   ├── claude-sonnet/
│   └── ...
└── workflows/
    ├── auth-flow/
    ├── payment-flow/
    └── ...
```

### AI Search API

```typescript
// AI searches for capsules semantically
POST /api/capsules/search
{
  "query": "I need a button that submits a form",
  "platform": "web",
  "context": {
    "existingCapsules": ["form-container", "input-email"],
    "appType": "e-commerce-checkout"
  }
}

// Response
{
  "capsules": [
    {
      "id": "button-submit",
      "relevanceScore": 0.98,
      "reasoning": "This capsule is a form submission button, matches your need exactly"
    },
    {
      "id": "button-primary",
      "relevanceScore": 0.85,
      "reasoning": "Generic primary button, can be used for form submission"
    }
  ]
}
```

---

## User-Created Capsules

### Creation Flow

1. **User describes capsule** (natural language)
2. **AI generates capsule code** for all platforms
3. **AI generates tests** and validates compatibility
4. **Capsule published to registry** with AI metadata
5. **Other users/AIs discover** via semantic search

### Example: User creates new capsule

```typescript
// User prompt
"Create a capsule for a loading spinner that works on all platforms"

// AI generates:
{
  "id": "loading-spinner",
  "name": "Loading Spinner",
  "platforms": {
    "web": "// SVG-based spinner animation",
    "desktop": "// Same as web",
    "ios": "// Native ActivityIndicator",
    "android": "// Native ProgressBar",
    "ai-os": "{ intent: 'show-loading-state' }"
  },
  "aiDescription": "Animated loading indicator to show background processes"
}
```

---

## Cross-Platform App Generation

### AI Workflow

```typescript
// User: "Build me a todo app"

// 1. AI selects capsules
const app = {
  capsules: [
    "app-container",
    "navigation-bar",
    "input-text",
    "button-add",
    "list-view",
    "list-item",
    "checkbox",
    "database-local"
  ]
}

// 2. AI composes capsules
const composition = {
  root: "app-container",
  children: [
    {
      capsule: "navigation-bar",
      props: { title: "My Todos" }
    },
    {
      capsule: "input-text",
      props: { placeholder: "New todo..." }
    },
    {
      capsule: "button-add",
      connections: {
        onClick: "database-local.insert"
      }
    },
    {
      capsule: "list-view",
      dataSource: "database-local.getAll"
    }
  ]
}

// 3. Compiler generates code for target platform
const output = compile(composition, {
  platform: "web", // or "ios", "android", "desktop", "ai-os"
  optimize: true,
  bundle: true
})

// Result: Production-ready app in 2 seconds
```

---

## When AI Becomes OS

### Intent-Based Execution

Instead of rendering UI, apps become **intent declarations**:

```json
{
  "app": "todo-list",
  "intents": [
    {
      "id": "add-todo",
      "action": "create-item",
      "entity": "task",
      "userInput": ["text"],
      "semantics": "User wants to add a new task to their list"
    },
    {
      "id": "complete-todo",
      "action": "update-item",
      "entity": "task",
      "property": "completed",
      "value": true,
      "semantics": "User marks a task as finished"
    },
    {
      "id": "view-todos",
      "action": "query-items",
      "entity": "task",
      "filters": ["status", "date"],
      "semantics": "User wants to see their tasks"
    }
  ]
}
```

**AI OS understands intent** → executes directly → no UI needed (unless user wants it)

---

## Capsule Lifecycle

### 1. Creation
- User/AI creates capsule
- AI generates implementations for all platforms
- AI writes tests
- AI validates cross-platform compatibility

### 2. Publishing
- Published to HubLab registry
- AI generates semantic embeddings
- Indexed for search
- Versioned with semver

### 3. Discovery
- Other users search semantically
- AIs recommend capsules
- Usage analytics improve rankings

### 4. Composition
- AIs compose capsules into apps
- Type checking ensures compatibility
- Dependency resolution automatic

### 5. Evolution
- Community improvements
- AI suggests optimizations
- Backwards compatibility maintained
- Deprecated → new version migration

---

## Technical Architecture

### Capsule Compiler

```typescript
class CapsuleCompiler {
  // Compiles capsule composition to target platform
  compile(composition: CapsuleComposition, target: Platform): Bundle {
    // 1. Resolve dependencies
    const resolved = this.resolveDependencies(composition)

    // 2. Type check
    this.typeCheck(resolved)

    // 3. Generate platform-specific code
    const code = this.generateCode(resolved, target)

    // 4. Optimize
    const optimized = this.optimize(code, target)

    // 5. Bundle
    return this.bundle(optimized, target)
  }
}
```

### Runtime Engines

#### Web Runtime
```typescript
// Renders capsules as React components
import { CapsuleRenderer } from 'capsulas-runtime-web'

const app = new CapsuleRenderer({
  composition: appComposition,
  theme: 'default'
})

app.mount('#root')
```

#### Native Runtime (iOS/Android)
```typescript
// Renders capsules as native components
import { CapsuleRenderer } from 'capsulas-runtime-native'

const App = () => {
  return <CapsuleRenderer composition={appComposition} />
}
```

#### AI OS Runtime
```typescript
// Executes intents directly
import { IntentExecutor } from 'capsulas-runtime-ai-os'

const executor = new IntentExecutor({
  intents: appIntents,
  aiModel: 'claude-sonnet-4.5'
})

executor.execute('add-todo', { text: 'Buy milk' })
```

---

## Ecosystem Growth

### Millions of Capsules

1. **Core Library** (1,000 capsules)
   - Built by HubLab team
   - Cover common use cases
   - Verified and optimized

2. **Community Capsules** (100,000+ capsules)
   - Created by developers
   - Peer reviewed
   - AI-validated

3. **AI-Generated Capsules** (Millions)
   - Generated on-demand
   - Personalized to use cases
   - Self-improving

### Network Effects

More capsules → Better AI apps → More users → More capsules → ∞

---

## Future: AI as OS

### Seamless Transition

When AI becomes the operating system:

1. **Apps are already AI-native** - written in intent language
2. **No rewrite needed** - capsules already speak AI
3. **Instant migration** - existing apps work day 1
4. **Better than native** - AI understands semantics, optimizes execution

### Example

```
Today (Traditional OS):
User clicks button → JS event → Update DOM → Render pixels

Future (AI OS):
User's intent detected → AI executes directly → Result shown how user prefers
```

No buttons, no UI, no code execution - just **pure intent**.

But if user wants traditional UI, AI OS uses capsule's UI implementation.

**Best of both worlds.**

---

## Getting Started

### For Developers

```bash
# Install capsulas CLI
npm install -g @capsulas/cli

# Create new capsule
capsulas create button-awesome

# Test on all platforms
capsulas test --all-platforms

# Publish to registry
capsulas publish
```

### For AI

```typescript
// Search capsules
const capsules = await registry.search({
  query: "authentication flow with Google OAuth",
  platforms: ["web", "mobile"]
})

// Generate app
const app = await composer.generate({
  description: "E-commerce checkout with Stripe",
  capsules: capsules,
  platform: "web"
})

// Deploy
await app.deploy()
```

---

## Conclusion

**Capsulas Framework** is not just a tool - it's the **foundation for the AI-native future**.

Today: Build apps 100x faster
Tomorrow: Apps that speak AI natively
Future: When AI becomes OS, we're already there.

Let's build it. 🚀
