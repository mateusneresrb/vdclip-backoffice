import { createFileRoute } from '@tanstack/react-router'

import { BusinessCompanyDetail } from '@/features/business/components/business-company-detail'

export const Route = createFileRoute('/_app/business/companies/$companyId')({
  component: BusinessCompanyDetailPage,
})

function BusinessCompanyDetailPage() {
  const { companyId } = Route.useParams()
  return <BusinessCompanyDetail companyId={companyId} />
}
