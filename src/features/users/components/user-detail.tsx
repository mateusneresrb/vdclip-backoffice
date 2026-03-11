import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { TemplateManager } from '@/features/admin/components/TemplateManager'
import {
  useAdminUserTemplates,
} from '@/features/admin/hooks/use-admin-templates'
import {
  useAdminUser,
} from '@/features/admin/hooks/use-admin-users'

import { UserActivityTab } from './user-activity-tab'
import { UserDetailHeader } from './user-detail-header'
import { UserMediaTab } from './user-media-tab'
import { UserOverviewTab } from './user-overview-tab'
import { UserScheduledPostsTab } from './user-scheduled-posts-tab'
import { UserSocialTab } from './user-social-tab'
import { UserTeamsTab } from './user-teams-tab'

export function UserDetail({ userId }: { userId: string }) {
  const { t } = useTranslation('admin')
  const { data: user, isLoading } = useAdminUser(userId)
  const [tab, setTab] = useState('overview')

  const { data: userTemplates, isLoading: userTemplatesLoading } =
    useAdminUserTemplates(userId, tab === 'templates')

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (!user) 
return null

  return (
    <div className="space-y-6">
      <UserDetailHeader user={user} />
      <Separator />

      <Tabs value={tab} onValueChange={setTab}>
        <div className="overflow-x-auto">
          <TabsList>
            <TabsTrigger value="overview">{t('users.tabs.overview')}</TabsTrigger>
            <TabsTrigger value="teams">{t('users.tabs.teams')}</TabsTrigger>
            <TabsTrigger value="activity">{t('users.tabs.activity')}</TabsTrigger>
            <TabsTrigger value="connections">{t('users.tabs.connections')}</TabsTrigger>
            <TabsTrigger value="templates">{t('users.tabs.templates')}</TabsTrigger>
            <TabsTrigger value="media">{t('users.tabs.media')}</TabsTrigger>
            <TabsTrigger value="scheduled-posts">{t('users.tabs.scheduledPosts')}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-4">
          <UserOverviewTab user={user} />
        </TabsContent>

        <TabsContent value="teams" className="mt-4">
          <UserTeamsTab teams={user.teams} />
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <UserActivityTab userId={userId} />
        </TabsContent>

        <TabsContent value="connections" className="mt-4">
          <UserSocialTab userId={userId} />
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('templates.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <TemplateManager templates={userTemplates} isLoading={userTemplatesLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-4">
          <UserMediaTab userId={userId} />
        </TabsContent>

        <TabsContent value="scheduled-posts" className="mt-4">
          <UserScheduledPostsTab userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
