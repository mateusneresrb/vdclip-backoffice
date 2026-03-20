import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { useAuthStore } from '@/features/auth/stores/auth-store'
import { apiClient, ApiError } from '@/lib/api-client'

// ── Resolve the same BASE_URL the api-client uses at import time ───────

const BASE_URL = import.meta.env.VITE_API_URL as string

// ── MSW server ─────────────────────────────────────────────────────────

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => {
  server.resetHandlers()
  useAuthStore.getState().clearAuth()
})
afterAll(() => server.close())

// ── Helpers ────────────────────────────────────────────────────────────

function setAuthToken(token: string) {
  useAuthStore.getState().setToken(token)
}

function url(path: string): string {
  return `${BASE_URL}/api${path}`
}

// ── Tests ──────────────────────────────────────────────────────────────

describe('apiClient integration with MSW', () => {
  it('gET request returns camelized data', async () => {
    server.use(
      http.get(url('/users/1'), () => {
        return HttpResponse.json({
          user_id: 'u-1',
          first_name: 'John',
          last_name: 'Doe',
          created_at: '2026-01-01',
        })
      }),
    )

    setAuthToken('test-token')

    const data = await apiClient.get<{
      user_id: string
      first_name: string
      last_name: string
      created_at: string
    }>('/users/1')

    expect(data).toEqual({
      userId: 'u-1',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: '2026-01-01',
    })
  })

  it('pOST request sends snakeized body', async () => {
    let capturedBody: unknown = null

    server.use(
      http.post(url('/users'), async ({ request }) => {
        capturedBody = await request.json()
        return HttpResponse.json({ user_id: 'u-new' }, { status: 201 })
      }),
    )

    setAuthToken('test-token')

    await apiClient.post('/users', {
      firstName: 'Jane',
      lastName: 'Smith',
      emailAddress: 'jane@test.com',
    })

    expect(capturedBody).toEqual({
      first_name: 'Jane',
      last_name: 'Smith',
      email_address: 'jane@test.com',
    })
  })

  it('gET request appends query params correctly', async () => {
    let capturedUrl = ''

    server.use(
      http.get(url('/users'), ({ request }) => {
        capturedUrl = request.url
        return HttpResponse.json({ items: [], total: 0 })
      }),
    )

    setAuthToken('test-token')

    await apiClient.get('/users', {
      page: 2,
      per_page: 25,
      is_active: true,
    })

    const parsed = new URL(capturedUrl)
    expect(parsed.searchParams.get('page')).toBe('2')
    expect(parsed.searchParams.get('per_page')).toBe('25')
    expect(parsed.searchParams.get('is_active')).toBe('true')
  })

  it('gET request omits undefined query params', async () => {
    let capturedUrl = ''

    server.use(
      http.get(url('/users'), ({ request }) => {
        capturedUrl = request.url
        return HttpResponse.json({ items: [] })
      }),
    )

    setAuthToken('test-token')

    await apiClient.get('/users', {
      page: 1,
      search: undefined,
    })

    const parsed = new URL(capturedUrl)
    expect(parsed.searchParams.get('page')).toBe('1')
    expect(parsed.searchParams.has('search')).toBe(false)
  })

  it('404 throws ApiError with correct status', async () => {
    server.use(
      http.get(url('/users/not-found'), () => {
        return HttpResponse.json(
          { error: { code: 'NOT_FOUND', message: 'User not found' } },
          { status: 404 },
        )
      }),
    )

    setAuthToken('test-token')

    try {
      await apiClient.get('/users/not-found')
      expect.unreachable('Should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      const apiErr = err as ApiError
      expect(apiErr.status).toBe(404)
      expect(apiErr.errorCode).toBe('NOT_FOUND')
      expect(apiErr.errorMessage).toBe('User not found')
    }
  })

  it('sends Authorization header from auth store', async () => {
    let capturedAuthHeader: string | null = null

    server.use(
      http.get(url('/protected'), ({ request }) => {
        capturedAuthHeader = request.headers.get('Authorization')
        return HttpResponse.json({ ok: true })
      }),
    )

    setAuthToken('my-jwt-token')

    await apiClient.get('/protected')

    expect(capturedAuthHeader).toBe('Bearer my-jwt-token')
  })

  it('handles 204 No Content response', async () => {
    server.use(
      http.delete(url('/users/1'), () => {
        return new HttpResponse(null, { status: 204 })
      }),
    )

    setAuthToken('test-token')

    const result = await apiClient.delete('/users/1')
    expect(result).toBeUndefined()
  })

  it('camelizes nested objects and arrays in response', async () => {
    server.use(
      http.get(url('/teams'), () => {
        return HttpResponse.json({
          team_list: [
            { team_id: 't-1', team_name: 'Alpha', member_count: 5 },
            { team_id: 't-2', team_name: 'Beta', member_count: 3 },
          ],
          total_count: 2,
        })
      }),
    )

    setAuthToken('test-token')

    const data = await apiClient.get<{
      team_list: { team_id: string; team_name: string; member_count: number }[]
      total_count: number
    }>('/teams')

    expect(data).toEqual({
      teamList: [
        { teamId: 't-1', teamName: 'Alpha', memberCount: 5 },
        { teamId: 't-2', teamName: 'Beta', memberCount: 3 },
      ],
      totalCount: 2,
    })
  })
})
