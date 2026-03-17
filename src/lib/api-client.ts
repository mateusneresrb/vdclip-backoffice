/**
 * API client — authenticated fetch calls with auto snake_case ↔ camelCase.
 *
 * - Response JSON keys are auto-converted from snake_case → camelCase
 * - Request body JSON keys are auto-converted from camelCase → snake_case
 * - Query params are NOT converted — always pass snake_case keys
 * - 401 → auto refresh + retry (skips auth endpoints to avoid loops)
 */

import type {CamelizeKeys} from './case-transform';

import { useAuthStore } from '@/features/auth/stores/auth-store'
import {  camelizeKeys, snakeizeKeys } from './case-transform'

const BASE_URL = import.meta.env.VITE_API_URL

// ── Error class ─────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(status: number, body: unknown) {
    super(`API error ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }

  get errorCode(): string {
    const b = this.body as { error?: { code?: string } } | null
    return b?.error?.code ?? ''
  }

  get errorMessage(): string {
    const b = this.body as { error?: { message?: string } } | null
    return b?.error?.message ?? `HTTP ${this.status}`
  }
}

// ── Token refresh queue ─────────────────────────────────────────────

let refreshPromise: Promise<boolean> | null = null

async function attemptTokenRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) 
return false
    const data = await res.json()
    useAuthStore.getState().setToken(data.access_token)
    return true
  }
  catch {
    return false
  }
}

function refreshTokenOnce(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = attemptTokenRefresh().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

// ── Auth headers ────────────────────────────────────────────────────

function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState()._token
  if (token) 
return { Authorization: `Bearer ${token}` }
  return {}
}

// ── Core request ────────────────────────────────────────────────────

async function request<TApi>(
  method: string,
  url: string,
  init?: RequestInit,
): Promise<CamelizeKeys<TApi>> {
  const headers: Record<string, string> = {
    ...getAuthHeaders(),
    ...(init?.headers as Record<string, string>),
  }

  const doFetch = () =>
    fetch(url, { ...init, method, headers, credentials: 'include' })

  let res = await doFetch()

  // 401 refresh + retry (skip auth endpoints to avoid loops)
  if (res.status === 401 && useAuthStore.getState()._token && !url.includes('/api/auth/')) {
    const refreshed = await refreshTokenOnce()
    if (refreshed) {
      const retryHeaders: Record<string, string> = {
        ...getAuthHeaders(),
        ...(init?.headers as Record<string, string>),
      }
      res = await fetch(url, { ...init, method, headers: retryHeaders, credentials: 'include' })
    }
    else {
      useAuthStore.getState().clearAuth()
      throw new ApiError(401, { error: { message: 'Sessão expirada' } })
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new ApiError(res.status, body)
  }

  if (res.status === 204) 
return undefined as CamelizeKeys<TApi>

  const json: TApi = await res.json()
  return camelizeKeys(json)
}

function withBody<TApi>(
  method: string,
  url: string,
  body?: unknown,
): Promise<CamelizeKeys<TApi>> {
  return request<TApi>(method, url, {
    headers: { 'Content-Type': 'application/json' },
    ...(body !== undefined && { body: JSON.stringify(snakeizeKeys(body)) }),
  })
}

// ── Public API ──────────────────────────────────────────────────────

export const apiClient = {
  get: <TApi>(path: string, params?: Record<string, string | number | boolean | undefined>) => {
    const url = new URL(`${BASE_URL}/api${path}`)
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value))
        }
      }
    }
    return request<TApi>('GET', url.toString())
  },

  post: <TApi>(path: string, body?: unknown) =>
    withBody<TApi>('POST', `${BASE_URL}/api${path}`, body),

  put: <TApi>(path: string, body?: unknown) =>
    withBody<TApi>('PUT', `${BASE_URL}/api${path}`, body),

  patch: <TApi>(path: string, body?: unknown) =>
    withBody<TApi>('PATCH', `${BASE_URL}/api${path}`, body),

  delete: <TApi>(path: string) =>
    request<TApi>('DELETE', `${BASE_URL}/api${path}`),
}
