import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { capsuleCompiler } from '@/lib/capsules-v2/compiler'
import { getTemplate } from '@/lib/capsules-v2/templates'
import { getAllCapsulesExtended } from '@/lib/capsules-v2/definitions-extended'
import type { AppComposition } from '@/lib/capsules-v2/types'
import { withCsrfProtection } from '@/lib/csrf'

// ✅ FIXED: Added comprehensive Zod validation schema
const capsuleInstanceSchema = z.object({
  capsuleId: z.string().min(1, 'Capsule ID is required'),
  instanceId: z.string().min(1, 'Instance ID is required'),
  props: z.record(z.string(), z.any()).optional().default({})
})

const appCompositionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().optional().default(''),
  capsules: z.array(capsuleInstanceSchema).min(1, 'At least one capsule is required'),
  layout: z.enum(['single', 'grid', 'flex', 'custom']).default('single'),
  customLayout: z.string().optional()
})

const compilerRequestSchema = z.object({
  template: z.string().optional(),
  composition: appCompositionSchema.optional()
}).refine(
  data => data.template || data.composition,
  {
    message: 'Either template or composition is required',
    path: ['template']
  }
)

/**
 * POST /api/compiler/v2
 * Compilador V2 - Simple y funcional con validación robusta
 * SECURITY: Protected with CSRF
 */
export const POST = withCsrfProtection(async (request: NextRequest) => {
  try {
    const body = await request.json()

    // ✅ FIXED: Validate request body with Zod
    const validation = compilerRequestSchema.safeParse(body)

    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: `${firstError.path.join('.')}: ${firstError.message}`,
          details: validation.error.issues
        },
        { status: 400 }
      )
    }

    const { template, composition } = validation.data

    console.log('🚀 Compiler V2 - Starting compilation...')

    let appComposition: AppComposition

    // Opción 1: Usar un template predefinido
    if (template) {
      const templateData = getTemplate(template)
      if (!templateData) {
        return NextResponse.json(
          { error: `Template not found: ${template}` },
          { status: 404 }
        )
      }
      appComposition = templateData
      console.log(`✅ Using template: ${template}`)
    }
    // Opción 2: Usar una composición personalizada
    else if (composition) {
      appComposition = composition
      console.log(`✅ Using custom composition: ${composition.name}`)
    }
    else {
      return NextResponse.json(
        { error: 'Either template or composition is required' },
        { status: 400 }
      )
    }

    // Compilar la aplicación
    console.log('⚙️  Compiling...')
    const result = capsuleCompiler.compile(appComposition)

    if (!result.success) {
      console.error('❌ Compilation failed:', result.error)
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    console.log('✅ Compilation successful!')

    return NextResponse.json({
      success: true,
      composition: appComposition,
      result: {
        code: result.code,
        html: result.html,
        dependencies: result.dependencies
      }
    })

  } catch (error: any) {
    console.error('❌ Compiler V2 error:', error)

    // ✅ FIXED: Don't expose error details in production
    return NextResponse.json(
      {
        error: 'Compilation failed',
        ...(process.env.NODE_ENV === 'development' && {
          details: error.message
        })
      },
      { status: 500 }
    )
  }
})

/**
 * GET /api/compiler/v2
 * Get available templates and capsules
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') // 'templates' or 'capsules'

  if (type === 'capsules') {
    const capsules = getAllCapsulesExtended()
    return NextResponse.json({
      capsules: capsules.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        category: c.category,
        props: c.props
      })),
      total: capsules.length
    })
  }

  // Default: return templates
  const templates = [
    { id: 'todo-app', name: 'Todo App', description: 'Simple todo list application' },
    { id: 'calculator', name: 'Calculator', description: 'Calculator with counters' },
    { id: 'contact-form', name: 'Contact Form', description: 'Professional contact form' },
    { id: 'dashboard', name: 'Dashboard', description: 'Dashboard with cards and stats' },
    { id: 'timer-app', name: 'Timer App', description: 'Productivity timer and counter' },
    { id: 'tabs-demo', name: 'Tabs Demo', description: 'Multi-tab interface' },
    { id: 'ui-components', name: 'UI Components', description: 'Component showcase' },
    { id: 'landing-page', name: 'Landing Page', description: 'Simple landing page' }
  ]

  return NextResponse.json({ templates })
}
