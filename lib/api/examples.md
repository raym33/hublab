# HubLab API Examples

Example API requests for testing and integration.

## Prerequisites

1. Get your API key from the dashboard
2. Set it as an environment variable:
```bash
export HUBLAB_API_KEY="hublab_sk_your_api_key_here"
```

## 1. Create a Dashboard Project

```bash
curl -X POST https://hublab.dev/api/v1/projects \
  -H "Authorization: Bearer $HUBLAB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Analytics Dashboard",
    "description": "Real-time analytics and metrics",
    "template": "dashboard",
    "theme": "modern-blue"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "project": {
    "id": "abc123",
    "userId": "user_456",
    "name": "Analytics Dashboard",
    "description": "Real-time analytics and metrics",
    "template": "dashboard",
    "theme": {
      "name": "Modern Blue",
      "colors": {
        "primary": "#3b82f6",
        "secondary": "#8b5cf6",
        "accent": "#06b6d4",
        "background": "#ffffff",
        "foreground": "#0f172a"
      },
      "typography": {
        "fontFamily": "Inter"
      },
      "spacing": "normal",
      "borderRadius": "md"
    },
    "capsules": [
      {
        "id": "header-1",
        "type": "header",
        "category": "navigation",
        "props": {
          "title": "Dashboard",
          "showLogo": true,
          "showNav": true
        }
      },
      {
        "id": "sidebar-1",
        "type": "sidebar",
        "category": "navigation",
        "props": {
          "items": [
            { "label": "Overview", "icon": "home", "href": "/" },
            { "label": "Analytics", "icon": "chart", "href": "/analytics" },
            { "label": "Settings", "icon": "settings", "href": "/settings" }
          ]
        }
      },
      {
        "id": "stats-1",
        "type": "stats-grid",
        "category": "data-display",
        "props": {
          "columns": 4,
          "stats": [
            { "label": "Total Users", "value": "0", "icon": "users" },
            { "label": "Revenue", "value": "$0", "icon": "dollar" },
            { "label": "Active Projects", "value": "0", "icon": "folder" },
            { "label": "Tasks", "value": "0", "icon": "check" }
          ]
        }
      }
    ],
    "integrations": [
      { "type": "supabase", "config": {} }
    ],
    "status": "draft",
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  },
  "message": "Project created successfully"
}
```

## 2. List All Projects

```bash
curl -X GET "https://hublab.dev/api/v1/projects?page=1&limit=10" \
  -H "Authorization: Bearer $HUBLAB_API_KEY"
```

**With Filters:**
```bash
curl -X GET "https://hublab.dev/api/v1/projects?status=ready&template=dashboard" \
  -H "Authorization: Bearer $HUBLAB_API_KEY"
```

## 3. Get a Specific Project

```bash
curl -X GET https://hublab.dev/api/v1/projects/abc123 \
  -H "Authorization: Bearer $HUBLAB_API_KEY"
```

## 4. Update a Project

**Update name and status:**
```bash
curl -X PUT https://hublab.dev/api/v1/projects/abc123 \
  -H "Authorization: Bearer $HUBLAB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Dashboard Name",
    "status": "ready"
  }'
```

**Change theme:**
```bash
curl -X PUT https://hublab.dev/api/v1/projects/abc123 \
  -H "Authorization: Bearer $HUBLAB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark-purple"
  }'
```

**Custom theme:**
```bash
curl -X PUT https://hublab.dev/api/v1/projects/abc123 \
  -H "Authorization: Bearer $HUBLAB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": {
      "name": "Custom Theme",
      "colors": {
        "primary": "#ff6b6b",
        "secondary": "#4ecdc4",
        "accent": "#ffe66d",
        "background": "#1a1a2e",
        "foreground": "#ffffff"
      },
      "typography": {
        "fontFamily": "Poppins",
        "headingFont": "Playfair Display"
      },
      "spacing": "relaxed",
      "borderRadius": "lg"
    }
  }'
```

## 5. Delete a Project

```bash
curl -X DELETE https://hublab.dev/api/v1/projects/abc123 \
  -H "Authorization: Bearer $HUBLAB_API_KEY"
```

## 6. Create Different Template Types

**Landing Page:**
```bash
curl -X POST https://hublab.dev/api/v1/projects \
  -H "Authorization: Bearer $HUBLAB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Landing Page",
    "description": "Marketing site for new product",
    "template": "landing",
    "theme": "minimal"
  }'
```

**E-commerce:**
```bash
curl -X POST https://hublab.dev/api/v1/projects \
  -H "Authorization: Bearer $HUBLAB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Online Store",
    "description": "E-commerce platform",
    "template": "ecommerce",
    "theme": "modern-blue"
  }'
```

**Blog:**
```bash
curl -X POST https://hublab.dev/api/v1/projects \
  -H "Authorization: Bearer $HUBLAB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Blog",
    "description": "Technology and programming blog",
    "template": "blog",
    "theme": "dark-purple"
  }'
```

