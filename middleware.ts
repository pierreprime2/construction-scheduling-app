import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getTokenFromRequest, isJwtExpired, TOKEN_COOKIE_NAME, USER_COOKIE_NAME } from './lib/auth-cookies'

/**
 * Routes that don't require authentication
 */
const PUBLIC_ROUTES = ['/login', '/register']

/**
 * Routes that should be skipped by middleware (static assets, api, etc.)
 */
const SKIP_ROUTES = ['/_next', '/api', '/favicon.ico', '/logo.png', '/icon', '/apple-icon']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static assets and API routes
  if (SKIP_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check if it's a public route
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  // Get token from cookie
  const token = getTokenFromRequest(request)

  // If no token or expired token, and not a public route, redirect to login
  if (!isPublicRoute) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (isJwtExpired(token)) {
      // Clear expired cookies and redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('expired', '1')

      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete(TOKEN_COOKIE_NAME)
      response.cookies.delete(USER_COOKIE_NAME)
      return response
    }
  }

  // If authenticated user tries to access login/register, redirect to home
  if (isPublicRoute && token && !isJwtExpired(token)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
