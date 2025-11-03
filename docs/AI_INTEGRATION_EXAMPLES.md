# AI Integration Examples for HubLab

Complete examples showing how AI assistants can integrate with and use HubLab effectively.

## Table of Contents

1. [Claude Code Integration](#claude-code-integration)
2. [ChatGPT Integration](#chatgpt-integration)
3. [GitHub Copilot Integration](#github-copilot-integration)
4. [Custom AI Assistant Integration](#custom-ai-assistant-integration)
5. [API Usage Examples](#api-usage-examples)

---

## Claude Code Integration

### Example 1: Component Search and Generation

**User Request**: "I need an animated button with a gradient background"

**Claude's Workflow**:

```typescript
// Step 1: Search HubLab capsules
import { searchCapsules } from '@/lib/all-capsules'

const results = searchCapsules('button animated')
console.log(`Found ${results.length} matching capsules`)

// Step 2: Filter by tags
const bestMatch = results.find(capsule =>
  capsule.tags.some(tag => tag.toLowerCase().includes('gradient')) ||
  capsule.description.toLowerCase().includes('gradient')
)

// Step 3: If no exact match, customize existing capsule
if (!bestMatch) {
  const animatedButton = results[0]

  // Claude analyzes the code and adds gradient styling
  const customCode = animatedButton.code.replace(
    'bg-blue-500',
    'bg-gradient-to-r from-purple-500 to-pink-500'
  )

  console.log('Customized code:', customCode)
}
```

**Claude's Response**:
```
I found a perfect animated button in HubLab! I've customized it with a gradient background:

[Shows the modified code with gradient]

To use it:
1. Copy this code to your component file
2. It uses Tailwind CSS (already configured)
3. No additional dependencies needed
```

### Example 2: Building a Complete Feature

**User Request**: "Create a user profile card with avatar, name, bio, and edit button"

**Claude's Workflow**:

```typescript
// Step 1: Search for required components
const avatar = searchCapsules('avatar')[0]
const card = searchCapsules('card')[0]
const button = searchCapsules('button')[0]

// Step 2: Combine capsules into feature
const profileCardCode = `
'use client'

import { useState } from 'react'

// Avatar component from HubLab
${avatar.code}

// Card layout from HubLab
${card.code}

// Button from HubLab
${button.code}

export default function UserProfileCard({
  name,
  bio,
  avatarUrl
}: {
  name: string
  bio: string
  avatarUrl: string
}) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Card>
      <div className="flex items-center gap-4 p-6">
        <Avatar src={avatarUrl} alt={name} size="lg" />
        <div className="flex-1">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-gray-600">{bio}</p>
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          variant="secondary"
        >
          Edit Profile
        </Button>
      </div>
    </Card>
  )
}
`

console.log('Generated UserProfileCard component')
```

---

## ChatGPT Integration

### Example 3: API-Based Search

**ChatGPT Plugin Code**:

```typescript
// chatgpt-plugin.ts
export async function searchHubLabCapsules(query: string) {
  const response = await fetch(
    `https://hublab.dev/api/ai/capsules?q=${encodeURIComponent(query)}&format=compact`
  )

  const data = await response.json()

  return {
    results: data.data.capsules.map((c: any) => ({
      name: c.name,
      description: c.description,
      category: c.category,
      tags: c.tags
    })),
    total: data.data.metadata.total
  }
}

// Usage in ChatGPT
const results = await searchHubLabCapsules('form validation')
```

**ChatGPT Response**:
```
I found 8 form validation components in HubLab:

1. **Multi-step Form** (Form category)
   - Complex form with validation and progress
   - Tags: form, validation, multi-step, wizard

2. **Input with Validation** (Input category)
   - Real-time validation for text inputs
   - Tags: input, validation, form, error

[Lists all results with descriptions]

Would you like me to get the full code for any of these?
```

### Example 4: Getting Full Component Code

```typescript
// Get specific capsule code
export async function getHubLabCapsule(id: string) {
  const response = await fetch(`https://hublab.dev/api/ai/capsules/${id}`)
  const data = await response.json()

  return {
    name: data.data.capsule.name,
    code: data.data.capsule.code,
    dependencies: data.data.capsule.dependencies || [],
    description: data.data.capsule.description
  }
}

// Usage
const capsule = await getHubLabCapsule('multi-step-form')
console.log(capsule.code)
```

---

## GitHub Copilot Integration

### Example 5: Inline Suggestions

**In your IDE**:

```typescript
// Type this comment:
// Create a toast notification component from HubLab

// Copilot suggests:
import { searchCapsules } from '@/lib/all-capsules'

const toastCapsule = searchCapsules('toast notification')[0]

export default function Toast({ message }: { message: string }) {
  // Copilot pastes the HubLab toast component code here
  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg">
      {message}
    </div>
  )
}
```

### Example 6: Component Library Completion

```typescript
// Type: const button =
// Copilot suggests:
const button = searchCapsules('button')[0]

// Type: const animated
// Copilot suggests:
const animatedComponents = searchCapsules('animated')
```

---

## Custom AI Assistant Integration

### Example 7: Building an AI Component Generator

```typescript
// ai-component-generator.ts
import { searchCapsules, allCapsules } from '@/lib/all-capsules'

