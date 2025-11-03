# GitHub Repository to Capsule Conversion System

## Overview

HubLab now supports converting any GitHub repository into a HubLab capsule! This allows you to integrate thousands of open-source projects directly into your visual app builder.

## How It Works

The system analyzes a GitHub repository and automatically:

1. **Fetches metadata** from the GitHub API (description, stars, topics, dependencies)
2. **Detects the embed type** (iframe, React component, or npm package)
3. **Determines the category** based on repository topics and content
4. **Generates wrapper code** with proper TypeScript interfaces
5. **Creates setup instructions** for installing and using the capsule

## Embed Types

### 1. IFrame Embed
- **Best for:** Full applications with live demos
- **Example:** OpenCut video editor, web-based tools
- **Detection:** Repository has a `homepage` URL

```typescript
// Example: OpenCut Video Editor
https://github.com/OpenCut-app/OpenCut
→ Embeds https://opencut.app in an iframe
```

### 2. Component Embed
- **Best for:** React/Next.js component libraries
- **Example:** UI components, custom hooks
- **Detection:** Repository contains React dependencies

```typescript
// Example: Component library
https://github.com/username/ui-components
→ Creates wrapper to import and render components
```

### 3. NPM Package Embed
- **Best for:** JavaScript/TypeScript libraries
- **Example:** Utility libraries, data processing tools
- **Detection:** Repository tagged with 'library' or 'package'

```typescript
// Example: Utility library
https://github.com/username/date-utils
→ Creates wrapper with npm install instructions
```

## API Usage

### Endpoint: `/api/github-to-capsule`

```typescript
POST /api/github-to-capsule

Request Body:
{
  repoUrl: string           // Required: GitHub repository URL
  embedType?: string        // Optional: 'iframe' | 'component' | 'npm-package'
  category?: string         // Optional: Override auto-detected category
  customProps?: object      // Optional: Custom props for the capsule
}

Response:
{
  success: boolean
  capsule: {
    id: string
    name: string
    category: string
    description: string
    tags: string[]
    code: string
    setupInstructions: string
    dependencies: string[]
    // ... more fields
  },
  metadata: {
    embedType: string
    detectedCategory: string
    language: string
    stars: number
  }
}
```

### Example Usage

```typescript
// Convert OpenCut to a capsule
const response = await fetch('/api/github-to-capsule', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    repoUrl: 'https://github.com/OpenCut-app/OpenCut',
    category: 'Media'  // Optional override
  })
})

const { capsule } = await response.json()

// The capsule is now ready to use in Studio V2!
console.log(capsule.name)  // "OpenCut"
console.log(capsule.code)  // Full React component code
```

## Programmatic Usage

```typescript
import { generateCapsuleFromGitHub } from '@/lib/github-repo-capsules'

// Convert any GitHub repo
const capsule = await generateCapsuleFromGitHub(
  'https://github.com/shadcn-ui/ui',
  {
    category: 'UI',
    embedType: 'npm-package',
    customProps: {
      theme: 'light',
      variant: 'default'
    }
  }
)

// Add to your capsule library
capsules.push(capsule)
```

## Automatic Category Detection

The system intelligently detects categories based on repository topics:

| Topics | Category |
|--------|----------|
| video, editor, media, audio, player | Media |
| ui, component, design, tailwind, css | UI |
| chart, visualization, dataviz, graph | DataViz |
| form, input, validation | Form |
| ai, ml, llm, openai, gpt | AI |
| animation, motion, transition | Animation |
| auth, authentication, login | Auth |
| database, db, sql, prisma | Database |

## Example Conversions

### 1. OpenCut Video Editor

```bash
Input: https://github.com/OpenCut-app/OpenCut
Category: Media
Embed Type: iframe
Result: Full-featured video editor with timeline and multi-track support
```

### 2. shadcn/ui Components

```bash
Input: https://github.com/shadcn-ui/ui
Category: UI
Embed Type: npm-package
Result: Beautiful, accessible React components
```

### 3. Remotion Video Library

```bash
Input: https://github.com/remotion-dev/remotion
Category: Media
Embed Type: component
Result: Programmatic video creation with React
```

### 4. Recharts Data Visualization

```bash
Input: https://github.com/recharts/recharts
Category: DataViz
Embed Type: npm-package
Result: Composable charting library built on React
```

## Real-World Example: OpenCut

The OpenCut video editor capsule is included as a proof of concept:

```typescript
import { openCutVideoEditorCapsule } from '@/lib/github-repo-capsules'

// Use in your app
<OpenCutVideoEditor
  height="800px"
  enableUpload={true}
  enableExport={true}
  maxTracks={5}
  theme="dark"
  onVideoExport={(blob) => {
    // Handle exported video
  }}
/>
```

**Features:**
- Timeline-based editing
- Multi-track support
- Real-time preview
- No watermarks
- Privacy-first (videos stay local)
- 100% open source

## Environment Variables

For better rate limits and private repositories:

```bash
# .env.local
GITHUB_TOKEN=ghp_your_token_here
```

Without a token: **60 requests/hour**
With a token: **5,000 requests/hour**

## Advanced Usage

### Custom Wrapper Code

You can customize the generated wrapper:

```typescript
const capsule = await generateCapsuleFromGitHub(repoUrl)

// Modify the generated code
capsule.code = capsule.code.replace(
  'height = "600px"',
  'height = "800px"'
)

// Add custom props
capsule.props = {
  ...capsule.props,
  onReady: '() => void',
  customTheme: 'string'
}
```

### Handling Authentication

Some repositories require authentication or API keys:

```typescript
// In your wrapper component
const apiKey = process.env.NEXT_PUBLIC_SERVICE_API_KEY

<IFrameEmbed
  src={`${demoUrl}?apiKey=${apiKey}`}
  // ... other props
/>
```

### Error Handling

```typescript
try {
  const capsule = await generateCapsuleFromGitHub(repoUrl)
  // Success!
} catch (error) {
  if (error.message.includes('GitHub API error')) {
    // Repository not found or rate limited
  } else if (error.message.includes('Invalid URL')) {
    // Malformed repository URL
  }
}
```

## Limitations

1. **CORS restrictions**: Some sites block iframe embedding
2. **Authentication**: Requires manual setup for authenticated services
3. **Custom integrations**: Complex APIs may need manual wrapper adjustments
4. **Self-hosted only**: Embedding requires repo to have a live URL

## Best Practices

1. **Check the demo URL** before converting (ensure it loads in iframe)
2. **Review generated code** and customize as needed
3. **Test the capsule** in Studio V2 before deploying
4. **Add error handling** for network failures
5. **Document custom props** if you modify the wrapper

## Future Enhancements

- [ ] Automatic component extraction from repositories
- [ ] Support for monorepos (Turborepo, Nx)
- [ ] Direct GitHub authentication in Studio V2
- [ ] Capsule marketplace with converted repos
- [ ] Auto-updates when repository changes
- [ ] Support for GitLab, Bitbucket repositories

## Contributing

Have ideas for improving the conversion system? Submit a PR!

Key files:
- [/lib/github-repo-capsules.ts](/lib/github-repo-capsules.ts) - Core conversion logic
- [/app/api/github-to-capsule/route.ts](/app/api/github-to-capsule/route.ts) - API endpoint

## Examples

Explore converted capsules:
- OpenCut Video Editor (Media)
- More examples coming soon!

---

**Ready to convert your first repository?** Try it in Studio V2 or use the API endpoint!
