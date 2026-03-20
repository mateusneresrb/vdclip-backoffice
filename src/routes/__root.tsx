import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Suspense } from 'react'

import { ThemeProvider } from '@/components/layout/theme-provider'
import { ErrorFallback } from '@/components/shared/error-fallback'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryProvider } from '@/providers/query-provider'

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ErrorFallback,
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
