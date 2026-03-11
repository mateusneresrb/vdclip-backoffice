import { createFileRoute } from '@tanstack/react-router'

import { AuditPage } from '@/features/audit'

export const Route = createFileRoute('/_app/audit')({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (search.tab as string) || undefined,
  }),
  component: AuditRoute,
})

function AuditRoute() {
  return <AuditPage />
}
