import type { TeamInvitation } from '@/features/admin/types'
import { Clock, Mail, MailCheck, MailX, RefreshCw, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { PaginationControls } from '@/components/pagination-controls'
import { EmptyState } from '@/components/shared/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

import { usePagination } from '@/hooks/use-pagination'
import { useTeamInvitations } from '../hooks/use-team-invitations'

const statusVariant: Record<TeamInvitation['status'], string> = {
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  accepted: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  expired: 'bg-muted text-muted-foreground',
}

const statusIcons: Record<TeamInvitation['status'], React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  accepted: MailCheck,
  expired: MailX,
}

export function TeamInvitationsTab({ teamId }: { teamId: string }) {
  const { t } = useTranslation('admin')
  const { data: invitations, isLoading } = useTeamInvitations(teamId)
  const [search, setSearch] = useState('')

  const filteredInvitations = useMemo(() => {
    if (!invitations) 
return []
    const q = search.toLowerCase()
    if (!q) 
return invitations
    return invitations.filter((inv) => inv.email.toLowerCase().includes(q))
  }, [invitations, search])

  const pagination = usePagination(filteredInvitations, 10)

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t('teams.invitations.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          aria-label={t('teams.invitations.searchPlaceholder')}
        />
      </div>

      {!invitations?.length ? (
        <EmptyState icon={Mail} title={t('teams.invitations.empty')} />
      ) : filteredInvitations.length === 0 ? (
        <EmptyState icon={Mail} title={t('teams.invitations.noResults')} />
      ) : (
        <>
          <div className="space-y-2">
            {pagination.paginatedItems.map((inv) => {
              const StatusIcon = statusIcons[inv.status]
              return (
                <div key={inv.id} className="flex flex-col gap-3 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex size-8 items-center justify-center rounded-md ${statusVariant[inv.status]}`}>
                      <StatusIcon className="size-4" />
                    </div>
                    <div>
                      <p className="truncate text-sm font-medium">{inv.email}</p>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Badge variant="outline" className="text-[10px]">{t(`teamRole.${inv.role}`)}</Badge>
                        <span>{t('teams.invite.invitedBy')}: {inv.invitedBy}</span>
                        <span>{t('teams.invite.expiresAt')}: {new Date(inv.expiresAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className={statusVariant[inv.status]}>
                      {t(`teams.invitationStatus.${inv.status}`)}
                    </Badge>
                    {inv.status === 'pending' && (
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                          <RefreshCw className="h-3 w-3" />
                          {t('teams.actions.resendInvite')}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-destructive hover:text-destructive">
                          <X className="h-3 w-3" />
                          {t('teams.actions.cancelInvite')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <PaginationControls {...pagination} />
        </>
      )}
    </div>
  )
}
