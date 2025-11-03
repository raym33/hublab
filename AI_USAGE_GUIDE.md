# HubLab AI Usage Guide

## Overview

HubLab is an AI-friendly component library with **240 production-ready React components** (capsules) optimized for AI consumption and code generation.

## Quick Stats

- **240 total capsules** across 19 categories
- **100% AI-friendly** (descriptive metadata, rich tags, proper React structure)
- **284 unique tags** for semantic search
- **6.5 tags per capsule** average
- All capsules include 'use client' and 'export default'

## For AI Assistants: How to Use HubLab

### 1. Understanding the Structure

```typescript
// Main registry - Import all capsules
import { allCapsules, searchCapsules, getCapsulesByCategory } from '@/lib/all-capsules'

// Each capsule has this structure:
interface Capsule {
  id: string              // Unique identifier
  name: string            // Human-readable name
  description: string     // Detailed description (>30 chars)
  category: string        // Category (UI, Form, Layout, etc.)
  code: string           // Ready-to-use React component code
  tags: string[]         // 3+ semantic tags for search
  popularity?: number    // Optional popularity metric
  dependencies?: string[] // Optional npm dependencies
}
```

### 2. Searching for Components

**By keyword (searches name, description, tags):**
```typescript
import { searchCapsules } from '@/lib/all-capsules'

// Find button components
const buttons = searchCapsules('button')

// Find form inputs
const inputs = searchCapsules('input')

// Find animated components
const animated = searchCapsules('animated')
```

**By category:**
```typescript
import { getCapsulesByCategory } from '@/lib/all-capsules'

const uiComponents = getCapsulesByCategory('UI')        // 77 capsules
const forms = getCapsulesByCategory('Form')             // 11 capsules
const layouts = getCapsulesByCategory('Layout')         // 22 capsules
const animations = getCapsulesByCategory('Animation')   // 10 capsules
```

**By tags (multi-tag filtering):**
```typescript
// Filter by multiple tags with AND logic
const results = allCapsules.filter(capsule =>
  ['button', 'animated'].every(tag =>
    capsule.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  )
)
```

### 3. Using a Capsule in Code

Every capsule is ready to copy-paste:

```typescript
// 1. Get the capsule
const capsule = searchCapsules('toast notification')[0]

// 2. Use the code directly
const componentCode = capsule.code
// This code includes:
// - 'use client' directive
// - All necessary imports
// - export default Component
// - TypeScript types
// - Tailwind CSS styling

// 3. Install dependencies if needed
if (capsule.dependencies) {
  console.log(`Install: npm install ${capsule.dependencies.join(' ')}`)
}
```

### 4. Category Breakdown

```
UI: 77 capsules         → Buttons, cards, badges, avatars, tooltips
feature: 27 capsules    → Complex features (currently needs normalization)
Layout: 22 capsules     → Grid, flex, containers, masonry
Form: 11 capsules       → Inputs, validation, multi-step forms
Animation: 10 capsules  → Motion, transitions, effects
Navigation: 10 capsules → Menus, breadcrumbs, tabs, pagination
Feedback: 8 capsules    → Toasts, alerts, progress bars
Content: 8 capsules     → Text, markdown, code blocks
Card: 8 capsules        → Card layouts and variations
Input: 8 capsules       → Form inputs and controls
Chart: 8 capsules       → Data visualization
List: 8 capsules        → Lists, tables, data grids
Data: 7 capsules        → Data handling components
Social: 6 capsules      → Social media integrations
E-commerce: 6 capsules  → Shopping cart, product cards
Modal: 6 capsules       → Dialogs, overlays, popups
DataViz: 4 capsules     → Advanced visualizations
Utility: 4 capsules     → Helpers and utilities
logic: 2 capsules       → Logic components (needs normalization)
```

## AI Prompt Templates

### Template 1: Find and Use a Component

```
I need a [COMPONENT_TYPE] with [FEATURES]. Search HubLab capsules:

1. Search for relevant capsules using searchCapsules('[KEYWORD]')
2. Filter by tags if needed: ['tag1', 'tag2']
3. Show me the top 3 matches with their descriptions
4. Use the most appropriate capsule code
```

**Example:**
```
I need an animated button with hover effects. Search HubLab capsules:

1. searchCapsules('button animated')
2. Filter by tags: ['button', 'animated', 'interactive']
3. Show top 3 matches
4. Use the best match
```

### Template 2: Build a Feature from Multiple Capsules

