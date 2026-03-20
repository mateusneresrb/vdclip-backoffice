import type { AdminRole } from '@/features/auth/lib/permissions'
import type { AdminAccount, AdminProfileResponse } from '@/features/auth/types'
import type { CamelizeKeys } from '@/lib/case-transform'

import { useNavigate } from '@tanstack/react-router'
import { authApi } from '@/features/auth/lib/auth-api'
import { useAuthStore } from '@/features/auth/stores/auth-store'

function mapProfileToAccount(profile: CamelizeKeys<AdminProfileResponse>): AdminAccount {
  return {
    id: profile.id,
    name: `${profile.firstName} ${profile.lastName ?? ''}`.trim(),
    email: profile.email,
    role: (profile.roles[0] ?? 'viewer') as AdminRole,
    avatar: profile.pictureUrl ?? undefined,
    mfaEnabled: profile.hasMfaEnabled,
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
    await fetchAndSetAdmin(tokenRes.accessToken)
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
  const setPasswordChangeToken = useAuthStore((s) => s.setPasswordChangeToken)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()

  const login = async (email: string, password: string): Promise<{ mfaRequired: boolean; passwordChangeRequired: boolean }> => {
    setStatus('loading')
    try {
      const response = await authApi.login(email, password)

      if ('passwordChangeRequired' in response) {
        setPasswordChangeToken(response.passwordChangeToken)
        setStatus('password_change_required')
        return { mfaRequired: false, passwordChangeRequired: true }
      }

      if ('mfaRequired' in response) {
        setMfaToken(response.mfaToken)
        setStatus('mfa_required')
        return { mfaRequired: true, passwordChangeRequired: false }
      }

      const tokenResponse = response as { accessToken: string }
      await fetchAndSetAdmin(tokenResponse.accessToken)
      navigate({ to: '/dashboard' })
      return { mfaRequired: false, passwordChangeRequired: false }
    } catch (err) {
      setStatus('unauthenticated')
      throw err
    }
  }

  const forceChangePassword = async (newPassword: string) => {
    const token = useAuthStore.getState()._passwordChangeToken
    if (!token) 
throw new Error('No password change token')

    setStatus('loading')
    try {
      await authApi.forceChangePassword(token, newPassword)
      setPasswordChangeToken(null)
      setStatus('unauthenticated')
    } catch (err) {
      setStatus('password_change_required')
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
      await fetchAndSetAdmin(response.accessToken)
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

  return { admin, status, login, verifyMfa, forceChangePassword, logout }
}
