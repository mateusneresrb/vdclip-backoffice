import type { AdminRole } from '@/features/auth/lib/permissions'

export type { AuthEventType, AuthLogEntry } from '@/features/admin/types'
export type { AdminRole } from '@/features/auth/lib/permissions'

export interface AuditLogEntry {
  id: string
  adminId: string
  adminName: string
  adminEmail: string
  adminRole: AdminRole
  action: string
  /** Domain-scoped resource identifier e.g. "user", "finance.cost_entry" */
  resource: string
  resourceId: string | null
  /**
   * Human-readable context of what was modified.
   * Examples: "Feature Toggle", "Conta de Usuário", "Entrada de Custo".
   * May optionally include a technical ref suffix, e.g. "Conta de Usuário (users)"
   */
  target: string
  oldValues: Record<string, unknown> | null
  newValues: Record<string, unknown> | null
  ipAddress: string
  createdAt: string
}
