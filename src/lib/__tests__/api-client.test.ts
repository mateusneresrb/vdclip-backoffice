/**
 * Tests for the api-client module.
 *
 * Covers: GET/POST/PUT/PATCH/DELETE, query params, case transforms,
 * auth headers, ApiError, 204 responses, and 401 refresh+retry flow.
 */

// Import AFTER mocks are registered.
 
import { useAuthStore } from '@/features/auth/stores/auth-store'
import { apiClient, ApiError } from '../api-client'

const mockSetToken = vi.fn()
const mockClearAuth = vi.fn()

vi.mock('@/features/auth/stores/auth-store', () => ({
  useAuthStore: {
    getState: vi.fn(() => ({
      _token: 'test-token',
      setToken: mockSetToken,
      clearAuth: mockClearAuth,
    })),
  },
}))

// ── Helpers ──────────────────────────────────────────────────────────

// BASE_URL is captured at module scope from import.meta.env.VITE_API_URL,
// so we read the same env var to keep assertions in sync.
const BASE = import.meta.env.VITE_API_URL as string

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function emptyResponse(status = 204): Response {
  return new Response(null, { status })
}

// ── Setup / Teardown ─────────────────────────────────────────────────

const fetchMock = vi.fn<(input: string | URL | Request, init?: RequestInit) => Promise<Response>>()

beforeEach(() => {
  fetchMock.mockReset()
  mockSetToken.mockReset()
  mockClearAuth.mockReset()
  globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch
  // Default auth state: authenticated with test-token
  vi.mocked(useAuthStore.getState).mockReturnValue({
    _token: 'test-token',
    setToken: mockSetToken,
    clearAuth: mockClearAuth,
  } as unknown as ReturnType<typeof useAuthStore.getState>)
})

afterEach(() => {
  vi.restoreAllMocks()
})

// ── GET requests ─────────────────────────────────────────────────────

describe('apiClient.get', () => {
  it('constructs URL with base URL + /api prefix', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 1 }))

    await apiClient.get('/users')

    expect(fetchMock).toHaveBeenCalledOnce()
    const [url] = fetchMock.mock.calls[0]
    expect(url).toBe(`${BASE}/api/users`)
  })

  it('appends query params to URL', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]))

    await apiClient.get('/users', { per_page: 10, status: 'active' })

    const [url] = fetchMock.mock.calls[0]
    const parsed = new URL(url as string)
    expect(parsed.searchParams.get('per_page')).toBe('10')
    expect(parsed.searchParams.get('status')).toBe('active')
  })

  it('skips undefined/null query params', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]))

    await apiClient.get('/users', { per_page: 10, status: undefined })

    const [url] = fetchMock.mock.calls[0]
    const parsed = new URL(url as string)
    expect(parsed.searchParams.get('per_page')).toBe('10')
    expect(parsed.searchParams.has('status')).toBe(false)
  })

  it('sends boolean query params as strings', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse([]))

    await apiClient.get('/items', { is_active: true })

    const [url] = fetchMock.mock.calls[0]
    const parsed = new URL(url as string)
    expect(parsed.searchParams.get('is_active')).toBe('true')
  })

  it('uses GET method', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}))

    await apiClient.get('/health')

    const [, init] = fetchMock.mock.calls[0]
    expect((init as RequestInit).method).toBe('GET')
  })

  it('sends credentials: include', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}))

    await apiClient.get('/health')

    const [, init] = fetchMock.mock.calls[0]
    expect((init as RequestInit).credentials).toBe('include')
  })
})

// ── POST / PUT / PATCH requests ──────────────────────────────────────

describe('apiClient.post', () => {
  it('sends POST with JSON body and Content-Type', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 1 }))

    await apiClient.post('/users', { userName: 'alice' })

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(`${BASE}/api/users`)
    expect((init as RequestInit).method).toBe('POST')
    expect((init as RequestInit).headers).toEqual(
      expect.objectContaining({ 'Content-Type': 'application/json' }),
    )
  })

  it('allows POST without body', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }))

    await apiClient.post('/trigger')

    const [, init] = fetchMock.mock.calls[0]
    expect((init as RequestInit).body).toBeUndefined()
  })
})

describe('apiClient.put', () => {
  it('sends PUT with JSON body', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 1 }))

    await apiClient.put('/users/1', { fullName: 'Alice' })

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(`${BASE}/api/users/1`)
    expect((init as RequestInit).method).toBe('PUT')
  })
})

describe('apiClient.patch', () => {
  it('sends PATCH with JSON body', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 1 }))

    await apiClient.patch('/users/1', { fullName: 'Bob' })

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(`${BASE}/api/users/1`)
    expect((init as RequestInit).method).toBe('PATCH')
  })
})

