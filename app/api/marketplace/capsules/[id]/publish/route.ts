import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

/**
 * POST /api/marketplace/capsules/[id]/publish
 * Submit a capsule for review (publish to marketplace)
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

    // Get the capsule
    const { data: capsule, error: fetchError } = await supabase
      .from('user_capsules')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !capsule) {
      return NextResponse.json(
        { error: 'Capsule not found' },
        { status: 404 }
      )
    }

    // Validate that capsule is complete
    if (!capsule.platforms || Object.keys(capsule.platforms).length === 0) {
      return NextResponse.json(
        { error: 'Capsule must have at least one platform implementation' },
        { status: 400 }
      )
    }

    // Update status to pending_review
    const { data, error } = await supabase
      .from('user_capsules')
      .update({
        status: 'pending_review',
        review_status: 'pending',
        is_public: true,
        published_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error publishing capsule:', error)
      return NextResponse.json(
        { error: 'Failed to publish capsule' },
        { status: 500 }
      )
    }

    // TODO: Send notification to admins for review

    return NextResponse.json({
      capsule: data,
      message: 'Capsule submitted for review. You will be notified when it is approved.'
    })

  } catch (error) {
    console.error('Publish API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
