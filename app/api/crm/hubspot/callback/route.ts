/**
 * HubLab Ambient Agent CRM - HubSpot OAuth Callback
 * Version: 1.0.0
 *
 * Handles the OAuth callback from HubSpot
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { HubSpotClient } from '@/lib/crm/hubspot-client'
import { createCRMConnection } from '@/lib/crm-database'
import { encrypt } from '@/lib/crypto'

// Mark route as dynamic since it uses searchParams
export const dynamic = 'force-dynamic'

/**
 * GET /api/crm/hubspot/callback
 * Receives authorization code from HubSpot and exchanges it for tokens
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Check for OAuth errors
    if (error) {
      const errorDescription = searchParams.get('error_description') || error
      console.error('HubSpot OAuth error:', errorDescription)

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/crm/setup?error=${encodeURIComponent(errorDescription)}`
      )
    }

    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/crm/setup?error=invalid_callback_parameters`
      )
    }

    // Extract user ID from state
    const [userId] = state.split(':')

    if (!userId) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/crm/setup?error=invalid_state_parameter`
      )
    }

    // Exchange authorization code for access token
    let tokenResponse
    try {
      tokenResponse = await HubSpotClient.exchangeCodeForToken(code)
    } catch (error) {
      console.error('Failed to exchange code for token:', error)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/crm/setup?error=token_exchange_failed`
      )
    }

    const { access_token, refresh_token, expires_in } = tokenResponse

    // Test the connection
    const hubspotClient = new HubSpotClient({ accessToken: access_token })
    const isConnected = await hubspotClient.testConnection()

    if (!isConnected) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/crm/setup?error=connection_test_failed`
      )
    }

    // Store the connection in database with encrypted tokens
    // SECURITY FIX: Encrypt OAuth tokens before storing
    try {
      const encryptedAccessToken = await encrypt(access_token)
      const encryptedRefreshToken = refresh_token ? await encrypt(refresh_token) : null

      await createCRMConnection({
        user_id: userId,
        crm_type: 'hubspot',
        oauth_token: encryptedAccessToken,  // ✅ Encrypted
        refresh_token: encryptedRefreshToken,  // ✅ Encrypted
        field_mappings: {
          // Default field mappings for HubSpot
          'contact.email': 'properties.email',
          'contact.firstname': 'properties.firstname',
          'contact.lastname': 'properties.lastname',
          'contact.phone': 'properties.phone',
          'deal.dealname': 'properties.dealname',
          'deal.amount': 'properties.amount',
          'deal.dealstage': 'properties.dealstage',
          'deal.closedate': 'properties.closedate',
        },
      })

      // Redirect to setup page with success message
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/crm/setup?success=hubspot_connected`
      )
    } catch (error) {
      console.error('Failed to save CRM connection:', error)

      // If connection already exists, this is likely an update
      if (error instanceof Error && error.message.includes('duplicate')) {
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}/crm/setup?success=hubspot_updated`
        )
      }

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/crm/setup?error=failed_to_save_connection`
      )
    }
  } catch (error) {
    console.error('Unexpected error in HubSpot OAuth callback:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/crm/setup?error=unexpected_error`
    )
  }
}
