import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { compilerService } from '@/lib/capsule-compiler/compiler-service'
import { generateAppComposition } from '@/lib/ai/ai-service'
import type { CapsuleComposition } from '@/lib/capsule-compiler/types'

// In-memory store for compilation jobs (in production, use Redis or database)
const compilationJobs = new Map<string, {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: any
  error?: string
  createdAt: Date
  updatedAt: Date
}>()

// Clean up old jobs after 10 minutes
setInterval(() => {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
  for (const [id, job] of compilationJobs.entries()) {
    if (job.updatedAt < tenMinutesAgo) {
      compilationJobs.delete(id)
    }
  }
}, 60000) // Check every minute

/**
 * POST /api/compiler/async
 * Start an async compilation job
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, platform = 'web', template, composition: customComposition, selectedCapsules } = body

    // Create a new job
    const jobId = uuidv4()
    const job = {
      id: jobId,
      status: 'pending' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    compilationJobs.set(jobId, job)

    // Start compilation in background (non-blocking)
    processCompilation(jobId, { prompt, platform, template, customComposition, selectedCapsules })
      .catch(error => {
        console.error('Background compilation error:', error)
        const job = compilationJobs.get(jobId)
        if (job) {
          job.status = 'failed'
          job.error = error.message
          job.updatedAt = new Date()
        }
      })

    // Return job ID immediately
    return NextResponse.json({
      jobId,
      status: 'pending',
      message: 'Compilation started',
      pollUrl: `/api/compiler/status/${jobId}`
    })

  } catch (error) {
    console.error('Async compiler error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to start compilation' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/compiler/async
 * Get status of a compilation job
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const jobId = url.searchParams.get('jobId')

  if (!jobId) {
    return NextResponse.json(
      { error: 'Job ID is required' },
      { status: 400 }
    )
  }

  const job = compilationJobs.get(jobId)

  if (!job) {
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    )
  }

  // Return current job status
  return NextResponse.json({
    jobId: job.id,
    status: job.status,
    result: job.result,
    error: job.error,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt
  })
}

/**
 * Process compilation in background
 */
async function processCompilation(
  jobId: string,
  params: {
    prompt?: string
    platform?: string
    template?: string
    customComposition?: any
    selectedCapsules?: string[]
  }
) {
  const job = compilationJobs.get(jobId)
  if (!job) return

  // Update status to processing
  job.status = 'processing'
  job.updatedAt = new Date()

  try {
    const { prompt, platform = 'web', template, customComposition, selectedCapsules } = params
    let composition: CapsuleComposition

    console.log(`🚀 Async compilation ${jobId} - prompt: "${prompt}", template: ${template}, platform: ${platform}`)

    // Generate or get composition (same logic as sync version)
    if (customComposition) {
      composition = customComposition
    } else if (template) {
      const { getTemplate } = await import('@/lib/capsule-compiler/example-templates')
      const templateComposition = getTemplate(template)
      if (!templateComposition) {
        throw new Error(`Template not found: ${template}`)
      }
      composition = templateComposition as any
      if (platform !== 'web') {
        (composition as any).platform = platform
      }
    } else if (prompt) {
      const aiComposition = await generateAppComposition(prompt, platform, selectedCapsules)
      if (aiComposition) {
        composition = aiComposition
      } else {
        // Fallback to simple generation
        const { generateSimpleComposition } = await import('./utils')
        composition = generateSimpleComposition(prompt, platform)
      }
    } else {
      throw new Error('Either prompt, template, or composition is required')
    }

    // Compile the composition
    console.log(`⚙️  Compiling composition ${jobId} with ${(composition as any).capsules?.length || 0} capsules...`)
    const result = await compilerService.compile(composition)

    // Update job with result
    job.status = 'completed'
    job.result = result
    job.updatedAt = new Date()

    console.log(`✅ Async compilation ${jobId} ${result.success ? 'successful' : 'failed'}`)

  } catch (error) {
    console.error(`❌ Async compilation ${jobId} error:`, error)

    job.status = 'failed'
    job.error = error instanceof Error ? error.message : 'Unknown error occurred'
    job.updatedAt = new Date()
  }
}