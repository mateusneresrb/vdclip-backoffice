import { Suspense } from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { QueryProvider } from '@/providers/query-provider'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <Suspense fallback={<div className="flex min-h-svh items-center justify-center">Loading...</div>}>
          <Outlet />
        </Suspense>
        <Toaster />
        <TanStackRouterDevtools position="bottom-right" />
      </QueryProvider>
    </ThemeProvider>
  )
}
