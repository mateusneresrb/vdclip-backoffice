import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { AdminHeader } from '@/components/layout/admin-header'
import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { useAuthStore } from '@/features/auth'
import { MfaSetupWall } from '@/features/auth/components/mfa-setup-wall'

export const Route = createFileRoute('/_app')({
  beforeLoad: () => {
    const { status } = useAuthStore.getState()
    if (status !== 'authenticated') {
      throw redirect({ to: '/login' })
    }
  },
  component: AdminLayout,
})

const isDev = import.meta.env.DEV

function AdminLayout() {
  const admin = useAuthStore((s) => s.admin)

  // Enforce 2FA: block all navigation until setup is complete
  if (admin && !admin.mfaEnabled) {
    return <MfaSetupWall />
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="flex min-h-svh flex-1 flex-col">
        {isDev && (
          <div className="flex items-center justify-center gap-2 bg-amber-400/90 px-3 py-1 text-center text-xs font-medium text-amber-950 dark:bg-amber-500/30 dark:text-amber-300">
            <span>⚠️</span>
            <span>Ambiente de desenvolvimento — alterações não afetam produção</span>
          </div>
        )}
        <AdminHeader />
        <main className="flex flex-1 flex-col overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}
