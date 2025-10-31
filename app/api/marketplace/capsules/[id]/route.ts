import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { UpdateCapsuleInput } from '@/lib/types/marketplace'

/**
 * GET /api/marketplace/capsules/[id]
 * Get a specific capsule by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { id } = params

    // Try to get from marketplace view first (includes stats)
    const { data, error } = await supabase
      .from('marketplace_capsules')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      // If not in marketplace, try user_capsules (user's own draft)
      const { data: { user } } = await supabase.auth.getUser()

      const { data: userCapsule, error: userError } = await supabase
        .from('user_capsules')
        .select('*')
        .eq('id', id)
        .single()

      if (userError || !userCapsule) {
        return NextResponse.json(
          { error: 'Capsule not found' },
          { status: 404 }
        )
      }

      // Check if user owns it
      if (!user || userCapsule.user_id !== user.id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }

      return NextResponse.json({ capsule: userCapsule })
    }

    // Increment download count
    await supabase.rpc('increment_capsule_download', { capsule_uuid: id })

    return NextResponse.json({ capsule: data })

  } catch (error) {
    console.error('Capsule API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/marketplace/capsules/[id]
 * Update a capsule
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
    const body: UpdateCapsuleInput = await request.json()

    // Update capsule (RLS will ensure user owns it)
    const { data, error } = await supabase
      .from('user_capsules')
      .update(body)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error || !data) {
      console.error('Error updating capsule:', error)
      return NextResponse.json(
        { error: 'Failed to update capsule' },
        { status: 500 }
      )
    }

    return NextResponse.json({ capsule: data })

  } catch (error) {
    console.error('Capsule API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/marketplace/capsules/[id]
 * Delete a capsule
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

    // Delete capsule (RLS will ensure user owns it)
    const { error } = await supabase
      .from('user_capsules')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting capsule:', error)
      return NextResponse.json(
        { error: 'Failed to delete capsule' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Capsule API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
