import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { FolderOpen, LayoutTemplate, Film, HardDrive } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

const cards = [
  { titleKey: 'cards.projects', value: '0', icon: FolderOpen },
  { titleKey: 'cards.templates', value: '0', icon: LayoutTemplate },
  { titleKey: 'cards.clips', value: '0', icon: Film },
  { titleKey: 'cards.storage', value: '0 MB', icon: HardDrive },
] as const

function DashboardPage() {
  const { t } = useTranslation('dashboard')

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{t('welcome')}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">{t('description')}</p>
      </div>
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.titleKey}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t(card.titleKey)}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
