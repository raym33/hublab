import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

/**
 * POST /api/marketplace/capsules/[id]/star
 * Star a capsule
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

    // Check if capsule exists and is public
    const { data: capsule, error: capsuleError } = await supabase
      .from('user_capsules')
      .select('id, is_public, status, star_count')
      .eq('id', id)
      .single()

    if (capsuleError || !capsule) {
      return NextResponse.json(
        { error: 'Capsule not found' },
        { status: 404 }
      )
    }

    if (!capsule.is_public || capsule.status !== 'approved') {
      return NextResponse.json(
        { error: 'Can only star approved public capsules' },
        { status: 403 }
      )
    }

    // Insert star
    const { error } = await supabase
      .from('capsule_stars')
      .insert({
        capsule_id: id,
        user_id: user.id
      })

    if (error) {
      // Check if already starred
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Already starred' },
          { status: 409 }
        )
      }
      console.error('Error starring capsule:', error)
      return NextResponse.json(
        { error: 'Failed to star capsule' },
        { status: 500 }
      )
    }

    // Increment star count
    await supabase
      .from('user_capsules')
      .update({ star_count: capsule.star_count + 1 })
      .eq('id', id)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Star API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/marketplace/capsules/[id]/star
 * Unstar a capsule
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

    // Delete star
    const { error } = await supabase
      .from('capsule_stars')
      .delete()
      .eq('capsule_id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error unstarring capsule:', error)
      return NextResponse.json(
        { error: 'Failed to unstar capsule' },
        { status: 500 }
      )
    }

    // Decrement star count
    const { data: capsule } = await supabase
      .from('user_capsules')
      .select('star_count')
      .eq('id', id)
      .single()

    if (capsule && capsule.star_count > 0) {
      await supabase
        .from('user_capsules')
        .update({ star_count: capsule.star_count - 1 })
        .eq('id', id)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Unstar API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
