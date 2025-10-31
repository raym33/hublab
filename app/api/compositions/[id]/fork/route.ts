import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

/**
 * POST /api/compositions/[id]/fork
 * Fork a composition
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

    // Get the original composition
    const { data: original, error: fetchError } = await supabase
      .from('saved_compositions')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !original) {
      return NextResponse.json(
        { error: 'Composition not found' },
        { status: 404 }
      )
    }

    // Check if composition is public or belongs to user
    if (!original.is_public && original.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Cannot fork private composition' },
        { status: 403 }
      )
    }

    // Create forked composition
    const { data: forked, error: createError } = await supabase
      .from('saved_compositions')
      .insert({
        user_id: user.id,
        name: `${original.name} (Fork)`,
        description: original.description,
        prompt: original.prompt,
        platform: original.platform,
        composition: original.composition,
        compilation_result: original.compilation_result,
        is_public: false, // Forks are private by default
        tags: original.tags
      })
      .select()
      .single()

    if (createError || !forked) {
      console.error('Error creating fork:', createError)
      return NextResponse.json(
        { error: 'Failed to create fork' },
        { status: 500 }
      )
    }

    // Record the fork relationship
    const { error: forkError } = await supabase
      .from('composition_forks')
      .insert({
        original_id: id,
        forked_id: forked.id,
        user_id: user.id
      })

    if (forkError) {
      console.error('Error recording fork:', forkError)
      // Don't fail the request, fork was created successfully
    }

    // Increment fork count on original
    await supabase
      .from('saved_compositions')
      .update({ fork_count: (original.fork_count || 0) + 1 })
      .eq('id', id)

    return NextResponse.json({ composition: forked }, { status: 201 })

  } catch (error) {
    console.error('Fork API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
