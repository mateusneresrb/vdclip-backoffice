import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/shared/page-header'

import { MetricsQuickPanel } from './metrics-quick-panel'

export function DashboardPage() {
  const { t } = useTranslation('admin')

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title={t('nav.dashboard')}
        description={t('dashboard.consolidatedDescription')}
      />

      <MetricsQuickPanel />
    </div>
  )
}
