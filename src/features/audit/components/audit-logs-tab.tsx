import type { AuditLogEntry } from '../types'
import type { MetricsDateRange } from '@/features/admin/types'
import { format, startOfYear, subDays, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Download,
  ScrollText,
  Search,
  X,
} from 'lucide-react'

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PaginationControls } from '@/components/pagination-controls'
import { EmptyState } from '@/components/shared/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { DateRangeFilter } from '@/features/dashboard/components/date-range-filter'
import { usePagination } from '@/hooks/use-pagination'

import { cn } from '@/lib/utils'
import { useAuditLogs, useAuditLogsRaw } from '../hooks/use-audit-logs'

// All possible audit actions grouped by domain
const ACTION_GROUPS = [
  {
    group: 'audit.actionGroups.users',
    actions: [
      'user.plan_changed',
      'user.status_changed',
      'user.credit_added',
      'user.credit_deducted',
      'user.account_unlocked',
      'user.deleted',
      'user.refund_issued',
    ],
  },
  {
    group: 'audit.actionGroups.subscriptions',
    actions: ['subscription.cancelled', 'subscription.extended', 'subscription.reactivated'],
  },
  {
    group: 'audit.actionGroups.finance',
    actions: [
      'finance.cost_entry_created',
      'finance.cost_entry_updated',
      'finance.cost_entry_deleted',
      'finance.bank_account_created',
      'finance.bank_account_updated',
      'finance.bank_account_deleted',
      'finance.category_created',
      'finance.category_updated',
      'finance.category_deleted',
      'finance.tax_config_created',
      'finance.tax_config_updated',
      'finance.tax_config_deleted',
    ],
  },
  {
    group: 'audit.actionGroups.teams',
    actions: ['team.settings_updated', 'team.member_removed'],
  },
  {
    group: 'audit.actionGroups.providers',
    actions: ['provider.toggled', 'provider.config_updated'],
  },
  {
    group: 'audit.actionGroups.admins',
    actions: [
      'admin.created',
      'admin.role_changed',
      'admin.permissions_updated',
      'admin.deactivated',
      'admin.session_revoked',
    ],
  },
] as const

const ACTION_SEVERITY: Record<string, string> = {
  // Destructive / critical
  'user.deleted': 'bg-red-500/15 text-red-700 dark:text-red-400',
  'user.status_changed': 'bg-red-500/15 text-red-700 dark:text-red-400',
  'admin.deactivated': 'bg-red-500/15 text-red-700 dark:text-red-400',
  'admin.session_revoked': 'bg-red-500/15 text-red-700 dark:text-red-400',
  'subscription.cancelled': 'bg-red-500/15 text-red-700 dark:text-red-400',
  'finance.cost_entry_deleted': 'bg-red-500/15 text-red-700 dark:text-red-400',
  'finance.bank_account_deleted': 'bg-red-500/15 text-red-700 dark:text-red-400',
  'finance.category_deleted': 'bg-red-500/15 text-red-700 dark:text-red-400',
  'finance.tax_config_deleted': 'bg-red-500/15 text-red-700 dark:text-red-400',
  // Finance / high impact
  'user.refund_issued': 'bg-teal-500/15 text-teal-700 dark:text-teal-400',
  'user.credit_added': 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  'user.credit_deducted': 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
  'subscription.extended': 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  'subscription.reactivated': 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  'finance.cost_entry_created': 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  'finance.cost_entry_updated': 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  'finance.bank_account_created': 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  'finance.bank_account_updated': 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  'finance.category_created': 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  'finance.category_updated': 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  'finance.tax_config_created': 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  'finance.tax_config_updated': 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  // Admin changes
  'user.plan_changed': 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  'user.account_unlocked': 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  'admin.created': 'bg-purple-500/15 text-purple-700 dark:text-purple-400',
  'admin.role_changed': 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
  'admin.permissions_updated': 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
  'provider.toggled': 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  'provider.config_updated': 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  'team.settings_updated': 'bg-teal-500/15 text-teal-700 dark:text-teal-400',
  'team.member_removed': 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
}

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  finance_admin: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  finance_viewer: 'bg-blue-500/10 text-blue-600 dark:text-blue-300',
  support: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  viewer: 'bg-muted text-muted-foreground',
}

