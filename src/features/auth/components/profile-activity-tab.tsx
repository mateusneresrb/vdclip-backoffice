import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { useProfileActivity } from '../hooks/use-profile-activity'

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
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : !events || events.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t('profile.activityLog.noEvents')}
          </p>
        ) : (
          <div className="relative ml-3 border-l border-border pl-6">
            {events.map((event) => (
              <div key={event.id} className="relative pb-6 last:pb-0">
                {/* Dot */}
                <div className="absolute -left-[calc(1.5rem+4.5px)] top-1 size-[9px] rounded-full bg-primary" />

                <div className="space-y-1">
                  <span className="text-sm font-medium">
                    {t(`profile.activityLog.eventTypes.${event.type}`, { defaultValue: event.type })}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
