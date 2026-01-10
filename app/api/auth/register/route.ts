import { NextRequest, NextResponse } from 'next/server'
import { setAuthCookies } from '@/lib/auth-cookies'

const API_URL = process.env.API_URL || 'http://127.0.0.1:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName } = body

    // Call Symfony API register endpoint
    const registerResponse = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName }),
    })

    if (!registerResponse.ok) {
      const error = await registerResponse.json()
      return NextResponse.json(
        { error: error.error || 'Échec de l\'inscription' },
        { status: registerResponse.status }
      )
    }

    // Auto-login after registration
    const loginResponse = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    })

    if (!loginResponse.ok) {
      // Registration succeeded but login failed - user should try logging in
      return NextResponse.json(
        { success: true, message: 'Compte créé. Veuillez vous connecter.' },
        { status: 201 }
      )
    }

    const { token } = await loginResponse.json()

    // Fetch user data
    const meResponse = await fetch(`${API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!meResponse.ok) {
      return NextResponse.json(
        { success: true, message: 'Compte créé. Veuillez vous connecter.' },
        { status: 201 }
      )
    }

    const user = await meResponse.json()

    // Set httpOnly cookie with token and regular cookie with user data
    const response = NextResponse.json({ success: true, user })
    setAuthCookies(response, token, user)

    return response
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
