import type { AdminRole } from '@/features/auth/lib/permissions'

export interface BackofficeAdmin {
  id: string
  name: string
  email: string
  role: AdminRole
  avatar?: string
  mfaEnabled: boolean
  isActive: boolean
  lastLoginAt: string
  createdAt: string
}

export interface AdminRoleInfo {
  id: string
  name: AdminRole
  displayName: string
  description: string
  permissionCount: number
  adminCount: number
  isSystem: boolean
}

export interface AdminSession {
  id: string
  adminId: string
  adminName: string
  ipAddress: string
  userAgent: string
  city?: string
  region?: string
  country?: string
  lastActivityAt: string
  createdAt: string
  isCurrent: boolean
}
