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
import { logger } from '@/lib/logger'

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
      logger.error('HubSpot OAuth error', { error: errorDescription })

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
      logger.error('Failed to exchange code for token', error)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/crm/setup?error=token_exchange_failed`
      )
    }

    const { access_token, refresh_token, expires_in } = tokenResponse

    logger.info('HubSpot: Token exchange successful', { userId })

    // Test the connection
    const hubspotClient = new HubSpotClient({ accessToken: access_token })
    const isConnected = await hubspotClient.testConnection()

    if (!isConnected) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/crm/setup?error=connection_test_failed`
      )
    }

    // Store the connection in database with encrypted tokens
    try {
      // Encrypt sensitive tokens before storing
      const encryptedAccessToken = encrypt(access_token)
      const encryptedRefreshToken = encrypt(refresh_token)

      await createCRMConnection({
        user_id: userId,
        crm_type: 'hubspot',
        oauth_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
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

      logger.info('HubSpot: Connection saved successfully', { userId })

      // Redirect to setup page with success message
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/crm/setup?success=hubspot_connected`
      )
    } catch (error) {
      logger.error('Failed to save CRM connection', error)

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
    logger.error('Unexpected error in HubSpot OAuth callback', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/crm/setup?error=unexpected_error`
    )
  }
}
