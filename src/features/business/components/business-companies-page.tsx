import { Link } from '@tanstack/react-router'
import { Building2, Search, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PaginationControls } from '@/components/pagination-controls'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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

import { useBusinessCompanies } from '../hooks/use-business-companies'

const statusVariants: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  inactive: 'bg-muted text-muted-foreground',
  trial: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  suspended: 'bg-red-500/15 text-red-700 dark:text-red-400',
}

const planVariants: Record<string, string> = {
  business: 'bg-violet-500/15 text-violet-700 dark:text-violet-400',
  enterprise: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
}

type StatusFilter = 'all' | 'active' | 'inactive' | 'trial' | 'suspended'

export function BusinessCompaniesPage() {
  const { t } = useTranslation('admin')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const { data: companies, isLoading } = useBusinessCompanies(search)

  const filteredCompanies = useMemo(() => {
    if (!companies) 
return []
    if (statusFilter === 'all') 
return companies
    return companies.filter((c) => c.status === statusFilter)
  }, [companies, statusFilter])

  const pagination = usePagination(filteredCompanies, 9)

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title={t('business.companies.title')}
        description={t('business.companies.description')}
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('business.companies.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label={t('business.companies.searchPlaceholder')}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder={t('business.companies.filterStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('business.companies.allStatuses')}</SelectItem>
            <SelectItem value="active">{t('business.companies.statusActive')}</SelectItem>
            <SelectItem value="inactive">{t('business.companies.statusInactive')}</SelectItem>
            <SelectItem value="trial">{t('business.companies.statusTrial')}</SelectItem>
            <SelectItem value="suspended">{t('business.companies.statusSuspended')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : !filteredCompanies.length ? (
        <EmptyState icon={Building2} title={t('business.companies.noResults')} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {pagination.paginatedItems.map((company) => (
              <Link
                key={company.id}
                to="/companies/$companyId"
                params={{ companyId: company.id }}
                className="block"
              >
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 shrink-0 rounded-lg">
                        <AvatarImage src={company.logoUrl} alt={company.name} />
                        <AvatarFallback className="rounded-lg text-xs font-semibold">
                          {company.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{company.name}</p>
                        <Badge variant="secondary" className={`mt-0.5 text-xs ${planVariants[company.plan] ?? 'bg-muted text-muted-foreground'}`}>
                          {t(`business.companies.plan.${company.plan}`, company.plan)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1.5 pt-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className={`text-xs ${statusVariants[company.status] ?? statusVariants.inactive}`}>
                        {t(`business.companies.status${company.status.charAt(0).toUpperCase()}${company.status.slice(1)}`)}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{company.userCount} {t('business.companies.users')}</span>
                      </div>
                    </div>
                    {company.document && (
                      <p className="text-xs text-muted-foreground">CNPJ: {company.document}</p>
                    )}
                    {company.contactEmail && (
                      <p className="truncate text-xs text-muted-foreground">{company.contactEmail}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {t('business.companies.createdAt')}: {new Date(company.createdAt).toLocaleDateString()}
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
