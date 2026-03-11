import { createFileRoute } from '@tanstack/react-router'

import { BusinessCompaniesPage } from '@/features/business'

export const Route = createFileRoute('/_app/companies/')({
  component: CompaniesRoute,
})

function CompaniesRoute() {
  return <BusinessCompaniesPage />
}
