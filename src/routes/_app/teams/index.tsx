import { createFileRoute } from '@tanstack/react-router'

import { TeamsOverview } from '@/features/teams'

export const Route = createFileRoute('/_app/teams/')({
  component: AdminTeamsPage,
})

function AdminTeamsPage() {
  return <TeamsOverview />
}
