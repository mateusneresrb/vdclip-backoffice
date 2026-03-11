import { createFileRoute } from '@tanstack/react-router'

import { RevenuePage } from '@/features/revenue'

export const Route = createFileRoute('/_app/revenue')({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (search.tab as string) || undefined,
  }),
  component: RevenueRoute,
})

function RevenueRoute() {
  return <RevenuePage />
}