export class AIComponentGenerator {
  /**
   * Generate a component based on natural language description
   */
  async generateComponent(description: string): Promise<string> {
    // 1. Extract keywords from description
    const keywords = this.extractKeywords(description)

    // 2. Search HubLab for matching capsules
    const matches = searchCapsules(keywords.join(' '))

    if (matches.length === 0) {
      return this.generateFromScratch(description)
    }

    // 3. Rank matches by relevance
    const ranked = this.rankByRelevance(matches, keywords)

    // 4. Use best match or combine multiple
    if (this.needsCombination(description, keywords)) {
      return this.combineMultipleCapsules(ranked, description)
    }

    return this.customizeCapsule(ranked[0], description)
  }

  private extractKeywords(description: string): string[] {
    // NLP processing to extract relevant keywords
    const words = description.toLowerCase().split(' ')
    const keywords: string[] = []

    // Component types
    const types = ['button', 'input', 'card', 'form', 'modal', 'table', 'chart']
    keywords.push(...words.filter(w => types.includes(w)))

    // Modifiers
    const modifiers = ['animated', 'interactive', 'responsive', 'gradient']
    keywords.push(...words.filter(w => modifiers.includes(w)))

    return keywords
  }

  private rankByRelevance(capsules: any[], keywords: string[]): any[] {
    return capsules.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, keywords)
      const bScore = this.calculateRelevanceScore(b, keywords)
      return bScore - aScore
    })
  }

  private calculateRelevanceScore(capsule: any, keywords: string[]): number {
    let score = 0

    keywords.forEach(keyword => {
      // Name match (highest weight)
      if (capsule.name.toLowerCase().includes(keyword)) score += 5

      // Tag match (medium weight)
      if (capsule.tags.some((t: string) => t.toLowerCase().includes(keyword))) {
        score += 3
      }

      // Description match (low weight)
      if (capsule.description.toLowerCase().includes(keyword)) score += 1
    })

    return score
  }

  private customizeCapsule(capsule: any, description: string): string {
    let code = capsule.code

    // Apply customizations based on description
    if (description.includes('gradient')) {
      code = this.addGradient(code)
    }

    if (description.includes('large') || description.includes('big')) {
      code = this.increaseSize(code)
    }

    return code
  }

  private combineMultipleCapsules(capsules: any[], description: string): string {
    // Combine multiple capsules into one component
    const imports = capsules.map(c => this.extractImports(c.code)).join('\n')
    const components = capsules.map(c => c.name).join(', ')

    return `
'use client'

${imports}

export default function GeneratedComponent() {
  return (
    <div className="generated-component">
      ${capsules.map(c => `<${c.name} />`).join('\n      ')}
    </div>
  )
}
    `.trim()
  }

  private extractImports(code: string): string {
    const lines = code.split('\n')
    return lines
      .filter(line => line.trim().startsWith('import'))
      .join('\n')
  }

  private addGradient(code: string): string {
    return code.replace(
      /bg-\w+-\d+/g,
      'bg-gradient-to-r from-purple-500 to-pink-500'
    )
  }

  private increaseSize(code: string): string {
    return code
      .replace(/text-sm/g, 'text-lg')
      .replace(/text-base/g, 'text-xl')
      .replace(/px-\d+/g, 'px-6')
      .replace(/py-\d+/g, 'py-4')
  }

  private needsCombination(description: string, keywords: string[]): boolean {
    // Check if description requires multiple components
    const multiComponentIndicators = ['with', 'and', 'including', 'containing']
    return multiComponentIndicators.some(indicator =>
      description.toLowerCase().includes(indicator)
    )
  }

  private generateFromScratch(description: string): string {
    // Fallback: generate basic component structure
    return `
'use client'

export default function GeneratedComponent() {
  return (
    <div>
      {/* Generated component based on: ${description} */}
      {/* No matching HubLab capsules found */}
    </div>
  )
}
    `.trim()
  }
}

// Usage
const generator = new AIComponentGenerator()
const code = await generator.generateComponent(
  'Create an animated button with gradient background and icon'
)
console.log(code)
```

---

## API Usage Examples

### Example 8: Search with Filters

```bash
# Search for animated buttons
curl "https://hublab.dev/api/ai/capsules?q=button&tags=animated"

# Response:
{
  "success": true,
  "data": {
    "capsules": [...],
    "metadata": {
      "total": 5,
      "returned": 5
    }
  }
}
```

### Example 9: Get Metadata

```bash
# Get library metadata
curl "https://hublab.dev/api/ai/metadata"

# Response:
{
  "success": true,
  "data": {
    "library": {
      "name": "HubLab",
      "totalCapsules": 240,
      "aiScore": 100
    },
    "statistics": {
      "categories": 19,
      "totalTags": 284
    },
    "categories": [
      {"name": "UI", "count": 77},
      ...
    ]
  }
}
```

### Example 10: Category Filtering

```typescript
// Get all UI components
async function getUIComponents() {
  const response = await fetch(
    'https://hublab.dev/api/ai/capsules?category=UI&format=compact'
  )
  const data = await response.json()

  return data.data.capsules
}

