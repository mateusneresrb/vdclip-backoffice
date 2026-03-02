import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_authenticated/affiliate')({
  component: AffiliatePage,
})

function AffiliatePage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-1 items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{t('nav.affiliate')}</h1>
        <p className="text-muted-foreground mt-2">{t('common.comingSoon')}</p>
      </div>
    </div>
  )
}
