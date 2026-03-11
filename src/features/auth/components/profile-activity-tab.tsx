import { Key, Link2, LogIn, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { EmptyState } from '@/components/shared/empty-state'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'
import { useProfileActivity } from '../hooks/use-profile-activity'

const eventIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  login: LogIn,
  password_changed: Key,
  mfa_enabled: ShieldCheck,
  oauth_connected: Link2,
}

const eventColors: Record<string, string> = {
  login: 'bg-muted text-muted-foreground',
  password_changed: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  mfa_enabled: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  oauth_connected: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
}

const eventDotColors: Record<string, string> = {
  login: 'bg-muted-foreground/50',
  password_changed: 'bg-amber-500',
  mfa_enabled: 'bg-emerald-500',
  oauth_connected: 'bg-blue-500',
}

export function ProfileActivityTab() {
  const { t } = useTranslation('common')
  const { data: events, isLoading } = useProfileActivity()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {t('profile.activityLog.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : !events || events.length === 0 ? (
          <EmptyState
            icon={LogIn}
            title={t('profile.activityLog.noEvents')}
          />
        ) : (
          <div className="relative ml-3">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

            {events.map((event, index) => {
              const Icon = eventIcons[event.type] ?? LogIn
              const isLast = index === events.length - 1

              return (
                <div key={event.id} className={cn('relative pl-8', !isLast && 'pb-5')}>
                  <div
                    className={cn(
                      'absolute left-0 top-1 flex size-[15px] items-center justify-center rounded-full ring-2 ring-background',
                      eventDotColors[event.type] ?? eventDotColors.login,
                    )}
                  />

                  <div className="rounded-lg border bg-card p-3 shadow-sm">
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className={cn('flex size-7 shrink-0 items-center justify-center rounded-md', eventColors[event.type] ?? eventColors.login)}>
                          <Icon className="size-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="text-sm font-medium">
                              {t(`profile.activityLog.eventTypes.${event.type}`, { defaultValue: event.type })}
                            </p>
                            <Badge
                              variant="secondary"
                              className={cn('text-[10px] font-normal', eventColors[event.type] ?? eventColors.login)}
                            >
                              {t(`profile.activityLog.eventTypes.${event.type}`, { defaultValue: event.type })}
                            </Badge>
                          </div>
                          <p className="truncate text-xs text-muted-foreground">{event.description}</p>
                        </div>
                      </div>
                      <span className="shrink-0 whitespace-nowrap pl-9 text-[11px] text-muted-foreground sm:pl-0">
                        {new Date(event.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
