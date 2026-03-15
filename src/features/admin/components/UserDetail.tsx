import type { CreditType, UserPlan, UserStatus } from '../types'
import {
  Calendar,
  CreditCard,
  FileText,
  Film,
  Handshake,
  HardDrive,
  Key,
  Link2,
  Mail,
  Package,
  Plus,
  Save,
  Shield,
  Users,
  UserX,
} from 'lucide-react'
import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

import { Skeleton } from '@/components/ui/skeleton'
import {
  useAdminTeamTemplates,
  useAdminUserTemplates,
} from '../hooks/use-admin-templates'
import {
  useAdminTeamSettings,
  useAdminUser,
  useAdminUserAffiliate,
} from '../hooks/use-admin-users'
import { MediaManager } from './MediaManager'
import { TemplateManager } from './TemplateManager'

const statusVariant: Record<UserStatus, string> = {
  active: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  inactive: 'bg-muted text-muted-foreground',
  suspended: 'bg-destructive/15 text-destructive',
}

const tierVariant: Record<string, string> = {
  bronze: 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
  silver: 'bg-slate-500/15 text-slate-700 dark:text-slate-400',
  gold: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
}

const creditTypes: CreditType[] = ['plan_cycle', 'purchased', 'promotional', 'bonus', 'adjustment']
const plans: UserPlan[] = ['free', 'lite', 'premium', 'ultimate']

