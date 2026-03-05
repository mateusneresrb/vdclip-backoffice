import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'

import { useAdminProviders } from '../hooks/use-admin-providers'
import type { SupportedProvider } from '../types'

const typeVariant: Record<SupportedProvider['type'], string> = {
  social: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  publishing: 'bg-violet-500/15 text-violet-700 dark:text-violet-400',
  ai: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  processing: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
}

export function ProvidersManager() {
  const { t } = useTranslation('admin')
  const { data: providers, isLoading } = useAdminProviders()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!providers) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('providers.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <div className="grid grid-cols-[1fr_auto_auto] gap-2 sm:gap-4 border-b px-3 sm:px-4 py-3 text-sm font-medium text-muted-foreground">
            <span>{t('providers.name')}</span>
            <span>{t('providers.type')}</span>
            <span>{t('providers.enabled')}</span>
          </div>
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-2 sm:gap-4 border-b px-3 sm:px-4 py-3 last:border-b-0"
            >
              <span className="text-sm font-medium truncate">{provider.name}</span>
              <Badge variant="secondary" className={typeVariant[provider.type]}>
                {t(`providers.types.${provider.type}`)}
              </Badge>
              <Switch
                checked={provider.enabled}
                aria-label={`${t('providers.toggle')} ${provider.name}`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
