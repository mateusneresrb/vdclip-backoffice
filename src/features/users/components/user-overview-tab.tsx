import type { AdminUser, UserPlan } from '@/features/admin/types'
import { Link } from '@tanstack/react-router'
import {
  AlertTriangle,
  Ban,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  Film,
  Key,
  Link2,
  Mail,
  MailCheck,
  Minus,
  Package,
  Plus,
  QrCode,
  Save,
  Share2,
  TrendingUp,
  Video,
} from 'lucide-react'
import { useState } from 'react'

import { useTranslation } from 'react-i18next'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

import { cn } from '@/lib/utils'
import { useUserMutations } from '../hooks/use-user-mutations'

const plans: UserPlan[] = ['free', 'lite', 'premium', 'ultimate']
const billingPeriods = ['monthly', 'yearly'] as const

const planBadgeVariants: Record<UserPlan, string> = {
  free: 'bg-muted text-muted-foreground',
  lite: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  premium: 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
  ultimate: 'bg-violet-600/15 text-violet-700 dark:text-violet-400',
}

export function UserOverviewTab({ user }: { user: AdminUser }) {
  const { t } = useTranslation('admin')
  const { grantCredits, deductCredits, changePlan, cancelPlan, sendVerificationEmail, createPixSubscription } = useUserMutations()

  const [editingPlan, setEditingPlan] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<UserPlan>(user.plan)
  const [planReason, setPlanReason] = useState('')
  const [planConfirmOpen, setPlanConfirmOpen] = useState(false)
  const [creditDialogOpen, setCreditDialogOpen] = useState(false)
  const [creditAmount, setCreditAmount] = useState('')
  const [creditReason, setCreditReason] = useState('')
  const [creditDays, setCreditDays] = useState('365')
  const [cancelPlanDialogOpen, setCancelPlanDialogOpen] = useState(false)

  // Remove credits dialog
  const [removeCreditOpen, setRemoveCreditOpen] = useState(false)
  const [removeCreditAmount, setRemoveCreditAmount] = useState('')
  const [removeCreditReason, setRemoveCreditReason] = useState('')

  // Pix subscription dialog
  const [pixDialogOpen, setPixDialogOpen] = useState(false)
  const [pixPlan, setPixPlan] = useState<UserPlan>('premium')
  const [pixBillingPeriod, setPixBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [pixQuantity, setPixQuantity] = useState('1')

  const totalCredits = user.creditPackages.reduce((sum, p) => sum + p.amount, 0)
  const usedCredits = user.creditPackages.reduce((sum, p) => sum + p.used, 0)
  const usagePercent = totalCredits > 0 ? Math.round((usedCredits / totalCredits) * 100) : 0
  const postRate = user.mediaCreated > 0 ? Math.round((user.mediaPosted / user.mediaCreated) * 100) : 0

  const daysSinceCreation = Math.floor(
    (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24),
  )

  const handleGrantCredits = () => {
    const amount = Number(creditAmount)
    if (!amount || amount <= 0 || !creditReason.trim()) return
    const days = Number(creditDays) || 365
    grantCredits.mutate(
      {
        userId: user.id,
        amount,
        expiresDays: days,
        reason: creditReason.trim(),
      },
      {
        onSuccess: () => {
          setCreditDialogOpen(false)
          setCreditAmount('')
          setCreditDays('365')
          setCreditReason('')
        },
      },
    )
  }

  const handleChangePlan = () => {
    if (selectedPlan === user.plan) {
      setEditingPlan(false)
      return
    }
    if (!planReason.trim()) return
    setPlanConfirmOpen(true)
  }

  const handleConfirmChangePlan = () => {
    changePlan.mutate(
      { userId: user.id, plan: selectedPlan, reason: planReason.trim() },
      {
        onSuccess: () => {
          setEditingPlan(false)
          setPlanConfirmOpen(false)
          setPlanReason('')
        },
      },
    )
  }

  const handleCancelPlan = () => {
    cancelPlan.mutate(
      { userId: user.id },
      { onSuccess: () => setCancelPlanDialogOpen(false) },
    )
  }

  const handleDeductCredits = () => {
    const amount = Number(removeCreditAmount)
    if (!amount || amount <= 0 || !removeCreditReason.trim()) return
    deductCredits.mutate(
      { userId: user.id, amount, reason: removeCreditReason.trim() },
      {
        onSuccess: () => {
          setRemoveCreditOpen(false)
          setRemoveCreditAmount('')
          setRemoveCreditReason('')
        },
      },
    )
  }

  const handleCreatePix = () => {
    const qty = Number(pixQuantity) || 1
    createPixSubscription.mutate(
      { userId: user.id, plan: pixPlan, billingPeriod: pixBillingPeriod, quantity: qty },
      { onSuccess: () => setPixDialogOpen(false) },
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Card className="border-dashed">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Video className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-bold sm:text-2xl">{user.mediaCreated}</p>
              <p className="text-xs text-muted-foreground">{t('userDetail.quickStats.totalMedia')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-lg font-bold sm:text-2xl">{postRate}%</p>
              <p className="text-xs text-muted-foreground">{t('userDetail.quickStats.successRate')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-violet-500/10">
              <Clock className="size-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-lg font-bold sm:text-2xl">{daysSinceCreation}</p>
              <p className="text-xs text-muted-foreground">{t('userDetail.quickStats.activeDays')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
              <TrendingUp className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-lg font-bold sm:text-2xl">{user.credits}</p>
              <p className="text-xs text-muted-foreground">{t('userDetail.quickStats.creditsAvailable')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3">
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
                <div className="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{t('userDetail.changePlanWarning')}</span>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{t('userDetail.newPlan')}</Label>
                  <Select value={selectedPlan} onValueChange={(v) => setSelectedPlan(v as UserPlan)}>
                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {plans.map((p) => (<SelectItem key={p} value={p}>{t(`plan.${p}`)}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">{t('userDetail.reason')}</Label>
                  <Input
                    className="h-8 text-xs"
                    placeholder={t('userDetail.reasonPlaceholder')}
                    value={planReason}
                    onChange={(e) => setPlanReason(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" disabled={changePlan.isPending || !planReason.trim() || selectedPlan === user.plan} onClick={handleChangePlan}>
                    <Save className="mr-1 h-3 w-3" />{t('userDetail.save')}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditingPlan(false)}>
                    {t('userDetail.cancel')}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('userDetail.plan')}</span>
                  <Badge variant="secondary" className={planBadgeVariants[user.plan]}>
                    {t(`plan.${user.plan}`)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('userDetail.provider')}</span>
                  <span className="capitalize">{user.planProvider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('userDetail.expires')}</span>
                  <span>{user.planExpiresAt ? new Date(user.planExpiresAt).toLocaleDateString() : '—'}</span>
                </div>
                {user.subscriptionId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('userDetail.subscriptionId')}</span>
                    <Badge variant="secondary" className="max-w-[240px] truncate font-mono text-[11px]">
                      {user.subscriptionId}
                    </Badge>
                  </div>
                )}
                <div className="mt-1 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setSelectedPlan(user.plan); setEditingPlan(true) }}>
                    {t('userDetail.changePlan')}
                  </Button>
                  {user.plan !== 'free' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-destructive/40 text-destructive hover:bg-destructive/10"
                      onClick={() => setCancelPlanDialogOpen(true)}
                    >
                      <Ban className="mr-1 h-3 w-3" />{t('userDetail.cancelPlan')}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => setPixDialogOpen(true)}
                  >
                    <QrCode className="h-3 w-3" />
                    Pix Automático
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Credits with usage progress */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Key className="h-4 w-4" />{t('userDetail.credits')}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs text-destructive hover:text-destructive"
                  onClick={() => setRemoveCreditOpen(true)}
                >
                  <Minus className="mr-1 h-3 w-3" />{t('userDetail.removeCredit')}
                </Button>
              <Dialog open={creditDialogOpen} onOpenChange={setCreditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Plus className="mr-1 h-3 w-3" />{t('userDetail.addCredit')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{t('userDetail.addCreditTitle')}</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label>{t('userDetail.creditAmount')}</Label>
                      <Input type="number" min={1} placeholder="100" value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('userDetail.creditValidDays')}</Label>
                      <Input
                        type="number"
                        min={1}
                        placeholder="365"
                        value={creditDays}
                        onChange={(e) => setCreditDays(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">{t('userDetail.creditValidDaysHint')}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('userDetail.reason')}</Label>
                      <Input
                        placeholder={t('userDetail.reasonPlaceholder')}
                        value={creditReason}
                        onChange={(e) => setCreditReason(e.target.value)}
                      />
                    </div>
                    <Button
                      className="w-full"
                      disabled={!creditAmount || Number(creditAmount) <= 0 || !creditReason.trim() || grantCredits.isPending}
                      onClick={handleGrantCredits}
                    >
                      {t('userDetail.confirmAddCredit')}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-baseline justify-between">
                <p className="text-lg font-bold sm:text-3xl">{user.credits}</p>
                <span className="text-xs text-muted-foreground">{usagePercent}% {t('userDetail.creditsUsed').toLowerCase()}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    usagePercent > 90 ? 'bg-destructive' : usagePercent > 70 ? 'bg-amber-500' : 'bg-primary',
                  )}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
                <span>{usedCredits} {t('userDetail.creditsUsed').toLowerCase()}</span>
                <span>{totalCredits - usedCredits} {t('userDetail.creditsRemaining').toLowerCase()}</span>
              </div>
            </div>
            {user.creditPackages.length > 0 && (
              <div className="max-h-[280px] divide-y overflow-y-auto rounded-lg border">
                {user.creditPackages.map((pkg) => {
                  const isExpired = new Date(pkg.expiresAt) < new Date()
                  const pkgUsage = pkg.amount > 0 ? Math.round((pkg.used / pkg.amount) * 100) : 0
                  return (
                    <div key={pkg.id} className={cn('space-y-1.5 p-3', isExpired && 'opacity-50')}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="h-3.5 w-3.5 text-muted-foreground" />
                          <Badge variant="outline" className="text-[10px] capitalize">{t(`creditTypes.${pkg.type}`)}</Badge>
                          {isExpired && <Badge variant="secondary" className="bg-destructive/15 text-[10px] text-destructive">{t('userDetail.expired')}</Badge>}
                        </div>
                        <span className="text-sm font-semibold">{pkg.amount - pkg.used} / {pkg.amount}</span>
                      </div>
                      {!isExpired && (
                        <div className="h-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary/60 transition-all"
                            style={{ width: `${pkgUsage}%` }}
                          />
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(pkg.startDate).toLocaleDateString()}</span>
                        <span>&rarr;</span>
                        <span>{new Date(pkg.expiresAt).toLocaleDateString()}</span>
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
              <Film className="h-4 w-4" />{t('userDetail.mediaStats')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('userDetail.mediaCreated')}</span>
              <span className="font-semibold">{user.mediaCreated}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Share2 className="h-3 w-3" />
                {t('userDetail.mediaPosted')}
              </span>
              <span className="font-semibold">{user.mediaPosted}</span>
            </div>
            {user.mediaCreated > 0 && (
              <>
                <Separator />
                <div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{t('userDetail.publishRate')}</span>
                    <span className="font-medium">{postRate}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${postRate}%` }}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Company Info */}
        {user.companyName && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4" />{t('userDetail.company')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('userDetail.companyName')}</span>
                <span className="font-medium">{user.companyName}</span>
              </div>
              <Link
                to="/companies/$companyId"
                params={{ companyId: user.companyId! }}
                className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                {t('userDetail.viewCompany')}
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Account Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />{t('userDetail.account')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('userDetail.emailVerified')}</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={user.emailVerified ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : 'bg-destructive/15 text-destructive'}>
                  {user.emailVerified ? t('userDetail.yes') : t('userDetail.no')}
                </Badge>
                {!user.emailVerified && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 gap-1 text-[11px]"
                    disabled={sendVerificationEmail.isPending}
                    onClick={() => sendVerificationEmail.mutate({ userId: user.id })}
                  >
                    <MailCheck className="h-3 w-3" />
                    {t('users.actions.verifyEmail')}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('userDetail.socialAccount')}</span>
              <span>{user.isSocialAccount ? t('userDetail.yes') : t('userDetail.no')}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Link2 className="h-3.5 w-3.5" />{t('userDetail.socialLogins')}
              </span>
              <Badge variant="outline">{user.socialLogins.length} {t('userDetail.connected')}</Badge>
            </div>
            {user.socialLogins.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {user.socialLogins.map((provider) => (
                  <Badge key={provider} variant="outline" className="text-xs capitalize">{provider}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Plan Change Confirmation */}
      <AlertDialog open={planConfirmOpen} onOpenChange={setPlanConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('userDetail.confirmPlanChangeTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('userDetail.confirmPlanChangeDescription', { from: t(`plan.${user.plan}`), to: t(`plan.${selectedPlan}`) })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('userDetail.cancel')}</AlertDialogCancel>
            <AlertDialogAction disabled={changePlan.isPending} onClick={handleConfirmChangePlan}>
              {t('userDetail.confirmPlanChange')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Plan Confirmation */}
      <AlertDialog open={cancelPlanDialogOpen} onOpenChange={setCancelPlanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('userDetail.cancelPlanTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('userDetail.cancelPlanDescription')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('userDetail.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={cancelPlan.isPending}
              onClick={handleCancelPlan}
            >
              {t('userDetail.cancelPlanConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Credits Dialog */}
      <Dialog open={removeCreditOpen} onOpenChange={setRemoveCreditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('userDetail.removeCreditTitle')}</DialogTitle>
            <DialogDescription>{t('userDetail.removeCreditDescription')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{t('userDetail.fefoWarning')}</span>
            </div>
            <div className="space-y-2">
              <Label>{t('userDetail.creditAmount')}</Label>
              <Input
                type="number"
                min={1}
                placeholder="50"
                value={removeCreditAmount}
                onChange={(e) => setRemoveCreditAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {t('userDetail.removeCreditAvailable', { credits: user.credits })}
              </p>
            </div>
            <div className="space-y-2">
              <Label>{t('userDetail.reason')}</Label>
              <Input
                placeholder={t('userDetail.reasonPlaceholder')}
                value={removeCreditReason}
                onChange={(e) => setRemoveCreditReason(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              variant="destructive"
              disabled={!removeCreditAmount || Number(removeCreditAmount) <= 0 || !removeCreditReason.trim() || deductCredits.isPending}
              onClick={handleDeductCredits}
            >
              {t('userDetail.confirmRemoveCredit')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pix Subscription Dialog */}
      <Dialog open={pixDialogOpen} onOpenChange={setPixDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              {t('userDetail.pixTitle')}
            </DialogTitle>
            <DialogDescription>{t('userDetail.pixDescription')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>{t('userDetail.plan')}</Label>
              <Select value={pixPlan} onValueChange={(v) => setPixPlan(v as UserPlan)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {plans.filter((p) => p !== 'free').map((p) => (
                    <SelectItem key={p} value={p}>{t(`plan.${p}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('userDetail.pixBillingPeriod')}</Label>
              <Select value={pixBillingPeriod} onValueChange={(v) => setPixBillingPeriod(v as 'monthly' | 'yearly')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {billingPeriods.map((bp) => (
                    <SelectItem key={bp} value={bp}>{t(`userDetail.pixPeriod.${bp}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('userDetail.pixQuantity')}</Label>
              <Input type="number" min={1} max={10} value={pixQuantity} onChange={(e) => setPixQuantity(e.target.value)} />
            </div>
            <Button
              className="w-full"
              disabled={createPixSubscription.isPending}
              onClick={handleCreatePix}
            >
              <QrCode className="mr-2 h-4 w-4" />
              {t('userDetail.pixGenerate')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
