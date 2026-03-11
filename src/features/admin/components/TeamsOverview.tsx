import type { TeamSearchField } from '../hooks/use-admin-teams'
import { Search, UsersRound } from 'lucide-react'
import { useState } from 'react'

import { useTranslation } from 'react-i18next'
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
import { useAdminTeams } from '../hooks/use-admin-teams'

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

  function handleFieldChange(field: TeamSearchField) {
    setSearchField(field)
    setSearchValue('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          {t('teams.title')}
        </h1>
      </div>

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
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : !teams?.length ? (
        <p className="text-muted-foreground">{t('teams.noResults')}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card key={team.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{team.name}</CardTitle>
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${planBadgeVariants[team.plan] ?? planBadgeVariants.free}`}>
                  {t(`plan.${team.plan}`)}
                </span>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UsersRound className="h-3.5 w-3.5" />
                  <span>{team.memberCount} {t('teams.membersLabel')}</span>
                </div>
                {team.category && (
                  <Badge variant="outline" className="text-xs">
                    {team.category}
                  </Badge>
                )}
                <p className="text-xs text-muted-foreground">
                  {t('teams.createdAt')}: {new Date(team.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
