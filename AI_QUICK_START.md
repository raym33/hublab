# HubLab API - Quick Start Guide for AI Agents

This guide shows AI agents (Claude, ChatGPT, etc.) how to use HubLab programmatically to build and deploy web applications for users.

## When to Use HubLab

Use HubLab when users need:
- Dashboard with data tables, charts, stats
- Landing page for product/service
- E-commerce store
- Admin panel
- Blog
- Any web app that can be built with components

## Setup (One-Time)

Users need to get an API key first:
1. Visit https://hublab.dev/workspace
2. Go to Settings → API Keys
3. Generate new API key
4. Copy key (format: `hublab_sk_...`)

## Option 1: Using TypeScript SDK (Recommended)

```typescript
import { HubLab } from '@hublab/sdk'

const hublab = new HubLab({
  apiKey: process.env.HUBLAB_API_KEY
})

// Create dashboard
const project = await hublab.projects.create({
  name: 'User Analytics Dashboard',
  template: 'dashboard',
  theme: 'modern-blue'
})

// Add stats
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
const { files } = await hublab.projects.export(project.id, {
  format: 'nextjs'
})

// Deploy to Vercel
const deployment = await hublab.projects.deploy(project.id, {
  platform: 'vercel'
})

console.log(`Live at: ${deployment.url}`)
```

## Option 2: Using REST API Directly

```bash
API_KEY="hublab_sk_..."
BASE_URL="https://hublab.dev/api/v1"

# 1. Create project
PROJECT_ID=$(curl -X POST $BASE_URL/projects \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Analytics Dashboard",
    "template": "dashboard",
    "theme": "modern-blue"
  }' | jq -r '.data.project.id')

# 2. Add stats capsule
curl -X POST $BASE_URL/projects/$PROJECT_ID/capsules \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "type": "stats-grid",
    "props": {
      "columns": 4,
      "stats": [
        {"label": "Users", "value": "1,234", "icon": "users"}
      ]
    }
  }'

# 3. Deploy
curl -X POST $BASE_URL/projects/$PROJECT_ID/deploy \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"platform": "vercel"}'
```

## Common Use Cases for AIs

### 1. User Wants a Dashboard

```typescript
// Ask user what data they want to display
const project = await hublab.projects.create({
  name: 'Sales Dashboard',
  template: 'dashboard',
  theme: 'modern-blue'
})

// Add KPI stats
await hublab.projects.addCapsule(project.id, {
  type: 'stats-grid',
  props: {
    columns: 4,
    stats: [
      { label: 'Total Sales', value: '$124.5k', icon: 'dollar' },
      { label: 'New Customers', value: '234', icon: 'users' },
      { label: 'Products Sold', value: '1,543', icon: 'shopping-bag' },
      { label: 'Conversion', value: '3.2%', icon: 'trending-up' }
    ]
  }
})

// Add data table (ask user for their Supabase credentials)
await hublab.projects.addCapsule(project.id, {
  type: 'data-table',
  props: {
    columns: [
      { key: 'customer_name', label: 'Customer' },
      { key: 'amount', label: 'Amount' },
      { key: 'status', label: 'Status' },
      { key: 'date', label: 'Date' }
    ],
    showPagination: true,
    showSearch: true
  },
  dataSource: {
    type: 'supabase',
    config: {
      table: 'orders',
      fields: ['customer_name', 'amount', 'status', 'date'],
      orderBy: { column: 'date', ascending: false }
    }
  }
})

// Add integration
await hublab.projects.addIntegration(project.id, {
  type: 'supabase',
  config: {}
})

// Deploy
const deployment = await hublab.projects.deploy(project.id, {
  platform: 'vercel',
  config: {
    envVars: {
      NEXT_PUBLIC_SUPABASE_URL: userProvidedUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: userProvidedKey
    }
  }
})

// Tell user: "Dashboard deployed at: [deployment.url]"
```

### 2. User Wants a Landing Page

