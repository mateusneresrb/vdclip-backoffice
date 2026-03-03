import { createFileRoute } from '@tanstack/react-router'

import { UserDetail } from '@/features/admin'

export const Route = createFileRoute('/admin/users/$userId')({
  component: AdminUserDetailPage,
})

function AdminUserDetailPage() {
  const { userId } = Route.useParams()
  return (
    <div className="space-y-4 md:space-y-6">
      <UserDetail userId={userId} />
    </div>
  )
}
