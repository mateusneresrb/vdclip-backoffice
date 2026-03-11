import { ScheduledPostsCalendar } from '@/features/admin/components/scheduled-posts-calendar'
import { useAdminUserScheduledPosts } from '@/features/admin/hooks/use-admin-scheduled-posts'

export function UserScheduledPostsTab({ userId }: { userId: string }) {
  const { data: posts = [], isLoading } = useAdminUserScheduledPosts(userId, true)

  return (
    <div className="space-y-4">
      <ScheduledPostsCalendar
        posts={posts}
        isLoading={isLoading}
        scope="user"
        scopeId={userId}
      />
    </div>
  )
}
