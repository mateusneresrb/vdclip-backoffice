import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { restoreSession } from '@/features/auth/hooks/use-auth'
import { router } from './router'
import './index.css'
import './i18n'

async function bootstrap() {
  // Try to restore session from refresh token cookie
  await restoreSession()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}

bootstrap()
