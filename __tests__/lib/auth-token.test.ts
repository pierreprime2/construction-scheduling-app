import {
  setUser,
  getUser,
  removeUser,
  clearAuth,
  hasToken,
  parseToken,
  isTokenExpired,
  getTokenExpirationTime,
  type AuthUser,
} from '@/lib/auth-token'

// Mock document.cookie
let mockCookies: Record<string, string> = {}

Object.defineProperty(document, 'cookie', {
  get: () => {
    return Object.entries(mockCookies)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ')
  },
  set: (value: string) => {
    const [cookiePart] = value.split(';')
    const [key, val] = cookiePart.split('=')
    if (val === '' || value.includes('Max-Age=0')) {
      delete mockCookies[key]
    } else {
      mockCookies[key] = val
    }
  },
})

describe('AuthToken (Cookie-based)', () => {
  beforeEach(() => {
    mockCookies = {}
  })

  describe('User Management', () => {
    const mockUser: AuthUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'Jean',
      lastName: 'Dupont',
      roles: ['ROLE_USER'],
    }

    test('setUser stores user data in cookie', () => {
      setUser(mockUser)
      expect(mockCookies['cogit_user']).toBeDefined()
      expect(JSON.parse(mockCookies['cogit_user'])).toEqual(mockUser)
    })

    test('getUser retrieves user data from cookie', () => {
      mockCookies['cogit_user'] = JSON.stringify(mockUser)
      expect(getUser()).toEqual(mockUser)
    })

    test('getUser returns null when no user cookie exists', () => {
      expect(getUser()).toBeNull()
    })

    test('getUser returns null for invalid JSON', () => {
      mockCookies['cogit_user'] = 'invalid-json'
      expect(getUser()).toBeNull()
    })

    test('removeUser removes user cookie', () => {
      mockCookies['cogit_user'] = JSON.stringify(mockUser)
      removeUser()
      expect(mockCookies['cogit_user']).toBeUndefined()
    })
  })

  describe('hasToken', () => {
    test('returns true when user cookie exists', () => {
      mockCookies['cogit_user'] = JSON.stringify({ id: 1, email: 'test@test.com', firstName: 'A', lastName: 'B', roles: [] })
      expect(hasToken()).toBe(true)
    })

    test('returns false when no user cookie exists', () => {
      expect(hasToken()).toBe(false)
    })
  })

  describe('clearAuth', () => {
    test('clears user cookie', () => {
      mockCookies['cogit_user'] = JSON.stringify({ id: 1, email: 'test@test.com', firstName: 'A', lastName: 'B', roles: [] })
      clearAuth()
      expect(mockCookies['cogit_user']).toBeUndefined()
    })
  })

  describe('parseToken', () => {
    // Valid JWT token payload: { "exp": 1735689600, "iat": 1735686000, "roles": ["ROLE_USER"], "username": "test@example.com" }
    const validToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzU2ODk2MDAsImlhdCI6MTczNTY4NjAwMCwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoidGVzdEBleGFtcGxlLmNvbSJ9.fake-signature'

    test('parses valid JWT token payload', () => {
      const payload = parseToken(validToken)
      expect(payload).toEqual({
        exp: 1735689600,
        iat: 1735686000,
        roles: ['ROLE_USER'],
        username: 'test@example.com',
      })
    })

    test('returns null for invalid token', () => {
      expect(parseToken('invalid-token')).toBeNull()
    })

    test('returns null for empty string', () => {
      expect(parseToken('')).toBeNull()
    })
  })

  describe('isTokenExpired', () => {
    test('returns true when no user cookie exists', () => {
      expect(isTokenExpired()).toBe(true)
    })

    test('returns false when user cookie exists', () => {
      mockCookies['cogit_user'] = JSON.stringify({ id: 1, email: 'test@test.com', firstName: 'A', lastName: 'B', roles: [] })
      expect(isTokenExpired()).toBe(false)
    })
  })

  describe('getTokenExpirationTime', () => {
    test('returns null (token is httpOnly)', () => {
      expect(getTokenExpirationTime()).toBeNull()
    })
  })
})
