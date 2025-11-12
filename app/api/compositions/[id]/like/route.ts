import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

/**
 * POST /api/compositions/[id]/like
 * Like a composition
 */
export async function POST(
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

    // Check if composition exists and is public
    const { data: composition, error: compError } = await supabase
      .from('saved_compositions')
      .select('id, is_public')
      .eq('id', id)
      .single()

    if (compError || !composition || !composition.is_public) {
      return NextResponse.json(
        { error: 'Composition not found or not public' },
        { status: 404 }
      )
    }

    // Insert like (will fail if already liked due to unique constraint)
    const { error } = await supabase
      .from('composition_likes')
      .insert({
        composition_id: id,
        user_id: user.id
      })

    if (error) {
      // Check if it's a unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Already liked' },
          { status: 409 }
        )
      }
      console.error('Error liking composition:', error)
      return NextResponse.json(
        { error: 'Failed to like composition' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Like API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/compositions/[id]/like
 * Unlike a composition
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

    // Delete like
    const { error } = await supabase
      .from('composition_likes')
      .delete()
      .eq('composition_id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error unliking composition:', error)
      return NextResponse.json(
        { error: 'Failed to unlike composition' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Unlike API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
