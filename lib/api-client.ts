/**
 * API Client with automatic JWT token via cookies
 *
 * Uses credentials: 'include' to send httpOnly cookies automatically.
 * No need to manually add Authorization header.
 */

import { clearAuth } from './auth-token'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

/**
 * Make an authenticated API request
 *
 * @param endpoint - API endpoint (e.g., '/api/clients')
 * @param options - Fetch options (method, body, headers, etc.)
 * @returns Parsed JSON response
 * @throws ApiError on non-2xx responses
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Send cookies automatically
    body: undefined,
  }

  // Stringify body if it's an object
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body)
  } else if (options.body) {
    config.body = options.body as BodyInit
  }

  const response = await fetch(endpoint, config)

  // Handle 401 Unauthorized - clear auth and redirect
  if (response.status === 401) {
    clearAuth()
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw new ApiError('Non authentifié', 401)
  }

  // Handle 403 Forbidden
  if (response.status === 403) {
    throw new ApiError('Accès refusé', 403)
  }

  // Handle 404 Not Found
  if (response.status === 404) {
    throw new ApiError('Ressource non trouvée', 404)
  }

  // Handle other non-2xx responses
  if (!response.ok) {
    let errorData: unknown
    try {
      errorData = await response.json()
    } catch {
      errorData = null
    }

    const message =
      errorData && typeof errorData === 'object' && 'message' in errorData
        ? String((errorData as { message: string }).message)
        : `Erreur ${response.status}`

    throw new ApiError(message, response.status, errorData)
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T
  }

  // Parse JSON response
  return response.json()
}

// Convenience methods
export const api = {
  get: <T = unknown>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T = unknown>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
}
