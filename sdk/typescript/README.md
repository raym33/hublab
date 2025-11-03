# @hublab/sdk

Official TypeScript SDK for the HubLab API.

## Installation

```bash
npm install @hublab/sdk
# or
yarn add @hublab/sdk
# or
pnpm add @hublab/sdk
```

## Quick Start

```typescript
import { HubLab } from '@hublab/sdk'

const hublab = new HubLab({
  apiKey: 'hublab_sk_your_api_key_here'
})

// Create a project
const project = await hublab.projects.create({
  name: 'My Dashboard',
  template: 'dashboard',
  theme: 'modern-blue'
})

// Add a capsule
await hublab.projects.addCapsule(project.id, {
  type: 'stats-grid',
  props: {
    columns: 4,
    stats: [
      { label: 'Users', value: '1,234', icon: 'users' },
      { label: 'Revenue', value: '$45.6k', icon: 'dollar' }
    ]
  }
})

// Export to Next.js
const exported = await hublab.projects.export(project.id, {
  format: 'nextjs',
  options: {
    typescript: true,
    includeReadme: true
  }
})

// Deploy to Vercel
const deployment = await hublab.projects.deploy(project.id, {
  platform: 'vercel',
  config: {
    envVars: {
      NEXT_PUBLIC_SUPABASE_URL: 'your-url'
    }
  }
})

console.log(`Deployed to: ${deployment.url}`)
```

## API Reference

### Client

```typescript
const hublab = new HubLab({
  apiKey: string
  baseUrl?: string // default: 'https://hublab.dev/api/v1'
})
```

### Projects

#### create(data)
Create a new project.

```typescript
const project = await hublab.projects.create({
  name: 'My Project',
  description: 'Optional description',
  template: 'dashboard', // blank | dashboard | landing | ecommerce | admin | blog
  theme: 'modern-blue'  // or custom ThemeConfig object
})
```

#### list(params?)
List all projects with optional filtering and pagination.

```typescript
const { projects, pagination } = await hublab.projects.list({
  page: 1,
  limit: 10,
  status: 'ready',
  template: 'dashboard'
})
```

#### get(projectId)
Get a single project by ID.

```typescript
const project = await hublab.projects.get('project-id')
```

#### update(projectId, data)
Update a project.

```typescript
const project = await hublab.projects.update('project-id', {
  name: 'Updated Name',
  theme: 'dark-purple'
})
```

#### delete(projectId)
Delete a project.

```typescript
await hublab.projects.delete('project-id')
```

#### addCapsule(projectId, data)
Add a capsule to a project.

```typescript
const capsule = await hublab.projects.addCapsule('project-id', {
  type: 'data-table',
  props: {
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' }
    ],
    showPagination: true
  },
  dataSource: {
    type: 'supabase',
    config: {
      table: 'users',
      fields: ['name', 'email']
    }
  }
})
```

#### listCapsules(projectId)
List all capsules in a project.

```typescript
const capsules = await hublab.projects.listCapsules('project-id')
```

#### updateCapsule(projectId, capsuleId, data)
Update a capsule.

```typescript
const capsule = await hublab.projects.updateCapsule(
  'project-id',
  'capsule-id',
  {
    props: { /* updated props */ }
  }
)
```

#### deleteCapsule(projectId, capsuleId)
Delete a capsule.

```typescript
await hublab.projects.deleteCapsule('project-id', 'capsule-id')
```

#### addIntegration(projectId, data)
Add an integration to a project.

```typescript
const integration = await hublab.projects.addIntegration('project-id', {
  type: 'supabase',
  config: {}
})
```

#### listIntegrations(projectId)
List all integrations in a project.

```typescript
const integrations = await hublab.projects.listIntegrations('project-id')
```

#### deleteIntegration(projectId, integrationType)
Delete an integration.

```typescript
await hublab.projects.deleteIntegration('project-id', 'supabase')
```

#### export(projectId, data)
Export a project to code.

```typescript
const { files } = await hublab.projects.export('project-id', {
  format: 'nextjs', // nextjs | react | html | vue
  options: {
    typescript: true,
    includeReadme: true,
    includeEnvExample: true
  }
})
```

