import { Link } from '@tanstack/react-router'
import { Building2, Search, User } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PaginationControls } from '@/components/pagination-controls'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { usePagination } from '@/hooks/use-pagination'

import { useBusinessUsers } from '../hooks/use-business-users'

const statusVariants: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  inactive: 'bg-muted text-muted-foreground',
  suspended: 'bg-red-500/15 text-red-700 dark:text-red-400',
}

type StatusFilter = 'all' | 'active' | 'inactive' | 'suspended'

export function BusinessUsersPage() {
  const { t } = useTranslation('admin')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const { data: users, isLoading } = useBusinessUsers(search)

  const filteredUsers = useMemo(() => {
    if (!users) 
return []
    if (statusFilter === 'all') 
return users
    return users.filter((u) => u.status === statusFilter)
  }, [users, statusFilter])

  const pagination = usePagination(filteredUsers, 10)

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('business.users.title')}
        description={t('business.users.description')}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t('business.users.title')}</CardTitle>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('business.users.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t('business.users.filterStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('business.users.allStatuses')}</SelectItem>
                <SelectItem value="active">{t('business.users.statusActive')}</SelectItem>
                <SelectItem value="inactive">{t('business.users.statusInactive')}</SelectItem>
                <SelectItem value="suspended">{t('business.users.statusSuspended')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : !filteredUsers.length ? (
            <EmptyState icon={User} title={t('business.users.noResults')} />
          ) : (
            <div className="space-y-2">
              {pagination.paginatedItems.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <Link to="/users/$userId" params={{ userId: user.id }} className="shrink-0">
                    <Avatar className="h-10 w-10 transition-opacity hover:opacity-80">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>
                        {user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/users/$userId"
                      params={{ userId: user.id }}
                      className="truncate text-sm font-medium hover:underline"
                    >
                      {user.name}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70">
                      <Building2 className="h-3 w-3" />
                      <span>{user.companyName}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-xs capitalize">
                    {user.role}
                  </Badge>
                  <Badge variant="secondary" className={`shrink-0 text-xs ${statusVariants[user.status] ?? statusVariants.inactive}`}>
                    {t(`business.users.status${user.status.charAt(0).toUpperCase()}${user.status.slice(1)}`)}
                  </Badge>
                  <Button variant="outline" size="sm" asChild className="shrink-0">
                    <Link to="/users/$userId" params={{ userId: user.id }}>
                      {t('users.view')}
                    </Link>
                  </Button>
                </div>
              ))}
              <PaginationControls {...pagination} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
