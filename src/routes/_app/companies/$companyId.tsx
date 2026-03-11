import { createFileRoute } from '@tanstack/react-router'

import { BusinessCompanyDetail } from '@/features/business/components/business-company-detail'

export const Route = createFileRoute('/_app/companies/$companyId')({
  component: CompanyDetailPage,
})

function CompanyDetailPage() {
  const { companyId } = Route.useParams()
  return <BusinessCompanyDetail companyId={companyId} />
}
