// ============================================
// POST /api/v1/projects
// Create a new HubLab project via API
// ============================================

import { NextRequest } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'
import type { CreateProjectRequest, CreateProjectResponse, ThemeConfig } from '@/types/api'
import { PRESET_THEMES } from '@/types/api'
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

function validateCreateProjectRequest(data: any): {
  valid: boolean
  errors?: string[]
} {
  const errors: string[] = []

  if (!data.name || typeof data.name !== 'string') {
    errors.push('name is required and must be a string')
  }

  if (data.name && data.name.length > 100) {
    errors.push('name must be less than 100 characters')
  }

  if (data.description && typeof data.description !== 'string') {
    errors.push('description must be a string')
  }

  if (data.description && data.description.length > 500) {
    errors.push('description must be less than 500 characters')
  }

  if (data.template) {
    const validTemplates = ['blank', 'dashboard', 'landing', 'ecommerce', 'admin', 'blog']
    if (!validTemplates.includes(data.template)) {
      errors.push(`template must be one of: ${validTemplates.join(', ')}`)
    }
  }

  if (data.theme) {
    if (typeof data.theme === 'string') {
      // Check if it's a valid preset theme
      if (!PRESET_THEMES[data.theme]) {
        errors.push(
          `theme preset "${data.theme}" not found. Available: ${Object.keys(PRESET_THEMES).join(', ')}`
        )
      }
    } else if (typeof data.theme === 'object') {
      // Validate custom theme object
      if (!data.theme.name) errors.push('theme.name is required')
      if (!data.theme.colors) errors.push('theme.colors is required')
      if (!data.theme.typography) errors.push('theme.typography is required')
      if (!data.theme.spacing) errors.push('theme.spacing is required')
      if (!data.theme.borderRadius) errors.push('theme.borderRadius is required')
    } else {
      errors.push('theme must be a string (preset name) or ThemeConfig object')
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

// ============================================
// GET TEMPLATE STRUCTURE
// ============================================

function getTemplateStructure(template?: string) {
  const templates = {
    blank: {
      capsules: [],
      integrations: [],
    },
    dashboard: {
      capsules: [
        {
          id: 'header-1',
          type: 'header',
          category: 'navigation' as const,
          props: {
            title: 'Dashboard',
            showLogo: true,
            showNav: true,
          },
        },
        {
          id: 'sidebar-1',
          type: 'sidebar',
          category: 'navigation' as const,
          props: {
            items: [
              { label: 'Overview', icon: 'home', href: '/' },
              { label: 'Analytics', icon: 'chart', href: '/analytics' },
              { label: 'Settings', icon: 'settings', href: '/settings' },
            ],
          },
        },
        {
          id: 'stats-1',
          type: 'stats-grid',
          category: 'data-display' as const,
          props: {
            columns: 4,
            stats: [
              { label: 'Total Users', value: '0', icon: 'users' },
              { label: 'Revenue', value: '$0', icon: 'dollar' },
              { label: 'Active Projects', value: '0', icon: 'folder' },
              { label: 'Tasks', value: '0', icon: 'check' },
            ],
          },
        },
      ],
      integrations: [{ type: 'supabase', config: {} }],
    },
    landing: {
      capsules: [
        {
          id: 'hero-1',
          type: 'hero',
          category: 'layout' as const,
          props: {
            title: 'Welcome to Your Product',
            subtitle: 'Build amazing things with our platform',
            ctaText: 'Get Started',
            ctaLink: '/signup',
          },
        },
        {
          id: 'features-1',
          type: 'feature-grid',
          category: 'layout' as const,
          props: {
            columns: 3,
            features: [
              { title: 'Fast', icon: 'zap', description: 'Lightning fast performance' },
              { title: 'Secure', icon: 'shield', description: 'Enterprise-grade security' },
              { title: 'Scalable', icon: 'trending-up', description: 'Grows with you' },
            ],
          },
        },
        {
          id: 'cta-1',
          type: 'cta-section',
          category: 'layout' as const,
          props: {
            title: 'Ready to get started?',
            ctaText: 'Sign Up Now',
            ctaLink: '/signup',
          },
        },
      ],
      integrations: [],
    },
    ecommerce: {
      capsules: [
        {
          id: 'header-1',
          type: 'header',
          category: 'navigation' as const,
          props: {
            title: 'My Store',
            showCart: true,
            showSearch: true,
          },
        },
        {
          id: 'product-grid-1',
          type: 'product-grid',
          category: 'ecommerce' as const,
          props: {
            columns: 4,
            showFilters: true,
          },
        },
      ],
      integrations: [
        { type: 'supabase', config: {} },
        { type: 'stripe', config: {} },
      ],
    },
    admin: {
      capsules: [
        {
          id: 'header-1',
          type: 'header',
          category: 'navigation' as const,
          props: {
            title: 'Admin Panel',
            showUserMenu: true,
          },
        },
        {
          id: 'sidebar-1',
          type: 'sidebar',
          category: 'navigation' as const,
          props: {
            items: [
              { label: 'Dashboard', icon: 'home', href: '/' },
              { label: 'Users', icon: 'users', href: '/users' },
              { label: 'Content', icon: 'file', href: '/content' },
              { label: 'Settings', icon: 'settings', href: '/settings' },
            ],
          },
        },
        {
          id: 'data-table-1',
          type: 'data-table',
          category: 'data-display' as const,
          props: {
            columns: [
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'status', label: 'Status' },
            ],
            showPagination: true,
            showSearch: true,
          },
        },
      ],
      integrations: [
        { type: 'supabase', config: {} },
        { type: 'nextauth', config: {} },
      ],
    },
    blog: {
      capsules: [
        {
          id: 'header-1',
          type: 'header',
          category: 'navigation' as const,
          props: {
            title: 'My Blog',
            showNav: true,
          },
        },
        {
          id: 'blog-grid-1',
          type: 'blog-grid',
          category: 'layout' as const,
          props: {
            columns: 3,
            showExcerpt: true,
            showAuthor: true,
            showDate: true,
          },
        },
      ],
      integrations: [{ type: 'supabase', config: {} }],
    },
  }

  return templates[template as keyof typeof templates] || templates.blank
}

// ============================================
// LIST PROJECTS HANDLER
// ============================================

async function listProjectsHandler(request: NextRequest, context: APIContext) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const offset = (page - 1) * limit
    const status = searchParams.get('status')
    const template = searchParams.get('template')

    // Build query
    let query = supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .eq('user_id', context.userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    if (template) {
      query = query.eq('template', template)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return errorResponse('INTERNAL_ERROR', 'Failed to fetch projects', error.message, 500)
    }

    // Transform to API response format
    const projects = (data || []).map((project) => ({
      id: project.id,
      userId: project.user_id,
      name: project.name,
      description: project.description,
      template: project.template,
      theme: project.theme,
      capsules: project.capsules,
      integrations: project.integrations,
      status: project.status,
      previewUrl: project.preview_url,
      deployUrl: project.deploy_url,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    }))

    const totalPages = count ? Math.ceil(count / limit) : 0

    return addCORSHeaders(
      successResponse({
        projects,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
        },
      })
    )
  } catch (error) {
    console.error('List projects error:', error)
    return errorResponse('INTERNAL_ERROR', 'Internal server error', String(error), 500)
  }
}

