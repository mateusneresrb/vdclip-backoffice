import type { AuthLogEntry } from '../types'
import type { MetricsDateRange } from '@/features/admin/types'
import { format, startOfYear, subDays, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Briefcase,
  ChevronDown,
  ChevronRight,
  Lock,
  LogIn,
  Search,
  ShieldAlert,
  ShieldCheck,
  XCircle,
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

import { DateRangeFilter } from '@/features/dashboard/components/date-range-filter'
import { usePagination } from '@/hooks/use-pagination'

import { cn } from '@/lib/utils'
import { useAdminAuthLogs } from '../hooks/use-auth-logs'

const eventTypeColors: Record<string, string> = {
  login_success: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  login_failed: 'bg-red-500/15 text-red-700 dark:text-red-400',
  password_changed: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  oauth_connected: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  oauth_disconnected: 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
  token_refreshed: 'bg-muted text-muted-foreground',
  account_locked: 'bg-red-500/15 text-red-700 dark:text-red-400',
}

const EVENT_TYPES = [
  'login_success',
  'login_failed',
  'password_changed',
  'oauth_connected',
  'oauth_disconnected',
  'token_refreshed',
  'account_locked',
] as const

const userSourceColors: Record<string, string> = {
  vdclip: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  business: 'bg-blue-600/10 text-blue-700 dark:text-blue-400',
}

function computeSummary(logs: AuthLogEntry[]) {
  let successCount = 0
  let failedCount = 0
  let lockedCount = 0

  for (const log of logs) {
    if (log.eventType === 'login_success') 
successCount++
    else if (log.eventType === 'login_failed') 
failedCount++
    else if (log.eventType === 'account_locked') 
lockedCount++
  }

  return {
    total: logs.length,
    success: successCount,
    failed: failedCount,
    locked: lockedCount,
  }
}

function SummaryBar({ logs }: { logs: AuthLogEntry[] }) {
  const { t } = useTranslation('admin')
  const summary = useMemo(() => computeSummary(logs), [logs])

  const items = [
    {
      label: t('logs.summaryTotal'),
      value: summary.total,
      icon: ShieldCheck,
      color: 'text-foreground',
      bg: 'bg-muted/50',
    },
    {
      label: t('logs.summarySuccess'),
      value: summary.success,
      icon: LogIn,
      color: 'text-emerald-700 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: t('logs.summaryFailed'),
      value: summary.failed,
      icon: XCircle,
      color: 'text-red-700 dark:text-red-400',
      bg: 'bg-red-500/10',
    },
    {
      label: t('logs.summaryLocked'),
      value: summary.locked,
      icon: Lock,
      color: 'text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="flex items-center gap-3 p-3">
            <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-md', item.bg)}>
              <item.icon className={cn('h-4 w-4', item.color)} />
            </div>
            <div>
              <p className="text-lg font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function MetadataView({ log }: { log: AuthLogEntry }) {
  const { t } = useTranslation('admin')

  const details = [
    { label: t('logs.metadataUserAgent'), value: log.userAgent },
    { label: t('logs.metadataIp'), value: log.ipAddress },
    { label: t('logs.metadataUserId'), value: log.userId != null ? String(log.userId) : null },
  ]

  const metadataEntries = log.metadata ? Object.entries(log.metadata) : []

  return (
    <div className="ml-6 mt-1 rounded-md border bg-muted/30 p-3">
      <p className="mb-2 text-xs font-medium text-muted-foreground">
        {t('logs.metadataTitle')}
      </p>
      <dl className="grid gap-1.5 text-xs sm:grid-cols-2">
        {details.map(
          (detail) =>
            detail.value && (
              <div key={detail.label} className="flex items-center gap-2">
                <dt className="font-medium text-muted-foreground">{detail.label}:</dt>
                <dd className="font-mono">{detail.value}</dd>
              </div>
            ),
        )}
        {metadataEntries.map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <dt className="font-medium text-muted-foreground">{key}:</dt>
            <dd className="font-mono">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function AuthLogsTab() {
  const { t } = useTranslation('admin')
  const [search, setSearch] = useState('')
  const [eventFilter, setEventFilter] = useState<string>('all')
  const [userSourceFilter, setUserSourceFilter] = useState<string>('all')
  const [metricsRange, setMetricsRange] = useState<MetricsDateRange>('30d')
  const [absFrom, setAbsFrom] = useState<Date | null>(null)
  const [absTo, setAbsTo] = useState<Date | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { data: logs, isLoading } = useAdminAuthLogs(search)

  const { dateFrom, dateTo } = useMemo(() => {
    const PRESETS: Record<string, () => { from: Date; to: Date }> = {
      '1d': () => { const n = new Date(); return { from: subDays(n, 1), to: n } },
      '3d': () => { const n = new Date(); return { from: subDays(n, 3), to: n } },
      '7d': () => { const n = new Date(); return { from: subDays(n, 7), to: n } },
      '30d': () => { const n = new Date(); return { from: subDays(n, 30), to: n } },
      '90d': () => { const n = new Date(); return { from: subMonths(n, 3), to: n } },
      'ytd': () => { const n = new Date(); return { from: startOfYear(n), to: n } },
    }
    if (metricsRange === 'custom') {
      return {
        dateFrom: absFrom ? format(absFrom, 'yyyy-MM-dd') : undefined,
        dateTo: absTo ? format(absTo, 'yyyy-MM-dd') : undefined,
      }
    }
    const range = PRESETS[metricsRange]?.()
    return range
      ? { dateFrom: format(range.from, 'yyyy-MM-dd'), dateTo: format(range.to, 'yyyy-MM-dd') }
      : { dateFrom: undefined, dateTo: undefined }
  }, [metricsRange, absFrom, absTo])

  const filtered = useMemo(() => {
    if (!logs) 
return []
    return logs.filter((log) => {
      if (eventFilter !== 'all' && log.eventType !== eventFilter) 
return false
      if (userSourceFilter !== 'all' && log.userSource !== userSourceFilter) 
return false
      if (dateFrom && log.createdAt < dateFrom) 
return false
      if (dateTo && log.createdAt > `${dateTo}T23:59:59Z`) 
return false
      return true
    })
  }, [logs, eventFilter, userSourceFilter, dateFrom, dateTo])

  const pagination = usePagination(filtered, 15)

  const hasActiveFilters = eventFilter !== 'all' || userSourceFilter !== 'all' || !!search

  function clearFilters() {
    setEventFilter('all')
    setUserSourceFilter('all')
    setSearch('')
  }

  return (
    <div className="space-y-6">
      {!isLoading && logs && logs.length > 0 && <SummaryBar logs={filtered} />}

      <div className="flex flex-col gap-2">
        {/* Row 1: search + event type + user source */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('logs.searchPlaceholder')}
              aria-label={t('logs.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 sm:w-64"
            />
          </div>
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-full sm:w-52" aria-label={t('logs.filterByEvent')}>
              <SelectValue placeholder={t('logs.filterByEvent')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('logs.allEvents')}</SelectItem>
              {EVENT_TYPES.map((eventType) => (
                <SelectItem key={eventType} value={eventType}>
                  {t(`logs.eventTypes.${eventType}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={userSourceFilter} onValueChange={setUserSourceFilter}>
            <SelectTrigger className="w-full sm:w-48" aria-label={t('logs.filterByProduct')}>
              <SelectValue placeholder={t('logs.filterByProduct')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('logs.allProducts')}</SelectItem>
              <SelectItem value="vdclip">{t('logs.productVdclip')}</SelectItem>
              <SelectItem value="business">{t('logs.productBusiness')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Row 2: date range + clear */}
        <div className="flex items-center gap-2">
          <DateRangeFilter
            dateRange={metricsRange}
            onDateRangeChange={setMetricsRange}
            onAbsoluteChange={(from, to) => { setAbsFrom(from); setAbsTo(to) }}
          />
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 text-xs">
              {t('logs.clearFilters')}
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3" role="status" aria-busy="true" aria-label={t('logs.loading')}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : !filtered.length ? (
        <div role="status" aria-live="polite">
          <EmptyState icon={ShieldAlert} title={t('logs.noResults')} description={t('logs.noResultsHint')} />
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4" />
              {t('logs.recentEvents')}
              <span className="ml-auto text-xs font-normal text-muted-foreground">
                {filtered.length} {t('logs.resultsCount')}
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
                      aria-controls={`meta-${log.id}`}
                      onClick={() => setExpandedId(isExpanded ? null : log.id)}
                      className={cn(
                        'flex w-full flex-col gap-1 rounded-md border p-3 text-left transition-colors hover:bg-muted/50',
                        'sm:flex-row sm:items-center sm:justify-between',
                      )}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                          )}
                          <span
                            className={cn(
                              'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
                              eventTypeColors[log.eventType] ?? eventTypeColors.token_refreshed,
                            )}
                          >
                            {t(`logs.eventTypes.${log.eventType}`)}
                          </span>
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium',
                              userSourceColors[log.userSource],
                            )}
                          >
                            {log.userSource === 'business' && <Briefcase className="h-3 w-3" />}
                            {t(`logs.product${log.userSource === 'vdclip' ? 'Vdclip' : 'Business'}`)}
                          </span>
                          {log.userName && (
                            <span className="text-sm font-medium">{log.userName}</span>
                          )}
                        </div>
                        {log.userEmail && (
                          <span className="ml-6 text-xs text-muted-foreground">{log.userEmail}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {log.ipAddress && (
                          <Badge variant="outline" className="font-mono text-xs">
                            {log.ipAddress}
                          </Badge>
                        )}
                        <span>{format(new Date(log.createdAt), 'dd/MM/yy HH:mm', { locale: ptBR })}</span>
                      </div>
                    </button>

                    {isExpanded && (
                      <div id={`meta-${log.id}`}>
                        <MetadataView log={log} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {filtered.length > 0 && <PaginationControls {...pagination} />}
    </div>
  )
}
