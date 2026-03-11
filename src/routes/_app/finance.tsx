import { createFileRoute } from '@tanstack/react-router'

import { FinancePage } from '@/features/finance'

export const Route = createFileRoute('/_app/finance')({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (search.tab as string) || undefined,
  }),
  component: FinanceRoute,
})

function FinanceRoute() {
  return <FinancePage />
}
