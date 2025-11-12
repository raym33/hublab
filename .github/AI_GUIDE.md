# HubLab API - Guide for AI Assistants

**This document is optimized for AI assistants (ChatGPT, Claude, etc.) to understand and use the HubLab API effectively.**

## Core Concept

HubLab is a REST API that allows programmatic creation of web applications. An AI can use this API to build functional web applications based on user requests.

## Authentication

All API requests require a Bearer token in the Authorization header:

```
Authorization: Bearer hublab_sk_XXXXXXXXXXXXXXXX
```

## Base URL

```
https://hublab.dev/api/v1
```

## Common Workflows

### Workflow 1: Create a Simple Dashboard

```javascript
// 1. Create project
POST /projects
{
  "name": "Sales Dashboard",
  "template": "dashboard",
  "theme": "modern-blue"
}
// Response: { "success": true, "data": { "project": { "id": "abc-123", ... } } }

// 2. Add chart component
POST /projects/abc-123/capsules
{
  "capsuleId": "line-chart",
  "inputs": {
    "data": [10, 20, 30],
    "labels": ["A", "B", "C"],
    "title": "Sales Over Time"
  }
}

// 3. Export to code
POST /projects/abc-123/export
{
  "format": "nextjs",
  "includeApi": true
}
// Response: { "success": true, "data": { "files": { "page.tsx": "...", ... } } }
```

### Workflow 2: Create a Landing Page

```javascript
// 1. Create project
POST /projects
{
  "name": "Product Landing",
  "template": "landing",
  "theme": "minimal"
}

// 2. Add hero section
POST /projects/xyz-456/capsules
{
  "capsuleId": "hero",
  "inputs": {
    "title": "Welcome to Our Product",
    "subtitle": "The best solution for your needs",
    "cta": "Get Started"
  }
}

// 3. Add pricing table
POST /projects/xyz-456/capsules
{
  "capsuleId": "pricing-table",
  "inputs": {
    "plans": [
      { "name": "Basic", "price": "$9/mo", "features": ["Feature 1", "Feature 2"] },
      { "name": "Pro", "price": "$29/mo", "features": ["All Basic", "Feature 3", "Feature 4"] }
    ]
  }
}

// 4. Deploy to Netlify
POST /projects/xyz-456/deploy
{
  "platform": "netlify"
}
```

## Available Templates

| Template | Description | Best For |
|----------|-------------|----------|
| `blank` | Empty project | Starting from scratch |
| `dashboard` | Pre-configured with charts | Analytics, metrics, KPIs |
| `landing` | Hero + sections layout | Marketing pages, product launches |
| `ecommerce` | Product grid + cart | Online stores, catalogs |
| `admin` | Tables + forms | Admin panels, CRUD apps |
| `blog` | Post list + detail | Content sites, blogs |

## Available Capsules (Components)

### Data Visualization
- `line-chart` - Line chart for trends
- `bar-chart` - Bar chart for comparisons
- `pie-chart` - Pie chart for proportions
- `area-chart` - Area chart for cumulative data
- `scatter-plot` - Scatter plot for correlations

### Data Display
- `data-table` - Sortable, filterable table
- `card` - Content card
- `stat-card` - Metric display card
- `list` - Vertical list
- `grid` - Responsive grid layout

### Input
- `form` - Multi-field form
- `input` - Text input field
- `textarea` - Multi-line text input
- `select` - Dropdown selector
- `checkbox` - Checkbox input
- `radio` - Radio button group
- `file-upload` - File uploader

### Navigation
- `navbar` - Top navigation bar
- `sidebar` - Side navigation
- `tabs` - Tab navigation
- `breadcrumb` - Breadcrumb trail
- `pagination` - Page navigation

### Content
- `hero` - Hero section
- `text-block` - Rich text content
- `image` - Image display
- `video` - Video embed
- `accordion` - Collapsible sections

### Feedback
- `alert` - Alert message
- `toast` - Toast notification
- `modal` - Modal dialog
- `tooltip` - Hover tooltip
- `progress` - Progress bar
- `spinner` - Loading spinner

### Actions
- `button` - Clickable button
- `link` - Navigation link
- `dropdown` - Action dropdown

## Themes

| Theme | Description | Colors |
|-------|-------------|--------|
| `modern-blue` | Modern professional | Blue primary, neutral grays |
| `dark-purple` | Dark mode | Purple accents, dark backgrounds |
| `minimal` | Clean minimal | Neutral tones, high contrast |

## Export Formats

| Format | Output | Best For |
|--------|--------|----------|
| `nextjs` | Next.js App Router | Full-stack apps |
| `react` | React SPA | Client-side apps |
| `html` | Static HTML/CSS/JS | Simple sites |
| `vue` | Vue 3 SPA | Vue ecosystem |

## Deploy Platforms

| Platform | Type | URL Format |
|----------|------|------------|
| `vercel` | Serverless | `*.vercel.app` |
| `netlify` | CDN + Functions | `*.netlify.app` |
| `cloudflare` | Edge | `*.pages.dev` |

## Rate Limits by Tier

| Action | Free | Pro | Enterprise |
|--------|------|-----|------------|
| Projects/hour | 10 | 100 | Unlimited |
| Exports/day | 5 | 50 | Unlimited |
| Deploys/day | 2 | 20 | Unlimited |
| Requests/min | 60 | 300 | 1000 |

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

