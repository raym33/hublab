import { NextRequest, NextResponse } from 'next/server'
import { UniversalCapsuleCompiler } from '@/lib/capsule-compiler/compiler'
import { UniversalCapsuleRegistry } from '@/lib/capsule-compiler/registry'
import { ClaudeAppGenerator } from '@/lib/capsule-compiler/ai-generator'
import { EXAMPLE_CAPSULES } from '@/lib/capsule-compiler/example-capsules'

/**
 * POST /api/compiler/generate
 * Generate an app from natural language prompt
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, platform = 'web' } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    console.log(`🚀 Generating app: "${prompt}" for platform: ${platform}`)

    // 1. Initialize registry with example capsules
    const registry = new UniversalCapsuleRegistry({
      aiModel: 'claude-sonnet-4.5'
    })

    // Load example capsules
    for (const capsule of EXAMPLE_CAPSULES) {
      await registry.publish(capsule)
    }

    console.log(`✅ Registry initialized with ${EXAMPLE_CAPSULES.length} capsules`)

    // 2. Generate app composition using AI
    const generator = new ClaudeAppGenerator(registry, 'claude-sonnet-4.5')

    const composition = await generator.generate({
      description: prompt,
      platform: platform as any,
      constraints: {
        maxCapsules: 20,
        performance: 'high',
        bundle: 'minimal'
      }
    })

    console.log(`✅ Composition generated: ${composition.name}`)

    // 3. Compile to target platform
    const compiler = new UniversalCapsuleCompiler(registry)

    const result = await compiler.compile(composition)

    console.log(`✅ Compilation ${result.success ? 'successful' : 'failed'}`)

    // 4. Return result
    return NextResponse.json(result)

  } catch (error) {
    console.error('Compiler error:', error)

    return NextResponse.json(
      {
        success: false,
        platform: 'web',
        errors: [{
          type: 'syntax',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }],
        stats: {
          duration: 0,
          capsulesProcessed: 0,
          linesOfCode: 0,
          dependencies: { capsules: 0, npm: 0 }
        }
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/compiler/generate
 * Get compiler info
 */
export async function GET() {
  return NextResponse.json({
    version: '1.0.0',
    supportedPlatforms: ['web', 'desktop', 'ios', 'android', 'ai-os'],
    availableCapsules: EXAMPLE_CAPSULES.length,
    status: 'operational'
  })
}
