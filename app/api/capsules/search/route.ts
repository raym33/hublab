import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { searchCapsules, loadCapsuleCodes } from '@/lib/capsule-loader'

/**
 * Optimized Capsule Search API
 *
 * Uses lazy loading system for 89% smaller bundle:
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
  try {
    const { searchParams } = new URL(request.url)

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
          details: parsed.error.errors
        },
        { status: 400 }
      )
    }

    const { q: query, category, tags: tagsParam, limit, includeCode: includeCodeStr } = parsed.data
    const tags = tagsParam ? tagsParam.split(',').map(t => t.trim()).filter(Boolean) : undefined
    const includeCode = includeCodeStr === 'true'

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

    return NextResponse.json({
      query,
      filters: {
        category,
        tags,
        limit,
      },
      total: results.length,
      results: capsulesWithCode,
      includeCode,
      elapsed_ms: parseFloat(elapsed.toFixed(3)),
      performance: {
        searchMode: includeCode ? 'metadata+code' : 'metadata-only',
        bundleSize: includeCode ? 'dynamic (~2.5MB + loaded batches)' : 'static (~2.5MB)',
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Capsule search error:', errorMessage)

    return NextResponse.json(
      {
        error: 'Search failed',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
