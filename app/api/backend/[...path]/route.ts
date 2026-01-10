import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

/**
 * Proxy all requests to the Symfony backend
 * Automatically adds the JWT token from httpOnly cookie
 */
async function proxyToBackend(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const backendPath = '/api/' + path.join('/')

  // Get query string
  const url = new URL(request.url)
  const queryString = url.search

  // Get token from cookie
  const cookieStore = await cookies()
  const token = cookieStore.get('cogit_token')?.value

  // Build headers
  const headers: HeadersInit = {
    'Accept': 'application/ld+json',
    'Content-Type': 'application/ld+json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Build request options
  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
  }

  // Add body for non-GET requests
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      const body = await request.text()
      if (body) {
        fetchOptions.body = body
      }
    } catch {
      // No body
    }
  }

  try {
    const backendUrl = `${BACKEND_URL}${backendPath}${queryString}`
    const response = await fetch(backendUrl, fetchOptions)

    // Get response body
    const contentType = response.headers.get('content-type')
    let data

    if (contentType?.includes('application/json') || contentType?.includes('application/ld+json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    // Return response with same status
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Content-Type': contentType || 'application/json',
      },
    })
  } catch (error) {
    console.error('Backend proxy error:', error)
    return NextResponse.json(
      { error: 'Erreur de connexion au serveur' },
      { status: 502 }
    )
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyToBackend(request, context)
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyToBackend(request, context)
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyToBackend(request, context)
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyToBackend(request, context)
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyToBackend(request, context)
}
