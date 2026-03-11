import { createFileRoute } from '@tanstack/react-router'

import { AdminProfilePage } from '@/features/auth/components/admin-profile-page'

export const Route = createFileRoute('/_app/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return <AdminProfilePage />
}
