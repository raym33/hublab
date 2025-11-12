import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { UpdateCompositionInput } from '@/lib/types/saved-compositions'

/**
 * GET /api/compositions/[id]
 * Get a specific composition by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { id } = params

    // Get the composition
    const { data, error } = await supabase
      .from('saved_compositions')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Composition not found' },
        { status: 404 }
      )
    }

    // Check if user has access (own composition or public)
    const { data: { user } } = await supabase.auth.getUser()

    if (!data.is_public && (!user || data.user_id !== user.id)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Increment view count if public
    if (data.is_public) {
      await supabase
        .from('saved_compositions')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', id)
    }

    return NextResponse.json({ composition: data })

  } catch (error) {
    console.error('Composition API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/compositions/[id]
 * Update a composition
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params
    const body: UpdateCompositionInput = await request.json()

    // Update composition
    const { data, error } = await supabase
      .from('saved_compositions')
      .update({
        name: body.name,
        description: body.description,
        is_public: body.is_public,
        tags: body.tags,
        composition: body.composition,
        compilation_result: body.compilation_result
      })
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user owns the composition
      .select()
      .single()

    if (error || !data) {
      console.error('Error updating composition:', error)
      return NextResponse.json(
        { error: 'Failed to update composition' },
        { status: 500 }
      )
    }

    return NextResponse.json({ composition: data })

  } catch (error) {
    console.error('Composition API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/compositions/[id]
 * Delete a composition
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params

    // Delete composition
    const { error } = await supabase
      .from('saved_compositions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user owns the composition

    if (error) {
      console.error('Error deleting composition:', error)
      return NextResponse.json(
        { error: 'Failed to delete composition' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Composition API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
