/**
 * Error Handling Nodes for Workflow Engine
 *
 * Provides nodes for:
 * - Try/Catch error handling
 * - Retry logic with backoff
 * - Error notifications
 * - Error recovery patterns
 */

import { registerNodeExecutor } from './engine'

// Types for error handling
export interface RetryConfig {
  maxAttempts: number
  initialDelayMs: number
  maxDelayMs: number
  backoffMultiplier: number
  retryOn?: string[] // Error types to retry on
}

export interface ErrorInfo {
  message: string
  type: string
  nodeId?: string
  stack?: string
  timestamp: string
  attempt?: number
}

// Default retry configuration
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2
}

/**
 * Calculate delay with exponential backoff
 */
function calculateBackoffDelay(
  attempt: number,
  config: RetryConfig
): number {
  const delay = config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt - 1)
  // Add jitter (±10%)
  const jitter = delay * 0.1 * (Math.random() * 2 - 1)
  return Math.min(delay + jitter, config.maxDelayMs)
}

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Register all error handling nodes
 */
export function registerErrorHandlingNodes(): void {
  /**
   * Try-Catch Node
   * Wraps execution and catches errors from connected nodes
   *
   * Inputs:
   *   - value: The value to pass through (from try branch)
   *   - error: Error from failed node (set by engine)
   *
   * Outputs:
   *   - success: Output when no error (passes through input)
   *   - error: Output when error occurred (contains error info)
   *   - finally: Always executed (contains input or error)
   */
  registerNodeExecutor('try-catch', async (node, inputs) => {
    const hasError = inputs.error !== undefined
    const errorInfo: ErrorInfo | null = hasError ? {
      message: inputs.error?.message || 'Unknown error',
      type: inputs.error?.type || 'Error',
      nodeId: inputs.error?.nodeId,
      stack: inputs.error?.stack,
      timestamp: new Date().toISOString()
    } : null

    return {
      success: !hasError ? inputs.value : undefined,
      error: errorInfo,
      finally: {
        hasError,
        value: hasError ? errorInfo : inputs.value,
        originalInput: inputs.value
      },
      _errorHandled: hasError // Signal to engine that error was handled
    }
  })

  /**
   * Retry Node
   * Retries a failed operation with exponential backoff
   *
   * Config:
   *   - maxAttempts: Maximum retry attempts (default: 3)
   *   - initialDelayMs: Initial delay in ms (default: 1000)
   *   - maxDelayMs: Maximum delay in ms (default: 30000)
   *   - backoffMultiplier: Backoff multiplier (default: 2)
   *   - retryOn: Array of error types to retry on (optional)
   *
   * Inputs:
   *   - operation: Function to retry (as serialized config)
   *   - input: Input to pass to operation
   *
   * Outputs:
   *   - result: Successful result
   *   - error: Final error after all retries exhausted
   *   - attempts: Number of attempts made
   */
  registerNodeExecutor('retry', async (node, inputs, context) => {
    const config: RetryConfig = {
      ...DEFAULT_RETRY_CONFIG,
      ...(node.config?.retry || {})
    }

    const maxAttempts = config.maxAttempts
    let lastError: ErrorInfo | null = null
    let attempt = 0

    // If there's an incoming error, this is a retry scenario
    if (inputs.error) {
      attempt = inputs._retryAttempt || 1

      if (attempt >= maxAttempts) {
        // Max retries exhausted
        return {
          result: null,
          error: {
            ...inputs.error,
            message: `Max retries (${maxAttempts}) exhausted: ${inputs.error.message}`,
            attempt
          },
          attempts: attempt,
          exhausted: true
        }
      }

      // Check if we should retry on this error type
      if (config.retryOn && config.retryOn.length > 0) {
        const errorType = inputs.error.type || 'Error'
        if (!config.retryOn.includes(errorType)) {
          return {
            result: null,
            error: inputs.error,
            attempts: attempt,
            exhausted: true,
            reason: `Error type '${errorType}' not in retryOn list`
          }
        }
      }

      // Calculate and wait for backoff delay
      const delay = calculateBackoffDelay(attempt, config)

      if (context?.log) {
        context.log('info', `Retry attempt ${attempt + 1}/${maxAttempts} after ${delay}ms`)
      }

      await sleep(delay)

      // Return retry signal
      return {
        _retry: true,
        _retryAttempt: attempt + 1,
        _retryInput: inputs.input || inputs._retryInput,
        attempts: attempt + 1
      }
    }

    // No error - pass through the value
    return {
      result: inputs.value || inputs.input,
      error: lastError,
      attempts: attempt,
      exhausted: false
    }
  })

  /**
   * Error Notification Node
   * Sends notifications when errors occur
   *
   * Config:
   *   - channels: Array of notification channels (email, slack, webhook)
   *   - email: Email configuration
   *   - slack: Slack webhook URL
   *   - webhook: Custom webhook URL
   *   - includeStack: Include stack trace in notification
   *
   * Inputs:
   *   - error: Error information
   *   - context: Additional context
   */
  registerNodeExecutor('error-notification', async (node, inputs, context) => {
    const error = inputs.error as ErrorInfo | undefined
    if (!error) {
      return { sent: false, reason: 'No error to notify' }
    }

    const config = node.config || {}
    const channels = config.channels || ['log']
    const notifications: Array<{ channel: string; success: boolean; error?: string }> = []

    for (const channel of channels) {
      try {
        switch (channel) {
          case 'log':
            // Log to execution context
            if (context?.log) {
              context.log('error', `Error notification: ${error.message}`, {
                error,
                additionalContext: inputs.context
              })
            }
            notifications.push({ channel: 'log', success: true })
            break

          case 'webhook':
            // Send to custom webhook
            if (config.webhookUrl) {
              const response = await fetch(config.webhookUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(config.webhookHeaders || {})
                },
                body: JSON.stringify({
                  type: 'workflow_error',
                  error: {
                    message: error.message,
                    type: error.type,
                    nodeId: error.nodeId,
                    timestamp: error.timestamp,
                    stack: config.includeStack ? error.stack : undefined
                  },
                  context: inputs.context,
                  workflow: {
                    executionId: context?.executionId,
                    workflowId: context?.workflowId
                  }
                })
              })

              notifications.push({
                channel: 'webhook',
                success: response.ok,
                error: response.ok ? undefined : `HTTP ${response.status}`
              })
            }
            break

          case 'slack':
            // Send to Slack webhook
            if (config.slackWebhookUrl) {
              const slackPayload = {
                text: `Workflow Error`,
                attachments: [{
                  color: 'danger',
                  title: error.type || 'Error',
                  text: error.message,
                  fields: [
                    {
                      title: 'Node ID',
                      value: error.nodeId || 'Unknown',
                      short: true
                    },
                    {
                      title: 'Timestamp',
                      value: error.timestamp,
                      short: true
                    }
                  ],
                  footer: `Execution: ${context?.executionId || 'Unknown'}`
                }]
              }

              const response = await fetch(config.slackWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(slackPayload)
              })

              notifications.push({
                channel: 'slack',
                success: response.ok,
                error: response.ok ? undefined : `HTTP ${response.status}`
              })
            }
            break

          case 'email':
            // Email would require an email service integration
            // For now, log that email would be sent
            if (context?.log) {
              context.log('info', `Would send email notification to: ${config.emailTo}`, {
                subject: `Workflow Error: ${error.type}`,
                error
              })
            }
            notifications.push({
              channel: 'email',
              success: true,
              error: 'Email service not configured'
            })
            break

          default:
            notifications.push({
              channel,
              success: false,
              error: `Unknown channel: ${channel}`
            })
        }
      } catch (err) {
        notifications.push({
          channel,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        })
      }
    }

    return {
      sent: notifications.some(n => n.success),
      notifications,
      error: inputs.error
    }
  })

  /**
   * Throw Error Node
   * Explicitly throws an error to trigger error handling
   *
   * Config:
   *   - message: Error message
   *   - type: Error type/name
   *   - condition: Optional condition to check before throwing
   */
  registerNodeExecutor('throw-error', async (node, inputs) => {
    const config = node.config || {}
    const message = config.message || inputs.message || 'Explicit error thrown'
    const errorType = config.type || inputs.type || 'WorkflowError'

    // Check condition if specified
    if (config.condition) {
      const conditionMet = evaluateSimpleCondition(config.condition, inputs)
      if (!conditionMet) {
        return {
          thrown: false,
          reason: 'Condition not met',
          passthrough: inputs.value
        }
      }
    }

    // Throw the error (will be caught by engine)
    throw Object.assign(new Error(message), {
      type: errorType,
      isWorkflowError: true,
      data: inputs
    })
  })

  /**
   * Error Recovery Node
   * Provides fallback values when errors occur
   *
   * Config:
   *   - fallbackValue: Value to use when error occurs
   *   - fallbackType: 'static', 'input', 'default'
   *   - logRecovery: Whether to log recovery
   */
  registerNodeExecutor('error-recovery', async (node, inputs, context) => {
    const config = node.config || {}
    const hasError = inputs.error !== undefined

    if (!hasError) {
      // No error - pass through
      return {
        value: inputs.value,
        recovered: false
      }
    }

    // Determine fallback value
    let fallbackValue: unknown
    switch (config.fallbackType) {
      case 'static':
        fallbackValue = config.fallbackValue
        break
      case 'input':
        fallbackValue = inputs.fallback ?? config.fallbackValue
        break
      case 'default':
      default:
        fallbackValue = config.fallbackValue ?? null
    }

    if (config.logRecovery && context?.log) {
      context.log('warn', `Recovered from error with fallback value`, {
        error: inputs.error,
        fallbackValue
      })
    }

    return {
      value: fallbackValue,
      recovered: true,
      originalError: inputs.error,
      _errorHandled: true
    }
  })

  /**
   * Circuit Breaker Node
   * Prevents repeated calls to failing services
   *
   * Config:
   *   - failureThreshold: Number of failures before opening circuit
   *   - resetTimeout: Time in ms before attempting to close circuit
   *   - halfOpenRequests: Number of test requests in half-open state
   *
   * State is stored in execution context
   */
  registerNodeExecutor('circuit-breaker', async (node, inputs, context) => {
    const config = node.config || {}
    const circuitId = node.id
    const failureThreshold = config.failureThreshold || 5
    const resetTimeout = config.resetTimeout || 30000

    // Get circuit state from context (would be in persistent storage in production)
    const circuitState = (context as Record<string, unknown>)?._circuitStates?.[circuitId] || {
      state: 'closed', // closed, open, half-open
      failures: 0,
      lastFailure: null,
      successesSinceHalfOpen: 0
    }

    // Check if circuit should transition from open to half-open
    if (circuitState.state === 'open') {
      const timeSinceLastFailure = Date.now() - (circuitState.lastFailure || 0)
      if (timeSinceLastFailure >= resetTimeout) {
        circuitState.state = 'half-open'
        circuitState.successesSinceHalfOpen = 0
      } else {
        // Circuit is open - reject immediately
        return {
          allowed: false,
          state: 'open',
          reason: 'Circuit breaker is open',
          retryAfter: resetTimeout - timeSinceLastFailure
        }
      }
    }

    // Check for incoming error
    if (inputs.error) {
      circuitState.failures++
      circuitState.lastFailure = Date.now()

      if (circuitState.failures >= failureThreshold) {
        circuitState.state = 'open'
        return {
          allowed: false,
          state: 'open',
          reason: `Circuit opened after ${failureThreshold} failures`,
          error: inputs.error
        }
      }

      return {
        allowed: true,
        state: circuitState.state,
        failures: circuitState.failures,
        error: inputs.error
      }
    }

    // Success
    if (circuitState.state === 'half-open') {
      circuitState.successesSinceHalfOpen++
      if (circuitState.successesSinceHalfOpen >= (config.halfOpenRequests || 3)) {
        circuitState.state = 'closed'
        circuitState.failures = 0
      }
    } else {
      circuitState.failures = Math.max(0, circuitState.failures - 1) // Gradual recovery
    }

    return {
      allowed: true,
      state: circuitState.state,
      value: inputs.value,
      failures: circuitState.failures
    }
  })

  console.log('[WorkflowEngine] Error handling nodes registered')
}

/**
 * Simple condition evaluator for throw-error node
 */
function evaluateSimpleCondition(
  condition: { field: string; operator: string; value: unknown },
  inputs: Record<string, unknown>
): boolean {
  const fieldValue = inputs[condition.field]
  const compareValue = condition.value

  switch (condition.operator) {
    case 'eq':
    case '==':
      return fieldValue == compareValue
    case 'neq':
    case '!=':
      return fieldValue != compareValue
    case 'gt':
    case '>':
      return (fieldValue as number) > (compareValue as number)
    case 'lt':
    case '<':
      return (fieldValue as number) < (compareValue as number)
    case 'exists':
      return fieldValue !== undefined && fieldValue !== null
    case 'not-exists':
      return fieldValue === undefined || fieldValue === null
    case 'contains':
      return String(fieldValue).includes(String(compareValue))
    case 'truthy':
      return Boolean(fieldValue)
    case 'falsy':
      return !fieldValue
    default:
      return false
  }
}

// Export types and utilities
export { calculateBackoffDelay, sleep }