```
I'm building a [FEATURE]. Find relevant HubLab capsules:

1. List components needed: [COMPONENTS]
2. Search for each component
3. Check compatibility (same styling system, React version)
4. Combine the capsule codes
5. Create integration code
```

**Example:**
```
I'm building a user profile page. Find relevant HubLab capsules:

1. Components needed: avatar, card, form, button
2. Search: searchCapsules('avatar'), searchCapsules('card'), etc.
3. All use Tailwind CSS and React 18
4. Combine codes
5. Create ProfilePage component
```

### Template 3: Customize a Capsule

```
Customize this HubLab capsule:

1. Get base capsule: searchCapsules('[KEYWORD]')[0]
2. Modifications needed: [LIST]
3. Apply changes to the code
4. Maintain React best practices
5. Keep Tailwind CSS structure
```

## API Endpoints for AI Access

### REST API (if you implement it)

```typescript
// GET /api/capsules - Get all capsules
// Response: { capsules: Capsule[], total: number }

// GET /api/capsules/search?q=button - Search capsules
// Response: { results: Capsule[], count: number }

// GET /api/capsules/category/:category - Get by category
// Response: { capsules: Capsule[], category: string }

// GET /api/capsules/:id - Get specific capsule
// Response: { capsule: Capsule }

// GET /api/capsules/tags - Get all tags
// Response: { tags: string[], count: number }
```

### GraphQL Schema (if you implement it)

```graphql
type Capsule {
  id: ID!
  name: String!
  description: String!
  category: String!
  code: String!
  tags: [String!]!
  popularity: Int
  dependencies: [String!]
}

type Query {
  capsules: [Capsule!]!
  capsule(id: ID!): Capsule
  searchCapsules(query: String!): [Capsule!]!
  capsulesByCategory(category: String!): [Capsule!]!
  capsulesByTags(tags: [String!]!): [Capsule!]!
  categories: [String!]!
  tags: [String!]!
}
```

## Best Practices for AI Code Generation

### ✅ DO:

1. **Search first**: Always search existing capsules before generating from scratch
2. **Use semantic tags**: Search by functionality, not just names
3. **Check dependencies**: Note required npm packages
4. **Maintain structure**: Keep 'use client', exports, TypeScript types
5. **Combine capsules**: Mix and match for complex features
6. **Preserve styling**: Keep Tailwind CSS classes consistent

### ❌ DON'T:

1. Don't modify capsule IDs
2. Don't remove 'use client' directives
3. Don't mix styling systems (stay with Tailwind)
4. Don't skip TypeScript types
5. Don't ignore dependencies

## Advanced AI Workflows

### Workflow 1: Smart Component Selection

```typescript
// AI decision tree for component selection
function selectBestCapsule(requirements: string[]): Capsule {
  // 1. Search by primary requirement
  let candidates = searchCapsules(requirements[0])

  // 2. Filter by additional requirements (tags)
  candidates = candidates.filter(capsule =>
    requirements.slice(1).every(req =>
      capsule.tags.some(tag => tag.toLowerCase().includes(req.toLowerCase()))
    )
  )

  // 3. Rank by tag coverage
  candidates.sort((a, b) => {
    const aScore = a.tags.filter(tag =>
      requirements.some(req => tag.toLowerCase().includes(req.toLowerCase()))
    ).length
    const bScore = b.tags.filter(tag =>
      requirements.some(req => tag.toLowerCase().includes(req.toLowerCase()))
    ).length
    return bScore - aScore
  })

  return candidates[0]
}
```

### Workflow 2: Automated Feature Scaffolding

