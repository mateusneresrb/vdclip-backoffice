import type { AdminAccount, AuthStatus } from '@/features/auth/types'

import { create } from 'zustand'
import { ROLE_PERMISSIONS } from '@/features/auth/lib/permissions'

interface AuthState {
  admin: AdminAccount | null
  permissions: Set<string>
  status: AuthStatus
  _token: string | null
  _mfaToken: string | null
  setAdmin: (admin: AdminAccount, permissions?: string[]) => void
  setToken: (token: string) => void
  setMfaToken: (token: string | null) => void
  clearAuth: () => void
  setStatus: (status: AuthStatus) => void
  completeMfaSetup: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  admin: null,
  permissions: new Set<string>(),
  status: 'unauthenticated' as AuthStatus,
  _token: null,
  _mfaToken: null,
  setAdmin: (admin, permissions) =>
    set({
      admin,
      permissions: new Set(permissions?.length ? permissions : ROLE_PERMISSIONS[admin.role]),
      status: 'authenticated',
    }),
  setToken: (token) => set({ _token: token }),
  setMfaToken: (mfaToken) => set({ _mfaToken: mfaToken }),
  clearAuth: () =>
    set({
      admin: null,
      permissions: new Set<string>(),
      status: 'unauthenticated',
      _token: null,
      _mfaToken: null,
    }),
  setStatus: (status) => set({ status }),
  completeMfaSetup: () =>
    set((state) => ({
      admin: state.admin ? { ...state.admin, mfaEnabled: true } : null,
    })),
}))
