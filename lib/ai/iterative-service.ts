/**
 * Iterative AI Service
 * Handles incremental improvements to existing code
 */

import { generateCompletion, type AIMessage } from './ai-service'

export interface IterationContext {
  currentCode: Record<string, string>
  previousPrompts: string[]
  platform: string
}

/**
 * Generate improved code based on user instruction
 */
export async function improveCode(
  instruction: string,
  context: IterationContext
): Promise<Record<string, string>> {
  const { currentCode, previousPrompts, platform } = context

  // Get the main component file
  const mainFile = currentCode['App.tsx'] || currentCode['index.tsx'] || currentCode['main.tsx']
  if (!mainFile) {
    throw new Error('No main component file found')
  }

  const systemPrompt = `You are an expert React developer helping to improve existing code.

IMPORTANT RULES:
1. Make MINIMAL changes - only what's needed for the requested improvement
2. Preserve existing functionality unless explicitly asked to change it
3. Maintain the same component structure
4. Keep the same styling approach (Tailwind CSS)
5. Return ONLY the improved code, no explanations
6. Ensure the code is valid React with TypeScript

Current context:
- Platform: ${platform}
- Previous changes: ${previousPrompts.length > 0 ? previousPrompts.join(', ') : 'None'}

The user will provide:
1. Current code
2. Improvement instruction

You should return the improved code that implements the requested change.`

  const userPrompt = `Current code:
\`\`\`tsx
${mainFile}
\`\`\`

Improvement requested: ${instruction}

Please provide the improved code:`

  const messages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]

  try {
    const completion = await generateCompletion(messages, {
      temperature: 0.3, // Lower temperature for more predictable code changes
      maxTokens: 3000
    })

    // Extract code from response
    const codeMatch = completion.match(/```(?:tsx|typescript|jsx|javascript)?\n([\s\S]*?)\n```/)
    const improvedCode = codeMatch ? codeMatch[1] : completion

    // Return updated code object
    const updatedCode = { ...currentCode }

    // Update the main file
    if (currentCode['App.tsx']) {
      updatedCode['App.tsx'] = improvedCode
    } else if (currentCode['index.tsx']) {
      updatedCode['index.tsx'] = improvedCode
    } else if (currentCode['main.tsx']) {
      updatedCode['main.tsx'] = improvedCode
    }

    return updatedCode
  } catch (error) {
    console.error('Error improving code:', error)
    throw error
  }
}

/**
 * Generate smart suggestions based on current code
 */
export async function generateSuggestions(
  currentCode: Record<string, string>,
  platform: string
): Promise<string[]> {
  const mainFile = currentCode['App.tsx'] || currentCode['index.tsx'] || currentCode['main.tsx']
  if (!mainFile) {
    return []
  }

  const systemPrompt = `You are an expert React developer analyzing code to suggest improvements.

Analyze the provided code and suggest 5 specific, actionable improvements.

Rules:
1. Suggestions should be specific and implementable
2. Focus on UX, accessibility, performance, and best practices
3. Each suggestion should be 1 sentence, starting with a verb
4. Return ONLY a JSON array of strings, no other text

Example output:
["Add loading skeleton while data fetches", "Implement error boundary for better error handling", "Add keyboard shortcuts for power users", "Improve mobile touch targets", "Add success toast notifications"]`

  const userPrompt = `Analyze this ${platform} app code:

\`\`\`tsx
${mainFile.slice(0, 2000)} // First 2000 chars for context
\`\`\`

Provide 5 improvement suggestions:`

  const messages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]

  try {
    const completion = await generateCompletion(messages, {
      temperature: 0.7,
      maxTokens: 500
    })

    // Extract JSON array
    const jsonMatch = completion.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return []
    }

    const suggestions = JSON.parse(jsonMatch[0])
    return Array.isArray(suggestions) ? suggestions.slice(0, 5) : []
  } catch (error) {
    console.error('Error generating suggestions:', error)
    return []
  }
}

/**
 * Explain what changed between two code versions
 */
export async function explainChanges(
  oldCode: string,
  newCode: string
): Promise<string> {
  const systemPrompt = `You are a helpful assistant explaining code changes.

Compare the old and new code and provide a brief, friendly explanation of what changed.

Rules:
1. Be concise (2-3 sentences max)
2. Focus on user-facing changes
3. Use simple, non-technical language when possible
4. Start with "I" (e.g., "I added...", "I changed...")`

  const userPrompt = `Old code:
\`\`\`tsx
${oldCode.slice(0, 1000)}
\`\`\`

New code:
\`\`\`tsx
${newCode.slice(0, 1000)}
\`\`\`

Explain the changes:`

  const messages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]

  try {
    const completion = await generateCompletion(messages, {
      temperature: 0.5,
      maxTokens: 200
    })

    return completion.trim()
  } catch (error) {
    console.error('Error explaining changes:', error)
    return 'I updated your code as requested.'
  }
}

/**
 * Validate that improved code is syntactically correct
 */
export function validateCode(code: string): { valid: boolean; error?: string } {
  try {
    // Basic validation: check for common syntax errors

    // Check for unclosed braces
    const openBraces = (code.match(/{/g) || []).length
    const closeBraces = (code.match(/}/g) || []).length
    if (openBraces !== closeBraces) {
      return {
        valid: false,
        error: 'Unmatched braces detected'
      }
    }

    // Check for unclosed parentheses
    const openParens = (code.match(/\(/g) || []).length
    const closeParens = (code.match(/\)/g) || []).length
    if (openParens !== closeParens) {
      return {
        valid: false,
        error: 'Unmatched parentheses detected'
      }
    }

    // Check for unclosed brackets
    const openBrackets = (code.match(/\[/g) || []).length
    const closeBrackets = (code.match(/\]/g) || []).length
    if (openBrackets !== closeBrackets) {
      return {
        valid: false,
        error: 'Unmatched brackets detected'
      }
    }

    // Check for export default
    if (!code.includes('export default')) {
      return {
        valid: false,
        error: 'Missing export default'
      }
    }

    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: 'Failed to validate code'
    }
  }
}
