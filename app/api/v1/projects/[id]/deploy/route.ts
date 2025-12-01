// ============================================
// /api/v1/projects/[id]/deploy
// Deploy project to hosting platforms
// ============================================

import { NextRequest } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import type { DeployPlatform, DeployRequest, Project } from '@/types/api'
import { generateExport } from '@/lib/api/code-generator'
import {
  withAPIProtection,
  successResponse,
  errorResponse,
  handleCORSPreflight,
  addCORSHeaders,
} from '@/lib/api/middleware'
import type { APIContext } from '@/lib/api/middleware'


// ============================================
// VALIDATION
// ============================================

function validateDeployRequest(data: any): {
  valid: boolean
  errors?: string[]
} {
  const errors: string[] = []

  const validPlatforms: DeployPlatform[] = ['vercel', 'netlify', 'cloudflare']

  if (!data.platform || !validPlatforms.includes(data.platform)) {
    errors.push(`platform must be one of: ${validPlatforms.join(', ')}`)
  }

  if (data.config) {
    if (typeof data.config !== 'object') {
      errors.push('config must be an object')
    }

    if (data.config.envVars && typeof data.config.envVars !== 'object') {
      errors.push('config.envVars must be an object')
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

// ============================================
// DEPLOY HELPERS
// ============================================

async function deployToVercel(
  project: Project,
  config?: DeployRequest['config']
): Promise<{ url: string; deploymentId: string }> {
  // In a real implementation, this would:
  // 1. Generate export files
  // 2. Create a GitHub repo (or use Vercel's file upload API)
  // 3. Deploy via Vercel API
  // 4. Return deployment URL

  // For now, return mock data
  const deploymentId = `vercel_${Date.now()}`
  const projectName = project.name.toLowerCase().replace(/\s+/g, '-')
  const url = config?.domain || `${projectName}.vercel.app`

  return {
    deploymentId,
    url: `https://${url}`,
  }
}

async function deployToNetlify(
  project: Project,
  config?: DeployRequest['config']
): Promise<{ url: string; deploymentId: string }> {
  // In a real implementation, this would:
  // 1. Generate export files
  // 2. Create a zip file
  // 3. Upload to Netlify via their API
  // 4. Return deployment URL

  const deploymentId = `netlify_${Date.now()}`
  const projectName = project.name.toLowerCase().replace(/\s+/g, '-')
  const url = config?.domain || `${projectName}.netlify.app`

  return {
    deploymentId,
    url: `https://${url}`,
  }
}

async function deployToCloudflare(
  project: Project,
  config?: DeployRequest['config']
): Promise<{ url: string; deploymentId: string }> {
  // In a real implementation, this would:
  // 1. Generate export files
  // 2. Use Cloudflare Pages API
  // 3. Deploy the project
  // 4. Return deployment URL

  const deploymentId = `cf_${Date.now()}`
  const projectName = project.name.toLowerCase().replace(/\s+/g, '-')
  const url = config?.domain || `${projectName}.pages.dev`

  return {
    deploymentId,
    url: `https://${url}`,
  }
}

// ============================================
// DEPLOY PROJECT HANDLER
// ============================================

async function deployProjectHandler(
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
    let body: DeployRequest
    try {
      body = await request.json()
    } catch (error) {
      return errorResponse('VALIDATION_ERROR', 'Invalid JSON body', String(error))
    }

    const validation = validateDeployRequest(body)
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

    // Update project status to building
    await supabase
      .from('projects')
      .update({
        status: 'building',
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .eq('user_id', context.userId)

    // Deploy based on platform
    let deployment: { url: string; deploymentId: string }

    switch (body.platform) {
      case 'vercel':
        deployment = await deployToVercel(project, body.config)
        break
      case 'netlify':
        deployment = await deployToNetlify(project, body.config)
        break
      case 'cloudflare':
        deployment = await deployToCloudflare(project, body.config)
        break
      default:
        return errorResponse('VALIDATION_ERROR', `Unsupported platform: ${body.platform}`)
    }

    // Update project with deployment URL
    await supabase
      .from('projects')
      .update({
        status: 'deployed',
        deploy_url: deployment.url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .eq('user_id', context.userId)

    return addCORSHeaders(
      successResponse({
        success: true,
        deploymentId: deployment.deploymentId,
        url: deployment.url,
        status: 'ready' as const,
        platform: body.platform,
        message: `Project deployed successfully to ${body.platform}`,
      })
    )
  } catch (error) {
    console.error('Deploy project error:', error)

    // Update project status to error
    try {
      await supabase
        .from('projects')
        .update({
          status: 'error',
          updated_at: new Date().toISOString(),
        })
        .eq('id', context.params.id)
        .eq('user_id', context.userId)
    } catch (updateError) {
      console.error('Failed to update project status:', updateError)
    }

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
  return withAPIProtection('deploysPerDay', async (req, ctx) =>
    deployProjectHandler(req, { ...ctx, params })
  )(request)
}
