import { apiClient, api, ApiError } from '@/lib/api-client'
import * as authToken from '@/lib/auth-token'

// Mock auth-token module
jest.mock('@/lib/auth-token', () => ({
  clearAuth: jest.fn(),
}))

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock window.location
const mockLocation = { href: '' }
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
})

describe('ApiClient (Cookie-based)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocation.href = ''
  })

  describe('apiClient', () => {
    test('makes GET request with credentials include', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: 'test' }),
      })

      const result = await apiClient('/api/test')

      expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }))
      expect(result).toEqual({ data: 'test' })
    })

    test('throws ApiError and clears auth on 401', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      })

      await expect(apiClient('/api/protected')).rejects.toThrow('Non authentifié')
      expect(authToken.clearAuth).toHaveBeenCalled()
      expect(mockLocation.href).toBe('/login')
    })

    test('throws ApiError on 403 Forbidden', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({}),
      })

      await expect(apiClient('/api/admin')).rejects.toThrow('Accès refusé')
    })

    test('throws ApiError on 404 Not Found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      })

      await expect(apiClient('/api/missing')).rejects.toThrow('Ressource non trouvée')
    })

    test('handles 204 No Content response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      })

      const result = await apiClient('/api/delete', { method: 'DELETE' })
      expect(result).toBeUndefined()
    })

    test('stringifies body object', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 1 }),
      })

      await apiClient('/api/create', {
        method: 'POST',
        body: { name: 'Test', value: 123 },
      })

      expect(mockFetch).toHaveBeenCalledWith('/api/create', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Test', value: 123 }),
        credentials: 'include',
      }))
    })
  })

  describe('api convenience methods', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      })
    })

    test('api.get makes GET request', async () => {
      await api.get('/api/items')

      expect(mockFetch).toHaveBeenCalledWith('/api/items', expect.objectContaining({
        method: 'GET',
        credentials: 'include',
      }))
    })

    test('api.post makes POST request with body', async () => {
      await api.post('/api/items', { name: 'New Item' })

      expect(mockFetch).toHaveBeenCalledWith('/api/items', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'New Item' }),
        credentials: 'include',
      }))
    })

    test('api.put makes PUT request with body', async () => {
      await api.put('/api/items/1', { name: 'Updated' })

      expect(mockFetch).toHaveBeenCalledWith('/api/items/1', expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated' }),
        credentials: 'include',
      }))
    })

    test('api.patch makes PATCH request with body', async () => {
      await api.patch('/api/items/1', { status: 'active' })

      expect(mockFetch).toHaveBeenCalledWith('/api/items/1', expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ status: 'active' }),
        credentials: 'include',
      }))
    })

    test('api.delete makes DELETE request', async () => {
      await api.delete('/api/items/1')

      expect(mockFetch).toHaveBeenCalledWith('/api/items/1', expect.objectContaining({
        method: 'DELETE',
        credentials: 'include',
      }))
    })
  })

  describe('ApiError', () => {
    test('contains status and data properties', () => {
      const error = new ApiError('Test error', 500, { details: 'more info' })

      expect(error.message).toBe('Test error')
      expect(error.status).toBe(500)
      expect(error.data).toEqual({ details: 'more info' })
      expect(error.name).toBe('ApiError')
    })
  })
})
