# REST API Integration Guide

Learn how to connect your HubLab-generated components to REST APIs for real data.

## Quick Start

Replace mock data in your components with real API calls:

```typescript
// Before (mock data)
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
]

// After (real API)
const [users, setUsers] = useState([])

useEffect(() => {
  fetch('https://api.example.com/users')
    .then(res => res.json())
    .then(data => setUsers(data))
}, [])
```

## Complete Example: User Dashboard

```typescript
'use client'

import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  email: string
  role: string
}

export default function UserDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Users ({users.length})</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Using SWR for Better UX

Install SWR for automatic revalidation and caching:

```bash
npm install swr
```

```typescript
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function Dashboard() {
  const { data, error, isLoading } = useSWR('/api/stats', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Users: {data.totalUsers}</p>
      <p>Active: {data.activeUsers}</p>
    </div>
  )
}
```

## POST Requests (Forms)

```typescript
const [formData, setFormData] = useState({ name: '', email: '' })
const [submitting, setSubmitting] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setSubmitting(true)

  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (!response.ok) throw new Error('Failed to create user')

    const newUser = await response.json()
    console.log('Created:', newUser)

    // Reset form
    setFormData({ name: '', email: '' })
  } catch (error) {
    console.error('Error:', error)
  } finally {
    setSubmitting(false)
  }
}
```

## Authentication Headers

```typescript
const fetchWithAuth = async (url: string) => {
  const token = localStorage.getItem('authToken')

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  return response.json()
}
```

## Error Handling

```typescript
const fetchData = async () => {
  try {
    const response = await fetch('/api/data')

    // Handle HTTP errors
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized - please login')
      }
      if (response.status === 404) {
        throw new Error('Data not found')
      }
      throw new Error(`HTTP error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError) {
      throw new Error('Network error - check your connection')
    }
    throw error
  }
}
```

## CORS Issues

If calling external APIs from the browser, create a Next.js API route as a proxy:

```typescript
// app/api/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const response = await fetch('https://external-api.com/data', {
    headers: {
      'API-Key': process.env.EXTERNAL_API_KEY!,
    },
  })

  const data = await response.json()
  return NextResponse.json(data)
}
```

Then call from your component:
```typescript
fetch('/api/proxy').then(res => res.json())
```

## Best Practices

1. **Always handle errors** - Show user-friendly messages
2. **Add loading states** - Improve perceived performance
3. **Use TypeScript** - Define interfaces for API responses
4. **Implement retries** - For failed requests (use libraries like `axios-retry`)
5. **Cache responses** - Use SWR or React Query
6. **Secure API keys** - Never expose keys in client code
7. **Use Next.js API routes** - For server-side API calls

## Next Steps

- [Form Handling Guide](./form-handling.md) - Handle form submissions
- [Supabase Integration](./supabase.md) - Use Supabase for backend
- [Authentication Guide](./authentication.md) - Add user authentication
