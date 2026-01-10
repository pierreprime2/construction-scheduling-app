/**
 * JWT Token Storage Utility (Client-side)
 *
 * Token is stored in httpOnly cookie (set by server).
 * User data is stored in a regular cookie (readable by client).
 *
 * Note: The actual token is NOT accessible from JavaScript (httpOnly).
 * Only the user data cookie can be read client-side.
 */

const USER_COOKIE_NAME = 'cogit_user'

export interface AuthUser {
  id: number
  email: string
  firstName: string
  lastName: string
  roles: string[]
}

/**
 * Get a cookie value by name (client-side)
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

/**
 * Set a cookie (client-side) - only for non-httpOnly cookies
 */
function setCookie(name: string, value: string, maxAge: number = 3600): void {
  if (typeof document === 'undefined') return

  const isProduction = process.env.NODE_ENV === 'production'
  const secure = isProduction ? '; Secure' : ''

  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
}

/**
 * Delete a cookie (client-side)
 */
function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; Path=/; Max-Age=0`
}

/**
 * Check if user is authenticated (has user cookie)
 * Note: We check user cookie since token cookie is httpOnly
 */
export function hasToken(): boolean {
  return !!getUser()
}

/**
 * Store user data in cookie
 */
export function setUser(user: AuthUser): void {
  setCookie(USER_COOKIE_NAME, JSON.stringify(user))
}

/**
 * Retrieve user data from cookie
 */
export function getUser(): AuthUser | null {
  const userData = getCookie(USER_COOKIE_NAME)
  if (userData) {
    try {
      return JSON.parse(decodeURIComponent(userData)) as AuthUser
    } catch {
      return null
    }
  }
  return null
}

/**
 * Remove user data from cookie
 */
export function removeUser(): void {
  deleteCookie(USER_COOKIE_NAME)
}

/**
 * Clear all auth data (user cookie)
 * Note: Token cookie must be cleared server-side
 */
export function clearAuth(): void {
  removeUser()
}

/**
 * Parse JWT token to extract payload (without validation)
 * Note: This only decodes, it does NOT verify the signature
 */
export function parseToken(token: string): { exp: number; iat: number; roles: string[]; username: string } | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

/**
 * Check if token is expired based on user cookie existence
 * Note: Actual token expiration is checked server-side in middleware
 */
export function isTokenExpired(): boolean {
  return !hasToken()
}

// Legacy functions for backward compatibility with tests
// These are no longer used but kept for API compatibility

export function setToken(_token: string): void {
  // Token is set via httpOnly cookie by server
  // This function is now a no-op client-side
  console.warn('setToken is deprecated: token is now set via httpOnly cookie')
}

export function getToken(): string | null {
  // Token is httpOnly, not accessible from JavaScript
  // Return null - API client will send cookie automatically
  return null
}

export function removeToken(): void {
  // Token cookie must be cleared server-side
  console.warn('removeToken is deprecated: token must be cleared server-side')
}

export function getTokenExpirationTime(): number | null {
  // Token is httpOnly, cannot read expiration client-side
  return null
}
