/**
 * AI-Friendly Capsules API
 *
 * RESTful API endpoints for AI assistants to query and retrieve capsules
 * Optimized for Claude, GPT, and other AI code generation tools
 */

import { NextRequest, NextResponse } from 'next/server'
import { allCapsules, searchCapsules, getCapsulesByCategory, getAllCategories } from '@/lib/all-capsules'

export const runtime = 'edge'

/**
 * GET /api/ai/capsules
 *
 * Query parameters:
 * - q: Search query (searches name, description, tags)
 * - category: Filter by category
 * - tags: Comma-separated tags (AND logic)
 * - limit: Maximum results to return (default: 50)
 * - offset: Pagination offset (default: 0)
 * - format: Response format ('full' | 'compact' | 'minimal') default: 'full'
 *
 * Examples:
 * - /api/ai/capsules?q=button
 * - /api/ai/capsules?category=UI&limit=10
 * - /api/ai/capsules?tags=animated,interactive
 * - /api/ai/capsules?q=form&format=compact
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Extract query parameters
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const tagsParam = searchParams.get('tags') || ''
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const format = searchParams.get('format') || 'full'

    let results = allCapsules

    // Apply search query
    if (query) {
      results = searchCapsules(query)
    }

    // Apply category filter
    if (category && category !== 'All') {
      results = results.filter(c => c.category === category)
    }

    // Apply tags filter (AND logic)
    if (tagsParam) {
      const tags = tagsParam.split(',').map(t => t.trim().toLowerCase())
      results = results.filter(capsule =>
        tags.every(tag =>
          capsule.tags.some(t => t.toLowerCase().includes(tag))
        )
      )
    }

    // Calculate total before pagination
    const total = results.length

    // Apply pagination
    results = results.slice(offset, offset + limit)

    // Format response based on requested format
    const formattedResults = results.map(capsule => {
      if (format === 'minimal') {
        return {
          id: capsule.id,
          name: capsule.name,
          category: capsule.category,
          tags: capsule.tags
        }
      }

      if (format === 'compact') {
        return {
          id: capsule.id,
          name: capsule.name,
          description: capsule.description,
          category: capsule.category,
          tags: capsule.tags,
          hasCode: !!capsule.code,
          dependencies: capsule.dependencies || []
        }
      }

      // Full format (default)
      return capsule
    })

    // Return response with metadata
    return NextResponse.json({
      success: true,
      data: {
        capsules: formattedResults,
        metadata: {
          total,
          limit,
          offset,
          returned: formattedResults.length,
          hasMore: offset + limit < total,
          format
        },
        query: {
          search: query || null,
          category: category || null,
          tags: tagsParam ? tagsParam.split(',') : null
        }
      }
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({
      success: false,
      error: {
        message: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}
