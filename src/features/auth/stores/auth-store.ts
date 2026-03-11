import type { AdminAccount, AuthStatus } from '@/features/auth/types'

import { create } from 'zustand'
import { ROLE_PERMISSIONS } from '@/features/auth/lib/permissions'

interface AuthState {
  admin: AdminAccount | null
  permissions: Set<string>
  status: AuthStatus
  setAdmin: (admin: AdminAccount) => void
  clearAuth: () => void
  setStatus: (status: AuthStatus) => void
  completeMfaSetup: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  admin: null,
  permissions: new Set<string>(),
  status: 'unauthenticated' as AuthStatus,
  setAdmin: (admin) =>
    set({
      admin,
      permissions: new Set(ROLE_PERMISSIONS[admin.role]),
      status: 'authenticated',
    }),
  clearAuth: () =>
    set({
      admin: null,
      permissions: new Set<string>(),
      status: 'unauthenticated',
    }),
  setStatus: (status) => set({ status }),
  completeMfaSetup: () =>
    set((state) => ({
      admin: state.admin ? { ...state.admin, mfaEnabled: true } : null,
    })),
}))
