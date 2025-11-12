/**
 * Structured logging utility
 * Provides different log levels and safe logging in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production'
  private minLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info'

  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.minLevel]
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` ${JSON.stringify(this.sanitizeContext(context))}` : ''
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`
  }

  /**
   * Remove sensitive data from context before logging
   */
  private sanitizeContext(context: LogContext): LogContext {
    const sanitized = { ...context }
    const sensitiveKeys = [
      'password',
      'token',
      'authorization',
      'cookie',
      'apiKey',
      'api_key',
      'secret',
      'access_token',
      'refresh_token',
      'oauth_token',
    ]

    for (const key of Object.keys(sanitized)) {
      const lowerKey = key.toLowerCase()
      if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
        sanitized[key] = '[REDACTED]'
      }
    }

    return sanitized
  }

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog('debug')) return

    if (this.isDevelopment) {
      console.log(this.formatMessage('debug', message, context))
    }
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog('info')) return
    console.log(this.formatMessage('info', message, context))
  }

  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog('warn')) return
    console.warn(this.formatMessage('warn', message, context))
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (!this.shouldLog('error')) return

    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
        name: error.name,
      } : error,
    }

    console.error(this.formatMessage('error', message, errorContext))
  }

  /**
   * Log API requests
   */
  apiRequest(method: string, path: string, context?: LogContext): void {
    this.info(`API ${method} ${path}`, context)
  }

  /**
   * Log API responses
   */
  apiResponse(method: string, path: string, status: number, duration?: number): void {
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'
    const message = `API ${method} ${path} - ${status}`
    const context = duration ? { duration: `${duration}ms` } : undefined

    if (level === 'error') {
      this.error(message, undefined, context)
    } else if (level === 'warn') {
      this.warn(message, context)
    } else {
      this.info(message, context)
    }
  }
}

// Export singleton instance
export const logger = new Logger()
