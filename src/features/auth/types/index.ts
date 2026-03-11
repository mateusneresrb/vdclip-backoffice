import type { AdminRole } from '@/features/auth/lib/permissions'

export interface AdminAccount {
  id: string
  name: string
  email: string
  role: AdminRole
  avatar?: string
  mfaEnabled: boolean
  lastLoginAt: string
  createdAt: string
}

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading' | 'mfa_required'
