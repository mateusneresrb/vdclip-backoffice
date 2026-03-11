import type { ReactNode } from 'react'

import { useHasPermission } from '@/features/auth/hooks/use-permissions'

interface PermissionGuardProps {
  permission: string
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGuard({ permission, fallback = null, children }: PermissionGuardProps) {
  const hasPermission = useHasPermission(permission)

  if (!hasPermission) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
