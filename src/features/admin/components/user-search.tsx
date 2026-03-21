import type { UserSearchField } from '../hooks/use-admin-users'
import type { UserStatus } from '../types'
import { Link } from '@tanstack/react-router'
import { Building2, Search } from 'lucide-react'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PaginationControls } from '@/components/pagination-controls'
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
import { useAdminUsers } from '../hooks/use-admin-users'

const planBadgeVariants: Record<string, string> = {
  free: 'bg-muted text-muted-foreground',
  lite: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  premium: 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
  ultimate: 'bg-violet-600/15 text-violet-700 dark:text-violet-400',
}

const statusDot: Record<UserStatus, string> = {
  active: 'bg-emerald-500',
  inactive: 'bg-muted-foreground',
  suspended: 'bg-destructive',
}

const FIELD_OPTIONS: UserSearchField[] = ['name', 'email', 'externalId']

export function UserSearch() {
  const { t } = useTranslation('admin')
  const [searchField, setSearchField] = useState<UserSearchField>('name')
  const [searchValue, setSearchValue] = useState('')
  const { data: users, isLoading } = useAdminUsers({ field: searchField, value: searchValue })

  const pagination = usePagination(users ?? [], 10)

  function handleFieldChange(field: UserSearchField) {
    setSearchField(field)
    setSearchValue('')
    pagination.setPage(1)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('users.title')}</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">{t('users.description')}</p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={searchField} onValueChange={(v) => handleFieldChange(v as UserSearchField)}>
            <SelectTrigger className="w-full shrink-0 sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FIELD_OPTIONS.map((f) => (
                <SelectItem key={f} value={f}>
                  {t(`users.searchField.${f}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t(`users.searchField.placeholder.${searchField}`)}
              value={searchValue}
              onChange={(e) => { setSearchValue(e.target.value); pagination.setPage(1) }}
              className="pl-9"
            />
          </div>
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
        ) : (users ?? []).length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t('users.noResults')}
          </p>
        ) : (
          <div className="space-y-2">
            {pagination.paginatedItems.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <Link to="/users/$userId" params={{ userId: user.id }} className="shrink-0">
                  <Avatar className="h-10 w-10 transition-opacity hover:opacity-80">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDot[user.status]}`} />
                    <Link
                      to="/users/$userId"
                      params={{ userId: user.id }}
                      className="truncate text-sm font-medium hover:underline"
                    >
                      {user.name}
                    </Link>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                    {user.companyName && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        <Link to="/companies/$companyId" params={{ companyId: user.companyId! }} className="hover:underline">
                          {user.companyName}
                        </Link>
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground">{t('userDetail.createdAt')}: {new Date(user.createdAt).toLocaleDateString()}</span>
                    <span className="text-[10px] text-muted-foreground">{t('userDetail.lastLogin')}: {new Date(user.lastLoginAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Badge variant="secondary" className={`shrink-0 ${planBadgeVariants[user.plan] ?? planBadgeVariants.free}`}>
                  {t(`plan.${user.plan}`)}
                </Badge>
                <Button variant="outline" size="sm" className="hidden shrink-0 sm:inline-flex" asChild>
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
  )
}