function getAllKeys(
  oldValues: Record<string, unknown> | null,
  newValues: Record<string, unknown> | null,
): string[] {
  const keys = new Set<string>()
  if (oldValues) 
Object.keys(oldValues).forEach((k) => keys.add(k))
  if (newValues) 
Object.keys(newValues).forEach((k) => keys.add(k))
  return Array.from(keys)
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) 
return '-'
  if (typeof value === 'object') 
return JSON.stringify(value)
  return String(value)
}

function exportToCsv(logs: AuditLogEntry[], t: (key: string, opts?: Record<string, unknown>) => string) {
  const headers = [
    t('audit.csv.date'),
    t('audit.csv.admin'),
    t('audit.csv.adminEmail'),
    t('audit.csv.adminRole'),
    t('audit.csv.action'),
    t('audit.csv.resource'),
    t('audit.csv.resourceId'),
    t('audit.csv.target'),
    t('audit.csv.ip'),
    t('audit.csv.oldValues'),
    t('audit.csv.newValues'),
  ]

  const rows = logs.map((log) => [
    format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR }),
    log.adminName,
    log.adminEmail,
    log.adminRole,
    log.action,
    log.resource,
    log.resourceId ?? '',
    log.target,
    log.ipAddress,
    log.oldValues ? JSON.stringify(log.oldValues) : '',
    log.newValues ? JSON.stringify(log.newValues) : '',
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function DiffView({ oldValues, newValues }: {
  oldValues: Record<string, unknown> | null
  newValues: Record<string, unknown> | null
}) {
  const { t } = useTranslation('admin')
  const keys = getAllKeys(oldValues, newValues)
  if (keys.length === 0) 
return null

  return (
    <div className="ml-6 mt-1 overflow-x-auto rounded-md border bg-muted/30" role="table" aria-label={t('audit.changeDetails')}>
      <div className="grid min-w-[480px] grid-cols-3 gap-px border-b bg-border text-xs font-medium" role="row">
        <div className="bg-muted/50 px-3 py-1.5" role="columnheader">{t('audit.diffField')}</div>
        <div className="bg-red-500/5 px-3 py-1.5 text-red-700 dark:text-red-400" role="columnheader">{t('audit.oldValues')}</div>
        <div className="bg-emerald-500/5 px-3 py-1.5 text-emerald-700 dark:text-emerald-400" role="columnheader">{t('audit.newValues')}</div>
      </div>
      <div className="divide-y divide-border">
        {keys.map((key) => {
          const oldVal = oldValues?.[key]
          const newVal = newValues?.[key]
          const changed = JSON.stringify(oldVal) !== JSON.stringify(newVal)
          return (
            <div key={key} className="grid min-w-[480px] grid-cols-3 gap-px text-xs" role="row">
              <div className="bg-background px-3 py-1.5 font-mono font-medium" role="cell">{key}</div>
              <div className={cn('px-3 py-1.5 font-mono', changed ? 'bg-red-500/10 text-red-700 dark:text-red-400' : 'bg-background text-muted-foreground')} role="cell">
                {oldVal !== undefined ? formatValue(oldVal) : '-'}
              </div>
              <div className={cn('px-3 py-1.5 font-mono', changed ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-background text-muted-foreground')} role="cell">
                {newVal !== undefined ? formatValue(newVal) : '-'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const PRESET_RANGES: Record<string, () => { from: Date; to: Date }> = {
  '1d': () => { const n = new Date(); return { from: subDays(n, 1), to: n } },
  '3d': () => { const n = new Date(); return { from: subDays(n, 3), to: n } },
  '7d': () => { const n = new Date(); return { from: subDays(n, 7), to: n } },
  '30d': () => { const n = new Date(); return { from: subDays(n, 30), to: n } },
  '90d': () => { const n = new Date(); return { from: subMonths(n, 3), to: n } },
  'ytd': () => { const n = new Date(); return { from: startOfYear(n), to: n } },
}

export function AuditLogsTab() {
  const { t } = useTranslation('admin')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [resourceFilter, setResourceFilter] = useState<string>('all')
  const [adminFilter, setAdminFilter] = useState<string>('all')
  const [metricsRange, setMetricsRange] = useState<MetricsDateRange>('30d')
  const [absFrom, setAbsFrom] = useState<Date | null>(null)
  const [absTo, setAbsTo] = useState<Date | null>(null)

  const { dateFrom, dateTo } = useMemo(() => {
    if (metricsRange === 'custom') {
      return {
        dateFrom: absFrom ? format(absFrom, 'yyyy-MM-dd') : undefined,
        dateTo: absTo ? format(absTo, 'yyyy-MM-dd') : undefined,
      }
    }
    const range = PRESET_RANGES[metricsRange]?.()
    return range
      ? { dateFrom: format(range.from, 'yyyy-MM-dd'), dateTo: format(range.to, 'yyyy-MM-dd') }
      : { dateFrom: undefined, dateTo: undefined }
  }, [metricsRange, absFrom, absTo])

  const filters = useMemo(
    () => ({ search: search || undefined, action: actionFilter, resource: resourceFilter, adminId: adminFilter, dateFrom, dateTo }),
    [search, actionFilter, resourceFilter, adminFilter, dateFrom, dateTo],
  )

  const { data: logs, isLoading } = useAuditLogs(filters)
  // Raw (unfiltered) data for populating filter options
  const { data: allLogs } = useAuditLogsRaw()

  const adminOptions = useMemo(() => {
    if (!allLogs) 
return []
    const seen = new Map<string, { name: string; email: string }>()
    for (const log of allLogs) seen.set(log.adminId, { name: log.adminName, email: log.adminEmail })
    return [...seen.entries()].sort((a, b) => a[1].name.localeCompare(b[1].name))
  }, [allLogs])

  const resourceOptions = useMemo(() => {
    if (!allLogs) 
return []
    return [...new Set(allLogs.map((l) => l.resource))].sort()
  }, [allLogs])

  const pagination = usePagination(logs ?? [], 15)

  const hasActiveFilters = actionFilter !== 'all' || resourceFilter !== 'all' || adminFilter !== 'all' || !!search

  function clearFilters() {
    setActionFilter('all')
    setResourceFilter('all')
    setAdminFilter('all')
    setSearch('')
  }

  return (
    <div className="space-y-6">
      {/* ── Filter bar ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          {/* Row 1: search + action + resource */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('audit.searchPlaceholder')}
                aria-label={t('audit.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 sm:w-60"
              />
            </div>

            {/* Action grouped select */}
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-56" aria-label={t('audit.filterByAction')}>
                <SelectValue placeholder={t('audit.filterByAction')} />
              </SelectTrigger>
              <SelectContent className="max-h-72 overflow-y-auto">
                <SelectItem value="all">{t('audit.allActions')}</SelectItem>
                {ACTION_GROUPS.map((group) => (
                  <SelectGroup key={group.group}>
                    <SelectLabel>{t(group.group)}</SelectLabel>
                    {group.actions.map((action) => (
                      <SelectItem key={action} value={action}>
                        {t(`audit.actions.${action}`, { defaultValue: action })}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>

            {/* Resource/entity */}
            <Select value={resourceFilter} onValueChange={setResourceFilter}>
              <SelectTrigger className="w-full sm:w-48" aria-label={t('audit.filterByEntity')}>
                <SelectValue placeholder={t('audit.filterByEntity')} />
              </SelectTrigger>
              <SelectContent className="max-h-56 overflow-y-auto">
                <SelectItem value="all">{t('audit.allEntities')}</SelectItem>
                {resourceOptions.map((res) => (
                  <SelectItem key={res} value={res}>
                    {t(`audit.entities.${res}`, { defaultValue: res })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row 2: admin + date picker + clear */}
          <div className="flex flex-wrap items-center gap-2">
            <Select value={adminFilter} onValueChange={setAdminFilter}>
              <SelectTrigger className="w-full sm:w-56" aria-label={t('audit.filterByAdmin')}>
                <SelectValue placeholder={t('audit.filterByAdmin')} />
              </SelectTrigger>
              <SelectContent className="max-h-56 overflow-y-auto">
                <SelectItem value="all">{t('audit.allAdmins')}</SelectItem>
                {adminOptions.map(([id, info]) => (
                  <SelectItem key={id} value={id}>
                    {info.name}
                    <span className="ml-1 text-xs text-muted-foreground">({info.email})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DateRangeFilter
              dateRange={metricsRange}
              onDateRangeChange={setMetricsRange}
              onAbsoluteChange={(from, to) => { setAbsFrom(from); setAbsTo(to) }}
            />

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 text-xs">
                <X className="mr-1 h-3.5 w-3.5" />
                {t('audit.clearFilters')}
              </Button>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={!logs?.length}
          onClick={() => logs && exportToCsv(logs, t)}
          className="shrink-0 self-start"
        >
          <Download className="mr-2 h-4 w-4" />
          {t('audit.exportCsv')}
        </Button>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="space-y-3" role="status" aria-busy="true" aria-label={t('audit.loading')}>
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : !logs?.length ? (
        <div role="status" aria-live="polite">
          <EmptyState icon={ScrollText} title={t('audit.noResults')} description={t('audit.noResultsHint')} />
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <ClipboardList className="h-4 w-4" />
              {t('audit.recentActions')}
              <span className="ml-auto text-xs font-normal text-muted-foreground">
                {logs.length} {t('audit.resultsCount')}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[640px] space-y-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border">
              {pagination.paginatedItems.map((log) => {
                const isExpanded = expandedId === log.id
                return (
                  <div key={log.id}>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={`diff-${log.id}`}
                      onClick={() => setExpandedId(isExpanded ? null : log.id)}
                      className={cn(
                        'flex w-full flex-col gap-1.5 rounded-md border p-3 text-left transition-colors hover:bg-muted/50',
                        'sm:flex-row sm:items-start sm:justify-between',
                        isExpanded && 'bg-muted/30',
                      )}
                    >
                      {/* Left: action + admin info + resource */}
                      <div className="flex flex-col gap-1.5">
                        {/* Line 1: expand icon + action badge */}
                        <div className="flex items-center gap-2">
                          {isExpanded
                            ? <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                            : <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                          }
                          <span className={cn(
                            'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
                            ACTION_SEVERITY[log.action] ?? 'bg-muted text-muted-foreground',
                          )}>
                            {t(`audit.actions.${log.action}`, { defaultValue: log.action })}
                          </span>
                        </div>

                        {/* Line 2: admin name + email + role */}
                        <div className="ml-6 flex flex-wrap items-center gap-1.5 text-xs">
                          <span className="font-medium">{log.adminName}</span>
                          <span className="text-muted-foreground">{log.adminEmail}</span>
                          <span className={cn(
                            'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                            ROLE_COLORS[log.adminRole] ?? ROLE_COLORS.viewer,
                          )}>
                            {t(`adminUsers.roles.${log.adminRole}`, { defaultValue: log.adminRole })}
                          </span>
                        </div>

                        {/* Line 3: resource + resource ID + target context */}
                        <div className="ml-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{t(`audit.entities.${log.resource}`, { defaultValue: log.resource })}</span>
                          {log.resourceId && (
                            <Badge variant="outline" className="font-mono text-[10px]">
                              {log.resourceId}
                            </Badge>
                          )}
                          <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
                            {log.target}
                          </Badge>
                        </div>
                      </div>

                      {/* Right: IP + date */}
                      <div className="ml-6 flex shrink-0 items-center gap-3 text-xs text-muted-foreground sm:ml-0">
                        <Badge variant="outline" className="font-mono text-xs">{log.ipAddress}</Badge>
                        <span className="whitespace-nowrap">{format(new Date(log.createdAt), 'dd/MM/yy HH:mm', { locale: ptBR })}</span>
                      </div>
                    </button>

                    {isExpanded && (log.oldValues || log.newValues) && (
                      <div id={`diff-${log.id}`}>
                        <DiffView oldValues={log.oldValues} newValues={log.newValues} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {(logs?.length ?? 0) > 0 && <PaginationControls {...pagination} />}
    </div>
  )
}