Common error codes:
- `UNAUTHORIZED` - Invalid API key
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `VALIDATION_ERROR` - Invalid request data
- `NOT_FOUND` - Resource not found
- `INTERNAL_ERROR` - Server error

## Decision Tree for AI Assistants

```
User Request
    │
    ▼
Does it need data visualization?
    ├─ Yes → Use `dashboard` template
    │         Add chart capsules (line-chart, bar-chart, etc.)
    │
    └─ No → Is it a marketing/product page?
            ├─ Yes → Use `landing` template
            │         Add hero, features, pricing
            │
            └─ No → Does it need products/items?
                    ├─ Yes → Use `ecommerce` template
                    │         Add product cards, cart
                    │
                    └─ No → Does it need forms/tables?
                            ├─ Yes → Use `admin` template
                            │         Add data-table, forms
                            │
                            └─ No → Use `blank` template
                                    Build from scratch
```

## Example Conversations

### Example 1: "Create a sales dashboard"

**AI Response:**
```javascript
// I'll create a sales dashboard with charts

// Step 1: Create dashboard project
const project = await createProject({
  name: "Sales Dashboard",
  template: "dashboard",
  theme: "modern-blue"
})

// Step 2: Add revenue trend chart
await addCapsule(project.id, {
  capsuleId: "line-chart",
  inputs: {
    data: [45000, 52000, 48000, 61000, 55000, 67000],
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    title: "Revenue Trend",
    prefix: "$"
  }
})

// Step 3: Add sales by region chart
await addCapsule(project.id, {
  capsuleId: "bar-chart",
  inputs: {
    data: [120, 95, 150, 80],
    labels: ["North", "South", "East", "West"],
    title: "Sales by Region"
  }
})

// Step 4: Add KPI cards
await addCapsule(project.id, {
  capsuleId: "stat-card",
  inputs: {
    value: "$348K",
    label: "Total Revenue",
    change: "+12.5%",
    trend: "up"
  }
})

// Done! Your dashboard is ready.
```

### Example 2: "Build a landing page for my SaaS product"

**AI Response:**
```javascript
// I'll create a professional landing page

// Step 1: Create landing page project
const project = await createProject({
  name: "SaaS Landing Page",
  template: "landing",
  theme: "minimal"
})

// Step 2: Add hero section
await addCapsule(project.id, {
  capsuleId: "hero",
  inputs: {
    title: "Streamline Your Workflow",
    subtitle: "The all-in-one platform for modern teams",
    cta: "Start Free Trial",
    image: "hero-illustration.svg"
  }
})

// Step 3: Add features section
await addCapsule(project.id, {
  capsuleId: "grid",
  inputs: {
    columns: 3,
    items: [
      { icon: "⚡", title: "Fast", description: "Lightning-fast performance" },
      { icon: "🔒", title: "Secure", description: "Enterprise-grade security" },
      { icon: "📊", title: "Analytics", description: "Powerful insights" }
    ]
  }
})

// Step 4: Add pricing table
await addCapsule(project.id, {
  capsuleId: "pricing-table",
  inputs: {
    plans: [
      {
        name: "Starter",
        price: "$29/mo",
        features: ["Up to 10 users", "Basic features", "Email support"]
      },
      {
        name: "Professional",
        price: "$99/mo",
        features: ["Up to 50 users", "Advanced features", "Priority support", "API access"],
        highlighted: true
      },
      {
        name: "Enterprise",
        price: "Custom",
        features: ["Unlimited users", "All features", "24/7 support", "Custom integration"]
      }
    ]
  }
})

// Step 5: Deploy to Netlify
const deployment = await deployProject(project.id, {
  platform: "netlify"
})

// Your landing page is live at: ${deployment.url}
```

## Best Practices for AI Assistants

1. **Always validate user input** - Check that requested features are available in the API
2. **Use appropriate templates** - Match the template to the use case
3. **Start simple** - Add core capsules first, then enhance
4. **Provide previews** - Show the user what you're building
5. **Handle errors gracefully** - If a request fails, explain why and offer alternatives
6. **Be specific with data** - When adding charts, use realistic sample data
7. **Consider theming** - Match the theme to the user's brand/preferences
8. **Export appropriately** - Choose the right format for the user's tech stack

## TypeScript SDK Usage (Recommended)

```typescript
import { HubLab } from '@hublab/sdk'

const client = new HubLab({
  apiKey: process.env.HUBLAB_API_KEY!,
  baseURL: 'https://hublab.dev/api/v1'
})

// Type-safe API calls
const themes = await client.themes.list()
const project = await client.projects.create({
  name: 'My App',
  template: 'dashboard',
  theme: 'modern-blue'
})

await client.projects.capsules.add(project.id, {
  capsuleId: 'line-chart',
  inputs: { /* ... */ }
})
```

## Quick Reference

### HTTP Methods
- `GET` - Retrieve data
- `POST` - Create new resource
- `PATCH` - Update existing resource
- `DELETE` - Remove resource

### Response Format
All successful responses:
```json
{
  "success": true,
  "data": { /* ... */ }
}
```

All error responses:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Description"
  }
}
```

### Authentication
```
Authorization: Bearer <api_key>
```

### Content Type
```
Content-Type: application/json
```

---

**This guide enables AI assistants to build web applications programmatically using natural language understanding combined with the HubLab API.**
