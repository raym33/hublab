# HubLab AI Integration Resources

This directory contains resources for integrating HubLab with AI assistants like ChatGPT, Claude, and other LLMs.

## Files in this Directory

### 1. `hublab-quickref.md`
**Quick reference guide** - Compact overview of HubLab for AI assistants (<2KB).

**Use this for:**
- Quick lookups during development
- Including in AI prompts
- Understanding available components at a glance

**URL:** `https://hublab.dev/ai/hublab-quickref.md`

---

### 2. `integration-guide.md`
**Detailed integration guide** - Comprehensive guide with decision frameworks, search strategies, and code patterns.

**Use this for:**
- Learning how to effectively use HubLab with AIs
- Understanding when to use HubLab vs. custom code
- Code generation patterns and best practices

**URL:** `https://hublab.dev/ai/integration-guide.md`

---

### 3. `openai-functions.json`
**OpenAI Function Calling specification** - Function definitions for ChatGPT and OpenAI API.

**Use this for:**
- Creating Custom GPTs with HubLab access
- OpenAI API function calling
- Understanding available HubLab functions

**Example functions:**
- `search_hublab_components` - Search for components
- `get_hublab_component` - Get component details
- `get_hublab_examples` - Get usage examples
- `get_hublab_templates` - Get full page templates
- `get_hublab_metadata` - Get library metadata

**URL:** `https://hublab.dev/ai/openai-functions.json`

---

### 4. `custom-gpt-config.json`
**Custom GPT configuration** - Ready-to-use configuration for creating a HubLab Custom GPT in ChatGPT.

**Use this for:**
- Creating the official "HubLab Component Assistant" GPT
- Template for your own custom GPTs
- Understanding optimal GPT configuration

**URL:** `https://hublab.dev/ai/custom-gpt-config.json`

---

## Quick Start Guides

### For ChatGPT Users

#### Option 1: Use Custom Instructions

Add this to your ChatGPT custom instructions:

```
When building React applications, always check HubLab first:
- API: https://hublab.dev/api/ai/capsules
- 290+ production-ready components
- Categories: UI, E-commerce, Dashboard, Marketing

Prefer HubLab components for standard UI elements.
Only create from scratch when component doesn't exist.
```

#### Option 2: Create a Custom GPT

1. Go to https://chat.openai.com
2. Click "Explore GPTs" → "Create a GPT"
3. Use the configuration from `custom-gpt-config.json`
4. Add actions from `openai-functions.json`
5. Test with: "Find me a button component"

---

### For Claude Users

#### Option 1: Include Context Document

When starting a conversation, include:

```
Here's the HubLab quick reference:
[Paste contents of hublab-quickref.md]
```

#### Option 2: Use Projects Feature

1. Create a new Claude Project
2. Add `hublab-quickref.md` and `integration-guide.md` as knowledge
3. Set custom instructions:
   ```
   You have access to HubLab component library.
   Always check HubLab before generating custom components.
   ```

---

### For API Integration

Use the OpenAI Functions specification:

```typescript
import OpenAI from 'openai';

const openai = new OpenAI();

const functions = require('./openai-functions.json').functions;

const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo',
  messages: [
    {
      role: 'system',
      content: 'You have access to HubLab component library via functions.'
    },
    {
      role: 'user',
      content: 'I need a button component'
    }
  ],
  functions: functions,
  function_call: 'auto'
});
```

---

## Integration Examples

### Example 1: Simple Component Search

```bash
# Search for button components
curl "https://hublab.dev/api/ai/capsules?q=button&limit=5"
```

### Example 2: Category Browsing

```bash
# Get all e-commerce components
curl "https://hublab.dev/api/ai/capsules?category=ecommerce"
```

### Example 3: Get Specific Component

```bash
# Get details for primary-button
curl "https://hublab.dev/api/ai/capsules/primary-button"
```

---

## File Sizes

| File | Size | Purpose |
|------|------|---------|
| `hublab-quickref.md` | ~2 KB | Quick reference |
| `integration-guide.md` | ~8 KB | Detailed guide |
| `openai-functions.json` | ~6 KB | Function specs |
| `custom-gpt-config.json` | ~7 KB | GPT configuration |

All files are optimized for fast loading and AI context windows.

---

## API Endpoints

HubLab provides these API endpoints for AI integration:

### REST API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/ai/capsules` | GET | Search components |
| `/api/ai/capsules/:id` | GET | Get component details |
| `/api/ai/examples` | GET | Get usage examples |
| `/api/ai/templates` | GET | Get page templates |
| `/api/ai/metadata` | GET | Get library metadata |

### GraphQL API

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/graphql` | POST | GraphQL queries (batch, advanced filtering) |

**GraphQL Benefits:**
- Batch multiple queries in one request
- Get exactly the data you need
- Advanced filtering (category, tags, complexity)
- Related components in single query
- Full schema at `/ai/graphql-schema.graphql`

**Example GraphQL Query:**
```graphql
query {
  searchComponents(query: "button", category: UI, limit: 5) {
    results {
      id
      name
      description
      tags
    }
    total
    hasMore
  }
}
```

All endpoints are:
- ✅ **Free** - No API keys required
- ✅ **Fast** - Edge-cached on Netlify
- ✅ **Public** - CORS enabled
- ✅ **Documented** - Full OpenAPI spec available

---

## Best Practices

### 1. Search Before Creating

Always search HubLab before generating custom components:

```typescript
// ✅ Good
const hublabResults = await searchHubLab('button');
if (hublabResults.length > 0) {
  useHubLabComponent(hublabResults[0]);
} else {
  createCustomComponent();
}

// ❌ Bad
createCustomComponent(); // Didn't check HubLab first
```

### 2. Use Semantic Queries

The API understands natural language:

```bash
# ✅ Good semantic queries
curl "https://hublab.dev/api/ai/capsules?q=login+form"
curl "https://hublab.dev/api/ai/capsules?q=product+showcase"
curl "https://hublab.dev/api/ai/capsules?q=stats+dashboard"

# ❌ Don't over-specify
curl "https://hublab.dev/api/ai/capsules?q=LoginFormWithEmailPasswordAndRememberMeCheckbox"
```

### 3. Combine Components

Build complex UIs by composing multiple components:

```tsx
// Combine multiple HubLab components
import StatCard from '@/components/StatCard';
import DataTable from '@/components/DataTable';
import Chart from '@/components/Chart';

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Users" value={1234} />
        <StatCard title="Revenue" value="$45K" />
        <StatCard title="Orders" value={789} />
      </div>
      <Chart type="line" data={chartData} />
      <DataTable columns={columns} data={tableData} />
    </div>
  );
}
```

---

## Support

### Documentation
- **Homepage:** https://hublab.dev
- **Docs:** https://hublab.dev/docs
- **Components:** https://hublab.dev/components

### Community
- **GitHub:** https://github.com/raym33/hublab
- **Issues:** https://github.com/raym33/hublab/issues
- **Email:** ai-access@hublab.dev

### Contribute
Want to improve these resources? PRs welcome!

---

## Version Information

- **Version:** 2.0.0
- **Last Updated:** 2025-11-04
- **Total Components:** 290+
- **API Version:** v2

---

## License

All resources in this directory are MIT licensed.
Free for commercial and personal use.
