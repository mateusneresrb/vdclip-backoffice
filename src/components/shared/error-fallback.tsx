import type { ErrorComponentProps } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

export function ErrorFallback({ reset }: ErrorComponentProps) {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-[50svh] flex-col items-center justify-center px-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 sm:size-16">
        <AlertTriangle className="size-7 text-destructive sm:size-8" />
      </div>
      <h2 className="mt-5 text-lg font-semibold tracking-tight sm:text-xl">
        {t('error.title')}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {t('error.description')}
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button onClick={reset}>{t('error.tryAgain')}</Button>
        <Button variant="outline" asChild>
          <Link to="/dashboard">{t('error.goHome')}</Link>
        </Button>
      </div>
    </div>
  )
}
