/**
 * AI-Friendly Metadata API
 *
 * Returns metadata about the capsule library for AI context
 */

import { NextRequest, NextResponse } from 'next/server'
import { allCapsules, getAllCategories, getCapsuleStats } from '@/lib/all-capsules'

export const runtime = 'edge'

/**
 * GET /api/ai/metadata
 *
 * Returns comprehensive metadata about HubLab capsules:
 * - Total capsules count
 * - Categories with counts
 * - All unique tags
 * - Quality metrics
 * - Popular capsules
 * - Usage statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Get all unique tags
    const allTags = new Set<string>()
    const tagDistribution: Record<string, number> = {}

    allCapsules.forEach((capsule: any) => {
      if (capsule.tags) {
        capsule.tags.forEach((tag: string) => {
          const lowerTag = tag.toLowerCase()
          allTags.add(lowerTag)
          tagDistribution[lowerTag] = (tagDistribution[lowerTag] || 0) + 1
        })
      }
    })

    // Get top 20 most used tags
    const topTags = Object.entries(tagDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([tag, count]) => ({ tag, count }))

    // Get capsule stats
    const stats = getCapsuleStats()

    // Quality metrics
    const qualityMetrics = {
      withGoodDescriptions: allCapsules.filter(c => c.description && c.description.length > 30).length,
      withTags: allCapsules.filter((c: any) => c.tags && c.tags.length >= 3).length,
      withUseClient: allCapsules.filter((c: any) => c.code && c.code.includes("'use client'")).length,
      withExport: allCapsules.filter((c: any) => c.code && c.code.includes('export default')).length,
      total: allCapsules.length
    }

    const aiScore = (
      (qualityMetrics.withGoodDescriptions +
        qualityMetrics.withTags +
        qualityMetrics.withUseClient +
        qualityMetrics.withExport) /
      (qualityMetrics.total * 4)
    ) * 100

    // Get categories
    const categories = getAllCategories()

    return NextResponse.json({
      success: true,
      data: {
        library: {
          name: 'HubLab',
          version: '2.0.0',
          description: 'AI-exclusive React component library with 290+ production-ready capsules. Optimized for ChatGPT, Claude, Grok, and all AI assistants with OpenAI-compatible SDKs. Features semantic search, function calling support, and real-time component discovery for AI code generation workflows.',
          totalCapsules: allCapsules.length,
          aiScore: Math.round(aiScore * 10) / 10,
          lastUpdated: '2025-11-03',
          supportedAI: ['ChatGPT', 'Claude', 'Grok', 'GitHub Copilot', 'Gemini', 'Perplexity'],
          capabilities: {
            functionCalling: true,
            semanticSearch: true,
            realtimeSearch: true,
            contextWindow: '128k tokens',
            openAPISpec: 'https://hublab.dev/openapi.json',
            pluginManifest: 'https://hublab.dev/.well-known/ai-plugin.json'
          }
        },
        statistics: {
          ...stats,
          averageTagsPerCapsule: Math.round((Array.from(allTags).length / allCapsules.length) * 10) / 10,
          totalTags: allTags.size,
          totalTagOccurrences: Object.values(tagDistribution).reduce((a, b) => a + b, 0)
        },
        categories: categories.filter(c => c !== 'All').map(category => ({
          name: category,
          count: stats.categoryDistribution[category] || 0
        })),
        tags: {
          total: allTags.size,
          topTags,
          all: Array.from(allTags).sort()
        },
        quality: {
          ...qualityMetrics,
          aiScore,
          percentages: {
            goodDescriptions: Math.round((qualityMetrics.withGoodDescriptions / qualityMetrics.total) * 1000) / 10,
            wellTagged: Math.round((qualityMetrics.withTags / qualityMetrics.total) * 1000) / 10,
            useClient: Math.round((qualityMetrics.withUseClient / qualityMetrics.total) * 1000) / 10,
            hasExport: Math.round((qualityMetrics.withExport / qualityMetrics.total) * 1000) / 10
          }
        },
        endpoints: {
          search: '/api/ai/capsules?q={query}',
          byCategory: '/api/ai/capsules?category={category}',
          byTags: '/api/ai/capsules?tags={tag1,tag2}',
          byId: '/api/ai/capsules/{id}',
          metadata: '/api/ai/metadata'
        },
        usage: {
          examples: [
            'GET /api/ai/capsules?q=button',
            'GET /api/ai/capsules?category=UI&limit=10',
            'GET /api/ai/capsules?tags=animated,interactive',
            'GET /api/ai/capsules/button-primary',
            'GET /api/ai/metadata'
          ],
          formats: ['full', 'compact', 'minimal'],
          pagination: {
            defaultLimit: 50,
            maxLimit: 100,
            offsetBased: true
          }
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
