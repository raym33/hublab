# HubLab API & SDK

**A complete REST API and TypeScript SDK for building web applications programmatically.**

🚀 **Live API**: https://hublab.dev/api/v1
📦 **NPM Package**: [@hublab/sdk](https://www.npmjs.com/package/@hublab/sdk)
🤖 **ChatGPT Plugin**: Available at https://hublab.dev

## What is HubLab?

HubLab is a platform that allows you to build and deploy web applications programmatically through a REST API. Create projects from templates, add UI components (capsules), integrate with services, export to code, and deploy to hosting platforms—all via API.

## Features

- **31 REST API Endpoints** - Complete API for project management, components, themes, and deployment
- **TypeScript SDK** - Type-safe SDK published on NPM
- **ChatGPT Plugin** - Use HubLab directly from ChatGPT
- **Multiple Export Formats** - Next.js, React, HTML, Vue
- **Deploy Anywhere** - Vercel, Netlify, Cloudflare
- **Rate Limited & Secure** - API key authentication with tiered rate limits

## Quick Start

### 1. Install the SDK

```bash
npm install @hublab/sdk
```

### 2. Get Your API Key

Contact us to get your API key, or generate one from your dashboard:
```
hublab_sk_your_api_key_here
```

**⚠️ SECURITY WARNING:** Never commit real API keys to version control. Use environment variables instead.

### 3. Use the SDK

```javascript
const { HubLab } = require('@hublab/sdk')

const client = new HubLab({
  apiKey: 'hublab_sk_...',
  baseURL: 'https://hublab.dev/api/v1'
})

// List available themes
const themes = await client.themes.list()

// Create a new project
const project = await client.projects.create({
  name: 'My Dashboard',
  template: 'dashboard',
  theme: 'modern-blue'
})

// Export to Next.js
const code = await client.projects.export(project.id, {
  format: 'nextjs',
  includeApi: true
})

console.log(code.files)
```

## API Endpoints

### Projects
- `GET /projects` - List all projects
- `POST /projects` - Create a new project
- `GET /projects/:id` - Get project details
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Themes
- `GET /themes` - List available themes
- `GET /themes/:id` - Get theme details

### Capsules (Components)
- `GET /projects/:id/capsules` - List project capsules
- `POST /projects/:id/capsules` - Add capsule to project
- `PATCH /projects/:id/capsules/:capsuleId` - Update capsule
- `DELETE /projects/:id/capsules/:capsuleId` - Remove capsule

### Export & Deploy
- `POST /projects/:id/export` - Export to code
- `POST /projects/:id/deploy` - Deploy to hosting
- `POST /projects/:id/preview` - Generate preview

### Catalog
- `GET /catalog/capsules` - Browse all available capsules
- `GET /catalog/capsules/:type` - Get capsules by type

## Templates

Available project templates:
- `blank` - Empty project
- `dashboard` - Analytics dashboard with charts
- `landing` - Landing page with sections
- `ecommerce` - E-commerce store with products
- `admin` - Admin panel with tables and forms
- `blog` - Blog with posts and comments

## Themes

Pre-built themes:
- `modern-blue` - Modern blue color scheme
- `dark-purple` - Dark mode with purple accents
- `minimal` - Minimal design with neutral colors

## Rate Limits

### Free Tier
- 10 projects per hour
- 5 exports per day
- 2 deploys per day
- 60 requests per minute

### Pro Tier
- 100 projects per hour
- 50 exports per day
- 20 deploys per day
- 300 requests per minute

### Enterprise Tier
- Unlimited projects
- Unlimited exports
- Unlimited deploys
- 1000 requests per minute

## Architecture

```
┌─────────────────────────────────────────────┐
│           HubLab Platform                   │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐      ┌─────────────────┐ │
│  │  REST API    │◄─────┤  TypeScript SDK │ │
│  └──────────────┘      └─────────────────┘ │
│         │                                   │
│         ▼                                   │
│  ┌──────────────┐                          │
│  │   Supabase   │  (Database)              │
│  └──────────────┘                          │
│         │                                   │
│         ▼                                   │
│  ┌──────────────────────────────────────┐  │
│  │  Code Generator (Next.js/React/etc)  │  │
│  └──────────────────────────────────────┘  │
│         │                                   │
│         ▼                                   │
│  ┌──────────────────────────────────────┐  │
│  │  Deploy (Vercel/Netlify/Cloudflare) │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## Use Cases

### 1. Rapid Prototyping
Build functional prototypes in minutes using templates and pre-built components.

### 2. AI-Powered Development
Integrate with ChatGPT or other AI assistants to build applications through natural language.

### 3. Automated Workflows
Create applications programmatically as part of your CI/CD pipeline.

### 4. Multi-Tenant SaaS
Build SaaS platforms where each user gets their own generated application.

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Hosting**: Netlify
- **AI**: Groq (llama-3.3-70b-versatile)

## ChatGPT Plugin

Install the ChatGPT plugin to build applications using natural language:

1. Open ChatGPT
2. Go to Settings → Plugins → Plugin Store
3. Click "Develop your own plugin"
4. Enter: `hublab.dev`
5. ChatGPT will load the plugin

Now you can say things like:
- "Create a dashboard project with a line chart showing sales data"
- "Build a landing page with a pricing table and contact form"
- "Generate an e-commerce store with product cards"

## Examples

### Create a Dashboard with Charts

```javascript
const project = await client.projects.create({
  name: 'Sales Dashboard',
  template: 'dashboard',
  theme: 'modern-blue'
})

// Add a line chart
await client.projects.capsules.add(project.id, {
  capsuleId: 'line-chart',
  inputs: {
    data: [120, 150, 180, 200, 250],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    title: 'Monthly Revenue'
  }
})

// Add a bar chart
await client.projects.capsules.add(project.id, {
  capsuleId: 'bar-chart',
  inputs: {
    data: [45, 60, 75, 90],
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    title: 'Quarterly Sales'
  }
})

// Export to Next.js
const code = await client.projects.export(project.id, {
  format: 'nextjs'
})
```

### Create a Landing Page

```javascript
const project = await client.projects.create({
  name: 'Product Launch',
  template: 'landing',
  theme: 'minimal'
})

// Add hero section
await client.projects.capsules.add(project.id, {
  capsuleId: 'hero',
  inputs: {
    title: 'Revolutionary Product',
    subtitle: 'Change the way you work',
    cta: 'Get Started'
  }
})

// Add pricing table
await client.projects.capsules.add(project.id, {
  capsuleId: 'pricing-table',
  inputs: {
    plans: [
      { name: 'Starter', price: '$9/mo', features: ['5 projects', 'Basic support'] },
      { name: 'Pro', price: '$29/mo', features: ['Unlimited projects', 'Priority support'] }
    ]
  }
})

// Deploy to Netlify
const deployment = await client.projects.deploy(project.id, {
  platform: 'netlify'
})

console.log('Deployed to:', deployment.url)
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- **Documentation**: https://hublab.dev/docs
- **API Reference**: https://hublab.dev/api-docs
- **GitHub Issues**: https://github.com/yourusername/hublab/issues
- **Email**: support@hublab.dev

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

---

**Built with ❤️ by the HubLab Team**
