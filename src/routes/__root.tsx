import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Suspense } from 'react'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryProvider } from '@/providers/query-provider'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <TooltipProvider delayDuration={300}>
          <Suspense fallback={<div className="flex min-h-svh items-center justify-center text-muted-foreground">Carregando...</div>}>
            <Outlet />
          </Suspense>
          <Toaster />
          <TanStackRouterDevtools position="bottom-right" />
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
