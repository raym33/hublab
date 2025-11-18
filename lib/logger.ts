/**
 * Structured Logger
 *
 * Production-grade logging with context, levels, and formatting.
 * Integrates with monitoring services like Sentry.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

interface LogContext {
  [key: string]: unknown
  userId?: string
  requestId?: string
  ip?: string
  userAgent?: string
  timestamp?: string
}

interface LogEntry {
  level: LogLevel
  message: string
  context?: LogContext
  error?: Error
  stack?: string
  timestamp: string
}

class Logger {
  private serviceName: string
  private minLevel: LogLevel

  constructor(serviceName = 'hublab', minLevel: LogLevel = 'info') {
    this.serviceName = serviceName
    this.minLevel = minLevel
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal']
    return levels.indexOf(level) >= levels.indexOf(this.minLevel)
  }

  private formatEntry(entry: LogEntry): string {
    const { level, message, context, error, timestamp } = entry

    const formatted: Record<string, unknown> = {
      service: this.serviceName,
      level: level.toUpperCase(),
      timestamp,
      message,
    }

    if (context) {
      formatted.context = context
    }

    if (error) {
      formatted.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    }

    return JSON.stringify(formatted)
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    if (!this.shouldLog(level)) {
      return
    }

    const entry: LogEntry = {
      level,
      message,
      context,
      error,
      timestamp: new Date().toISOString(),
    }

    const formatted = this.formatEntry(entry)

    // Console output with colors in development
    const colors = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m', // Green
      warn: '\x1b[33m', // Yellow
      error: '\x1b[31m', // Red
      fatal: '\x1b[35m', // Magenta
    }
    const reset = '\x1b[0m'

    if (process.env.NODE_ENV === 'development') {
      console.log(`${colors[level]}${formatted}${reset}`)
    } else {
      // Production: plain JSON for log aggregators
      console.log(formatted)
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production' && (level === 'error' || level === 'fatal')) {
      this.sendToMonitoring(entry)
    }
  }

  private sendToMonitoring(entry: LogEntry): void {
    // Integration with Sentry, DataDog, etc.
    try {
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(entry.error || new Error(entry.message), {
          level: entry.level === 'fatal' ? 'fatal' : 'error',
          extra: entry.context,
        })
      }
    } catch (err) {
      // Fail silently to not break application
      console.error('Failed to send to monitoring:', err)
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context)
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context)
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.log('error', message, context, error)
  }

  fatal(message: string, error?: Error, context?: LogContext): void {
    this.log('fatal', message, context, error)
  }

  // API-specific helpers
  apiRequest(method: string, path: string, context?: LogContext): void {
    this.info(`API ${method} ${path}`, {
      ...context,
      method,
      path,
    })
  }

  apiError(method: string, path: string, error: Error, context?: LogContext): void {
    this.error(`API ${method} ${path} failed`, error, {
      ...context,
      method,
      path,
    })
  }

  performance(operation: string, durationMs: number, context?: LogContext): void {
    this.info(`Performance: ${operation}`, {
      ...context,
      operation,
      duration_ms: durationMs,
      slow: durationMs > 1000,
    })
  }
}

// Global logger instance
export const logger = new Logger(
  'hublab',
  process.env.NODE_ENV === 'production' ? 'info' : 'debug'
)

/**
 * Create request context from Next.js request
 */
export function getRequestContext(request: Request): LogContext {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'

  return {
    ip,
    userAgent: request.headers.get('user-agent') || 'unknown',
    requestId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  }
}
