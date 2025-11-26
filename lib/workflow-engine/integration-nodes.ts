/**
 * Integration Nodes - HTTP, Webhooks, Variables, Delays
 *
 * These nodes enable external integrations and workflow control.
 */

import { registerNodeExecutor } from './engine'

// ============================================
// NODE EXECUTORS
// ============================================

/**
 * Register all integration node executors
 */
export function registerIntegrationNodes(): void {
  /**
   * HTTP Request Node - Make HTTP calls to external APIs
   */
  registerNodeExecutor('http-request', async (node, inputs) => {
    const url = (inputs.url ?? node.inputs.url) as string
    const method = ((inputs.method ?? node.inputs.method) as string)?.toUpperCase() || 'GET'
    const headers = (inputs.headers ?? node.inputs.headers ?? {}) as Record<string, string>
    const body = inputs.body ?? node.inputs.body

    if (!url) {
      return {
        success: false,
        error: 'URL is required for HTTP request'
      }
    }

    try {
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      }

      if (body && method !== 'GET' && method !== 'HEAD') {
        fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
      }

      const response = await fetch(url, fetchOptions)
      const contentType = response.headers.get('content-type') || ''

      let data: unknown
      if (contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      return {
        success: true,
        output: {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries()),
          data,
          url: response.url
        }
      }
    } catch (error) {
      return {
        success: false,
        error: `HTTP request failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  })

  /**
   * Webhook Trigger Node - Represents a webhook entry point
   * This is mainly for visual representation in the workflow
   */
  registerNodeExecutor('webhook-trigger', async (node, inputs) => {
    return {
      success: true,
      output: {
        triggered: true,
        webhookId: node.inputs.webhookId,
        payload: inputs,
        timestamp: new Date().toISOString()
      }
    }
  })

  /**
   * Delay Node - Pause execution for a specified time
   */
  registerNodeExecutor('delay', async (node, inputs) => {
    const delayMs = Number(inputs.delay ?? node.inputs.delay ?? node.inputs.ms ?? 1000)
    const maxDelay = 30000 // 30 seconds max to prevent abuse

    const actualDelay = Math.min(Math.max(0, delayMs), maxDelay)

    await new Promise(resolve => setTimeout(resolve, actualDelay))

    return {
      success: true,
      output: {
        delayed: true,
        requestedMs: delayMs,
        actualMs: actualDelay,
        timestamp: new Date().toISOString(),
        passthrough: inputs.input ?? inputs.data ?? inputs
      }
    }
  })

  /**
   * Set Variable Node - Store a value in workflow context
   */
  registerNodeExecutor('set-variable', async (node, inputs, context) => {
    const variableName = (node.inputs.name ?? node.inputs.variableName) as string
    const value = inputs.value ?? inputs.input ?? node.inputs.value

    if (!variableName) {
      return {
        success: false,
        error: 'Variable name is required'
      }
    }

    // Store in context variables
    context.variables[variableName] = value

    return {
      success: true,
      output: {
        set: true,
        name: variableName,
        value,
        allVariables: { ...context.variables }
      }
    }
  })

  /**
   * Get Variable Node - Retrieve a value from workflow context
   */
  registerNodeExecutor('get-variable', async (node, _inputs, context) => {
    const variableName = (node.inputs.name ?? node.inputs.variableName) as string
    const defaultValue = node.inputs.default ?? node.inputs.defaultValue

    if (!variableName) {
      return {
        success: false,
        error: 'Variable name is required'
      }
    }

    const value = context.variables[variableName] ?? defaultValue

    return {
      success: true,
      output: {
        name: variableName,
        value,
        found: variableName in context.variables,
        allVariables: { ...context.variables }
      }
    }
  })

  /**
   * Transform Node - Transform data using a simple mapping
   */
  registerNodeExecutor('transform', async (node, inputs) => {
    const inputData = inputs.input ?? inputs.data ?? inputs
    const mapping = (node.inputs.mapping ?? {}) as Record<string, string>

    if (typeof inputData !== 'object' || inputData === null) {
      return {
        success: true,
        output: inputData
      }
    }

    const result: Record<string, unknown> = {}

    // Apply mapping
    for (const [targetKey, sourceKey] of Object.entries(mapping)) {
      const value = (inputData as Record<string, unknown>)[sourceKey]
      if (value !== undefined) {
        result[targetKey] = value
      }
    }

    // Include unmapped fields if configured
    if (node.inputs.includeUnmapped) {
      for (const [key, value] of Object.entries(inputData as Record<string, unknown>)) {
        if (!(key in result)) {
          result[key] = value
        }
      }
    }

    return {
      success: true,
      output: result
    }
  })

  /**
   * Merge Node - Merge multiple inputs into one object
   */
  registerNodeExecutor('merge', async (_node, inputs) => {
    const result: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(inputs)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(result, value)
      } else {
        result[key] = value
      }
    }

    return {
      success: true,
      output: result
    }
  })

  /**
   * Split Node - Split an array into individual items
   */
  registerNodeExecutor('split', async (node, inputs) => {
    const inputData = inputs.input ?? inputs.data ?? inputs
    const field = node.inputs.field as string | undefined

    let arrayToSplit: unknown[]

    if (field && typeof inputData === 'object' && inputData !== null) {
      arrayToSplit = (inputData as Record<string, unknown>)[field] as unknown[]
    } else if (Array.isArray(inputData)) {
      arrayToSplit = inputData
    } else {
      return {
        success: true,
        output: {
          items: [inputData],
          count: 1
        }
      }
    }

    if (!Array.isArray(arrayToSplit)) {
      return {
        success: true,
        output: {
          items: [arrayToSplit],
          count: 1
        }
      }
    }

    return {
      success: true,
      output: {
        items: arrayToSplit,
        count: arrayToSplit.length,
        first: arrayToSplit[0],
        last: arrayToSplit[arrayToSplit.length - 1]
      }
    }
  })

  /**
   * Aggregate Node - Combine multiple items into an array
   */
  registerNodeExecutor('aggregate', async (_node, inputs) => {
    const items = Object.values(inputs).filter(v => v !== undefined)

    return {
      success: true,
      output: {
        items,
        count: items.length
      }
    }
  })

  /**
   * Log Node - Log data for debugging (outputs to execution logs)
   */
  registerNodeExecutor('log', async (node, inputs) => {
    const message = (node.inputs.message ?? 'Log') as string
    const level = (node.inputs.level ?? 'info') as string
    const data = inputs.input ?? inputs.data ?? inputs

    // This will be captured in the execution logs
    console.log(`[Workflow Log - ${level.toUpperCase()}] ${message}:`, data)

    return {
      success: true,
      output: {
        logged: true,
        message,
        level,
        data,
        timestamp: new Date().toISOString()
      }
    }
  })

  console.log('[WorkflowEngine] Integration nodes registered')
}
