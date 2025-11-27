import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { searchCapsules, loadCapsuleCodes } from '@/lib/capsule-loader'
import { searchCache, getCacheKey } from '@/lib/api-cache'
import { standardLimiter, getClientIdentifier, rateLimitResponse } from '@/lib/rate-limiter'
import { logger, getRequestContext } from '@/lib/logger'

/**
 * Optimized Capsule Search API
 *
 * Features:
 * - Lazy loading system for 89% smaller bundle
 * - LRU cache with 5-minute TTL
 * - Rate limiting: 60 requests/minute per IP
 * - Input validation with Zod
 * - Searches metadata only (fast)
 * - Loads code on-demand (when includeCode=true)
 *
 * GET /api/capsules/search?q=dashboard&category=Analytics&limit=20&includeCode=true
 */

const searchParamsSchema = z.object({
  q: z.string().max(200).default(''),
  category: z.string().max(100).optional(),
  tags: z.string().max(500).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  includeCode: z.enum(['true', 'false']).default('false'),
})

export async function GET(request: NextRequest) {
  const requestContext = getRequestContext(request)
  const { searchParams } = new URL(request.url)

  // Rate limiting (async for distributed Redis support)
  const clientId = getClientIdentifier(request)
  const rateLimitStatus = await standardLimiter.getStatus(clientId)

  const isAllowed = await standardLimiter.allowRequest(clientId)
  if (!isAllowed) {
    logger.warn('Rate limit exceeded', { ...requestContext, clientId })
    return rateLimitResponse(rateLimitStatus.resetIn)
  }

  try {

    // Validate and parse search params
    const parsed = searchParamsSchema.safeParse({
      q: searchParams.get('q'),
      category: searchParams.get('category'),
      tags: searchParams.get('tags'),
      limit: searchParams.get('limit'),
      includeCode: searchParams.get('includeCode'),
    })

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid parameters',
          details: parsed.error.issues.map(e => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      )
    }

    const { q: query, category, tags: tagsParam, limit, includeCode: includeCodeStr } = parsed.data
    const tags = tagsParam ? tagsParam.split(',').map(t => t.trim()).filter(Boolean) : undefined
    const includeCode = includeCodeStr === 'true'

    // Generate cache key
    const cacheKey = getCacheKey('search', { query, category, tags, limit, includeCode })

    // Check cache
    const cached = searchCache.get(cacheKey)
    if (cached) {
      return NextResponse.json({
        ...(cached as object),
        cached: true,
        rateLimit: {
          remaining: rateLimitStatus.remaining,
          resetIn: rateLimitStatus.resetIn,
        },
      })
    }

    const startTime = performance.now()

    // Search metadata (fast - no code loaded)
    const results = searchCapsules(query, {
      category,
      tags,
      limit,
    })

    let capsulesWithCode = results

    // Load code if requested
    if (includeCode && results.length > 0) {
      const ids = results.map((r) => r.id)
      const codesMap = await loadCapsuleCodes(ids)

      capsulesWithCode = results.map((metadata) => {
        const fullCapsule = codesMap.get(metadata.id)
        return fullCapsule || metadata
      })
    }

    const elapsed = performance.now() - startTime

    const response = {
      query,
      filters: {
        category,
        tags,
        limit,
      },
      total: results.length,
      results: capsulesWithCode,
      includeCode,
      cached: false,
      elapsed_ms: parseFloat(elapsed.toFixed(3)),
      performance: {
        searchMode: includeCode ? 'metadata+code' : 'metadata-only',
        bundleSize: includeCode ? 'dynamic (~2.5MB + loaded batches)' : 'static (~2.5MB)',
      },
      rateLimit: {
        remaining: rateLimitStatus.remaining,
        resetIn: rateLimitStatus.resetIn,
      },
    }

    // Cache the response
    searchCache.set(cacheKey, response)

    // Log successful search
    logger.performance('capsule_search', elapsed, {
      ...requestContext,
      query,
      resultsCount: results.length,
      cached: false,
    })

    return NextResponse.json(response)
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error')

    logger.apiError('GET', '/api/capsules/search', err, {
      ...requestContext,
      query: searchParams.get('q'),
    })

    return NextResponse.json(
      {
        error: 'Search failed',
        details: err.message,
        requestId: requestContext.requestId,
      },
      { status: 500 }
    )
  }
}
