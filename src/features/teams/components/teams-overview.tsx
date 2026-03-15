import type { TeamSearchField } from '@/features/admin/hooks/use-admin-teams'
import { Link } from '@tanstack/react-router'
import { Search, UsersRound } from 'lucide-react'
import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { PaginationControls } from '@/components/pagination-controls'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

import { useAdminTeams } from '@/features/admin/hooks/use-admin-teams'
import { usePagination } from '@/hooks/use-pagination'

const planBadgeVariants: Record<string, string> = {
  free: 'bg-muted text-muted-foreground',
  lite: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  premium: 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
  ultimate: 'bg-violet-600/15 text-violet-700 dark:text-violet-400',
}

const FIELD_OPTIONS: TeamSearchField[] = ['name', 'id']

export function TeamsOverview() {
  const { t } = useTranslation('admin')
  const [searchField, setSearchField] = useState<TeamSearchField>('name')
  const [searchValue, setSearchValue] = useState('')
  const { data: teams, isLoading } = useAdminTeams({ field: searchField, value: searchValue })

  const pagination = usePagination(teams ?? [], 9)

  function handleFieldChange(field: TeamSearchField) {
    setSearchField(field)
    setSearchValue('')
    pagination.setPage(1)
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader title={t('teams.title')} description={t('teams.description')} />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Select value={searchField} onValueChange={(v) => handleFieldChange(v as TeamSearchField)}>
          <SelectTrigger className="w-full shrink-0 sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FIELD_OPTIONS.map((f) => (
              <SelectItem key={f} value={f}>
                {t(`teams.searchField.${f}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t(`teams.searchField.placeholder.${searchField}`)}
            value={searchValue}
            onChange={(e) => { setSearchValue(e.target.value); pagination.setPage(1) }}
            className="pl-9"
            aria-label={t(`teams.searchField.placeholder.${searchField}`)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : !(teams ?? []).length ? (
        <EmptyState icon={UsersRound} title={t('teams.noResults')} />
      ) : (
        <>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3">
            {pagination.paginatedItems.map((team) => (
              <Link key={team.id} to="/teams/$teamId" params={{ teamId: team.id }}>
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="text-sm font-medium">
                        {team.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                      <CardTitle className="truncate text-sm font-medium">{team.name}</CardTitle>
                      <Badge variant="secondary" className={`shrink-0 text-xs ${planBadgeVariants[team.plan] ?? planBadgeVariants.free}`}>
                        {t(`plan.${team.plan}`)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UsersRound className="h-3.5 w-3.5" />
                      <span>{team.memberCount} {t('teams.membersLabel')}</span>
                    </div>
                    {team.category && (
                      <Badge variant="outline" className="text-xs">{team.category}</Badge>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {t('teams.createdAt')}: {new Date(team.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <PaginationControls {...pagination} />
        </>
      )}
    </div>
  )
}
