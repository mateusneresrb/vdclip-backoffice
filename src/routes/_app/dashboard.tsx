import { createFileRoute } from '@tanstack/react-router'

import { DashboardPage } from '@/features/dashboard'

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardRoute,
})

function DashboardRoute() {
  return <DashboardPage />
}
