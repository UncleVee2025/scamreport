// Environment-aware logging service
const isDev = process.env.NODE_ENV === "development"

// Log levels
export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  FATAL = "fatal",
}

// Log entry interface
interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: string
  data?: any
  error?: {
    message: string
    stack?: string
    code?: string
  }
}

// Format log entry as JSON string
const formatLogEntry = (entry: LogEntry): string => {
  return JSON.stringify(entry)
}

// Core logging function
const log = (level: LogLevel, message: string, context?: string, data?: any, error?: Error) => {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
    data,
  }

  if (error) {
    entry.error = {
      message: error.message,
      stack: isDev ? error.stack : undefined,
      code: (error as any).code,
    }
  }

  const formattedEntry = formatLogEntry(entry)

  // Console output in development
  if (isDev) {
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedEntry)
        break
      case LogLevel.INFO:
        console.info(formattedEntry)
        break
      case LogLevel.WARN:
        console.warn(formattedEntry)
        break
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(formattedEntry)
        break
    }
  } else {
    // In production, we would send logs to a service like Vercel Logs, LogRocket, etc.
    // For now, we'll just use console.log for all levels in production
    console.log(formattedEntry)

    // For production, you might want to implement a buffer and batch send logs
    // or use a dedicated logging service
  }

  return entry
}

// Public API
export const logger = {
  debug: (message: string, context?: string, data?: any) => log(LogLevel.DEBUG, message, context, data),

  info: (message: string, context?: string, data?: any) => log(LogLevel.INFO, message, context, data),

  warn: (message: string, context?: string, data?: any) => log(LogLevel.WARN, message, context, data),

  error: (message: string, context?: string, data?: any, error?: Error) =>
    log(LogLevel.ERROR, message, context, data, error),

  fatal: (message: string, context?: string, data?: any, error?: Error) =>
    log(LogLevel.FATAL, message, context, data, error),
}

// Usage tracking for admin actions
export const trackAdminAction = (action: string, userId: string, details?: any) => {
  logger.info(`Admin action: ${action}`, "admin", { userId, ...details })

  // In a real app, you might want to store this in the database as well
  // for audit purposes
}
