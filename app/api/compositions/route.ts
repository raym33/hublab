import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createCompositionSchema, validateRequest } from '@/lib/validation-schemas'

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
    // SECURITY: Use separate filter conditions instead of string interpolation
    if (includePublic) {
      // Get user's compositions and public ones
      const { data: userData, error: userError } = await supabase
        .from('saved_compositions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      const { data: publicData, error: publicError } = await supabase
        .from('saved_compositions')
        .select('*')
        .eq('is_public', true)
        .neq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (userError || publicError) {
        console.error('Error fetching compositions:', userError || publicError)
        return NextResponse.json(
          { error: 'Failed to fetch compositions' },
          { status: 500 }
        )
      }

      // Merge and sort results
      const allData = [...(userData || []), ...(publicData || [])]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

      // Apply additional filters if needed
      let filteredData = allData
      if (platform) {
        filteredData = filteredData.filter(c => c.platform === platform)
      }
      if (tag) {
        filteredData = filteredData.filter(c => c.tags?.includes(tag))
      }

      return NextResponse.json({ compositions: filteredData })
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

    // Parse JSON body with error handling
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    // Validate with Zod schema
    const validation = validateRequest(createCompositionSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    const validatedData = validation.data

    // Insert composition
    const { data, error } = await supabase
      .from('saved_compositions')
      .insert({
        user_id: user.id,
        name: validatedData.name,
        description: validatedData.description || null,
        prompt: validatedData.prompt || null,
        platform: validatedData.platform,
        composition: validatedData.composition,
        compilation_result: validatedData.compilation_result || null,
        is_public: validatedData.is_public,
        tags: validatedData.tags
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
