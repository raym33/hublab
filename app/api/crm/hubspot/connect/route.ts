/**
 * HubLab Ambient Agent CRM - HubSpot OAuth Connect
 * Version: 1.0.0
 *
 * Initiates the OAuth flow with HubSpot
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * GET /api/crm/hubspot/connect
 * Redirects user to HubSpot OAuth authorization page
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get OAuth credentials from environment
    const clientId = process.env.HUBSPOT_CLIENT_ID
    const redirectUri = process.env.HUBSPOT_REDIRECT_URI ||
                       `${process.env.NEXT_PUBLIC_APP_URL}/api/crm/hubspot/callback`

    if (!clientId) {
      return NextResponse.json(
        { error: 'HubSpot OAuth not configured. Please set HUBSPOT_CLIENT_ID in environment variables.' },
        { status: 500 }
      )
    }

    // Define required scopes
    const scopes = [
      'crm.objects.contacts.read',
      'crm.objects.contacts.write',
      'crm.objects.companies.read',
      'crm.objects.companies.write',
      'crm.objects.deals.read',
      'crm.objects.deals.write',
      'crm.schemas.contacts.read',
      'crm.schemas.companies.read',
      'crm.schemas.deals.read',
    ]

    // Generate state parameter for CSRF protection
    const state = `${user.id}:${Date.now()}:${Math.random().toString(36).substring(7)}`

    // Store state in session/database for verification
    // TODO: In production, store this in Redis or database
    // For now, we'll verify the user_id in the callback

    // Build authorization URL
    const authUrl = new URL('https://app.hubspot.com/oauth/authorize')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('scope', scopes.join(' '))
    authUrl.searchParams.set('state', state)

    // Redirect to HubSpot
    return NextResponse.redirect(authUrl.toString())
  } catch (error) {
    console.error('Error initiating HubSpot OAuth:', error)
    return NextResponse.json(
      {
        error: 'Failed to initiate OAuth flow',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
