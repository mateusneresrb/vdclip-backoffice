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
    adminId: String(data.adminUserId ?? data.adminId ?? ''),
    adminName: String(data.adminName ?? ''),
    adminEmail: String(data.adminEmail ?? ''),
    adminRole: (data.adminRole ?? 'viewer') as AuditLogEntry['adminRole'],
    action: String(data.action ?? ''),
    resource: String(data.entityType ?? data.resource ?? ''),
    resourceId: (data.entityId ?? data.resourceId ?? null) as string | null,
    target: String(data.target ?? data.entityType ?? ''),
    oldValues: (data.oldValues ?? null) as Record<string, unknown> | null,
    newValues: (data.newValues ?? null) as Record<string, unknown> | null,
    ipAddress: String(data.ipAddress ?? ''),
    createdAt: String(data.createdAt ?? ''),
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
