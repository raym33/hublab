import { NextRequest, NextResponse } from 'next/server'
import { compilerService } from '@/lib/capsule-compiler/compiler-service'
import { getTemplate } from '@/lib/capsule-compiler/example-templates'
import type { CapsuleComposition } from '@/lib/capsule-compiler/types'

/**
 * POST /api/compiler/quick
 * Quick compilation for Netlify - uses templates only, no AI generation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { template = 'todo-app', platform = 'web', composition: customComposition } = body

    console.log(`⚡ Quick compiler - template: ${template}, platform: ${platform}`)

    let composition: CapsuleComposition

    // Option 1: Use provided composition
    if (customComposition) {
      composition = customComposition
      console.log(`✅ Using custom composition: ${composition.name}`)
    }
    // Option 2: Use template (fast, no AI)
    else {
      const templateComposition = getTemplate(template)
      if (!templateComposition) {
        // Use default template if not found
        const defaultTemplate = getTemplate('todo-app')
        composition = defaultTemplate as any
        console.log(`⚠️ Template not found, using default: todo-app`)
      } else {
        composition = templateComposition as any
      }

      // Override platform if needed
      if (platform !== 'web') {
        (composition as any).platform = platform
      }
      console.log(`✅ Using template: ${composition.name}`)
    }

    // Generate the app code
    const result = await compilerService.compile(composition)

    // Return the result
    return NextResponse.json({
      success: true,
      composition,
      result
    })

  } catch (error: any) {
    console.error('❌ Quick compilation error:', error)

    // Return a simple error response
    return NextResponse.json(
      {
        error: 'Compilation failed. Please try with a simpler template.',
        details: error.message
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/compiler/quick
 * Get available templates for quick compilation
 */
export async function GET() {
  const templates = [
    { id: 'todo-app', name: 'Todo App', description: 'Task management with categories' },
    { id: 'landing-page', name: 'Landing Page', description: 'Marketing landing page' },
    { id: 'dashboard', name: 'Dashboard', description: 'Analytics dashboard' },
    { id: 'portfolio', name: 'Portfolio', description: 'Personal portfolio site' },
    { id: 'blog', name: 'Blog', description: 'Blog with markdown support' },
    { id: 'ecommerce', name: 'E-commerce', description: 'Product catalog and cart' }
  ]

  return NextResponse.json({ templates })
}