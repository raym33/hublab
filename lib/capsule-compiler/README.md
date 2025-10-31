# Universal Capsule Compiler

A revolutionary system for building cross-platform applications using AI-powered, platform-agnostic components called "capsules".

## 🎯 Vision

Capsules are **meta-components**: platform-agnostic, reusable, AI-compatible building blocks that compile to native code for any platform (web, desktop, mobile, IoT, future AI OS).

## 🚀 Quick Start

```typescript
import { UniversalCapsuleCompiler, UniversalCapsuleRegistry, ClaudeAppGenerator } from '@/lib/capsule-compiler'

// 1. Initialize registry
const registry = new UniversalCapsuleRegistry({ aiModel: 'claude-sonnet-4.5' })

// 2. Generate app from natural language
const generator = new ClaudeAppGenerator(registry)
const composition = await generator.generate({
  description: "Build me a todo app with local storage",
  platform: "web"
})

// 3. Compile to target platform
const compiler = new UniversalCapsuleCompiler(registry)
const result = await compiler.compile(composition)

// 4. Get production-ready code
console.log(result.output.code)
```

## 📦 Available Capsules (40)

### Layout & Structure
- **app-container** - Root app container with header
- **card** - Card container with shadow
- **modal** - Modal dialog overlay

### Forms & Input
- **input-text** - Text input field
- **search-input** - Search with debounce and clear button
- **checkbox** - Boolean checkbox input
- **toggle-switch** - Toggle for boolean settings
- **radio-group** - Radio button group selection
- **slider** - Range slider for numeric values
- **form-validated** - Complete form with validation
- **dropdown-select** - Dropdown with search and multi-select
- **date-picker** - Calendar-based date selector
- **file-upload** - Drag-and-drop file uploader

### Buttons & Actions
- **button-primary** - Primary action button
- **icon-button** - Icon-only buttons with tooltips

### Navigation
- **tabs** - Tabbed navigation for content organization
- **breadcrumb** - Breadcrumb navigation showing page location
- **pagination** - Page navigation with first/last controls
- **stepper** - Multi-step wizard navigation
- **context-menu** - Right-click and dropdown menus

### Data Display
- **list-view** - List renderer with custom items
- **data-table** - Sortable table with columns
- **text-display** - Text with different styles
- **code-block** - Code display with copy button
- **badge** - Labels, tags, and status indicators
- **avatar** - User profile pictures with status
- **accordion** - Collapsible sections for FAQs
- **rating** - Star rating component
- **divider** - Content section separator
- **empty-state** - No data placeholder
- **chip** - Tags and filter chips with delete
- **image** - Images with lazy loading and fallback

### Feedback & Indicators
- **loading-spinner** - Animated loading indicator
- **skeleton** - Loading placeholder animation
- **progress-bar** - Progress indicator with percentage
- **alert** - Important messages and notifications
- **tooltip** - Helpful hints on hover
- **toast** - Toast notifications with auto-dismiss

### Data & Logic
- **database-local** - Local storage (IndexedDB/AsyncStorage)
- **http-fetch** - HTTP request handler

## 🎨 Features

### 1. Natural Language → App
```typescript
"Build me a todo app" → Full React app in 2 seconds
```

### 2. Multi-Platform Support
```typescript
platform: 'web' | 'desktop' | 'ios' | 'android' | 'ai-os'
```

### 3. AI-Powered Search
```typescript
registry.search({
  query: "button that submits form",
  semanticSearch: true
})
```

### 4. Type-Safe
All connections are type-checked at compile time.

### 5. Optimized Output
- Tree shaking
- Code splitting
- Minification
- Lazy loading

## 📝 Creating Custom Capsules

```typescript
const myCustomCapsule: UniversalCapsule = {
  id: 'my-button',
  name: 'My Custom Button',
  version: '1.0.0',
  author: 'you@example.com',
  registry: 'your-registry.com',
  category: 'ui-components',
  type: 'ui-component',
  tags: ['button', 'custom'],
  aiDescription: 'A custom button with special styling',

  platforms: {
    web: {
      engine: 'react',
      code: `export const MyButton = ({ label, onClick }) => {
        return <button onClick={onClick}>{label}</button>
      }`
    }
  },

  inputs: [
    {
      name: 'label',
      type: 'string',
      required: true,
      aiDescription: 'Button text'
    },
    {
      name: 'onClick',
      type: 'function',
      required: true,
      aiDescription: 'Click handler'
    }
  ],

  outputs: [
    {
      name: 'element',
      type: 'component',
      aiDescription: 'Rendered button'
    }
  ],

  dependencies: {},

  aiMetadata: {
    usageExamples: ['Add a custom button', 'Create special action'],
    relatedCapsules: ['button-primary'],
    complexity: 'simple'
  },

  verified: true,
  usageCount: 0
}

await registry.publish(myCustomCapsule)
```

## 🏗️ Architecture

### Compiler Pipeline
```
Natural Language → AI Analysis → Capsule Selection → Composition → Type Check → Code Generation → Optimization → Bundle
```

### Platform Compilers
- **WebCompiler**: Generates React + Vite
- **DesktopCompiler**: Generates Electron + React
- **iOSCompiler**: Generates React Native (iOS)
- **AndroidCompiler**: Generates React Native (Android)
- **AIIntentCompiler**: Generates intent definitions for AI OS

## 🎯 Use Cases

### 1. Rapid Prototyping
Generate full apps in seconds from natural language.

### 2. Cross-Platform Development
Write once, deploy to all platforms.

### 3. AI-Native Apps
Build apps that speak AI's native language.

### 4. Component Libraries
Share and discover reusable components.

## 🔮 Future: AI as OS

When AI becomes the operating system:
- Apps are already AI-native (written in intent language)
- No rewrite needed
- Instant migration
- Better than native

## 📊 Stats

- **Compilation Speed**: < 2 seconds
- **Capsule Library**: 40 (growing)
- **Platforms Supported**: 5
- **Type Safety**: 100%
- **Bundle Size**: Optimized (< 50KB typical)

## 🛠️ API Reference

### UniversalCapsuleCompiler

```typescript
class UniversalCapsuleCompiler {
  compile(composition: CapsuleComposition): Promise<CompilationResult>
}
```

### UniversalCapsuleRegistry

```typescript
class UniversalCapsuleRegistry {
  search(query: CapsuleSearchQuery): Promise<CapsuleSearchResult[]>
  get(id: string, version?: string): Promise<UniversalCapsule>
  publish(capsule: UniversalCapsule): Promise<PublishResult>
}
```

### ClaudeAppGenerator

```typescript
class ClaudeAppGenerator {
  generate(prompt: AIGenerationPrompt): Promise<CapsuleComposition>
  optimize(composition: CapsuleComposition): Promise<CapsuleComposition>
  explain(composition: CapsuleComposition): Promise<string>
}
```

## 🧪 Testing

```bash
# Run compiler tests
npm test lib/capsule-compiler

# Test specific capsule
npm test lib/capsule-compiler/example-capsules
```

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](../../CONTRIBUTING.md)

## 📚 Learn More

- [Full Specification](./UNIVERSAL_CAPSULE_SPEC.md)
- [Example Capsules](./example-capsules.ts)
- [Type Definitions](./types.ts)
- [Live Demo](http://localhost:3001/compiler/demo)

---

Built with ❤️ for the future of app development
