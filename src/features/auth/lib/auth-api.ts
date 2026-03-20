import type {
  AdminProfileResponse,
  LoginResponse,
  MfaSetupResponse,
  SessionResponse,
  TokenResponse,
} from '@/features/auth/types'
import type {CamelizeKeys} from '@/lib/case-transform';
import { useAuthStore } from '@/features/auth/stores/auth-store'
import {  camelizeKeys, snakeizeKeys } from '@/lib/case-transform'

const BASE_URL = import.meta.env.VITE_API_URL

async function authFetch<TApi>(
  path: string,
  options: RequestInit = {},
): Promise<CamelizeKeys<TApi>> {
  const res = await fetch(`${BASE_URL}/api/auth${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: { message: res.statusText } }))
    throw new Error(body?.error?.message ?? `HTTP ${res.status}`)
  }

  const text = await res.text()
  if (!text) 
return {} as CamelizeKeys<TApi>
  const json: TApi = JSON.parse(text)
  return camelizeKeys(json)
}

function authHeaders(): HeadersInit {
  const token = useAuthStore.getState()._token
  if (!token) 
return {}
  return { Authorization: `Bearer ${token}` }
}

function jsonBody(data: unknown): string {
  return JSON.stringify(snakeizeKeys(data))
}

export const authApi = {
  login(email: string, password: string): Promise<CamelizeKeys<LoginResponse>> {
    return authFetch<LoginResponse>('/login', {
      method: 'POST',
      body: jsonBody({ email, password }),
    })
  },

  verifyMfa(mfaToken: string, code: string): Promise<CamelizeKeys<TokenResponse>> {
    return authFetch<TokenResponse>('/mfa/verify', {
      method: 'POST',
      body: jsonBody({ mfaToken, code }),
    })
  },

  refresh(): Promise<CamelizeKeys<TokenResponse>> {
    return authFetch<TokenResponse>('/refresh', { method: 'POST' })
  },

  logout(): Promise<CamelizeKeys<void>> {
    return authFetch<void>('/logout', { method: 'POST', headers: authHeaders() })
  },

  getProfile(token?: string): Promise<CamelizeKeys<AdminProfileResponse>> {
    const headers = token ? { Authorization: `Bearer ${token}` } : authHeaders()
    return authFetch<AdminProfileResponse>('/me', { headers })
  },

  forceChangePassword(passwordChangeToken: string, newPassword: string): Promise<CamelizeKeys<void>> {
    return authFetch<void>('/force-change-password', {
      method: 'POST',
      body: jsonBody({ passwordChangeToken, newPassword }),
    })
  },

  changePassword(currentPassword: string, newPassword: string): Promise<CamelizeKeys<void>> {
    return authFetch<void>('/change-password', {
      method: 'PUT',
      headers: authHeaders(),
      body: jsonBody({ currentPassword, newPassword }),
    })
  },

  getSessions(): Promise<CamelizeKeys<{ sessions: SessionResponse[] }>> {
    return authFetch<{ sessions: SessionResponse[] }>('/sessions', { headers: authHeaders() })
  },

  revokeSession(sessionId: string): Promise<CamelizeKeys<void>> {
    return authFetch<void>(`/sessions/${sessionId}`, { method: 'DELETE', headers: authHeaders() })
  },

  setupMfa(): Promise<CamelizeKeys<MfaSetupResponse>> {
    return authFetch<MfaSetupResponse>('/mfa/setup', { method: 'POST', headers: authHeaders() })
  },

  enableMfa(code: string): Promise<CamelizeKeys<void>> {
    return authFetch<void>('/mfa/enable', { method: 'POST', headers: authHeaders(), body: jsonBody({ code }) })
  },

  disableMfa(code: string): Promise<CamelizeKeys<void>> {
    return authFetch<void>('/mfa/disable', { method: 'POST', headers: authHeaders(), body: jsonBody({ code }) })
  },

  logoutAll(): Promise<CamelizeKeys<void>> {
    return authFetch<void>('/logout-all', { method: 'POST', headers: authHeaders() })
  },
}
