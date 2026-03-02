import { useTranslation } from 'react-i18next'
import { useMatches } from '@tanstack/react-router'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { LanguageSwitcher } from '@/components/layout/language-switcher'
import { ThemeToggle } from '@/components/layout/theme-toggle'

const routeLabels: Record<string, string> = {
  dashboard: 'nav.dashboard',
  projects: 'nav.projects',
  templates: 'nav.templates',
  calendar: 'nav.calendar',
  affiliate: 'nav.affiliate',
  profile: 'nav.profile',
  settings: 'nav.settings',
}

export function Header() {
  const { t } = useTranslation()
  const matches = useMatches()
  const lastMatch = matches[matches.length - 1]
  const pathSegment = lastMatch?.pathname.split('/').filter(Boolean).pop() ?? 'dashboard'
  const labelKey = routeLabels[pathSegment] ?? 'nav.dashboard'

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 md:px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 hidden h-4 sm:block" />
      <Breadcrumb className="hidden sm:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{t(labelKey)}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-1">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  )
}
