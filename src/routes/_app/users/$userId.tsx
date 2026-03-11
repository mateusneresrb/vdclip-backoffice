import { createFileRoute } from '@tanstack/react-router'

import { UserDetail } from '@/features/users'

export const Route = createFileRoute('/_app/users/$userId')({
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
