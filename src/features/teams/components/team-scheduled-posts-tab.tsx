import { ScheduledPostsCalendar } from '@/features/admin/components/scheduled-posts-calendar'
import { useAdminTeamScheduledPosts } from '@/features/admin/hooks/use-admin-scheduled-posts'

export function TeamScheduledPostsTab({ teamId }: { teamId: string }) {
  const { data: posts = [], isLoading } = useAdminTeamScheduledPosts(teamId, true)

  return (
    <div className="space-y-4">
      <ScheduledPostsCalendar
        posts={posts}
        isLoading={isLoading}
        scope="team"
        scopeId={teamId}
      />
    </div>
  )
}
