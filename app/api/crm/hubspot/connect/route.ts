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

    // Store state in a secure cookie for verification (expires in 10 minutes)
    const response = NextResponse.redirect(
      `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}&state=${state}`
    )

    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // 'lax' needed for OAuth callback flow
      maxAge: 600, // 10 minutes
      path: '/api/crm/hubspot'
    })

    return response
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
