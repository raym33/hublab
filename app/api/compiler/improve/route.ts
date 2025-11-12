import { NextRequest, NextResponse } from 'next/server'
import { compilerService } from '@/lib/capsule-compiler/compiler-service'
import { improveCode, validateCode, type IterationContext } from '@/lib/ai/iterative-service'
import type { CompilationResult } from '@/lib/capsule-compiler/types'

/**
 * POST /api/compiler/improve
 * Improve existing code based on user instruction
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { instruction, currentCode, previousPrompts = [], platform = 'web' } = body

    if (!instruction || !currentCode) {
      return NextResponse.json(
        { error: 'Missing instruction or currentCode' },
        { status: 400 }
      )
    }

    console.log(`🔄 Improving code with instruction: "${instruction}"`)

    // Build iteration context
    const context: IterationContext = {
      currentCode,
      previousPrompts,
      platform
    }

    // Get improved code from AI
    const improvedCode = await improveCode(instruction, context)

    // Validate improved code
    const validation = validateCode(
      improvedCode['App.tsx'] || improvedCode['index.tsx'] || improvedCode['main.tsx'] || ''
    )

    if (!validation.valid) {
      console.error('❌ Code validation failed:', validation.error)
      return NextResponse.json(
        {
          success: false,
          error: `Generated code is invalid: ${validation.error}`,
          platform
        },
        { status: 400 }
      )
    }

    // Create a simple composition for recompilation
    // We'll recompile the improved code
    const composition = {
      name: 'Improved App',
      version: '1.0.0',
      platform,
      description: instruction,
      rootCapsule: 'root',
      capsules: [
        {
          id: 'root',
          capsuleId: 'app-container',
          inputs: {}
        }
      ],
      connections: []
    }

    // Compile the improved code
    console.log('⚙️  Recompiling improved code...')
    const result = await compilerService.compile(composition)

    // Replace the generated code with our improved code
    if (result.success && result.output?.code) {
      result.output.code = improvedCode
    }

    console.log(`✅ Code improvement ${result.success ? 'successful' : 'failed'}`)

    return NextResponse.json({
      ...result,
      improvedCode
    })

  } catch (error) {
    console.error('Improvement error:', error)

    return NextResponse.json(
      {
        success: false,
        platform: 'web',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        errors: [{
          type: 'runtime',
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }],
        stats: {
          duration: 0,
          capsulesProcessed: 0,
          linesOfCode: 0,
          dependencies: { capsules: 0, npm: 0 },
          bundleSize: { raw: 0, minified: 0, gzipped: 0 }
        }
      },
      { status: 500 }
    )
  }
}
