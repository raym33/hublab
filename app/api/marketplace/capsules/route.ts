import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { CreateCapsuleInput, CapsuleFilters } from '@/lib/types/marketplace'
import { withCsrfProtection } from '@/lib/csrf'

/**
 * GET /api/marketplace/capsules
 * Browse marketplace capsules with filters
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)

    // Parse filters
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const complexity = searchParams.get('complexity')
    const tags = searchParams.get('tags')?.split(',').filter(Boolean)
    const search = searchParams.get('search')
    const author = searchParams.get('author')
    const featured = searchParams.get('featured') === 'true'
    const sortBy = searchParams.get('sortBy') || 'recent'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = supabase
      .from('marketplace_capsules')
      .select('*')
      .range(offset, offset + limit - 1)

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }

    if (type) {
      query = query.eq('type', type)
    }

    if (complexity) {
      query = query.eq('complexity', complexity)
    }

    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,ai_description.ilike.%${search}%,capsule_id.ilike.%${search}%`)
    }

    if (author) {
      query = query.eq('author', author)
    }

    if (featured) {
      query = query.eq('is_featured', true)
    }

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        query = query.order('stars_actual', { ascending: false })
        break
      case 'downloads':
        query = query.order('download_count', { ascending: false })
        break
      case 'rating':
        query = query.order('avg_rating', { ascending: false })
        break
      case 'recent':
      default:
        query = query.order('published_at', { ascending: false })
        break
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching marketplace capsules:', error)
      return NextResponse.json(
        { error: 'Failed to fetch capsules' },
        { status: 500 }
      )
    }

    return NextResponse.json({ capsules: data })

  } catch (error) {
    console.error('Marketplace API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/marketplace/capsules
 * Publish a new capsule to the marketplace
 * SECURITY: Protected with CSRF
 */
export const POST = withCsrfProtection(async (request: NextRequest) => {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: CreateCapsuleInput = await request.json()

    // Validate required fields
    if (!body.capsule_id || !body.name || !body.ai_description || !body.platforms) {
      return NextResponse.json(
        { error: 'Missing required fields: capsule_id, name, ai_description, platforms' },
        { status: 400 }
      )
    }

    // Check if capsule_id already exists
    const { data: existing } = await supabase
      .from('user_capsules')
      .select('id')
      .eq('capsule_id', body.capsule_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Capsule ID already exists. Please choose a unique ID.' },
        { status: 409 }
      )
    }

    // Insert capsule
    const { data, error } = await supabase
      .from('user_capsules')
      .insert({
        user_id: user.id,
        capsule_id: body.capsule_id,
        name: body.name,
        version: body.version || '1.0.0',
        author: body.author,
        category: body.category,
        type: body.type,
        tags: body.tags || [],
        ai_description: body.ai_description,
        usage_examples: body.usage_examples || [],
        related_capsules: body.related_capsules || [],
        complexity: body.complexity || 'simple',
        platforms: body.platforms,
        inputs: body.inputs || [],
        outputs: body.outputs || [],
        dependencies: body.dependencies || {},
        is_public: body.is_public || false,
        license: body.license || 'MIT',
        status: 'draft' // Always start as draft
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating capsule:', error)
      return NextResponse.json(
        { error: 'Failed to create capsule' },
        { status: 500 }
      )
    }

    return NextResponse.json({ capsule: data }, { status: 201 })

  } catch (error) {
    console.error('Marketplace API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})
