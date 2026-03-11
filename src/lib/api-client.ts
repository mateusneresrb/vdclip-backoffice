/**
 * API client base — authenticated fetch calls to vdclip-backoffice-api.
 * In dev: MSW intercepts all calls and returns mock data.
 * In prod: calls go to VITE_API_URL.
 */

import { useAuthStore } from '@/features/auth/stores/auth-store'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8001'

function getAuthHeader(): HeadersInit {
  // In dev with MSW, token can be empty — MSW doesn't validate JWTs.
  // In prod, the real JWT from the auth session would go here.
  const token = (useAuthStore.getState() as { _token?: string })._token ?? 'dev-mock-token'
  return { Authorization: `Bearer ${token}` }
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

  const res = await fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

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
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, { body }),
  delete: <T>(path: string) => request<T>('DELETE', path),
}
