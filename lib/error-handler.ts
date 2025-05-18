import { toast } from "@/components/ui/use-toast"

// Error types for better categorization
export enum ErrorType {
  NETWORK = "network",
  DATABASE = "database",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  VALIDATION = "validation",
  NOT_FOUND = "not_found",
  SERVER = "server",
  UNKNOWN = "unknown",
}

// Error codes for specific error scenarios
export enum ErrorCode {
  // Network errors
  NETWORK_OFFLINE = "network_offline",
  REQUEST_TIMEOUT = "request_timeout",

  // Database errors
  DB_CONNECTION_FAILED = "db_connection_failed",
  DB_QUERY_FAILED = "db_query_failed",
  DB_CONSTRAINT_VIOLATION = "db_constraint_violation",
  DB_DUPLICATE_ENTRY = "db_duplicate_entry",

  // Authentication errors
  INVALID_CREDENTIALS = "invalid_credentials",
  SESSION_EXPIRED = "session_expired",

  // Authorization errors
  INSUFFICIENT_PERMISSIONS = "insufficient_permissions",
  RESOURCE_FORBIDDEN = "resource_forbidden",

  // Validation errors
  INVALID_INPUT = "invalid_input",
  MISSING_REQUIRED_FIELD = "missing_required_field",

  // Not found errors
  RESOURCE_NOT_FOUND = "resource_not_found",

  // Server errors
  INTERNAL_SERVER_ERROR = "internal_server_error",
  SERVICE_UNAVAILABLE = "service_unavailable",

  // Unknown errors
  UNKNOWN_ERROR = "unknown_error",
}

// Error response interface
export interface ErrorResponse {
  success: false
  message: string
  type: ErrorType
  code: ErrorCode
  details?: any
}

// Client-side error handler
export const handleApiError = async (response: Response) => {
  try {
    const errorData = (await response.json()) as ErrorResponse

    // Log the error
    console.error("API Error:", errorData)

    // Show toast notification with appropriate message
    toast({
      title: getErrorTitle(errorData.type),
      description: errorData.message || "An unexpected error occurred",
      variant: "destructive",
    })

    // Return the error data for further handling if needed
    return errorData
  } catch (error) {
    // Handle case where response is not valid JSON
    console.error("Error parsing API error response:", error)

    toast({
      title: "Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    })

    return {
      success: false,
      message: "Failed to parse error response",
      type: ErrorType.UNKNOWN,
      code: ErrorCode.UNKNOWN_ERROR,
    } as ErrorResponse
  }
}

// Helper function to get user-friendly error titles
const getErrorTitle = (type: ErrorType): string => {
  switch (type) {
    case ErrorType.NETWORK:
      return "Network Error"
    case ErrorType.DATABASE:
      return "Database Error"
    case ErrorType.AUTHENTICATION:
      return "Authentication Error"
    case ErrorType.AUTHORIZATION:
      return "Authorization Error"
    case ErrorType.VALIDATION:
      return "Validation Error"
    case ErrorType.NOT_FOUND:
      return "Not Found"
    case ErrorType.SERVER:
      return "Server Error"
    case ErrorType.UNKNOWN:
    default:
      return "Error"
  }
}

// Server-side error handler for API routes
export const createErrorResponse = (message: string, type: ErrorType, code: ErrorCode, status = 500, details?: any) => {
  return new Response(
    JSON.stringify({
      success: false,
      message,
      type,
      code,
      details,
    } as ErrorResponse),
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
}

// Helper function to determine error type from error object
export const categorizeError = (error: any): { type: ErrorType; code: ErrorCode; status: number } => {
  // Network errors
  if (!navigator.onLine) {
    return { type: ErrorType.NETWORK, code: ErrorCode.NETWORK_OFFLINE, status: 503 }
  }

  // Database errors
  if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
    return { type: ErrorType.DATABASE, code: ErrorCode.DB_CONNECTION_FAILED, status: 503 }
  }

  if (error.code === "ER_DUP_ENTRY") {
    return { type: ErrorType.DATABASE, code: ErrorCode.DB_DUPLICATE_ENTRY, status: 409 }
  }

  // Authentication errors
  if (error.status === 401) {
    return { type: ErrorType.AUTHENTICATION, code: ErrorCode.INVALID_CREDENTIALS, status: 401 }
  }

  // Authorization errors
  if (error.status === 403) {
    return { type: ErrorType.AUTHORIZATION, code: ErrorCode.INSUFFICIENT_PERMISSIONS, status: 403 }
  }

  // Not found errors
  if (error.status === 404) {
    return { type: ErrorType.NOT_FOUND, code: ErrorCode.RESOURCE_NOT_FOUND, status: 404 }
  }

  // Default to unknown error
  return { type: ErrorType.UNKNOWN, code: ErrorCode.UNKNOWN_ERROR, status: 500 }
}