```typescript
const project = await hublab.projects.create({
  name: 'Product Landing Page',
  template: 'landing',
  theme: 'minimal'
})

// Customize hero section
await hublab.projects.updateCapsule(
  project.id,
  'hero-1', // ID from template
  {
    props: {
      title: 'Build Better Products Faster',
      subtitle: 'The platform developers love',
      ctaText: 'Get Started Free',
      ctaLink: '/signup'
    }
  }
)

// Deploy
const deployment = await hublab.projects.deploy(project.id, {
  platform: 'netlify'
})
```

### 3. User Wants E-commerce Store

```typescript
const project = await hublab.projects.create({
  name: 'Online Store',
  template: 'ecommerce',
  theme: 'modern-blue'
})

// Add product grid (user provides product data)
await hublab.projects.addCapsule(project.id, {
  type: 'product-grid',
  props: {
    columns: 4,
    showFilters: true
  },
  dataSource: {
    type: 'supabase',
    config: {
      table: 'products',
      fields: ['name', 'price', 'image', 'category']
    }
  }
})

// Add integrations
await hublab.projects.addIntegration(project.id, {
  type: 'supabase',
  config: {}
})

await hublab.projects.addIntegration(project.id, {
  type: 'stripe',
  config: {}
})

// Deploy
const deployment = await hublab.projects.deploy(project.id, {
  platform: 'vercel',
  config: {
    envVars: {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseKey,
      STRIPE_SECRET_KEY: stripeKey
    }
  }
})
```

## Available Templates

- `blank` - Start from scratch
- `dashboard` - Analytics dashboard with sidebar, stats, charts
- `landing` - Marketing landing page
- `ecommerce` - Online store with product grid
- `admin` - Admin panel with data table
- `blog` - Blog with post grid

## Available Capsule Types

**Navigation:**
- `header` - Top navigation bar
- `sidebar` - Vertical sidebar menu

**Layout:**
- `hero` - Hero section with title, subtitle, CTA
- `feature-grid` - Grid of features with icons
- `cta-section` - Call-to-action section

**Data Display:**
- `stats-grid` - KPI statistics grid
- `data-table` - Sortable, filterable data table
- `card` - Content card

**Forms:**
- `form` - Customizable form
- `contact-form` - Contact form

**Charts:**
- `bar-chart` - Bar chart
- `line-chart` - Line chart
- `pie-chart` - Pie chart

**E-commerce:**
- `product-grid` - Product grid with filters
- `cart` - Shopping cart

## Data Sources

**Supabase:**
```typescript
dataSource: {
  type: 'supabase',
  config: {
    table: 'users',
    fields: ['name', 'email', 'status'],
    filters: { status: 'active' },
    orderBy: { column: 'created_at', ascending: false },
    limit: 100
  }
}
```

**Firebase:**
```typescript
dataSource: {
  type: 'firebase',
  config: {
    collection: 'users',
    fields: ['name', 'email'],
    where: [
      { field: 'status', operator: '==', value: 'active' }
    ]
  }
}
```

**REST API:**
```typescript
dataSource: {
  type: 'rest',
  config: {
    url: 'https://api.example.com/users',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer token'
    }
  }
}
```

## Themes

**Preset Themes:**
- `modern-blue` - Blue color scheme, modern design
- `dark-purple` - Dark background, purple accents
- `minimal` - Black & white, minimal design

**Custom Theme:**
```typescript
theme: {
  name: 'Custom Theme',
  colors: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    accent: '#ffe66d',
    background: '#ffffff',
    foreground: '#000000'
  },
  typography: {
    fontFamily: 'Inter',
    headingFont: 'Playfair Display'
  },
  spacing: 'normal',
  borderRadius: 'md'
}
```

## Export Formats

- `nextjs` - Next.js 14 App Router (recommended)
- `react` - React with Vite
- `html` - Static HTML/CSS
- `vue` - Vue 3 with Vite

## Deploy Platforms

- `vercel` - Best for Next.js
- `netlify` - Good for static sites
- `cloudflare` - Cloudflare Pages

## Error Handling

