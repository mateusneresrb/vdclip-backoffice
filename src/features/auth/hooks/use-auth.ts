import type { AdminAccount } from '@/features/auth/types'

import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth/stores/auth-store'

const MOCK_ADMIN: AdminAccount = {
  id: '1',
  name: 'Admin',
  email: 'admin@vdclip.com',
  role: 'super_admin',
  mfaEnabled: false, // Wall triggers on login — use dev bypass to skip
  lastLoginAt: new Date().toISOString(),
  createdAt: '2024-01-01T00:00:00.000Z',
}

export function useAuth() {
  const admin = useAuthStore((s) => s.admin)
  const status = useAuthStore((s) => s.status)
  const setAdmin = useAuthStore((s) => s.setAdmin)
  const setStatus = useAuthStore((s) => s.setStatus)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()

  const login = async () => {
    setStatus('loading')
    await new Promise((resolve) => setTimeout(resolve, 500))
    setAdmin(MOCK_ADMIN)
    navigate({ to: '/dashboard' })
  }

  const logout = () => {
    clearAuth()
    navigate({ to: '/login' })
  }

  return { admin, status, login, logout }
}
