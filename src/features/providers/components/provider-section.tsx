import type { SupportedProvider } from '@/features/admin/types'

import { ProviderCard } from './provider-card'

interface ProviderSectionProps {
  title: string
  providers: SupportedProvider[]
  onToggle?: (provider: SupportedProvider) => void
}

export function ProviderSection({ title, providers, onToggle }: ProviderSectionProps) {
  if (providers.length === 0) 
return null

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}
