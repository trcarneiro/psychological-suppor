// Simple logger utility for production-safe logging
type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogContext {
  [key: string]: unknown
}

class Logger {
  private isDevelopment = import.meta.env.DEV

  private log(level: LogLevel, message: string, context?: LogContext) {
    if (!this.isDevelopment && level === 'debug') {
      return // Skip debug logs in production
    }

    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`
    
    if (this.isDevelopment) {
      // Detailed logging in development
      if (context) {
        console[level === 'debug' ? 'log' : level](prefix, message, context)
      } else {
        console[level === 'debug' ? 'log' : level](prefix, message)
      }
    } else {
      // Minimal logging in production (only errors/warns)
      if (level === 'error' || level === 'warn') {
        console[level](prefix, message, context || '')
      }
    }
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context)
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context)
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context)
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context)
  }
}

export const logger = new Logger()
