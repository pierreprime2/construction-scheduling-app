/**
 * Server-side cookie utilities for JWT token management
 *
 * These functions are used by:
 * - Next.js middleware (edge runtime)
 * - Server actions / API routes
 */

import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const TOKEN_COOKIE_NAME = 'cogit_token'
export const USER_COOKIE_NAME = 'cogit_user'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

/**
 * Cookie options for the JWT token
 */
export const TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 3600, // 1 hour (matches JWT TTL)
}

/**
 * Cookie options for user data (not httpOnly - needed by client)
 */
export const USER_COOKIE_OPTIONS = {
  httpOnly: false, // Client needs to read user data
  secure: IS_PRODUCTION,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 3600,
}

/**
 * Set auth cookies on a NextResponse (for middleware/API routes)
 */
export function setAuthCookies(
  response: NextResponse,
  token: string,
  user?: { id: number; email: string; firstName: string; lastName: string; roles: string[] }
): NextResponse {
  response.cookies.set(TOKEN_COOKIE_NAME, token, TOKEN_COOKIE_OPTIONS)

  if (user) {
    response.cookies.set(USER_COOKIE_NAME, JSON.stringify(user), USER_COOKIE_OPTIONS)
  }

  return response
}

/**
 * Clear auth cookies on a NextResponse
 */
export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.delete(TOKEN_COOKIE_NAME)
  response.cookies.delete(USER_COOKIE_NAME)
  return response
}

/**
 * Get token from request cookies (for middleware)
 */
export function getTokenFromRequest(request: NextRequest): string | undefined {
  return request.cookies.get(TOKEN_COOKIE_NAME)?.value
}

/**
 * Get token from cookies (for server components/actions)
 */
export async function getTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value
}

/**
 * Get user from cookies (for server components/actions)
 */
export async function getUserFromCookies(): Promise<{
  id: number
  email: string
  firstName: string
  lastName: string
  roles: string[]
} | null> {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get(USER_COOKIE_NAME)?.value

  if (!userCookie) return null

  try {
    return JSON.parse(userCookie)
  } catch {
    return null
  }
}

/**
 * Parse JWT token to extract payload (without validation)
 * Works in edge runtime (no Node.js crypto)
 */
export function parseJwtPayload(token: string): {
  exp: number
  iat: number
  roles: string[]
  username: string
} | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = atob(base64)
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

/**
 * Check if a JWT token is expired
 */
export function isJwtExpired(token: string): boolean {
  const payload = parseJwtPayload(token)
  if (!payload || !payload.exp) return true

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = payload.exp * 1000
  const now = Date.now()

  // Consider expired if less than 60 seconds remaining
  return now >= expirationTime - 60000
}
