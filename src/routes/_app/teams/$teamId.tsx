import { createFileRoute } from '@tanstack/react-router'

import { TeamDetail } from '@/features/teams/components/team-detail'

export const Route = createFileRoute('/_app/teams/$teamId')({
  component: TeamDetailPage,
})

function TeamDetailPage() {
  const { teamId } = Route.useParams()
  return <TeamDetail teamId={teamId} />
}
