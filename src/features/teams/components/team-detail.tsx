import type { UserPlan } from '@/features/admin/types'
import { useNavigate } from '@tanstack/react-router'
import { MoreHorizontal, Pencil, Save, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { useTeamMutations } from '../hooks/use-team-mutations'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TemplateManager } from '@/features/admin/components/TemplateManager'

import { useAdminTeamTemplates } from '@/features/admin/hooks/use-admin-templates'
import { useTeamDetail } from '../hooks/use-team-detail'
import { TeamActivityTab } from './team-activity-tab'
import { TeamConnectionsTab } from './team-connections-tab'
import { TeamInvitationsTab } from './team-invitations-tab'
import { TeamMediaTab } from './team-media-tab'
import { TeamMembersTab } from './team-members-tab'
import { TeamOverviewTab } from './team-overview-tab'
import { TeamScheduledPostsTab } from './team-scheduled-posts-tab'

const planBadgeVariants: Record<string, string> = {
  free: 'bg-muted text-muted-foreground',
  lite: 'bg-blue-500/15 text-blue-700 dark:text-blue-400',
  premium: 'bg-orange-500/15 text-orange-700 dark:text-orange-400',
  ultimate: 'bg-violet-600/15 text-violet-700 dark:text-violet-400',
}

export function TeamDetail({ teamId }: { teamId: string }) {
  const { t } = useTranslation('admin')
  const navigate = useNavigate()
  const { data: team, isLoading } = useTeamDetail(teamId)
  const { updateTeam, deleteTeam } = useTeamMutations()
  const [tab, setTab] = useState('overview')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editYoutube, setEditYoutube] = useState('')
  const [editInstagram, setEditInstagram] = useState('')
  const [editTiktok, setEditTiktok] = useState('')

  const { data: teamTemplates, isLoading: teamTemplatesLoading } = useAdminTeamTemplates(
    teamId,
    tab === 'templates',
  )

  const openEditDialog = () => {
    if (!team) 
return
    setEditName(team.name)
    setEditEmail(team.email ?? '')
    setEditCategory(team.category ?? '')
    setEditYoutube(team.socialUrls.youtube ?? '')
    setEditInstagram(team.socialUrls.instagram ?? '')
    setEditTiktok(team.socialUrls.tiktok ?? '')
    setEditDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
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

  if (!team) 
return null

  const initials = team.name.slice(0, 2).toUpperCase()
  const categoryLabel = team.category
    ? t(`teams.categories.${team.category}`, team.category)
    : null

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar className="h-16 w-16">
          {team.picture && <AvatarImage src={team.picture} alt={team.name} />}
          <AvatarFallback className="text-lg font-medium">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-bold sm:text-xl">{team.name}</h2>
            <Badge variant="secondary" className={planBadgeVariants[team.plan as UserPlan]}>
              {t(`plan.${team.plan}`)}
            </Badge>
            {categoryLabel && (
              <Badge variant="outline" className="text-xs">{categoryLabel}</Badge>
            )}
          </div>
          {team.email && <p className="truncate text-sm text-muted-foreground">{team.email}</p>}
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t('teams.createdAt')}: {new Date(team.createdAt).toLocaleDateString()}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0" aria-label={t('userDetail.actions')}>
              <MoreHorizontal className="mr-1 h-4 w-4" />
              {t('userDetail.actions')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={openEditDialog}>
              <Pencil className="mr-2 h-4 w-4" />
              {t('teams.actions.editTeam')}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('teams.actions.deleteTeam')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('teams.actions.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('teams.actions.deleteDescription')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('userDetail.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteTeam.isPending}
              onClick={() => {
                deleteTeam.mutate(
                  { teamId },
                  {
                    onSuccess: () => {
                      setDeleteDialogOpen(false)
                      navigate({ to: '/teams' })
                    },
                    onSettled: () => setDeleteDialogOpen(false),
                  },
                )
              }}
            >
              {t('teams.actions.deleteTeam')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Team Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              {t('teams.actions.editTeam')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <div className="space-y-2">
              <Label>{t('teams.edit.name')}</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t('teams.edit.email')}</Label>
              <Input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="email@team.com" />
            </div>
            <div className="space-y-2">
              <Label>{t('teams.edit.category')}</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger><SelectValue placeholder={t('teams.edit.categoryPlaceholder')} /></SelectTrigger>
                <SelectContent>
                  {['technology', 'gaming', 'entertainment', 'education', 'sports', 'music', 'news', 'lifestyle', 'other'].map((c) => (
                    <SelectItem key={c} value={c}>{t(`teams.categories.${c}`, c)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <p className="text-xs font-medium text-muted-foreground">{t('teams.edit.socialUrls')}</p>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs">
                <span className="inline-block size-2.5 rounded-full bg-red-500" />
                YouTube
              </Label>
              <Input value={editYoutube} onChange={(e) => setEditYoutube(e.target.value)} placeholder="https://youtube.com/@channel" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs">
                <span className="inline-block size-2.5 rounded-full bg-pink-500" />
                Instagram
              </Label>
              <Input value={editInstagram} onChange={(e) => setEditInstagram(e.target.value)} placeholder="https://instagram.com/profile" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs">
                <span className="inline-block size-2.5 rounded-full bg-foreground/80" />
                TikTok
              </Label>
              <Input value={editTiktok} onChange={(e) => setEditTiktok(e.target.value)} placeholder="https://tiktok.com/@profile" />
            </div>
            <Button
              className="w-full"
              disabled={updateTeam.isPending}
              onClick={() => {
                updateTeam.mutate(
                  {
                    teamId,
                    name: editName || undefined,
                    email: editEmail || undefined,
                    category: editCategory || undefined,
                  },
                  { onSettled: () => setEditDialogOpen(false) },
                )
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              {t('userDetail.save')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Separator />

      <Tabs value={tab} onValueChange={setTab}>
        <div className="-mb-px overflow-x-auto overflow-y-hidden">
          <TabsList className="w-max sm:w-auto">
            <TabsTrigger value="overview">{t('teams.detail.overview')}</TabsTrigger>
            <TabsTrigger value="members">{t('teams.detail.membersTab')}</TabsTrigger>
            <TabsTrigger value="invitations">{t('teams.detail.invitations')}</TabsTrigger>
            <TabsTrigger value="connections">{t('users.tabs.connections')}</TabsTrigger>
            <TabsTrigger value="media">{t('users.tabs.media')}</TabsTrigger>
            <TabsTrigger value="activity">{t('users.tabs.activity')}</TabsTrigger>
            <TabsTrigger value="templates">{t('users.tabs.templates')}</TabsTrigger>
            <TabsTrigger value="scheduled-posts">{t('users.tabs.scheduledPosts')}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-4">
          <TeamOverviewTab team={team} />
        </TabsContent>

        <TabsContent value="members" className="mt-4">
          <TeamMembersTab teamId={teamId} />
        </TabsContent>

        <TabsContent value="invitations" className="mt-4">
          <TeamInvitationsTab teamId={teamId} />
        </TabsContent>

        <TabsContent value="connections" className="mt-4">
          <TeamConnectionsTab teamId={teamId} />
        </TabsContent>

        <TabsContent value="media" className="mt-4">
          <TeamMediaTab teamId={teamId} />
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <TeamActivityTab teamId={teamId} />
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('templates.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <TemplateManager templates={teamTemplates} isLoading={teamTemplatesLoading} teamId={teamId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled-posts" className="mt-4">
          <TeamScheduledPostsTab teamId={teamId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
