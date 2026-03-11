import type { SupportedProvider } from '../types'
import { ToggleRight } from 'lucide-react'

import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { Skeleton } from '@/components/ui/skeleton'

import { ProviderCard } from '@/features/providers/components/provider-card'
import { useAdminProviders } from '../hooks/use-admin-providers'

function ProviderSection({
  title,
  providers,
  onToggle,
}: {
  title: string
  providers: SupportedProvider[]
  onToggle?: (provider: SupportedProvider) => void
}) {
  if (providers.length === 0) 
return null

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} onToggle={onToggle} />
        ))}
      </div>
    </div>
  )
}

export function ProvidersManager() {
  const { t } = useTranslation('admin')
  const { data: providers, isLoading } = useAdminProviders()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('providers.title')} description={t('providers.pageDescription')} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    )
  }

  if (!providers?.length) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('providers.title')} description={t('providers.pageDescription')} />
        <EmptyState icon={ToggleRight} title={t('providers.noProviders')} description={t('providers.noProvidersHint')} />
      </div>
    )
  }

  const videoSourceProviders = providers.filter((p) => p.category === 'video_source')
  const paymentProviders = providers.filter((p) => p.category === 'payment')
  const aiProcessingProviders = providers.filter((p) => p.category === 'ai_processing')
  const publishingProviders = providers.filter((p) => p.category === 'publishing')

  const handleToggle = (_provider: SupportedProvider) => {
    // TODO: API call to toggle provider
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('providers.title')} description={t('providers.pageDescription')} />

      <div className="space-y-8">
        <ProviderSection
          title={t('providers.sections.videoSource')}
          providers={videoSourceProviders}
          onToggle={handleToggle}
        />

        <ProviderSection
          title={t('providers.sections.payment')}
          providers={paymentProviders}
          onToggle={handleToggle}
        />

        <ProviderSection
          title={t('providers.sections.aiProcessing')}
          providers={aiProcessingProviders}
          onToggle={handleToggle}
        />

        <ProviderSection
          title={t('providers.sections.publishing')}
          providers={publishingProviders}
          onToggle={handleToggle}
        />
      </div>
    </div>
  )
}
