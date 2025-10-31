/**
 * AI Service - Supports multiple AI providers
 * Default: Groq (free tier: 14,400 requests/day)
 * Fallback: OpenAI, Together AI, or local models
 */

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AICompletionOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface AIProvider {
  name: string
  baseURL: string
  apiKey: string
  models: {
    fast: string      // For quick responses
    balanced: string  // Balance speed/quality
    powerful: string  // Best quality
  }
}

/**
 * Get AI provider configuration from environment
 */
export function getAIProvider(): AIProvider {
  // Check for Groq (recommended free option)
  if (process.env.GROQ_API_KEY) {
    return {
      name: 'groq',
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY,
      models: {
        fast: 'llama-3.1-8b-instant',       // Ultra fast
        balanced: 'llama-3.1-70b-versatile', // Best for most tasks
        powerful: 'llama-3.1-70b-versatile'  // Same as balanced
      }
    }
  }

  // Check for Together AI
  if (process.env.TOGETHER_API_KEY) {
    return {
      name: 'together',
      baseURL: 'https://api.together.xyz/v1',
      apiKey: process.env.TOGETHER_API_KEY,
      models: {
        fast: 'meta-llama/Llama-3-8b-chat-hf',
        balanced: 'meta-llama/Llama-3-70b-chat-hf',
        powerful: 'meta-llama/Llama-3-70b-chat-hf'
      }
    }
  }

  // Check for local Ollama
  if (process.env.OPENAI_API_BASE?.includes('localhost') ||
      process.env.OPENAI_API_BASE?.includes('11434')) {
    return {
      name: 'ollama',
      baseURL: process.env.OPENAI_API_BASE || 'http://localhost:11434/v1',
      apiKey: 'ollama', // Ollama doesn't need API key
      models: {
        fast: 'llama3.1:8b',
        balanced: 'llama3.1:70b',
        powerful: 'llama3.1:70b'
      }
    }
  }

  // Default to OpenAI
  return {
    name: 'openai',
    baseURL: process.env.OPENAI_API_BASE || 'https://api.openai.com/v1',
    apiKey: process.env.OPENAI_API_KEY || '',
    models: {
      fast: 'gpt-3.5-turbo',
      balanced: 'gpt-4-turbo-preview',
      powerful: 'gpt-4'
    }
  }
}

/**
 * Generate completion using configured AI provider
 */
export async function generateCompletion(
  messages: AIMessage[],
  options: AICompletionOptions = {}
): Promise<string> {
  const provider = getAIProvider()

  if (!provider.apiKey) {
    throw new Error(`No API key configured for ${provider.name}`)
  }

  const model = options.model || provider.models.balanced
  const temperature = options.temperature ?? 0.7
  const maxTokens = options.maxTokens ?? 2000

  console.log(`🤖 Using ${provider.name} (${model}) for AI generation`)

  try {
    const response = await fetch(`${provider.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: false,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`AI provider error (${response.status}): ${error}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('No content in AI response')
    }

    return content
  } catch (error) {
    console.error(`❌ Error with ${provider.name}:`, error)
    throw error
  }
}

/**
 * Generate app composition from natural language prompt
 */
export async function generateAppComposition(prompt: string, platform: string) {
  const systemPrompt = `You are an expert app architecture assistant. Given a user's app description, analyze it and suggest a composition of capsules (reusable components) to build the app.

Available capsule categories:
- UI: app-container, button-primary, input-text, card-display, modal-dialog, navigation-bar, list-view, data-table, chart-line, form-builder
- Auth: auth-login, auth-signup, auth-oauth-google, auth-session
- Database: database-supabase, database-localstorage, database-postgres
- State: state-context, state-redux, state-zustand
- API: api-rest-client, api-graphql-client, api-fetch
- Media: media-image-upload, media-video-player, media-file-storage
- AI: ai-chat-interface, ai-completion, ai-embeddings

Respond ONLY with a JSON object in this exact format:
{
  "name": "App Name",
  "description": "Brief description",
  "capsules": [
    {
      "id": "unique-id",
      "capsuleId": "capsule-type",
      "inputs": { "key": "value" }
    }
  ]
}

DO NOT include any explanations or markdown, ONLY the JSON object.`

  const userPrompt = `Create an app composition for: "${prompt}"
Platform: ${platform}

Focus on the core functionality described. Keep it simple and practical.`

  const messages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]

  try {
    const completion = await generateCompletion(messages, {
      temperature: 0.7,
      maxTokens: 1500
    })

    // Extract JSON from response (in case AI adds markdown)
    const jsonMatch = completion.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response')
    }

    const compositionData = JSON.parse(jsonMatch[0])

    // Add required fields
    return {
      ...compositionData,
      version: '1.0.0',
      platform,
      rootCapsule: compositionData.capsules?.[0]?.id || 'root',
      connections: []
    }
  } catch (error) {
    console.error('Error generating composition:', error)
    // Fallback to simple keyword-based generation
    return null
  }
}

/**
 * Check if AI service is available
 */
export async function checkAIAvailability(): Promise<{
  available: boolean
  provider: string
  error?: string
}> {
  try {
    const provider = getAIProvider()

    if (!provider.apiKey) {
      return {
        available: false,
        provider: provider.name,
        error: 'No API key configured'
      }
    }

    // Try a simple test request
    await generateCompletion([
      { role: 'user', content: 'Say "OK" if you can hear me.' }
    ], {
      maxTokens: 10
    })

    return {
      available: true,
      provider: provider.name
    }
  } catch (error) {
    return {
      available: false,
      provider: 'unknown',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
