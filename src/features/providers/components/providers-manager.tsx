import type { SupportedProvider } from '@/features/admin/types'
import { useQueryClient } from '@tanstack/react-query'
import { ToggleRight } from 'lucide-react'

import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminProviders } from '@/features/admin/hooks/use-admin-providers'
import { showSuccessToast } from '@/lib/toast'

import { ProviderSection } from './provider-section'

export function ProvidersManager() {
  const { t } = useTranslation('admin')
  const queryClient = useQueryClient()
  const { data: providers, isLoading } = useAdminProviders()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('providers.title')} description={t('providers.pageDescription')} />
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
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

  const handleToggle = (provider: SupportedProvider) => {
    // TODO: Wire to API when provider toggle endpoint is available
    // (e.g., PATCH /platform/providers/{id} with { enabled: boolean }).
    // For now, apply optimistic update to the query cache.
    queryClient.setQueryData<SupportedProvider[]>(
      ['admin-providers'],
      (old) => old?.map((p) => (p.id === provider.id ? { ...p, enabled: !p.enabled } : p)),
    )
    showSuccessToast({ title: t('toast.providerToggled') })
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('providers.title')} description={t('providers.pageDescription')} />

      <ProviderSection
        title={t('providers.sections.videoSource')}
        providers={videoSourceProviders}
        onToggle={handleToggle}
      />
    </div>
  )
}
