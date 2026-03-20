import { Search, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PaginationControls } from '@/components/pagination-controls'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { usePagination } from '@/hooks/use-pagination'

import { useAdminAuthLogs } from '../hooks/use-admin-auth-logs'

const eventTypeColors: Record<string, string> = {
  login_success: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  login_failed: 'bg-red-500/15 text-red-700 dark:text-red-400',
  password_changed: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  oauth_connected: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  oauth_disconnected: 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
  token_refreshed: 'bg-muted text-muted-foreground',
  account_locked: 'bg-red-500/15 text-red-700 dark:text-red-400',
}

export function AuthLogsViewer() {
  const { t } = useTranslation('admin')
  const [search, setSearch] = useState('')
  const { data: logs, isLoading } = useAdminAuthLogs(search)
  const pagination = usePagination(logs ?? [], 15)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          {t('logs.title')}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('logs.description')}
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t('logs.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : !logs?.length ? (
        <p className="text-muted-foreground">{t('logs.noResults')}</p>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4" />
              {t('logs.recentEvents')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {pagination.paginatedItems.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col gap-1 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${eventTypeColors[log.eventType] ?? eventTypeColors.token_refreshed}`}>
                        {t(`logs.eventTypes.${log.eventType}`)}
                      </span>
                      {log.userName && (
                        <span className="text-sm font-medium">{log.userName}</span>
                      )}
                    </div>
                    {log.userEmail && (
                      <span className="text-xs text-muted-foreground">{log.userEmail}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {log.ipAddress && (
                      <Badge variant="outline" className="text-xs font-mono">
                        {log.ipAddress}
                      </Badge>
                    )}
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <PaginationControls {...pagination} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
