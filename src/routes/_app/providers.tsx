import { createFileRoute } from '@tanstack/react-router'

import { ProvidersManager } from '@/features/providers'

export const Route = createFileRoute('/_app/providers')({
  component: AdminProvidersPage,
})

function AdminProvidersPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <ProvidersManager />
    </div>
  )
}
