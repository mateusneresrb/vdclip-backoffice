import type { AdminRole } from '@/features/auth/lib/permissions'
import type { AdminAccount, AdminProfileResponse } from '@/features/auth/types'

import { useNavigate } from '@tanstack/react-router'
import { authApi } from '@/features/auth/lib/auth-api'
import { useAuthStore } from '@/features/auth/stores/auth-store'

function mapProfileToAccount(profile: AdminProfileResponse): AdminAccount {
  return {
    id: profile.id,
    name: `${profile.first_name} ${profile.last_name ?? ''}`.trim(),
    email: profile.email,
    role: (profile.roles[0] ?? 'viewer') as AdminRole,
    avatar: profile.picture_url ?? undefined,
    mfaEnabled: profile.has_mfa_enabled,
  }
}

async function fetchAndSetAdmin(accessToken: string) {
  const store = useAuthStore.getState()
  store.setToken(accessToken)
  const profile = await authApi.getProfile(accessToken)
  const account = mapProfileToAccount(profile)
  store.setAdmin(account, profile.permissions)
}

export async function restoreSession(): Promise<boolean> {
  const store = useAuthStore.getState()
  try {
    store.setStatus('loading')
    const tokenRes = await authApi.refresh()
    await fetchAndSetAdmin(tokenRes.access_token)
    return true
  } catch {
    store.setStatus('unauthenticated')
    return false
  }
}

export function useAuth() {
  const admin = useAuthStore((s) => s.admin)
  const status = useAuthStore((s) => s.status)
  const setStatus = useAuthStore((s) => s.setStatus)
  const setMfaToken = useAuthStore((s) => s.setMfaToken)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()

  const login = async (email: string, password: string): Promise<{ mfaRequired: boolean }> => {
    setStatus('loading')
    try {
      const response = await authApi.login(email, password)

      if ('mfa_required' in response) {
        setMfaToken(response.mfa_token)
        setStatus('mfa_required')
        return { mfaRequired: true }
      }

      const tokenResponse = response as { access_token: string }
      await fetchAndSetAdmin(tokenResponse.access_token)
      navigate({ to: '/dashboard' })
      return { mfaRequired: false }
    } catch (err) {
      setStatus('unauthenticated')
      throw err
    }
  }

  const verifyMfa = async (code: string) => {
    const mfaToken = useAuthStore.getState()._mfaToken
    if (!mfaToken) 
throw new Error('No MFA token')

    setStatus('loading')
    try {
      const response = await authApi.verifyMfa(mfaToken, code)
      setMfaToken(null)
      await fetchAndSetAdmin(response.access_token)
      navigate({ to: '/dashboard' })
    } catch (err) {
      setStatus('mfa_required')
      throw err
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // Ignore — clear local state regardless
    }
    clearAuth()
    navigate({ to: '/login' })
  }

  return { admin, status, login, verifyMfa, logout }
}
