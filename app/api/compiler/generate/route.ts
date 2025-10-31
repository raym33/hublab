import { NextRequest, NextResponse } from 'next/server'
import { compilerService } from '@/lib/capsule-compiler/compiler-service'
import { EXAMPLE_CAPSULES } from '@/lib/capsule-compiler/example-capsules'
import { getTemplate } from '@/lib/capsule-compiler/example-templates'
import { generateAppComposition } from '@/lib/ai/ai-service'
import type { CapsuleComposition } from '@/lib/capsule-compiler/types'

/**
 * POST /api/compiler/generate
 * Generate an app from natural language prompt or template
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, platform = 'web', template, composition: customComposition } = body

    console.log(`🚀 Compiler request - prompt: "${prompt}", template: ${template}, platform: ${platform}`)

    let composition: CapsuleComposition

    // Option 1: Use provided composition
    if (customComposition) {
      composition = customComposition
      console.log(`✅ Using custom composition: ${composition.name}`)
    }
    // Option 2: Use template
    else if (template) {
      const templateComposition = getTemplate(template)
      if (!templateComposition) {
        return NextResponse.json(
          { error: `Template not found: ${template}` },
          { status: 400 }
        )
      }
      composition = templateComposition as any
      // Override platform if needed
      if (platform !== 'web') {
        (composition as any).platform = platform
      }
      console.log(`✅ Using template: ${composition.name}`)
    }
    // Option 3: Generate from prompt using AI
    else if (prompt) {
      console.log(`🤖 Generating composition with AI...`)
      const aiComposition = await generateAppComposition(prompt, platform)

      if (aiComposition) {
        composition = aiComposition
        console.log(`✅ AI generated composition: ${composition.name}`)
      } else {
        // Fallback to simple keyword-based generation
        console.log(`⚠️  AI generation failed, using fallback`)
        composition = generateSimpleComposition(prompt, platform)
        console.log(`✅ Fallback composition generated: ${composition.name}`)
      }
    }
    else {
      return NextResponse.json(
        { error: 'Either prompt, template, or composition is required' },
        { status: 400 }
      )
    }

    // Compile the composition
    const capsuleCount = (composition as any).capsules?.length || 0
    console.log(`⚙️  Compiling composition with ${capsuleCount} capsules...`)
    const result = await compilerService.compile(composition)

    console.log(`✅ Compilation ${result.success ? 'successful' : 'failed'} in ${result.stats.duration}ms`)

    // Return result
    return NextResponse.json(result)

  } catch (error) {
    console.error('Compiler error:', error)

    return NextResponse.json(
      {
        success: false,
        platform: 'web',
        errors: [{
          type: 'runtime',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          stack: error instanceof Error ? error.stack : undefined
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

/**
 * Simple composition generator based on keywords
 * (Simplified version without real AI - can be enhanced with Claude API later)
 */
function generateSimpleComposition(prompt: string, platform: string): any {
  const lowerPrompt = prompt.toLowerCase()

  // Detect app type from keywords
  if (lowerPrompt.includes('todo') || lowerPrompt.includes('task')) {
    return {
      name: 'Todo App',
      version: '1.0.0',
      platform: platform as any,
      description: prompt,
      rootCapsule: 'root',
      capsules: [
        {
          id: 'root',
          capsuleId: 'app-container',
          inputs: { title: 'My Tasks' }
        },
        {
          id: 'input',
          capsuleId: 'input-text',
          inputs: { placeholder: 'Add a new task...' }
        },
        {
          id: 'button',
          capsuleId: 'button-primary',
          inputs: { label: 'Add' }
        },
        {
          id: 'list',
          capsuleId: 'list-view',
          inputs: { items: [] }
        }
      ],
      connections: []
    }
  }

  if (lowerPrompt.includes('dashboard') || lowerPrompt.includes('analytics')) {
    return {
      name: 'Analytics Dashboard',
      version: '1.0.0',
      platform: platform as any,
      description: prompt,
      rootCapsule: 'root',
      capsules: [
        {
          id: 'root',
          capsuleId: 'app-container',
          inputs: { title: 'Dashboard' }
        },
        {
          id: 'chart',
          capsuleId: 'chart-line',
          inputs: { data: [] }
        },
        {
          id: 'table',
          capsuleId: 'data-table',
          inputs: {
            data: [],
            columns: [
              { id: 'name', label: 'Name' },
              { id: 'value', label: 'Value' }
            ]
          }
        }
      ],
      connections: []
    }
  }

  // Default: Simple app with container and text
  return {
    name: 'Simple App',
    version: '1.0.0',
    platform: platform as any,
    description: prompt,
    rootCapsule: 'root',
    capsules: [
      {
        id: 'root',
        capsuleId: 'app-container',
        inputs: { title: 'My App' }
      },
      {
        id: 'text',
        capsuleId: 'text-display',
        inputs: { text: prompt }
      }
    ],
    connections: []
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
    availableTemplates: 6,
    status: 'operational',
    features: {
      realTimeCompilation: true,
      typeChecking: true,
      codeGeneration: true,
      templateSupport: true,
      customCompositions: true
    }
  })
}