export function UserDetail({ userId }: { userId: string }) {
  const { t } = useTranslation('admin')
  const { data: user, isLoading } = useAdminUser(userId)

  // Credit dialog
  const [creditDialogOpen, setCreditDialogOpen] = useState(false)
  const [creditAmount, setCreditAmount] = useState('')
  const [creditType, setCreditType] = useState<CreditType>('plan_cycle')
  const [creditDays, setCreditDays] = useState('')

  // Plan change (inline)
  const [editingPlan, setEditingPlan] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<UserPlan>('free')

  // Inline panels
  const [showAffiliate, setShowAffiliate] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [mediaOpen, setMediaOpen] = useState(false)
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)

  // Create affiliate
  const [newAffiliateCode, setNewAffiliateCode] = useState('')
  const [newAffiliatePercent, setNewAffiliatePercent] = useState('')

  // Team credit dialog
  const [teamCreditDialogOpen, setTeamCreditDialogOpen] = useState(false)
  const [teamCreditAmount, setTeamCreditAmount] = useState('')
  const [teamCreditType, setTeamCreditType] = useState<CreditType>('plan_cycle')
  const [teamCreditDays, setTeamCreditDays] = useState('')

  // Team plan change
  const [editingTeamPlan, setEditingTeamPlan] = useState(false)
  const [selectedTeamPlan, setSelectedTeamPlan] = useState<UserPlan>('free')

  const { data: affiliate, isLoading: affiliateLoading } =
    useAdminUserAffiliate(userId, showAffiliate)

  const { data: userTemplates, isLoading: userTemplatesLoading } =
    useAdminUserTemplates(userId, showTemplates)


  const { data: teamSettings, isLoading: teamLoading } =
    useAdminTeamSettings(selectedTeamId ?? '', !!selectedTeamId)

  const { data: teamTemplates, isLoading: teamTemplatesLoading } =
    useAdminTeamTemplates(selectedTeamId ?? '', !!selectedTeamId)

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
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (!user) 
return null

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <Badge
              variant="secondary"
              className={statusVariant[user.status]}
            >
              {t(`status.${user.status}`)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
            <span>
              {t('userDetail.createdAt')}: {user.createdAt}
            </span>
            <span>
              {t('userDetail.lastLogin')}: {user.lastLoginAt}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {/* Plan Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4" />
              {t('userDetail.planInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {editingPlan ? (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">{t('userDetail.newPlan')}</Label>
                  <Select
                    value={selectedPlan}
                    onValueChange={(v) => setSelectedPlan(v as UserPlan)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((p) => (
                        <SelectItem key={p} value={p}>
                          {t(`plan.${p}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => setEditingPlan(false)}
                  >
                    <Save className="mr-1 h-3 w-3" />
                    {t('userDetail.save')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingPlan(false)}
                  >
                    {t('userDetail.cancel')}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('userDetail.plan')}
                  </span>
                  <Badge variant="outline">{t(`plan.${user.plan}`)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('userDetail.provider')}
                  </span>
                  <span>{user.planProvider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('userDetail.expires')}
                  </span>
                  <span>{user.planExpiresAt ?? t('userDetail.noExpiry')}</span>
                </div>
                {user.subscriptionId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t('userDetail.subscriptionId')}
                    </span>
                    <span className="font-mono text-xs truncate max-w-[120px]">
                      {user.subscriptionId}
                    </span>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1 w-full"
                  onClick={() => {
                    setSelectedPlan(user.plan)
                    setEditingPlan(true)
                  }}
                >
                  {t('userDetail.changePlan')}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Credits */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Key className="h-4 w-4" />
                {t('userDetail.credits')}
              </CardTitle>
              <Dialog open={creditDialogOpen} onOpenChange={setCreditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Plus className="mr-1 h-3 w-3" />
                    {t('userDetail.addCredit')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('userDetail.addCreditTitle')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label>{t('userDetail.creditType')}</Label>
                      <Select
                        value={creditType}
                        onValueChange={(v) => setCreditType(v as CreditType)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {creditTypes.map((ct) => (
                            <SelectItem key={ct} value={ct}>
                              {t(`creditTypes.${ct}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('userDetail.creditAmount')}</Label>
                      <Input
                        type="number"
                        min={1}
                        placeholder="100"
                        value={creditAmount}
                        onChange={(e) => setCreditAmount(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('userDetail.creditValidDays')}</Label>
                      <Input
                        type="number"
                        min={1}
                        placeholder="30"
                        value={creditDays}
                        onChange={(e) => setCreditDays(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        {t('userDetail.creditValidDaysHint')}
                      </p>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setCreditDialogOpen(false)
                        setCreditAmount('')
                        setCreditDays('')
                        setCreditType('plan_cycle')
                      }}
                    >
                      {t('userDetail.confirmAddCredit')}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Total + packages count */}
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold sm:text-3xl">{user.credits}</p>
              <span className="text-xs text-muted-foreground">
                {user.creditPackages.length} {t('userDetail.creditPackages')}
              </span>
            </div>

            {/* Packages list */}
            {user.creditPackages.length > 0 && (
              <div className="rounded-lg border divide-y">
                {user.creditPackages.map((pkg) => {
                  const isExpired = new Date(pkg.expiresAt) < new Date()
                  return (
                    <div key={pkg.id} className={`p-3 space-y-1.5 ${isExpired ? 'opacity-50' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="h-3.5 w-3.5 text-muted-foreground" />
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {t(`creditTypes.${pkg.type}`)}
                          </Badge>
                          {isExpired && (
                            <Badge variant="secondary" className="text-[10px] bg-destructive/15 text-destructive">
                              {t('userDetail.expired')}
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm font-semibold">
                          {pkg.amount}
                        </span>
                      </div>
                      {/* Dates */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {pkg.startDate}
                        </span>
                        <span>→</span>
                        <span>{pkg.expiresAt}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Media Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Film className="h-4 w-4" />
              {t('userDetail.mediaStats')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t('userDetail.mediaCreated')}
              </span>
              <span className="font-semibold">{user.mediaCreated}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t('userDetail.mediaPosted')}
              </span>
              <span className="font-semibold">{user.mediaPosted}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              onClick={() => setMediaOpen(true)}
            >
              {t('userDetail.viewMedia')}
            </Button>







          </CardContent>
        </Card>

        {/* Account & Social Logins */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              {t('userDetail.account')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t('userDetail.emailVerified')}
              </span>
              <Badge
                variant="secondary"
                className={
                  user.emailVerified
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                    : 'bg-destructive/15 text-destructive'
                }
              >
                {user.emailVerified ? t('userDetail.yes') : t('userDetail.no')}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {t('userDetail.socialAccount')}
              </span>
              <span>
                {user.isSocialAccount ? t('userDetail.yes') : t('userDetail.no')}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <Link2 className="h-3.5 w-3.5" />
                {t('userDetail.socialLogins')}
              </span>
              <Badge variant="outline">
                {user.socialLogins.length} {t('userDetail.connected')}
              </Badge>
            </div>
            {user.socialLogins.length > 0 && (
              <div className="flex gap-1 flex-wrap pt-1">
                {user.socialLogins.map((provider) => (
                  <Badge key={provider} variant="outline" className="text-xs">
                    {provider}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Teams */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              {t('userDetail.teams')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {user.teams.length === 0 ? (
              <p className="text-muted-foreground text-center py-2">
                {t('userDetail.noTeams')}
              </p>
            ) : (
              user.teams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <div>
                    <p className="font-medium text-xs">{team.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t(`teamRole.${team.role}`)} &middot; {team.members}{' '}
                      {t('userDetail.membersCount')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      if (selectedTeamId === team.id) {
                        setSelectedTeamId(null)
                        setEditingTeamPlan(false)
                      } else {
                        setSelectedTeamId(team.id)
                        setEditingTeamPlan(false)
                      }
                    }}
                  >
                    {selectedTeamId === team.id
                      ? t('userDetail.hide')
                      : t('userDetail.viewTeam')}
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4" />
              {t('userDetail.actions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="destructive" size="sm" className="w-full">
              <UserX className="mr-1 h-3 w-3" />
              {t('userDetail.cancelSubscription')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowAffiliate(!showAffiliate)}
            >
              <Handshake className="mr-1 h-3 w-3" />
              {showAffiliate
                ? t('userDetail.hideAffiliate')
                : t('userDetail.accessAffiliate')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowTemplates(!showTemplates)}
            >
              <FileText className="mr-1 h-3 w-3" />
              {showTemplates
                ? t('userDetail.hideTemplates')
                : t('userDetail.viewTemplates')}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Affiliate Panel (inline) */}
      {showAffiliate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Handshake className="h-5 w-5" />
              {t('affiliate.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {affiliateLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : !affiliate ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t('affiliate.noData')}
                </p>
                <Separator />
                <h4 className="text-sm font-medium">
                  {t('affiliate.createTitle')}
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t('affiliate.referralCode')}</Label>
                    <Input
                      placeholder="CODIGO123"
                      value={newAffiliateCode}
                      onChange={(e) =>
                        setNewAffiliateCode(e.target.value.toUpperCase())
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('affiliate.commissionPercent')}</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        placeholder="20"
                        value={newAffiliatePercent}
                        onChange={(e) => setNewAffiliatePercent(e.target.value)}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        %
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setNewAffiliateCode('')
                    setNewAffiliatePercent('')
                  }}
                  disabled={!newAffiliateCode || !newAffiliatePercent}
                >
                  {t('affiliate.create')}
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    {t('affiliate.referralCode')}
                  </p>
                  <p className="font-mono font-semibold">
                    {affiliate.referralCode}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    {t('affiliate.commissionPercent')}
                  </p>
                  <p className="text-lg font-bold">{affiliate.commissionPercent}%</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    {t('affiliate.tier')}
                  </p>
                  <Badge
                    variant="secondary"
                    className={tierVariant[affiliate.tier]}
                  >
                    {t(`affiliate.tiers.${affiliate.tier}`)}
                  </Badge>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    {t('affiliate.totalReferrals')}
                  </p>
                  <p className="text-lg font-bold">
                    {affiliate.totalReferrals}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      ({affiliate.activeReferrals} {t('affiliate.active')})
                    </span>
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    {t('affiliate.totalEarnings')}
                  </p>
                  <p className="text-lg font-bold">
                    ${affiliate.totalEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">
                    {t('affiliate.pendingPayout')}
                  </p>
                  <p className="text-lg font-bold">
                    ${affiliate.pendingPayout.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}


      {/* User Templates (inline) */}
      {showTemplates && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5" />
              {t('templates.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateManager
              templates={userTemplates}
              isLoading={userTemplatesLoading}
              userId={userId}
            />
          </CardContent>
        </Card>
      )}

      {/* Team Settings (inline) */}
      {selectedTeamId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5" />
              {t('teamSettings.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teamLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16" />
                <Skeleton className="h-32" />
              </div>
            ) : !teamSettings ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t('teamSettings.noData')}
              </p>
            ) : (
              <div className="space-y-6">
                {/* Team Info Cards */}
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">
                      {t('teamSettings.name')}
                    </p>
                    <p className="font-semibold">{teamSettings.name}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">
                      {t('teamSettings.members')}
                    </p>
                    <p className="font-semibold">
                      {teamSettings.members.length} / {teamSettings.maxMembers}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <HardDrive className="h-3 w-3" />
                      {t('teamSettings.storage')}
                    </p>
                    <p className="font-semibold">
                      {teamSettings.storageUsed} GB / {teamSettings.storageLimit} GB
                    </p>
                    <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${Math.min((teamSettings.storageUsed / teamSettings.storageLimit) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Team Plan + Credits + Media */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {/* Team Plan */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <CreditCard className="h-4 w-4" />
                        {t('userDetail.planInfo')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      {editingTeamPlan ? (
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs">{t('userDetail.newPlan')}</Label>
                            <Select
                              value={selectedTeamPlan}
                              onValueChange={(v) => setSelectedTeamPlan(v as UserPlan)}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {plans.map((p) => (
                                  <SelectItem key={p} value={p}>
                                    {t(`plan.${p}`)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => setEditingTeamPlan(false)}
                            >
                              <Save className="mr-1 h-3 w-3" />
                              {t('userDetail.save')}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingTeamPlan(false)}
                            >
                              {t('userDetail.cancel')}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {t('userDetail.plan')}
                            </span>
                            <Badge variant="outline">
                              {t(`plan.${teamSettings.plan}`)}
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-1 w-full"
                            onClick={() => {
                              setSelectedTeamPlan(teamSettings.plan)
                              setEditingTeamPlan(true)
                            }}
                          >
                            {t('userDetail.changePlan')}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Team Credits */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Key className="h-4 w-4" />
                        {t('teamSettings.credits')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Dialog
                        open={teamCreditDialogOpen}
                        onOpenChange={setTeamCreditDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="mr-1 h-3 w-3" />
                            {t('userDetail.addCredit')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {t('teamSettings.addCreditTitle')}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-2">
                            <div className="space-y-2">
                              <Label>{t('userDetail.creditType')}</Label>
                              <Select
                                value={teamCreditType}
                                onValueChange={(v) =>
                                  setTeamCreditType(v as CreditType)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {creditTypes.map((ct) => (
                                    <SelectItem key={ct} value={ct}>
                                      {t(`creditTypes.${ct}`)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>{t('userDetail.creditAmount')}</Label>
                              <Input
                                type="number"
                                min={1}
                                placeholder="100"
                                value={teamCreditAmount}
                                onChange={(e) =>
                                  setTeamCreditAmount(e.target.value)
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>{t('userDetail.creditValidDays')}</Label>
                              <Input
                                type="number"
                                min={1}
                                placeholder="30"
                                value={teamCreditDays}
                                onChange={(e) =>
                                  setTeamCreditDays(e.target.value)
                                }
                              />
                              <p className="text-xs text-muted-foreground">
                                {t('userDetail.creditValidDaysHint')}
                              </p>
                            </div>
                            <Button
                              className="w-full"
                              onClick={() => {
                                setTeamCreditDialogOpen(false)
                                setTeamCreditAmount('')
                                setTeamCreditDays('')
                                setTeamCreditType('plan_cycle')
                              }}
                            >
                              {t('userDetail.confirmAddCredit')}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>

                  {/* Team Media */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Film className="h-4 w-4" />
                        {t('userDetail.mediaStats')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm" className="w-full">
                        {t('teamSettings.viewTeamMedia')}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Members List */}
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    {t('teamSettings.membersList')}
                  </h4>
                  <div className="rounded-lg border divide-y">
                    {teamSettings.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-3"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="text-xs">
                            {member.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {member.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {member.email}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {t(`teamRole.${member.role}`)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Templates */}
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    {t('teamSettings.templates')}
                  </h4>
                  <TemplateManager
                    templates={teamTemplates}
                    isLoading={teamTemplatesLoading}
                    teamId={selectedTeamId ?? undefined}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Media Dialog */}
      <MediaManager userId={userId} open={mediaOpen} onOpenChange={setMediaOpen} />
    </div>
  )
}
