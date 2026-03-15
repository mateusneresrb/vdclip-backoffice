import type {
  AdminProfileResponse,
  LoginResponse,
  MfaSetupResponse,
  SessionResponse,
  TokenResponse,
} from '@/features/auth/types'

import { useAuthStore } from '@/features/auth/stores/auth-store'

const BASE_URL = import.meta.env.VITE_API_URL

async function authFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
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
  return text ? (JSON.parse(text) as T) : ({} as T)
}

function authHeaders(): HeadersInit {
  const token = useAuthStore.getState()._token
  if (!token) 
return {}
  return { Authorization: `Bearer ${token}` }
}

export const authApi = {
  login(email: string, password: string): Promise<LoginResponse> {
    return authFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  verifyMfa(mfaToken: string, code: string): Promise<TokenResponse> {
    return authFetch('/mfa/verify', {
      method: 'POST',
      body: JSON.stringify({ mfa_token: mfaToken, code }),
    })
  },

  refresh(): Promise<TokenResponse> {
    return authFetch('/refresh', { method: 'POST' })
  },

  logout(): Promise<void> {
    return authFetch('/logout', {
      method: 'POST',
      headers: authHeaders(),
    })
  },

  getProfile(token?: string): Promise<AdminProfileResponse> {
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : authHeaders()
    return authFetch('/me', { headers })
  },

  changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return authFetch('/change-password', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    })
  },

  getSessions(): Promise<{ sessions: SessionResponse[] }> {
    return authFetch('/sessions', { headers: authHeaders() })
  },

  revokeSession(sessionId: string): Promise<void> {
    return authFetch(`/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
  },

  setupMfa(): Promise<MfaSetupResponse> {
    return authFetch('/mfa/setup', {
      method: 'POST',
      headers: authHeaders(),
    })
  },

  enableMfa(code: string): Promise<void> {
    return authFetch('/mfa/enable', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ code }),
    })
  },

  disableMfa(code: string): Promise<void> {
    return authFetch('/mfa/disable', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ code }),
    })
  },

  logoutAll(): Promise<void> {
    return authFetch('/logout-all', {
      method: 'POST',
      headers: authHeaders(),
    })
  },
}
