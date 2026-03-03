import { createFileRoute } from '@tanstack/react-router'

import { MetricsOverview } from '@/features/admin'

export const Route = createFileRoute('/admin/metrics')({
  component: AdminMetricsPage,
})

function AdminMetricsPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <MetricsOverview />
    </div>
  )
}