```typescript
import { HubLabError } from '@hublab/sdk'

try {
  const project = await hublab.projects.create({
    name: 'My Project'
  })
} catch (error) {
  if (error instanceof HubLabError) {
    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      // Tell user: "Rate limit reached. Please wait or upgrade plan."
    } else if (error.code === 'UNAUTHORIZED') {
      // Tell user: "Invalid API key. Please check your key."
    } else {
      // Tell user: error.message
    }
  }
}
```

## Complete Example for AIs

```typescript
async function buildDashboardForUser(userRequirements) {
  const hublab = new HubLab({ apiKey: process.env.HUBLAB_API_KEY })

  // 1. Create project
  const project = await hublab.projects.create({
    name: userRequirements.name || 'Dashboard',
    template: 'dashboard',
    theme: userRequirements.theme || 'modern-blue'
  })

  // 2. Add stats if user wants KPIs
  if (userRequirements.showStats) {
    await hublab.projects.addCapsule(project.id, {
      type: 'stats-grid',
      props: {
        columns: 4,
        stats: userRequirements.stats
      }
    })
  }

  // 3. Add data table if user has data
  if (userRequirements.showTable) {
    await hublab.projects.addCapsule(project.id, {
      type: 'data-table',
      props: {
        columns: userRequirements.columns,
        showPagination: true,
        showSearch: true
      },
      dataSource: {
        type: 'supabase',
        config: {
          table: userRequirements.tableName,
          fields: userRequirements.fields
        }
      }
    })

    // Add Supabase integration
    await hublab.projects.addIntegration(project.id, {
      type: 'supabase',
      config: {}
    })
  }

  // 4. Export
  const exported = await hublab.projects.export(project.id, {
    format: 'nextjs',
    options: {
      typescript: true,
      includeReadme: true,
      includeEnvExample: true
    }
  })

  // 5. Deploy if user wants
  if (userRequirements.deploy) {
    const deployment = await hublab.projects.deploy(project.id, {
      platform: 'vercel',
      config: {
        envVars: userRequirements.envVars
      }
    })

    return {
      success: true,
      url: deployment.url,
      files: exported.files
    }
  }

  return {
    success: true,
    files: exported.files
  }
}

// Usage:
const result = await buildDashboardForUser({
  name: 'Sales Dashboard',
  theme: 'dark-purple',
  showStats: true,
  stats: [
    { label: 'Revenue', value: '$124k', icon: 'dollar' },
    { label: 'Customers', value: '2,543', icon: 'users' }
  ],
  showTable: true,
  tableName: 'orders',
  fields: ['customer', 'amount', 'status', 'date'],
  columns: [
    { key: 'customer', label: 'Customer' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status' },
    { key: 'date', label: 'Date' }
  ],
  deploy: true,
  envVars: {
    NEXT_PUBLIC_SUPABASE_URL: 'user-provided-url',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'user-provided-key'
  }
})

console.log(`Dashboard live at: ${result.url}`)
```

## Tips for AI Agents

1. **Always ask for API key first** - Users need to generate it at hublab.dev/workspace

2. **Start with templates** - Don't build from blank unless user specifically asks

3. **Ask for data source credentials** - If user wants real data, you need their Supabase/Firebase credentials

4. **Explain what you're building** - Before deploying, show user what components will be included

5. **Handle errors gracefully** - If rate limited or auth fails, explain clearly to user

6. **Suggest improvements** - If user's request is vague, suggest specific capsules/features

7. **Export before deploy** - Show user the code first if they want to review

8. **Test the flow** - Always check if the user's data source is accessible before adding capsules

## Resources

- **Full API Docs**: https://hublab.dev/api-docs
- **SDK README**: /sdk/typescript/README.md
- **API Reference**: /lib/api/API_COMPLETE.md
- **Examples**: /lib/api/examples.md

## Support

If you (the AI) encounter issues or need clarification:
- Check /lib/api/API_COMPLETE.md for complete endpoint reference
- Check SDK README for TypeScript usage
- Tell user to visit https://hublab.dev/api-docs for interactive docs
