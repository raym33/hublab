import { NextRequest, NextResponse } from 'next/server'
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
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || undefined
    const tagsParam = searchParams.get('tags')
    const tags = tagsParam ? tagsParam.split(',') : undefined
    const limit = parseInt(searchParams.get('limit') || '50')
    const includeCode = searchParams.get('includeCode') === 'true'

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
