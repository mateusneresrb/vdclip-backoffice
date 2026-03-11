import { createFileRoute } from '@tanstack/react-router'

import { BusinessCompaniesPage } from '@/features/business'

export const Route = createFileRoute('/_app/business/companies')({
  component: BusinessCompaniesRoute,
})

function BusinessCompaniesRoute() {
  return <BusinessCompaniesPage />
}
