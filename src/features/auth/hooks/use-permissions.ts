import { useAuthStore } from '@/features/auth/stores/auth-store'

export function useHasPermission(permission: string): boolean {
  const permissions = useAuthStore((s) => s.permissions)
  return permissions.has(permission)
}

export function useHasAnyPermission(permissions: string[]): boolean {
  const userPermissions = useAuthStore((s) => s.permissions)
  return permissions.some((p) => userPermissions.has(p))
}
