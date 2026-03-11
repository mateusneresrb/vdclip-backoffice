import type { SupportedProvider } from '@/features/admin/types'

import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

import { PROVIDER_COLORS, ProviderIcon } from './provider-icons'

interface ProviderCardProps {
  provider: SupportedProvider
  onToggle?: (provider: SupportedProvider) => void
}

export function ProviderCard({ provider, onToggle }: ProviderCardProps) {
  const { t } = useTranslation('admin')
  const brandColors = PROVIDER_COLORS[provider.slug]

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md dark:hover:shadow-muted/20',
        !provider.enabled && 'opacity-60',
      )}
    >
      <CardContent className="flex items-start gap-3 p-4">
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-lg',
            provider.enabled && brandColors
              ? cn(brandColors.bg, brandColors.icon)
              : provider.enabled
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground',
          )}
        >
          <ProviderIcon slug={provider.slug} name={provider.name} className="size-5" />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold truncate">{provider.name}</span>
            <span
              className={cn(
                'inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                provider.enabled
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {provider.enabled ? t('providers.statusActive') : t('providers.statusInactive')}
            </span>
          </div>
          {provider.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {provider.description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center pt-0.5">
          <Switch
            checked={provider.enabled}
            onCheckedChange={() => onToggle?.(provider)}
            aria-label={`${t('providers.toggle')} ${provider.name}`}
          />
        </div>
      </CardContent>
    </Card>
  )
}
