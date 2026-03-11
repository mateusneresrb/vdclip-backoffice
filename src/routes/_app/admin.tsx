import { createFileRoute } from '@tanstack/react-router'

import { AdminUsersPage } from '@/features/admin-users'

export const Route = createFileRoute('/_app/admin')({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (search.tab as string) || undefined,
  }),
  component: AdminRoute,
})

function AdminRoute() {
  return <AdminUsersPage />
}
