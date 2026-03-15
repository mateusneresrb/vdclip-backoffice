import type { AuditLogEntry } from '../types'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api-client'

export interface AuditLogFilters {
  search?: string
  action?: string
  resource?: string
  adminId?: string
  dateFrom?: string
  dateTo?: string
}

const auditLogsKeys = {
  all: ['audit-logs'] as const,
  list: (filters: AuditLogFilters) => [...auditLogsKeys.all, 'list', filters] as const,
}

function mapAuditLog(data: Record<string, unknown>): AuditLogEntry {
  return {
    id: String(data.id),
    adminId: String(data.admin_user_id ?? data.adminId ?? ''),
    adminName: String(data.admin_name ?? data.adminName ?? ''),
    adminEmail: String(data.admin_email ?? data.adminEmail ?? ''),
    adminRole: (data.admin_role ?? data.adminRole ?? 'viewer') as AuditLogEntry['adminRole'],
    action: String(data.action ?? ''),
    resource: String(data.entity_type ?? data.resource ?? ''),
    resourceId: (data.entity_id ?? data.resourceId ?? null) as string | null,
    target: String(data.target ?? data.entity_type ?? ''),
    oldValues: (data.old_values ?? data.oldValues ?? null) as Record<string, unknown> | null,
    newValues: (data.new_values ?? data.newValues ?? null) as Record<string, unknown> | null,
    ipAddress: String(data.ip_address ?? data.ipAddress ?? ''),
    createdAt: String(data.created_at ?? data.createdAt ?? ''),
  }
}

export function useAuditLogs(filters: AuditLogFilters = {}) {
  return useQuery({
    queryKey: auditLogsKeys.list(filters),
    queryFn: async () => {
      const params: Record<string, string | number | boolean | undefined> = {
        page: 1,
        per_page: 50,
      }
      if (filters.search) 
params.search = filters.search
      if (filters.action && filters.action !== 'all') 
params.action = filters.action
      if (filters.resource && filters.resource !== 'all') 
params.entity_type = filters.resource
      if (filters.adminId && filters.adminId !== 'all') 
params.admin_user_id = filters.adminId
      if (filters.dateFrom) 
params.date_from = filters.dateFrom
      if (filters.dateTo) 
params.date_to = filters.dateTo

      const data = await apiClient.get<
        Record<string, unknown>[]
        | { items: Record<string, unknown>[], total?: number }
      >('/audit-logs', params)
      const items = Array.isArray(data) ? data : (data.items ?? [])
      return items.map(mapAuditLog)
    },
  })
}

export function useAuditLogsRaw() {
  return useQuery({
    queryKey: auditLogsKeys.all,
    queryFn: async () => {
      const data = await apiClient.get<
        Record<string, unknown>[]
        | { items: Record<string, unknown>[] }
      >('/audit-logs', { page: 1, per_page: 200 })
      const items = Array.isArray(data) ? data : (data.items ?? [])
      return items.map(mapAuditLog)
    },
  })
}
