import type { SupportedProvider } from '@/features/admin/types'
import { useQueryClient } from '@tanstack/react-query'

import { ToggleRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminProviders } from '@/features/admin/hooks/use-admin-providers'
import { showSuccessToast } from '@/lib/toast'

import { useUpdateVideoSources, useVideoSources } from '../hooks/use-video-sources'
import { ProviderSection } from './provider-section'

export function ProvidersManager() {
  const { t } = useTranslation('admin')
  const queryClient = useQueryClient()
  const { data: providers, isLoading } = useAdminProviders()
  const { data: videoSources } = useVideoSources()
  const updateMutation = useUpdateVideoSources()

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

  // Merge DynamoDB enabled state into provider list
  const mergedProviders = providers.map((p) => ({
    ...p,
    enabled: videoSources?.providers?.[p.slug] ?? p.enabled,
  }))

  const videoSourceProviders = mergedProviders.filter((p) => p.category === 'video_source')

  const handleToggle = (provider: SupportedProvider) => {
    if (!videoSources?.providers) 
return

    const updatedProviders = {
      ...videoSources.providers,
      [provider.slug]: !provider.enabled,
    }

    updateMutation.mutate(updatedProviders, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-providers'] })
        showSuccessToast({ title: t('toast.providerToggled') })
      },
    })
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