describe('apiClient.delete', () => {
  it('sends DELETE without body', async () => {
    fetchMock.mockResolvedValueOnce(emptyResponse())

    await apiClient.delete('/users/1')

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(`${BASE}/api/users/1`)
    expect((init as RequestInit).method).toBe('DELETE')
  })
})

// ── Case transform ───────────────────────────────────────────────────

describe('case transform', () => {
  it('converts response JSON keys from snake_case to camelCase', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ user_name: 'alice', created_at: '2026-01-01' }),
    )

    const result = await apiClient.get('/users/1')

    expect(result).toEqual({ userName: 'alice', createdAt: '2026-01-01' })
  })

  it('converts nested response keys recursively', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        user_profile: {
          first_name: 'Alice',
          address_info: { zip_code: '12345' },
        },
      }),
    )

    const result = await apiClient.get('/users/1')

    expect(result).toEqual({
      userProfile: {
        firstName: 'Alice',
        addressInfo: { zipCode: '12345' },
      },
    })
  })

  it('converts response arrays with snake_case keys', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse([
        { user_id: 1, first_name: 'Alice' },
        { user_id: 2, first_name: 'Bob' },
      ]),
    )

    const result = await apiClient.get('/users')

    expect(result).toEqual([
      { userId: 1, firstName: 'Alice' },
      { userId: 2, firstName: 'Bob' },
    ])
  })

  it('converts request body keys from camelCase to snake_case', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: 1 }))

    await apiClient.post('/users', {
      firstName: 'Alice',
      lastName: 'Smith',
      addressInfo: { zipCode: '12345' },
    })

    const [, init] = fetchMock.mock.calls[0]
    const body = JSON.parse((init as RequestInit).body as string)
    expect(body).toEqual({
      first_name: 'Alice',
      last_name: 'Smith',
      address_info: { zip_code: '12345' },
    })
  })
})

// ── Auth headers ─────────────────────────────────────────────────────

describe('auth headers', () => {
  it('injects Bearer token from auth store', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}))

    await apiClient.get('/protected')

    const [, init] = fetchMock.mock.calls[0]
    const headers = (init as RequestInit).headers as Record<string, string>
    expect(headers.Authorization).toBe('Bearer test-token')
  })

  it('omits Authorization header when no token', async () => {
    vi.mocked(useAuthStore.getState).mockReturnValue({
      _token: null,
      setToken: mockSetToken,
      clearAuth: mockClearAuth,
    } as unknown as ReturnType<typeof useAuthStore.getState>)
    fetchMock.mockResolvedValueOnce(jsonResponse({}))

    await apiClient.get('/public')

    const [, init] = fetchMock.mock.calls[0]
    const headers = (init as RequestInit).headers as Record<string, string>
    expect(headers.Authorization).toBeUndefined()
  })
})

// ── ApiError ─────────────────────────────────────────────────────────

describe('apiError', () => {
  it('throws ApiError on non-OK response', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: { code: 'NOT_FOUND', message: 'User not found' } }, 404),
    )

    await expect(apiClient.get('/users/999')).rejects.toThrow(ApiError)
  })

  it('contains correct status and body', async () => {
    const errorBody = { error: { code: 'CONFLICT', message: 'Duplicate entry' } }
    fetchMock.mockResolvedValueOnce(jsonResponse(errorBody, 409))

    try {
      await apiClient.post('/users', { email: 'dup@test.com' })
      expect.unreachable('Should have thrown')
    }
    catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      const apiErr = err as ApiError
      expect(apiErr.status).toBe(409)
      expect(apiErr.body).toEqual(errorBody)
    }
  })

  it('exposes errorCode from body', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: { code: 'RATE_LIMITED', message: 'Too many requests' } }, 429),
    )

    try {
      await apiClient.get('/data')
      expect.unreachable('Should have thrown')
    }
    catch (err) {
      expect((err as ApiError).errorCode).toBe('RATE_LIMITED')
    }
  })

  it('exposes errorMessage from body', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: { code: 'BAD_REQUEST', message: 'Invalid input' } }, 400),
    )

    try {
      await apiClient.get('/data')
      expect.unreachable('Should have thrown')
    }
    catch (err) {
      expect((err as ApiError).errorMessage).toBe('Invalid input')
    }
  })

  it('returns fallback errorMessage when body has no message', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}, 500))

    try {
      await apiClient.get('/data')
      expect.unreachable('Should have thrown')
    }
    catch (err) {
      expect((err as ApiError).errorMessage).toBe('HTTP 500')
    }
  })

  it('returns empty errorCode when body has no code', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({}, 500))

    try {
      await apiClient.get('/data')
      expect.unreachable('Should have thrown')
    }
    catch (err) {
      expect((err as ApiError).errorCode).toBe('')
    }
  })

  it('handles non-JSON error responses gracefully', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response('Internal Server Error', {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      }),
    )

    try {
      await apiClient.get('/data')
      expect.unreachable('Should have thrown')
    }
    catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      const apiErr = err as ApiError
      expect(apiErr.status).toBe(500)
      expect(apiErr.body).toBeNull()
    }
  })
})

