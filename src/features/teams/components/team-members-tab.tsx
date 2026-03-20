import { Link } from '@tanstack/react-router'
import { MoreHorizontal, Search, Shield, ShieldCheck, Trash2, User, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PaginationControls } from '@/components/pagination-controls'
import { EmptyState } from '@/components/shared/empty-state'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { usePagination } from '@/hooks/use-pagination'

import { useTeamMembers } from '../hooks/use-team-members'

const roleBadgeVariants: Record<string, string> = {
  owner: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  admin: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  member: 'bg-muted text-muted-foreground',
}

const roleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  owner: ShieldCheck,
  admin: Shield,
  member: User,
}

export function TeamMembersTab({ teamId }: { teamId: string }) {
  const { t } = useTranslation('admin')
  const { data: members, isLoading } = useTeamMembers(teamId)
  const [search, setSearch] = useState('')
  const [removeMemberId, setRemoveMemberId] = useState<string | null>(null)

  const filteredMembers = useMemo(() => {
    if (!members) 
return []
    const q = search.toLowerCase()
    if (!q) 
return members
    return members.filter(
      (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
    )
  }, [members, search])

  const pagination = usePagination(filteredMembers, 10)

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('teams.members.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label={t('teams.members.searchPlaceholder')}
          />
        </div>

        {!members?.length ? (
          <EmptyState icon={Users} title={t('teamSettings.noData')} />
        ) : filteredMembers.length === 0 ? (
          <EmptyState icon={Users} title={t('teams.members.noResults')} />
        ) : (
          <>
            <div className="divide-y rounded-lg border">
              {pagination.paginatedItems.map((member) => {
                const initials = member.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                const isOwner = member.role === 'owner'
                const RoleIcon = roleIcons[member.role] ?? User

                return (
                  <div key={member.id} className="flex items-center gap-3 p-3 transition-colors hover:bg-muted/50">
                    <Link to="/users/$userId" params={{ userId: member.id }} className="shrink-0">
                      <Avatar className="h-9 w-9 transition-opacity hover:opacity-80">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        to="/users/$userId"
                        params={{ userId: member.id }}
                        className="truncate text-sm font-medium hover:underline"
                      >
                        {member.name}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                    </div>
                    <Badge variant="secondary" className={`shrink-0 gap-1 text-xs ${roleBadgeVariants[member.role] ?? roleBadgeVariants.member}`}>
                      <RoleIcon className="h-3 w-3" />
                      {t(`teamRole.${member.role}`)}
                    </Badge>

                    {!isOwner && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label={t('userDetail.actions')}>
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">{t('userDetail.actions')}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Shield className="mr-2 h-4 w-4" />
                            {member.role === 'admin' ? t('teams.actions.demoteToMember') : t('teams.actions.promoteToAdmin')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setRemoveMemberId(member.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('teams.actions.removeMember')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                )
              })}
            </div>
            <PaginationControls {...pagination} />
          </>
        )}
      </div>

      <AlertDialog open={removeMemberId !== null} onOpenChange={(open) => { if (!open) 
setRemoveMemberId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('teams.actions.removeMemberTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('teams.actions.removeMemberDescription')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('userDetail.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => setRemoveMemberId(null)}
            >
              {t('teams.actions.removeMember')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
