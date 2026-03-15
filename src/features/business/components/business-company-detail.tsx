import type {
  BusinessActivityEntry,
  BusinessBillingEntry,
  BusinessCompanyUser,
  BusinessCompanyDetail as CompanyDetailType,
} from '../types'
import {
  Building2,
  Calendar,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  Phone,
  Users,
} from 'lucide-react'
import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useBusinessCompanyDetail } from '../hooks/use-business-company-detail'

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

const userRoleVariants: Record<string, string> = {
  owner: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  admin: 'bg-violet-500/15 text-violet-700 dark:text-violet-400',
  member: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  viewer: 'bg-muted text-muted-foreground',
}

const billingStatusVariants: Record<string, string> = {
  paid: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  failed: 'bg-red-500/15 text-red-700 dark:text-red-400',
  refunded: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
}

const subscriptionStatusVariants: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  canceled: 'bg-red-500/15 text-red-700 dark:text-red-400',
  past_due: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  trialing: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
}

export function BusinessCompanyDetail({ companyId }: { companyId: string }) {
  const { t } = useTranslation('admin')
  const { data: company, isLoading } = useBusinessCompanyDetail(companyId)
  const [tab, setTab] = useState('overview')

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    )
  }

  if (!company) {
    return <p className="text-muted-foreground">{t('business.companyDetail.noData')}</p>
  }

  const initials = company.name.slice(0, 2).toUpperCase()

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg font-medium">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold">{company.name}</h2>
            <Badge variant="secondary" className={planVariants[company.plan] ?? 'bg-muted text-muted-foreground'}>
              {t(`business.companies.plan.${company.plan}`, company.plan)}
            </Badge>
            <Badge variant="secondary" className={statusVariants[company.status] ?? statusVariants.inactive}>
              {t(`business.companyDetail.status.${company.status}`)}
            </Badge>
          </div>
          {company.document && (
            <p className="text-sm text-muted-foreground">CNPJ: {company.document}</p>
          )}
          <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {company.userCount} {t('business.companies.users')}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {t('business.companies.createdAt')}: {new Date(company.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      <Tabs value={tab} onValueChange={setTab}>
        <div className="-mb-px overflow-x-auto overflow-y-hidden">
          <TabsList>
            <TabsTrigger value="overview">{t('business.companyDetail.tabs.overview')}</TabsTrigger>
            <TabsTrigger value="users">{t('business.companyDetail.tabs.users')}</TabsTrigger>
            <TabsTrigger value="subscription">{t('business.companyDetail.tabs.subscription')}</TabsTrigger>
            <TabsTrigger value="activity">{t('business.companyDetail.tabs.activity')}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-4">
          <OverviewTab company={company} />
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <UsersTab users={company.users} />
        </TabsContent>

        <TabsContent value="subscription" className="mt-4">
          <SubscriptionTab company={company} />
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <ActivityTab activities={company.activityLog} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function OverviewTab({ company }: { company: CompanyDetailType }) {
  const { t } = useTranslation('admin')

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('business.companyDetail.overview.users')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold sm:text-2xl">{company.userCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('business.companyDetail.overview.plan')}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold sm:text-2xl">{t(`business.companies.plan.${company.plan}`, company.plan)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('business.companyDetail.overview.monthlyPrice')}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold sm:text-2xl">
              {company.subscription.currency} {company.subscription.monthlyPrice.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('business.companyDetail.overview.status')}</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className={statusVariants[company.status] ?? statusVariants.inactive}>
              {t(`business.companyDetail.status.${company.status}`)}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{t('business.companyDetail.overview.contactInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {company.contactEmail && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{company.contactEmail}</span>
            </div>
          )}
          {company.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{company.phone}</span>
            </div>
          )}
          {company.address && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{company.address}</span>
            </div>
          )}
          {company.document && (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>CNPJ: {company.document}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function UsersTab({ users }: { users: BusinessCompanyUser[] }) {
  const { t } = useTranslation('admin')

  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('business.companyDetail.usersTab.noUsers')}</p>
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          {t('business.companyDetail.usersTab.title')} ({users.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('business.companyDetail.usersTab.name')}</TableHead>
                <TableHead className="hidden sm:table-cell">{t('business.companyDetail.usersTab.email')}</TableHead>
                <TableHead>{t('business.companyDetail.usersTab.role')}</TableHead>
                <TableHead>{t('business.companyDetail.usersTab.status')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('business.companyDetail.usersTab.joinedAt')}</TableHead>
                <TableHead className="hidden lg:table-cell">{t('business.companyDetail.usersTab.lastLogin')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div>
                      <span>{user.name}</span>
                      <p className="text-xs text-muted-foreground sm:hidden">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={userRoleVariants[user.role] ?? 'bg-muted text-muted-foreground'}>
                      {t(`business.companyDetail.usersTab.roles.${user.role}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusVariants[user.status] ?? statusVariants.inactive}>
                      {t(`business.companyDetail.status.${user.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function SubscriptionTab({ company }: { company: CompanyDetailType }) {
  const { t } = useTranslation('admin')
  const { subscription, billingHistory } = company

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{t('business.companyDetail.subscriptionTab.currentPlan')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">{t('business.companyDetail.subscriptionTab.planTier')}</p>
              <Badge variant="secondary" className={planVariants[subscription.planTier] ?? 'bg-muted text-muted-foreground'}>
                {t(`business.companies.plan.${subscription.planTier}`, subscription.planTier)}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('business.companyDetail.subscriptionTab.subscriptionStatus')}</p>
              <Badge variant="secondary" className={subscriptionStatusVariants[subscription.status] ?? 'bg-muted text-muted-foreground'}>
                {t(`business.companyDetail.subscriptionTab.statuses.${subscription.status}`)}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('business.companyDetail.subscriptionTab.monthlyPrice')}</p>
              <p className="text-sm font-medium">{subscription.currency} {subscription.monthlyPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('business.companyDetail.subscriptionTab.currentPeriod')}</p>
              <p className="text-sm">
                {new Date(subscription.currentPeriodStart).toLocaleDateString()} - {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('business.companyDetail.subscriptionTab.cancelAtPeriodEnd')}</p>
              <p className="text-sm">{subscription.cancelAtPeriodEnd ? t('business.companyDetail.subscriptionTab.yes') : t('business.companyDetail.subscriptionTab.no')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <BillingHistoryTable entries={billingHistory} />
    </div>
  )
}

function BillingHistoryTable({ entries }: { entries: BusinessBillingEntry[] }) {
  const { t } = useTranslation('admin')

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('business.companyDetail.subscriptionTab.noBilling')}</p>
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{t('business.companyDetail.subscriptionTab.billingHistory')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">{t('business.companyDetail.subscriptionTab.billingDate')}</TableHead>
                <TableHead>{t('business.companyDetail.subscriptionTab.billingDescription')}</TableHead>
                <TableHead>{t('business.companyDetail.subscriptionTab.billingAmount')}</TableHead>
                <TableHead>{t('business.companyDetail.subscriptionTab.billingStatus')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div>
                      <span>{entry.description}</span>
                      <p className="text-xs text-muted-foreground sm:hidden">{new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {entry.currency} {entry.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={billingStatusVariants[entry.status] ?? 'bg-muted text-muted-foreground'}>
                      {t(`business.companyDetail.subscriptionTab.billingStatuses.${entry.status}`)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityTab({ activities }: { activities: BusinessActivityEntry[] }) {
  const { t } = useTranslation('admin')

  if (activities.length === 0) {
    return <p className="text-sm text-muted-foreground">{t('business.companyDetail.activityTab.noActivity')}</p>
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{t('business.companyDetail.activityTab.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{activity.actor}</span>
                  <Badge variant="outline" className="text-xs">
                    {t(`business.companyDetail.activityTab.actions.${activity.action}`, activity.action)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.details}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
