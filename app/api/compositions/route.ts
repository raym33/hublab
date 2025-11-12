import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { CreateCompositionInput } from '@/lib/types/saved-compositions'

/**
 * GET /api/compositions
 * Get all compositions for the authenticated user
 */
export async function GET(request: NextRequest) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const includePublic = searchParams.get('includePublic') === 'true'
    const platform = searchParams.get('platform')
    const tag = searchParams.get('tag')

    // Build query
    let query = supabase
      .from('saved_compositions')
      .select('*')
      .order('updated_at', { ascending: false })

    // Filter by user's compositions or public ones
    if (includePublic) {
      query = query.or(`user_id.eq.${user.id},is_public.eq.true`)
    } else {
      query = query.eq('user_id', user.id)
    }

    // Filter by platform if specified
    if (platform) {
      query = query.eq('platform', platform)
    }

    // Filter by tag if specified
    if (tag) {
      query = query.contains('tags', [tag])
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching compositions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch compositions' },
        { status: 500 }
      )
    }

    return NextResponse.json({ compositions: data })

  } catch (error) {
    console.error('Compositions API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/compositions
 * Create a new saved composition
 */
export async function POST(request: NextRequest) {
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

    const body: CreateCompositionInput = await request.json()

    // Validate required fields
    if (!body.name || !body.composition) {
      return NextResponse.json(
        { error: 'Name and composition are required' },
        { status: 400 }
      )
    }

    // Insert composition
    const { data, error } = await supabase
      .from('saved_compositions')
      .insert({
        user_id: user.id,
        name: body.name,
        description: body.description || null,
        prompt: body.prompt || null,
        platform: body.platform,
        composition: body.composition,
        compilation_result: body.compilation_result || null,
        is_public: body.is_public || false,
        tags: body.tags || []
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating composition:', error)
      return NextResponse.json(
        { error: 'Failed to create composition' },
        { status: 500 }
      )
    }

    return NextResponse.json({ composition: data }, { status: 201 })

  } catch (error) {
    console.error('Compositions API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
