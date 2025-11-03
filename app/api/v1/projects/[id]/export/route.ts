// ============================================
// /api/v1/projects/[id]/export
// Export project to various formats
// ============================================

import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { ExportFormat, ExportRequest, Project } from '@/types/api'
import { generateExport } from '@/lib/api/code-generator'
import {
  withAPIProtection,
  successResponse,
  errorResponse,
  handleCORSPreflight,
  addCORSHeaders,
} from '@/lib/api/middleware'
import type { APIContext } from '@/lib/api/middleware'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ============================================
// VALIDATION
// ============================================

function validateExportRequest(data: any): {
  valid: boolean
  errors?: string[]
} {
  const errors: string[] = []

  const validFormats: ExportFormat[] = ['nextjs', 'react', 'html', 'vue']

  if (!data.format || !validFormats.includes(data.format)) {
    errors.push(`format must be one of: ${validFormats.join(', ')}`)
  }

  if (data.options) {
    if (typeof data.options !== 'object') {
      errors.push('options must be an object')
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

// ============================================
// EXPORT PROJECT HANDLER
// ============================================

async function exportProjectHandler(
  request: NextRequest,
  context: APIContext & { params: { id: string } }
) {
  try {
    const { id: projectId } = context.params

    // Get project
    const { data: projectData, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', context.userId)
      .single()

    if (fetchError || !projectData) {
      return errorResponse('NOT_FOUND', 'Project not found', undefined, 404)
    }

    // Parse request body
    let body: ExportRequest
    try {
      body = await request.json()
    } catch (error) {
      return errorResponse('VALIDATION_ERROR', 'Invalid JSON body', String(error))
    }

    const validation = validateExportRequest(body)
    if (!validation.valid) {
      return errorResponse('VALIDATION_ERROR', 'Validation failed', validation.errors)
    }

    // Transform to Project type
    const project: Project = {
      id: projectData.id,
      userId: projectData.user_id,
      name: projectData.name,
      description: projectData.description,
      template: projectData.template,
      theme: projectData.theme,
      capsules: projectData.capsules || [],
      integrations: projectData.integrations || [],
      status: projectData.status,
      previewUrl: projectData.preview_url,
      deployUrl: projectData.deploy_url,
      createdAt: projectData.created_at,
      updatedAt: projectData.updated_at,
    }

    // Generate export files
    const files = generateExport(project, body.format)

    // Optionally add additional files based on options
    const options = body.options || {}

    if (options.includeEnvExample) {
      files.push({
        path: '.env.example',
        content: `# Environment variables
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
`,
      })
    }

    if (options.includeReadme && !files.some((f) => f.path === 'README.md')) {
      files.push({
        path: 'README.md',
        content: `# ${project.name}

${project.description || 'Generated with HubLab'}

Built with [HubLab](https://hublab.dev)
`,
      })
    }

    // Update project status
    await supabase
      .from('projects')
      .update({
        status: 'ready',
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .eq('user_id', context.userId)

    return addCORSHeaders(
      successResponse({
        success: true,
        files,
        format: body.format,
        message: `Project exported successfully to ${body.format}`,
      })
    )
  } catch (error) {
    console.error('Export project error:', error)
    return errorResponse('INTERNAL_ERROR', 'Internal server error', String(error), 500)
  }
}

// ============================================
// ROUTE HANDLERS
// ============================================

export async function OPTIONS() {
  return handleCORSPreflight()
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAPIProtection('exportsPerDay', async (req, ctx) =>
    exportProjectHandler(req, { ...ctx, params })
  )(request)
}