#### deploy(projectId, data)
Deploy a project to a hosting platform.

```typescript
const deployment = await hublab.projects.deploy('project-id', {
  platform: 'vercel', // vercel | netlify | cloudflare
  config: {
    domain: 'my-app.example.com',
    envVars: {
      NEXT_PUBLIC_API_URL: 'https://api.example.com'
    }
  }
})
```

#### preview(projectId)
Generate a preview URL for a project.

```typescript
const { previewUrl, expiresAt } = await hublab.projects.preview('project-id')
```

### Themes

#### list()
List all available preset themes.

```typescript
const themes = await hublab.themes.list()
```

#### get(themeId)
Get a specific theme.

```typescript
const theme = await hublab.themes.get('modern-blue')
```

### Catalog

#### listCapsules(params?)
Browse available capsule types.

```typescript
const capsules = await hublab.catalog.listCapsules({
  category: 'charts',
  search: 'bar'
})
```

#### getCapsule(capsuleType)
Get details for a specific capsule type.

```typescript
const capsule = await hublab.catalog.getCapsule('data-table')
```

## Error Handling

```typescript
import { HubLabError } from '@hublab/sdk'

try {
  const project = await hublab.projects.create({ name: 'Test' })
} catch (error) {
  if (error instanceof HubLabError) {
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    console.error('HTTP status:', error.status)
    console.error('Details:', error.details)
  }
}
```

## Types

All types are exported from the SDK:

```typescript
import type {
  Project,
  Capsule,
  ThemeConfig,
  CreateProjectRequest,
  ExportRequest,
  DeployRequest,
  // ... and more
} from '@hublab/sdk'
```

## Examples

### Complete Workflow

```typescript
import { HubLab } from '@hublab/sdk'

const hublab = new HubLab({ apiKey: process.env.HUBLAB_API_KEY })

async function buildAndDeployApp() {
  // 1. Create project
  const project = await hublab.projects.create({
    name: 'User Dashboard',
    template: 'dashboard',
    theme: 'dark-purple'
  })

  // 2. Add stats grid
  await hublab.projects.addCapsule(project.id, {
    type: 'stats-grid',
    props: {
      columns: 4,
      stats: [
        { label: 'Active Users', value: '2,543', icon: 'users' },
        { label: 'Total Revenue', value: '$124.5k', icon: 'dollar' },
        { label: 'Projects', value: '89', icon: 'folder' },
        { label: 'Completion', value: '94%', icon: 'check' }
      ]
    }
  })

  // 3. Add data table with live data
  await hublab.projects.addCapsule(project.id, {
    type: 'data-table',
    props: {
      columns: [
        { key: 'name', label: 'User' },
        { key: 'email', label: 'Email' },
        { key: 'status', label: 'Status' },
        { key: 'created_at', label: 'Joined' }
      ],
      showPagination: true,
      showSearch: true
    },
    dataSource: {
      type: 'supabase',
      config: {
        table: 'users',
        fields: ['name', 'email', 'status', 'created_at'],
        orderBy: { column: 'created_at', ascending: false },
        limit: 50
      }
    }
  })

  // 4. Add Supabase integration
  await hublab.projects.addIntegration(project.id, {
    type: 'supabase',
    config: {}
  })

  // 5. Export to Next.js
  const exported = await hublab.projects.export(project.id, {
    format: 'nextjs',
    options: {
      typescript: true,
      includeReadme: true,
      includeEnvExample: true
    }
  })

  console.log(`Generated ${exported.files.length} files`)

  // 6. Deploy to Vercel
  const deployment = await hublab.projects.deploy(project.id, {
    platform: 'vercel',
    config: {
      envVars: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
      }
    }
  })

  console.log(`Deployed to: ${deployment.url}`)
  return deployment.url
}

buildAndDeployApp()
```

## License

MIT

## Support

- Documentation: https://hublab.dev/api-docs
- GitHub: https://github.com/hublab/sdk-typescript
- Email: support@hublab.dev