// ============================================
// CREATE PROJECT HANDLER
// ============================================

async function createProjectHandler(request: NextRequest, context: APIContext) {
  try {
    // Parse and validate request body
    let body: CreateProjectRequest
    try {
      body = await request.json()
    } catch (error) {
      return errorResponse('VALIDATION_ERROR', 'Invalid JSON body', String(error))
    }

    const validation = validateCreateProjectRequest(body)
    if (!validation.valid) {
      return errorResponse('VALIDATION_ERROR', 'Validation failed', validation.errors)
    }

    // Resolve theme
    let theme: ThemeConfig
    if (!body.theme) {
      theme = PRESET_THEMES['modern-blue']
    } else if (typeof body.theme === 'string') {
      theme = PRESET_THEMES[body.theme]
    } else {
      theme = body.theme
    }

    // Get template structure
    const templateStructure = getTemplateStructure(body.template)

    // Create project in database
    const projectData = {
      user_id: context.userId,
      name: body.name,
      description: body.description || null,
      template: body.template || 'blank',
      theme,
      capsules: templateStructure.capsules,
      integrations: templateStructure.integrations,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return errorResponse('INTERNAL_ERROR', 'Failed to create project', error.message, 500)
    }

    // Transform to API response format
    const project = {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      description: data.description,
      template: data.template,
      theme: data.theme,
      capsules: data.capsules,
      integrations: data.integrations,
      status: data.status,
      previewUrl: data.preview_url,
      deployUrl: data.deploy_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    const response: CreateProjectResponse = {
      success: true,
      project,
      message: 'Project created successfully',
    }

    return addCORSHeaders(successResponse(response))
  } catch (error) {
    console.error('Project creation error:', error)
    return errorResponse('INTERNAL_ERROR', 'Internal server error', String(error), 500)
  }
}

// ============================================
// ROUTE HANDLERS
// ============================================

export async function OPTIONS() {
  return handleCORSPreflight()
}

export async function GET(request: NextRequest) {
  return withAPIProtection('requestsPerMinute', listProjectsHandler)(request)
}

export async function POST(request: NextRequest) {
  return withAPIProtection('projectsPerHour', createProjectHandler)(request)
}
