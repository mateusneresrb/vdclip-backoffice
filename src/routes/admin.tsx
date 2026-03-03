import { Outlet, createFileRoute } from '@tanstack/react-router'

import { SidebarProvider } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { AdminHeader } from '@/components/layout/admin-header'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="flex min-h-svh flex-1 flex-col">
        <AdminHeader />
        <main className="flex flex-1 flex-col overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}
