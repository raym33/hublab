# Supabase Integration Guide

Connect your HubLab components to Supabase for instant backend, database, auth, and storage.

## Setup

### 1. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 2. Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Create Supabase Client

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Quick Start - Fetch Data

```typescript
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProductList() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      setProducts(data || [])
    }
    fetchProducts()
  }, [])

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  )
}
```

## CRUD Operations

**Insert:** `await supabase.from('products').insert([{ name, price }])`
**Update:** `await supabase.from('products').update({ price }).eq('id', id)`
**Delete:** `await supabase.from('products').delete().eq('id', id)`

## Real-time Data

```typescript
useEffect(() => {
  const channel = supabase
    .channel('products-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' },
      (payload) => fetchProducts()
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}, [])
```

## Authentication

```typescript
// Sign up
await supabase.auth.signUp({ email, password })

// Sign in
await supabase.auth.signInWithPassword({ email, password })

// Get current user
const { data: { user } } = await supabase.auth.getUser()
```

## File Upload

```typescript
const uploadFile = async (file: File) => {
  const filePath = `uploads/${Date.now()}-${file.name}`

  const { data } = await supabase.storage
    .from('public-files')
    .upload(filePath, file)

  const { data: { publicUrl } } = supabase.storage
    .from('public-files')
    .getPublicUrl(filePath)

  return publicUrl
}
```

## Best Practices

1. **Enable Row Level Security (RLS)** in Supabase dashboard
2. **Handle errors** - Always check `error` in responses
3. **Use TypeScript** - Define database types
4. **Optimize queries** - Only select columns you need
5. **Clean up subscriptions** - Unsubscribe from real-time channels

## Next Steps

- [REST API Guide](./rest-api.md) - General API patterns
- [Form Handling](./form-handling.md) - Form validation
