import { NextResponse } from 'next/server'
import { checkAIAvailability, getAIProvider } from '@/lib/ai/ai-service'

/**
 * GET /api/ai/status
 * Check AI service availability and provider info
 */
export async function GET() {
  try {
    const provider = getAIProvider()
    const status = await checkAIAvailability()

    return NextResponse.json({
      ...status,
      providerInfo: {
        name: provider.name,
        baseURL: provider.baseURL,
        models: provider.models,
        hasApiKey: !!provider.apiKey
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        available: false,
        provider: 'unknown',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