// ── 204 responses ────────────────────────────────────────────────────

describe('204 responses', () => {
  it('returns undefined for 204 No Content', async () => {
    fetchMock.mockResolvedValueOnce(emptyResponse(204))

    const result = await apiClient.delete('/users/1')

    expect(result).toBeUndefined()
  })
})

// ── 401 refresh flow ─────────────────────────────────────────────────

describe('401 refresh flow', () => {
  it('attempts token refresh on 401 and retries the original request', async () => {
    // First call: 401
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: { message: 'Unauthorized' } }, 401),
    )
    // Refresh call: success
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ access_token: 'new-token' }),
    )
    // Retry call: success
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ user_name: 'alice' }),
    )

    // After refresh, getState should return the new token
    vi.mocked(useAuthStore.getState)
      .mockReturnValueOnce({
        _token: 'test-token',
        setToken: mockSetToken,
        clearAuth: mockClearAuth,
      } as unknown as ReturnType<typeof useAuthStore.getState>)
      // Called inside the 401 check (has token?)
      .mockReturnValueOnce({
        _token: 'test-token',
        setToken: mockSetToken,
        clearAuth: mockClearAuth,
      } as unknown as ReturnType<typeof useAuthStore.getState>)
      // After refresh succeeds, getState returns new token for retry headers
      .mockReturnValue({
        _token: 'new-token',
        setToken: mockSetToken,
        clearAuth: mockClearAuth,
      } as unknown as ReturnType<typeof useAuthStore.getState>)

    const result = await apiClient.get('/protected')

    // 3 fetch calls: original + refresh + retry
    expect(fetchMock).toHaveBeenCalledTimes(3)

    // Refresh was called with correct endpoint
    const [refreshUrl, refreshInit] = fetchMock.mock.calls[1]
    expect(refreshUrl).toBe(`${BASE}/api/auth/refresh`)
    expect((refreshInit as RequestInit).method).toBe('POST')
    expect((refreshInit as RequestInit).credentials).toBe('include')

    // setToken was called with the new token
    expect(mockSetToken).toHaveBeenCalledWith('new-token')

    // Result is from the retried request
    expect(result).toEqual({ userName: 'alice' })
  })

  it('clears auth and throws ApiError when refresh fails', async () => {
    // First call: 401
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: { message: 'Unauthorized' } }, 401),
    )
    // Refresh call: fails
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: { message: 'Refresh expired' } }, 401),
    )

    await expect(apiClient.get('/protected')).rejects.toThrow(ApiError)

    expect(mockClearAuth).toHaveBeenCalledOnce()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('skips refresh for auth endpoints to avoid loops', async () => {
    // 401 on an auth endpoint
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: { message: 'Bad credentials' } }, 401),
    )

    // Auth endpoints should throw directly without refresh attempt
    await expect(apiClient.post('/auth/login', { email: 'a', password: 'b' })).rejects.toThrow(
      ApiError,
    )

    // Only 1 fetch call — no refresh attempt
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('skips refresh when no token exists (not logged in)', async () => {
    vi.mocked(useAuthStore.getState).mockReturnValue({
      _token: null,
      setToken: mockSetToken,
      clearAuth: mockClearAuth,
    } as unknown as ReturnType<typeof useAuthStore.getState>)

    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: { message: 'Unauthorized' } }, 401),
    )

    await expect(apiClient.get('/protected')).rejects.toThrow(ApiError)

    // Only 1 fetch call — no refresh attempt
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(mockClearAuth).not.toHaveBeenCalled()
  })

  it('retries with new token after successful refresh', async () => {
    // First call: 401
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: { message: 'Unauthorized' } }, 401),
    )
    // Refresh: success
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ access_token: 'refreshed-token' }),
    )
    // Retry: success
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }))

    vi.mocked(useAuthStore.getState)
      .mockReturnValueOnce({
        _token: 'old-token',
        setToken: mockSetToken,
        clearAuth: mockClearAuth,
      } as unknown as ReturnType<typeof useAuthStore.getState>)
      .mockReturnValueOnce({
        _token: 'old-token',
        setToken: mockSetToken,
        clearAuth: mockClearAuth,
      } as unknown as ReturnType<typeof useAuthStore.getState>)
      .mockReturnValue({
        _token: 'refreshed-token',
        setToken: mockSetToken,
        clearAuth: mockClearAuth,
      } as unknown as ReturnType<typeof useAuthStore.getState>)

    await apiClient.get('/data')

    // The retry call should use the new token
    const [, retryInit] = fetchMock.mock.calls[2]
    const retryHeaders = (retryInit as RequestInit).headers as Record<string, string>
    expect(retryHeaders.Authorization).toBe('Bearer refreshed-token')
  })
})
