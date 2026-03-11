import type { AdminTeamDetail, UserPlan } from '@/features/admin/types'
import {
  AlertTriangle,
  Ban,
  CreditCard,
  ExternalLink,
  Film,
  Globe,
  Key,
  Save,
  Share2,
  TrendingUp,
  Users,
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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Separator } from '@/components/ui/separator'

const planBadgeVariants: Record<UserPlan, string> = {
  free: 'bg-muted text-muted-foreground',
  lite: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  premium: 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
  ultimate: 'bg-violet-600/15 text-violet-700 dark:text-violet-400',
}

const plans: UserPlan[] = ['free', 'lite', 'premium', 'ultimate']

export function TeamOverviewTab({ team }: { team: AdminTeamDetail }) {
  const { t } = useTranslation('admin')
  const [editingPlan, setEditingPlan] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<UserPlan>(team.plan)
  const [cancelPlanDialogOpen, setCancelPlanDialogOpen] = useState(false)

  const postRate = team.mediaCreated > 0 ? Math.round((team.mediaPosted / team.mediaCreated) * 100) : 0
  const memberPercent = Math.min((team.memberCount / team.maxMembers) * 100, 100)
  const daysSinceCreation = Math.floor((Date.now() - new Date(team.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  const socialEntries = Object.entries(team.socialUrls).filter(([, v]) => v)

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Card className="border-dashed">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Video className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-lg font-bold sm:text-2xl">{team.mediaCreated}</p>
              <p className="text-xs text-muted-foreground">{t('userDetail.quickStats.totalMedia')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <Share2 className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-lg font-bold sm:text-2xl">{team.mediaPosted}</p>
              <p className="text-xs text-muted-foreground">{t('userDetail.quickStats.postsPublished')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-violet-500/10">
              <Users className="size-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-lg font-bold sm:text-2xl">{team.memberCount}<span className="text-sm font-normal text-muted-foreground">/{team.maxMembers}</span></p>
              <p className="text-xs text-muted-foreground">{t('teams.detail.memberCount')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
              <TrendingUp className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-lg font-bold sm:text-2xl">{team.credits.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{t('userDetail.quickStats.creditsAvailable')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

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
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => setEditingPlan(false)}>
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
                  <Badge variant="secondary" className={planBadgeVariants[team.plan]}>
                    {t(`plan.${team.plan}`)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('teams.detail.memberCount')}</span>
                  <span className="font-medium">{team.memberCount} / {team.maxMembers}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all ${memberPercent >= 90 ? 'bg-amber-500' : 'bg-primary'}`}
                    style={{ width: `${memberPercent}%` }}
                  />
                </div>
                <div className="mt-1 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => { setSelectedPlan(team.plan); setEditingPlan(true) }}>
                    {t('userDetail.changePlan')}
                  </Button>
                  {team.plan !== 'free' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-destructive/40 text-destructive hover:bg-destructive/10"
                      onClick={() => setCancelPlanDialogOpen(true)}
                    >
                      <Ban className="mr-1 h-3 w-3" />{t('userDetail.cancelPlan')}
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Credits */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Key className="h-4 w-4" />
              {t('userDetail.credits')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-2xl font-bold sm:text-3xl">{team.credits.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{t('teams.detail.creditsAvailable')}</p>
            <Separator />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('teams.createdAt')}: {new Date(team.createdAt).toLocaleDateString()}</span>
              <span>{daysSinceCreation}d</span>
            </div>
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
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('userDetail.mediaCreated')}</span>
              <span className="font-semibold">{team.mediaCreated}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Share2 className="h-3 w-3" />
                {t('userDetail.mediaPosted')}
              </span>
              <span className="font-semibold">{team.mediaPosted}</span>
            </div>
            {team.mediaCreated > 0 && (
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

        {/* Social URLs */}
        {socialEntries.length > 0 && (
          <Card className="sm:col-span-2 lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Globe className="h-4 w-4" />
                {t('teams.detail.socialUrls')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {socialEntries.map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-colors hover:bg-muted"
                  >
                    <span className="font-medium capitalize">{platform}</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Cancel Plan Dialog */}
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
              onClick={() => setCancelPlanDialogOpen(false)}
            >
              {t('userDetail.cancelPlanConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
