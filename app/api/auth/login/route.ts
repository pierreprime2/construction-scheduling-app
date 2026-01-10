import { NextRequest, NextResponse } from 'next/server'
import { setAuthCookies } from '@/lib/auth-cookies'

const API_URL = process.env.API_URL || 'http://127.0.0.1:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Call Symfony API login endpoint
    const loginResponse = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!loginResponse.ok) {
      const error = await loginResponse.json()
      return NextResponse.json(
        { error: error.message || 'Échec de la connexion' },
        { status: loginResponse.status }
      )
    }

    const { token } = await loginResponse.json()

    // Fetch user data
    const meResponse = await fetch(`${API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!meResponse.ok) {
      return NextResponse.json(
        { error: 'Impossible de récupérer les données utilisateur' },
        { status: 500 }
      )
    }

    const user = await meResponse.json()

    // Set httpOnly cookie with token and regular cookie with user data
    const response = NextResponse.json({ success: true, user })
    setAuthCookies(response, token, user)

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
