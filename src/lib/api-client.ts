/**
 * API client base — authenticated fetch calls to vdclip-backoffice-api.
 * In dev: MSW intercepts all calls and returns mock data.
 * In prod: calls go to VITE_API_URL.
 */

import { useAuthStore } from '@/features/auth/stores/auth-store'

const BASE_URL = import.meta.env.VITE_API_URL

let isRefreshing: Promise<boolean> | null = null

function getAuthHeader(): HeadersInit {
  const token = useAuthStore.getState()._token
  if (!token) 
return {}
  return { Authorization: `Bearer ${token}` }
}

async function tryRefresh(): Promise<boolean> {
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
  } catch {
    return false
  }
}

async function request<T>(
  method: string,
  path: string,
  options: { params?: Record<string, string | number | boolean | undefined>; body?: unknown } = {},
): Promise<T> {
  const url = new URL(`${BASE_URL}/api${path}`)

  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const doFetch = () =>
    fetch(url.toString(), {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    })

  let res = await doFetch()

  // On 401, try to refresh the token and retry once
  if (res.status === 401 && useAuthStore.getState()._token) {
    if (!isRefreshing) {
      isRefreshing = tryRefresh().finally(() => { isRefreshing = null })
    }
    const refreshed = await isRefreshing
    if (refreshed) {
      res = await doFetch()
    } else {
      useAuthStore.getState().clearAuth()
      throw new Error('Sessão expirada')
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: { message: res.statusText } }))
    throw new Error(error?.error?.message ?? `HTTP ${res.status}`)
  }

  return res.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string, params?: Record<string, string | number | boolean | undefined>) =>
    request<T>('GET', path, { params }),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, { body }),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, { body }),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, { body }),
  delete: <T>(path: string) => request<T>('DELETE', path),
}
