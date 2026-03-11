import { createFileRoute } from '@tanstack/react-router'

import { BusinessUsersPage } from '@/features/business'

export const Route = createFileRoute('/_app/business/users')({
  component: BusinessUsersRoute,
})

function BusinessUsersRoute() {
  return <BusinessUsersPage />
}