```typescript
// AI generates a complete feature from capsules
async function scaffoldFeature(
  featureName: string,
  components: string[]
): Promise<string> {
  const capsules = components.map(comp => searchCapsules(comp)[0])

  // Generate feature code
  const imports = capsules.map(c =>
    `// From ${c.name}\n${extractImports(c.code)}`
  ).join('\n')

  const componentCode = capsules.map(c => c.code).join('\n\n')

  return `
'use client'

${imports}

export default function ${featureName}() {
  return (
    <div className="feature-container">
      ${capsules.map(c => `<${c.name} />`).join('\n      ')}
    </div>
  )
}
  `.trim()
}
```

### Workflow 3: Intelligent Code Modification

```typescript
// AI modifies capsule while preserving structure
function modifyCapsule(
  capsule: Capsule,
  modifications: {
    props?: Record<string, any>
    styling?: string
    behavior?: string
  }
): string {
  let code = capsule.code

  // Preserve 'use client'
  const hasUseClient = code.includes("'use client'")

  // Apply modifications
  if (modifications.props) {
    code = addProps(code, modifications.props)
  }

  if (modifications.styling) {
    code = updateStyling(code, modifications.styling)
  }

  if (modifications.behavior) {
    code = addBehavior(code, modifications.behavior)
  }

  // Ensure 'use client' is still first line
  if (hasUseClient && !code.startsWith("'use client'")) {
    code = `'use client'\n\n${code.replace("'use client'", '').trim()}`
  }

  return code
}
```

## Semantic Understanding Guide

### Common Intent → HubLab Search

| User Intent | Search Query | Expected Category |
|------------|--------------|-------------------|
| "I need a button" | `searchCapsules('button')` | UI, Form |
| "Show loading state" | `searchCapsules('loading')` | Feedback |
| "Animated card" | `searchCapsules('card animated')` | Card, Animation |
| "User input field" | `searchCapsules('input')` | Form, Input |
| "Data table" | `searchCapsules('table')` | List, Data |
| "Modal popup" | `searchCapsules('modal')` | Modal |
| "Chart visualization" | `searchCapsules('chart')` | Chart, DataViz |
| "Navigation menu" | `searchCapsules('menu')` | Navigation |
| "Image gallery" | `searchCapsules('gallery')` | Layout |
| "Progress indicator" | `searchCapsules('progress')` | Feedback |

## Performance Considerations

- **Search speed**: Average 0.04ms per search (tested with 100 iterations)
- **Memory footprint**: 0.51MB for all 240 capsules
- **Filter speed**: Average 0.00ms per category filter
- **Optimal for**: Real-time AI code generation, interactive chat interfaces

## Quality Metrics

- ✅ 100% have descriptive descriptions (>30 chars)
- ✅ 100% well-tagged (3+ semantic tags)
- ✅ 100% have 'use client' directive
- ✅ 100% have export default
- ✅ 93.3% overall AI-friendliness score

## Integration Examples

### Example 1: Claude Code Integration

```typescript
// Claude searches and uses HubLab
async function claudeGenerateComponent(userRequest: string) {
  // 1. Understand intent
  const keywords = extractKeywords(userRequest)

  // 2. Search HubLab
  const capsules = searchCapsules(keywords.join(' '))

  // 3. Select best match
  const best = capsules[0]

  // 4. Generate response
  return `I found a perfect match in HubLab: ${best.name}

Description: ${best.description}
Category: ${best.category}
Tags: ${best.tags.join(', ')}

Here's the code:

\`\`\`tsx
${best.code}
\`\`\`

${best.dependencies ? `Dependencies: npm install ${best.dependencies.join(' ')}` : ''}
  `
}
```

### Example 2: GitHub Copilot Integration

```typescript
// Copilot uses HubLab as context
// In your IDE, Copilot can suggest:

// Type: "// Create animated button"
// Copilot suggests:
import { searchCapsules } from '@/lib/all-capsules'
const animatedButton = searchCapsules('button animated')[0]
// Use: animatedButton.code
```

### Example 3: ChatGPT Plugin

```typescript
// ChatGPT plugin that queries HubLab
export async function searchHubLab(query: string): Promise<string> {
  const results = searchCapsules(query)

  return JSON.stringify({
    count: results.length,
    capsules: results.slice(0, 5).map(c => ({
      name: c.name,
      description: c.description,
      category: c.category,
      tags: c.tags,
      hasCode: true
    }))
  })
}
```

## Testing AI Integration

Run these tests to verify AI-friendly features:

```bash
# Operational test - Verify all capsules work
npx tsx scripts/operational-test.ts

# Deep system test - Comprehensive quality check
npx tsx scripts/deep-system-test.ts

# Verify enhancements - Check AI-friendliness score
npx tsx scripts/verify-enhancements.ts
```

## Future AI Enhancements

Planned features to make HubLab even more AI-friendly:

1. **Semantic embeddings**: Vector search for natural language queries
2. **Usage examples**: Real-world implementation examples for each capsule
3. **Compatibility matrix**: Auto-detect compatible capsule combinations
4. **AI annotations**: Machine-readable metadata for better understanding
5. **Code explanation**: Natural language explanations of how each capsule works
6. **Automatic updates**: AI-generated improvements based on usage patterns

## Support

For AI developers integrating HubLab:
- Test suite: `/scripts/operational-test.ts`
- Documentation: This file
- Type definitions: `/types/capsule.ts`
- Main registry: `/lib/all-capsules.ts`

---

**Last Updated**: 2025-11-03
**Version**: 1.0.0
**Total Capsules**: 240
**AI-Friendliness Score**: 100%
