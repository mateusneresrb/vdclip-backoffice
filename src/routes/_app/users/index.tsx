import { createFileRoute } from '@tanstack/react-router'

import { UserSearch } from '@/features/users'

export const Route = createFileRoute('/_app/users/')({
  component: AdminUsersPage,
})

function AdminUsersPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <UserSearch />
    </div>
  )
}
