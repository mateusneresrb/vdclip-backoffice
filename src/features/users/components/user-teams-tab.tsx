import type { UserTeam } from '@/features/admin/types'
import { Link } from '@tanstack/react-router'
import { Users } from 'lucide-react'

import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/components/shared/empty-state'
import { Badge } from '@/components/ui/badge'

import { Card, CardContent } from '@/components/ui/card'

const roleBadgeVariants: Record<string, string> = {
  owner: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  admin: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  member: 'bg-muted text-muted-foreground',
}

export function UserTeamsTab({ teams }: { teams: UserTeam[] }) {
  const { t } = useTranslation('admin')

  if (teams.length === 0) {
    return <EmptyState icon={Users} title={t('userDetail.noTeams')} />
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
      {teams.map((team) => (
        <Link key={team.id} to="/teams/$teamId" params={{ teamId: team.id }}>
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex items-center justify-between p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{team.name}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{team.members} {t('userDetail.membersCount')}</span>
                </div>
              </div>
              <Badge variant="secondary" className={`ml-3 shrink-0 text-xs ${roleBadgeVariants[team.role] ?? roleBadgeVariants.member}`}>
                {t(`teamRole.${team.role}`)}
              </Badge>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
