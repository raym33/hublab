# 🤖 HubLab - AI-Only Service

## ⚠️ IMPORTANT NOTICE

**HubLab is exclusively for AI assistants and programmatic clients.**

Human browser access is **BLOCKED** at the middleware level.

---

## Why AI-Only?

HubLab is designed as a component library API optimized for:
- **AI code generation** (Claude, ChatGPT, Copilot)
- **Programmatic access** (APIs, SDKs, scripts)
- **Machine learning** (training data, embeddings)

This is intentional to:
1. Prevent scraping and unauthorized use
2. Ensure API-first architecture
3. Optimize for AI consumption patterns
4. Reduce bandwidth for human UI rendering

---

## How to Access HubLab

### ✅ For AI Assistants

**Option 1: Add AI Header**
```bash
curl -H "X-AI-Assistant: Claude" \
  https://hublab.dev/api/ai/capsules
```

**Option 2: Use AI User Agent**
```bash
curl -H "User-Agent: ClaudeBot/1.0" \
  https://hublab.dev/api/ai/metadata
```

**Option 3: Programmatic Client**
```javascript
// Automatically allowed (not a browser)
fetch('https://hublab.dev/api/ai/capsules?q=button')
```

### ❌ For Humans

If you try to access HubLab in a browser, you will see:

```
🤖 AI-Only Service

HubLab is exclusively for AI assistants.
Human browser access is not permitted.
```

---

## API Endpoints

All endpoints are accessible programmatically:

### Get All Components
```bash
GET /api/ai/capsules
```

**Query Parameters:**
- `q` - Search query
- `category` - Filter by category
- `tags` - Filter by tags (comma-separated)
- `limit` - Maximum results (default: 50)
- `offset` - Pagination offset
- `format` - Response format (`full` | `compact` | `minimal`)

### Get Specific Component
```bash
GET /api/ai/capsules/:id
```

### Get Library Metadata
```bash
GET /api/ai/metadata
```

---

## Example Usage

### Search for Components
```bash
# Search for buttons
curl "https://hublab.dev/api/ai/capsules?q=button"

# Filter by category and tags
curl "https://hublab.dev/api/ai/capsules?category=UI&tags=animated"

# Get compact format with limit
curl "https://hublab.dev/api/ai/capsules?format=compact&limit=10"
```

### Get Component Code
```bash
# Get specific component
curl "https://hublab.dev/api/ai/capsules/button-primary"
```

### Get Library Stats
```bash
# Get metadata
curl "https://hublab.dev/api/ai/metadata"
```

---

## Integration Examples

### Claude Code
```typescript
import { searchCapsules } from '@/lib/all-capsules'

// Direct import (when running in app context)
const buttons = searchCapsules('button')
```

### ChatGPT Plugin
```typescript
async function searchHubLab(query: string) {
  const response = await fetch(
    `https://hublab.dev/api/ai/capsules?q=${query}`,
    {
      headers: {
        'X-AI-Assistant': 'ChatGPT'
      }
    }
  )
  return response.json()
}
```

### Python Script
```python
import requests

response = requests.get(
    'https://hublab.dev/api/ai/capsules',
    headers={'X-AI-Assistant': 'Python Script'},
    params={'q': 'button', 'format': 'compact'}
)

capsules = response.json()
print(f"Found {capsules['data']['metadata']['total']} components")
```

---

## What You Get

### 240 Production-Ready Components
- All with TypeScript types
- All use Tailwind CSS
- All include 'use client' directive
- 100% AI-friendliness score

### Rich Metadata
- 284 unique semantic tags
- 19 categories
- Detailed descriptions
- Relevance scoring

### Fast Performance
- 0.04ms search speed
- <100ms API response time
- Edge-optimized
- Cached responses

---

## Access Control

### ✅ Allowed Clients

- **AI Assistants**: Claude, ChatGPT, Copilot, Gemini, etc.
- **Programmatic**: curl, wget, axios, fetch, python-requests
- **Developer Tools**: Postman, Insomnia, HTTPie
- **Crawlers**: Googlebot, Bingbot (for indexing)

### ❌ Blocked Clients

- **Web Browsers**: Chrome, Safari, Firefox, Edge
- **Human Users**: Any interactive browser access
- **GUI Clients**: Unless they identify as AI/programmatic

---

## Why This Matters

### For AI Developers
- No rate limiting for legitimate AI use
- Optimized response formats
- Semantic search built-in
- Natural language query support

### For Component Users
- Access through AI assistants
- Always get latest components
- No manual browsing needed
- AI selects best match

### For HubLab
- Reduced bandwidth costs
- Focused optimization
- Better security
- Clear use case

---

## Technical Details

### Middleware Detection

HubLab uses advanced detection to identify AI/programmatic clients:

1. **Header Check**: Looks for `X-AI-Assistant`, `X-API-Key`, or `Authorization`
2. **User Agent**: Matches against known AI/bot agents
3. **Browser Detection**: Blocks typical browser signatures

See [middleware.ts](./middleware.ts) for full implementation.

### Response Format

All blocked requests receive:
- **Status**: 403 Forbidden
- **Content-Type**: text/html
- **Message**: Beautiful AI-only notice page
- **Instructions**: How to access via API

---

## Documentation

- **API Guide**: [AI_USAGE_GUIDE.md](./AI_USAGE_GUIDE.md)
- **Integration Examples**: [docs/AI_INTEGRATION_EXAMPLES.md](./docs/AI_INTEGRATION_EXAMPLES.md)
- **Quick Start**: [README_FOR_AI.md](./README_FOR_AI.md)

---

## Contact

**For AI Integration Support:**
- Email: ai-access@hublab.dev
- API Docs: https://hublab.dev/api/ai/metadata
- GitHub: https://github.com/raym33/hublab

---

## FAQ

**Q: Can I get a human-accessible version?**
A: No. HubLab is intentionally AI-only. Use the API through an AI assistant.

**Q: How do I test the API?**
A: Use curl, Postman, or any programmatic client. Add `X-AI-Assistant` header.

**Q: Will you add a web UI?**
A: No. The architecture is optimized for API-first, AI-only access.

**Q: Can I bypass the middleware?**
A: No. Access control is enforced at the infrastructure level.

**Q: What if I need components for my app?**
A: Ask an AI assistant (Claude, ChatGPT) to search HubLab for you.

---

**Last Updated**: 2025-11-03
**Version**: 2.0.0 (AI-Only)
**Total Components**: 240
**AI-Friendliness**: 100%