// Usage
const uiComponents = await getUIComponents()
console.log(`Found ${uiComponents.length} UI components`)
```

### Example 11: Pagination

```typescript
// Get paginated results
async function getPaginatedCapsules(page: number = 0, pageSize: number = 20) {
  const offset = page * pageSize

  const response = await fetch(
    `https://hublab.dev/api/ai/capsules?limit=${pageSize}&offset=${offset}`
  )
  const data = await response.json()

  return {
    capsules: data.data.capsules,
    hasMore: data.data.metadata.hasMore,
    total: data.data.metadata.total
  }
}

// Usage - Get first 3 pages
for (let page = 0; page < 3; page++) {
  const result = await getPaginatedCapsules(page, 20)
  console.log(`Page ${page + 1}: ${result.capsules.length} capsules`)
}
```

---

## Advanced Integration Patterns

### Pattern 1: Intelligent Component Selection

```typescript
import { searchCapsules } from '@/lib/all-capsules'

function selectBestComponent(
  userIntent: string,
  requirements: string[]
): any {
  // Search by primary intent
  let candidates = searchCapsules(userIntent)

  // Filter by requirements (tags)
  candidates = candidates.filter(capsule =>
    requirements.every(req =>
      capsule.tags.some(tag =>
        tag.toLowerCase().includes(req.toLowerCase())
      )
    )
  )

  // Rank by tag coverage
  candidates.sort((a, b) => {
    const aMatches = a.tags.filter(tag =>
      requirements.some(req => tag.toLowerCase().includes(req.toLowerCase()))
    ).length

    const bMatches = b.tags.filter(tag =>
      requirements.some(req => tag.toLowerCase().includes(req.toLowerCase()))
    ).length

    return bMatches - aMatches
  })

  return candidates[0]
}

// Usage
const bestButton = selectBestComponent('button', ['animated', 'gradient'])
```

### Pattern 2: Contextual Code Modification

```typescript
function modifyForContext(
  capsule: any,
  context: {
    theme?: 'light' | 'dark'
    size?: 'sm' | 'md' | 'lg'
    variant?: string
  }
): string {
  let code = capsule.code

  // Apply theme
  if (context.theme === 'dark') {
    code = code
      .replace(/bg-white/g, 'bg-gray-900')
      .replace(/text-gray-900/g, 'text-white')
      .replace(/border-gray-200/g, 'border-gray-700')
  }

  // Apply size
  if (context.size === 'lg') {
    code = code
      .replace(/text-sm/g, 'text-lg')
      .replace(/px-3/g, 'px-6')
      .replace(/py-2/g, 'py-4')
  }

  return code
}

// Usage
const darkLargeButton = modifyForContext(buttonCapsule, {
  theme: 'dark',
  size: 'lg'
})
```

### Pattern 3: Multi-Capsule Features

```typescript
function buildFeatureFromCapsules(
  featureName: string,
  componentList: string[]
): string {
  const capsules = componentList.map(name => searchCapsules(name)[0])

  const imports = capsules
    .map(c => extractImports(c.code))
    .filter((imp, idx, arr) => arr.indexOf(imp) === idx) // unique
    .join('\n')

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

// Usage
const profilePage = buildFeatureFromCapsules('ProfilePage', [
  'avatar',
  'card',
  'button',
  'form'
])
```

---

## Testing AI Integration

### Test Script

```typescript
// test-ai-integration.ts
import { searchCapsules, getCapsulesByCategory } from '@/lib/all-capsules'

async function testAIIntegration() {
  console.log('Testing AI Integration with HubLab\n')

  // Test 1: Search functionality
  console.log('Test 1: Search for "button"')
  const buttons = searchCapsules('button')
  console.log(`✓ Found ${buttons.length} buttons\n`)

  // Test 2: Category filtering
  console.log('Test 2: Get UI components')
  const uiComponents = getCapsulesByCategory('UI')
  console.log(`✓ Found ${uiComponents.length} UI components\n`)

  // Test 3: Tag filtering
  console.log('Test 3: Multi-tag filtering')
  const animated = searchCapsules('animated button')
  console.log(`✓ Found ${animated.length} animated buttons\n`)

  // Test 4: API endpoint
  console.log('Test 4: API endpoint')
  const response = await fetch('http://localhost:3000/api/ai/metadata')
  const data = await response.json()
  console.log(`✓ API returned ${data.data.library.totalCapsules} capsules\n`)

  console.log('All tests passed!')
}

testAIIntegration()
```

---

## Best Practices

1. **Always search first** - Check HubLab before generating from scratch
2. **Use semantic tags** - Tags are the most reliable way to find components
3. **Combine when needed** - Multiple simple capsules often work better than one complex component
4. **Preserve structure** - Keep 'use client', exports, and TypeScript types
5. **Check dependencies** - Note any npm packages that need to be installed
6. **Test the code** - Always verify generated code works before presenting to user

---

**For more information, see**: [AI_USAGE_GUIDE.md](../AI_USAGE_GUIDE.md)