**Admin Panel:**
```bash
curl -X POST https://hublab.dev/api/v1/projects \
  -H "Authorization: Bearer $HUBLAB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CMS Admin",
    "description": "Content management system",
    "template": "admin",
    "theme": "minimal"
  }'
```

## 7. Error Handling Examples

**Missing API Key:**
```bash
curl -X GET https://hublab.dev/api/v1/projects
# Response: 401 Unauthorized
# {
#   "success": false,
#   "error": {
#     "code": "UNAUTHORIZED",
#     "message": "Missing API key. Include it in the Authorization header as \"Bearer <api_key>\""
#   }
# }
```

**Invalid API Key:**
```bash
curl -X GET https://hublab.dev/api/v1/projects \
  -H "Authorization: Bearer invalid_key"
# Response: 401 Unauthorized
# {
#   "success": false,
#   "error": {
#     "code": "UNAUTHORIZED",
#     "message": "Invalid or inactive API key"
#   }
# }
```

**Rate Limit Exceeded:**
```bash
# After exceeding rate limits
curl -X POST https://hublab.dev/api/v1/projects \
  -H "Authorization: Bearer $HUBLAB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test"}'
# Response: 429 Too Many Requests
# {
#   "success": false,
#   "error": {
#     "code": "RATE_LIMIT_EXCEEDED",
#     "message": "Rate limit exceeded. Limit: 10 per 60 minutes",
#     "details": {
#       "limit": 10,
#       "resetAt": "2025-01-15T11:00:00Z"
#     }
#   }
# }
```

**Validation Error:**
```bash
curl -X POST https://hublab.dev/api/v1/projects \
  -H "Authorization: Bearer $HUBLAB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
# Response: 400 Bad Request
# {
#   "success": false,
#   "error": {
#     "code": "VALIDATION_ERROR",
#     "message": "Validation failed",
#     "details": ["name is required and must be a string"]
#   }
# }
```

**Project Not Found:**
```bash
curl -X GET https://hublab.dev/api/v1/projects/nonexistent \
  -H "Authorization: Bearer $HUBLAB_API_KEY"
# Response: 404 Not Found
# {
#   "success": false,
#   "error": {
#     "code": "NOT_FOUND",
#     "message": "Project not found"
#   }
# }
```

## 8. Python Example

```python
import requests
import os

API_KEY = os.getenv('HUBLAB_API_KEY')
BASE_URL = 'https://hublab.dev/api/v1'

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

# Create project
response = requests.post(
    f'{BASE_URL}/projects',
    headers=headers,
    json={
        'name': 'Python Dashboard',
        'description': 'Created via Python',
        'template': 'dashboard',
        'theme': 'modern-blue'
    }
)

project = response.json()
print(f"Created project: {project['project']['id']}")

# List projects
response = requests.get(
    f'{BASE_URL}/projects',
    headers=headers,
    params={'page': 1, 'limit': 10}
)

projects = response.json()
print(f"Total projects: {projects['data']['pagination']['total']}")

# Update project
project_id = project['project']['id']
response = requests.put(
    f'{BASE_URL}/projects/{project_id}',
    headers=headers,
    json={'status': 'ready'}
)

print(f"Updated project status")

# Delete project
response = requests.delete(
    f'{BASE_URL}/projects/{project_id}',
    headers=headers
)

print(f"Deleted project")
```

## 9. JavaScript/TypeScript Example

```typescript
const HUBLAB_API_KEY = process.env.HUBLAB_API_KEY
const BASE_URL = 'https://hublab.dev/api/v1'

async function createProject() {
  const response = await fetch(`${BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HUBLAB_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Next.js Dashboard',
      description: 'Created via JavaScript',
      template: 'dashboard',
      theme: 'dark-purple'
    })
  })

  const data = await response.json()
  console.log('Created project:', data.project.id)
  return data.project
}

async function listProjects() {
  const response = await fetch(
    `${BASE_URL}/projects?page=1&limit=10`,
    {
      headers: {
        'Authorization': `Bearer ${HUBLAB_API_KEY}`
      }
    }
  )

  const data = await response.json()
  console.log('Total projects:', data.data.pagination.total)
  return data.data.projects
}

async function updateProject(projectId: string) {
  const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${HUBLAB_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: 'ready'
    })
  })

  return await response.json()
}

async function deleteProject(projectId: string) {
  const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${HUBLAB_API_KEY}`
    }
  })

  return await response.json()
}

// Usage
const project = await createProject()
const projects = await listProjects()
await updateProject(project.id)
await deleteProject(project.id)
```

## 10. Testing with Postman

1. **Import Collection**: Create a new collection in Postman
2. **Set Variables**:
   - `baseUrl`: `https://hublab.dev/api/v1`
   - `apiKey`: Your API key
3. **Add Requests**: Use the examples above
4. **Set Headers**:
   - `Authorization`: `Bearer {{apiKey}}`
   - `Content-Type`: `application/json`

## Rate Limit Headers

All responses include rate limit information in headers:

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 8
X-RateLimit-Reset: 2025-01-15T11:00:00Z
```

Monitor these headers to avoid hitting rate limits.
