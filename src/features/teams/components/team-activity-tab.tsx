import type { UserActivityEvent } from '@/features/admin/types'
import {
  ChevronDown,
  ChevronRight,
  CreditCard,
  Key,
  LogIn,
  Pencil,
  Plus,
  Video,
} from 'lucide-react'
import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { PaginationControls } from '@/components/pagination-controls'
import { EmptyState } from '@/components/shared/empty-state'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { usePagination } from '@/hooks/use-pagination'

import { cn } from '@/lib/utils'
import { useTeamActivity } from '../hooks/use-team-activity'

type ActivityType = UserActivityEvent['type']

const eventIcons: Record<ActivityType, React.ComponentType<{ className?: string }>> = {
  subscription_created: CreditCard,
  plan_changed: Pencil,
  credits_added: Plus,
  login: LogIn,
  password_changed: Key,
  media_created: Video,
}

const eventColors: Record<ActivityType, string> = {
  subscription_created: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  plan_changed: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  credits_added: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  login: 'bg-muted text-muted-foreground',
  password_changed: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
  media_created: 'bg-pink-500/15 text-pink-600 dark:text-pink-400',
}

const eventDotColors: Record<ActivityType, string> = {
  subscription_created: 'bg-emerald-500',
  plan_changed: 'bg-blue-500',
  credits_added: 'bg-amber-500',
  login: 'bg-muted-foreground/50',
  password_changed: 'bg-violet-500',
  media_created: 'bg-pink-500',
}

const activityTypes: Array<ActivityType | 'all'> = [
  'all',
  'subscription_created',
  'plan_changed',
  'credits_added',
  'media_created',
]

export function TeamActivityTab({ teamId }: { teamId: string }) {
  const { t } = useTranslation('admin')
  const { data: events, isLoading } = useTeamActivity(teamId)
  const [typeFilter, setTypeFilter] = useState<ActivityType | 'all'>('all')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const filteredEvents = (events ?? []).filter(
    (event) => typeFilter === 'all' || event.type === typeFilter,
  )
  const pagination = usePagination(filteredEvents, 10)

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) 
next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    )
  }

  if (!events?.length) {
    return <EmptyState icon={LogIn} title={t('activity.noEvents')} />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as ActivityType | 'all')}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder={t('activity.filterByType')} />
          </SelectTrigger>
          <SelectContent>
            {activityTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type === 'all' ? t('activity.allTypes') : t(`activity.eventTypes.${type}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">
          {filteredEvents.length} {t('activity.eventsCount')}
        </span>
      </div>

      {filteredEvents.length === 0 ? (
        <EmptyState icon={LogIn} title={t('activity.noFilteredEvents')} />
      ) : (
        <>
          <div className="relative ml-3">
            <div className="absolute bottom-2 left-[7px] top-2 w-px bg-border" />
            {pagination.paginatedItems.map((event, index) => {
              const Icon = eventIcons[event.type]
              const isExpanded = expandedIds.has(event.id)
              const hasMetadata = event.metadata && Object.keys(event.metadata).length > 0
              const isLast = index === pagination.paginatedItems.length - 1
              return (
                <div key={event.id} className={cn('relative pl-8', !isLast && 'pb-6')}>
                  <div className={cn('absolute left-0 top-1 flex size-[15px] items-center justify-center rounded-full ring-2 ring-background', eventDotColors[event.type])} />
                  <div className="rounded-lg border bg-card p-3 shadow-sm">
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className={cn('flex size-7 shrink-0 items-center justify-center rounded-md', eventColors[event.type])}>
                          <Icon className="size-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="text-sm font-medium">{t(`activity.eventTypes.${event.type}`)}</p>
                            <Badge variant="secondary" className={cn('text-[10px] font-normal', eventColors[event.type])}>
                              {t(`activity.eventTypes.${event.type}`)}
                            </Badge>
                          </div>
                          <p className="truncate text-xs text-muted-foreground">{event.description}</p>
                        </div>
                      </div>
                      <span className="shrink-0 whitespace-nowrap pl-9 text-[11px] text-muted-foreground sm:pl-0">
                        {new Date(event.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {hasMetadata && (
                      <div className="mt-2">
                        <button
                          type="button"
                          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                          onClick={() => toggleExpand(event.id)}
                        >
                          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                          {t('activity.metadata')}
                        </button>
                        {isExpanded && (
                          <div className="mt-2 rounded-md border bg-muted/30 p-2.5">
                            <div className="space-y-1">
                              {Object.entries(event.metadata!).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between text-xs">
                                  <span className="font-medium text-muted-foreground">{key}</span>
                                  <Badge variant="outline" className="font-mono text-[10px]">{String(value)}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
