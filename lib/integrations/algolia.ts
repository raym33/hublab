// ============================================
// ALGOLIA SEARCH INTEGRATION
// Powerful search and discovery for your applications
// ============================================

import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch'

export type AlgoliaConfig = {
  appId: string
  apiKey: string
  indexName?: string
}

export type SearchOptions = {
  query: string
  hitsPerPage?: number
  page?: number
  filters?: string
  facetFilters?: string | string[]
  attributesToRetrieve?: string[]
  attributesToHighlight?: string[]
}

// ============================================
// ALGOLIA CLIENT
// ============================================

let client: SearchClient | null = null
let defaultIndexName: string | null = null

export function getAlgoliaClient(config?: AlgoliaConfig): SearchClient {
  if (!client) {
    const appId = config?.appId || process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
    const apiKey = config?.apiKey || process.env.NEXT_PUBLIC_ALGOLIA_API_KEY
    defaultIndexName = config?.indexName || process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || null

    if (!appId || !apiKey) {
      throw new Error('Algolia app ID and API key are required')
    }

    client = algoliasearch(appId, apiKey)
  }

  return client
}

export function getIndex(indexName?: string): SearchIndex {
  const algolia = getAlgoliaClient()
  const name = indexName || defaultIndexName

  if (!name) {
    throw new Error('Index name is required')
  }

  return algolia.initIndex(name)
}

// ============================================
// SEARCH
// ============================================

export async function search<T = any>(options: SearchOptions, indexName?: string) {
  const index = getIndex(indexName)

  const results = await index.search<T>(options.query, {
    hitsPerPage: options.hitsPerPage,
    page: options.page,
    filters: options.filters,
    facetFilters: options.facetFilters,
    attributesToRetrieve: options.attributesToRetrieve,
    attributesToHighlight: options.attributesToHighlight,
  })

  return results
}

export async function searchMultiple<T = any>(queries: SearchOptions[], indexName?: string) {
  const index = getIndex(indexName)

  const results = await Promise.all(
    queries.map((options) =>
      index.search<T>(options.query, {
        hitsPerPage: options.hitsPerPage,
        page: options.page,
        filters: options.filters,
      })
    )
  )

  return results
}

// ============================================
// INDEXING
// ============================================

export async function saveObject(object: any, indexName?: string) {
  const index = getIndex(indexName)
  const result = await index.saveObject(object, { autoGenerateObjectIDIfNotExist: true })
  return result
}

export async function saveObjects(objects: any[], indexName?: string) {
  const index = getIndex(indexName)
  const result = await index.saveObjects(objects, { autoGenerateObjectIDIfNotExist: true })
  return result
}

export async function partialUpdateObject(objectID: string, updates: any, indexName?: string) {
  const index = getIndex(indexName)
  const result = await index.partialUpdateObject({
    objectID,
    ...updates,
  })
  return result
}

export async function deleteObject(objectID: string, indexName?: string) {
  const index = getIndex(indexName)
  const result = await index.deleteObject(objectID)
  return result
}

export async function deleteObjects(objectIDs: string[], indexName?: string) {
  const index = getIndex(indexName)
  const result = await index.deleteObjects(objectIDs)
  return result
}

export async function clearIndex(indexName?: string) {
  const index = getIndex(indexName)
  const result = await index.clearObjects()
  return result
}

// ============================================
// FACETED SEARCH
// ============================================

export async function searchWithFacets<T = any>(
  query: string,
  facets: string[],
  indexName?: string
) {
  const index = getIndex(indexName)

  const results = await index.search<T>(query, {
    facets,
  })

  return {
    hits: results.hits,
    facets: results.facets,
    nbHits: results.nbHits,
  }
}

// ============================================
// RECOMMENDATIONS
// ============================================

export async function getRecommendations<T = any>(
  objectID: string,
  maxRecommendations: number = 5,
  indexName?: string
) {
  const index = getIndex(indexName)

  // Get the object
  const object = await index.getObject<T>(objectID)

  // Search for similar objects (simplified recommendation)
  const results = await index.search<T>('', {
    similarQuery: objectID,
    hitsPerPage: maxRecommendations,
  })

  return results.hits
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export async function searchProducts(query: string, filters?: { category?: string; minPrice?: number; maxPrice?: number }) {
  let filterString = ''

  if (filters?.category) {
    filterString += `category:${filters.category}`
  }

  if (filters?.minPrice !== undefined) {
    filterString += ` AND price >= ${filters.minPrice}`
  }

  if (filters?.maxPrice !== undefined) {
    filterString += ` AND price <= ${filters.maxPrice}`
  }

  return search({
    query,
    filters: filterString.trim(),
  }, 'products')
}

export async function searchUsers(query: string) {
  return search({
    query,
    attributesToRetrieve: ['name', 'email', 'avatar', 'bio'],
  }, 'users')
}

export async function searchPosts(query: string, tags?: string[]) {
  return search({
    query,
    facetFilters: tags ? tags.map((tag) => `tags:${tag}`) : undefined,
  }, 'posts')
}

// ============================================
// EXAMPLE USAGE
// ============================================

/*
// Example 1: Simple Search
import { search } from '@/lib/integrations/algolia'

const results = await search({
  query: 'laptop',
  hitsPerPage: 20,
})

console.log('Found:', results.nbHits)
results.hits.forEach((hit) => console.log(hit))

// Example 2: Search with Filters
const filtered = await search({
  query: 'smartphone',
  filters: 'price < 500 AND category:electronics',
  hitsPerPage: 10,
})

// Example 3: Faceted Search
import { searchWithFacets } from '@/lib/integrations/algolia'

const faceted = await searchWithFacets('laptop', ['brand', 'price_range', 'rating'])
console.log('Facets:', faceted.facets)

// Example 4: Add Object to Index
import { saveObject } from '@/lib/integrations/algolia'

await saveObject({
  name: 'MacBook Pro',
  price: 1999,
  category: 'electronics',
  brand: 'Apple',
  rating: 4.8,
}, 'products')

// Example 5: Add Multiple Objects
import { saveObjects } from '@/lib/integrations/algolia'

await saveObjects([
  { name: 'Product 1', price: 100 },
  { name: 'Product 2', price: 200 },
], 'products')

// Example 6: Update Object
import { partialUpdateObject } from '@/lib/integrations/algolia'

await partialUpdateObject('product-123', {
  price: 899,
  stock: 50,
}, 'products')

// Example 7: Delete Object
import { deleteObject } from '@/lib/integrations/algolia'

await deleteObject('product-123', 'products')

// Example 8: Search Component (React)
'use client'

import { useState, useEffect } from 'react'
import { search } from '@/lib/integrations/algolia'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (query.length > 2) {
      search({ query, hitsPerPage: 10 }).then((res) => {
        setResults(res.hits)
      })
    }
  }, [query])

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {results.map((hit) => (
        <div key={hit.objectID}>{hit.name}</div>
      ))}
    </div>
  )
}

// Example 9: API Route for Search
import { search } from '@/lib/integrations/algolia'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''

  try {
    const results = await search({
      query,
      hitsPerPage: 20,
    })

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
*/
