import type { AdminSession } from '../types'

import { LogOut, MapPin, MonitorSmartphone, Search, Shield } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { PaginationControls } from '@/components/pagination-controls'
import { EmptyState } from '@/components/shared/empty-state'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { usePagination } from '@/hooks/use-pagination'

import { cn } from '@/lib/utils'
import { useAdminSessions, useRevokeOtherSessions, useRevokeSession } from '../hooks/use-admin-sessions'

function truncateUserAgent(ua: string, maxLength = 40) {
  return ua.length > maxLength ? `${ua.slice(0, maxLength)}...` : ua
}

function formatLocation(session: AdminSession): string | null {
  const parts = [session.city, session.region, session.country].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : null
}

export function AdminSessionsTab() {
  const { t } = useTranslation('admin')
  const { data: sessions, isLoading } = useAdminSessions()
  const revokeSession = useRevokeSession()
  const revokeOtherSessions = useRevokeOtherSessions()

  const [search, setSearch] = useState('')
  const [revokingSession, setRevokingSession] = useState<AdminSession | null>(null)
  const [showRevokeAllDialog, setShowRevokeAllDialog] = useState(false)

  const filtered = useMemo(() => {
    if (!sessions) return []
    if (!search) return sessions
    const q = search.toLowerCase()
    return sessions.filter(
      (s) => s.ipAddress.includes(q) || s.userAgent.toLowerCase().includes(q),
    )
  }, [sessions, search])

  const otherSessionIds = useMemo(
    () => sessions?.filter((s) => !s.isCurrent).map((s) => s.id) ?? [],
    [sessions],
  )

  const pagination = usePagination(filtered, 10)

  const handleRevokeConfirm = () => {
    if (revokingSession) {
      revokeSession.mutate(revokingSession.id)
    }
    setRevokingSession(null)
  }

  const handleRevokeAllConfirm = () => {
    if (otherSessionIds.length > 0) {
      revokeOtherSessions.mutate(otherSessionIds)
    }
    setShowRevokeAllDialog(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters + Revoke All */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('adminUsers.searchSessionsPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {otherSessionIds.length > 0 && (
          <Button
            variant="destructive"
            className="gap-1.5"
            disabled={revokeOtherSessions.isPending}
            onClick={() => setShowRevokeAllDialog(true)}
          >
            <LogOut className="size-4" />
            {t('adminUsers.revokeAll')}
          </Button>
        )}
      </div>

      {/* List */}
      {!filtered.length ? (
        <EmptyState icon={MonitorSmartphone} title={t('adminUsers.noSessions')} description={t('adminUsers.noSessionsHint')} />
      ) : (
        <div className="space-y-3">
          {pagination.paginatedItems.map((session) => {
            const location = formatLocation(session)
            return (
              <Card key={session.id}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs',
                          session.isCurrent
                            ? 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                            : 'text-muted-foreground',
                        )}
                      >
                        {session.isCurrent && <Shield className="mr-1 size-3" />}
                        {session.isCurrent ? t('adminUsers.currentSession') : t('adminUsers.sessionActive')}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="font-mono text-xs">
                        {session.ipAddress}
                      </Badge>
                      {location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3" />
                          {location}
                        </span>
                      )}
                      <span title={session.userAgent}>
                        {truncateUserAgent(session.userAgent)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        {t('adminUsers.createdAt')}: {new Date(session.createdAt).toLocaleString()}
                      </span>
                      <span>
                        {t('adminUsers.lastActivity')}: {new Date(session.lastActivityAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-1.5"
                      disabled={revokeSession.isPending}
                      onClick={() => setRevokingSession(session)}
                    >
                      <LogOut className="h-4 w-4" />
                      {t('adminUsers.revoke')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <PaginationControls {...pagination} />

      {/* Revoke Single Session Confirmation */}
      <AlertDialog open={!!revokingSession} onOpenChange={(v) => { if (!v) setRevokingSession(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('adminUsers.confirmRevokeTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('adminUsers.confirmRevokeDescription', { name: revokingSession?.adminName })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('adminUsers.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleRevokeConfirm}
            >
              {t('adminUsers.revoke')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Revoke All Other Sessions Confirmation */}
      <AlertDialog open={showRevokeAllDialog} onOpenChange={setShowRevokeAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('adminUsers.confirmRevokeAllTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('adminUsers.confirmRevokeAllDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('adminUsers.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleRevokeAllConfirm}
            >
              {t('adminUsers.revokeAll')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
