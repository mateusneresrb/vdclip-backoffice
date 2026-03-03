import { createFileRoute } from '@tanstack/react-router'

import { ProvidersManager } from '@/features/admin'

export const Route = createFileRoute('/admin/providers')({
  component: AdminProvidersPage,
})

function AdminProvidersPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <ProvidersManager />
    </div>
  )
}
