export const PERMISSIONS = {
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_DELETE: 'users:delete',
  TEAMS_READ: 'teams:read',
  TEAMS_WRITE: 'teams:write',
  FINANCE_READ: 'finance:read',
  FINANCE_WRITE: 'finance:write',
  FINANCE_EXPORT: 'finance:export',
  METRICS_READ: 'metrics:read',
  METRICS_EXPORT: 'metrics:export',
  ADMIN_READ: 'admin:read',
  ADMIN_WRITE: 'admin:write',
  AUDIT_READ: 'audit:read',
  PROVIDERS_READ: 'providers:read',
  PROVIDERS_WRITE: 'providers:write',
  SUBSCRIPTIONS_READ: 'subscriptions:read',
  SUBSCRIPTIONS_WRITE: 'subscriptions:write',
} as const

export type AdminRole =
  | 'super_admin'
  | 'finance_admin'
  | 'finance_viewer'
  | 'support'
  | 'viewer'

export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: Object.values(PERMISSIONS),
  finance_admin: [
    PERMISSIONS.FINANCE_READ,
    PERMISSIONS.FINANCE_WRITE,
    PERMISSIONS.FINANCE_EXPORT,
    PERMISSIONS.METRICS_READ,
    PERMISSIONS.SUBSCRIPTIONS_READ,
    PERMISSIONS.SUBSCRIPTIONS_WRITE,
  ],
  finance_viewer: [
    PERMISSIONS.FINANCE_READ,
    PERMISSIONS.METRICS_READ,
    PERMISSIONS.SUBSCRIPTIONS_READ,
  ],
  support: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_WRITE,
    PERMISSIONS.TEAMS_READ,
    PERMISSIONS.SUBSCRIPTIONS_READ,
  ],
  viewer: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.TEAMS_READ,
    PERMISSIONS.METRICS_READ,
  ],
}
