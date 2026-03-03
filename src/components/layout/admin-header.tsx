import { useTranslation } from 'react-i18next'
import { useMatches } from '@tanstack/react-router'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { LanguageSwitcher } from '@/components/layout/language-switcher'
import { ThemeToggle } from '@/components/layout/theme-toggle'

const routeLabels: Record<string, string> = {
  users: 'nav.users',
  metrics: 'nav.metrics',
  providers: 'nav.providers',
}

export function AdminHeader() {
  const { t } = useTranslation('admin')
  const matches = useMatches()
  const lastMatch = matches[matches.length - 1]
  const segments = lastMatch?.pathname.split('/').filter(Boolean) ?? []
  const lastSegment = segments[segments.length - 1] ?? 'users'

  const isUserDetail = segments.includes('users') && segments.length > 2
  const labelKey = routeLabels[lastSegment]

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 md:px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 hidden h-4 sm:block" />
      <Breadcrumb className="hidden sm:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            {isUserDetail ? (
              <span className="text-muted-foreground">{t('nav.users')}</span>
            ) : (
              <BreadcrumbPage>
                {labelKey ? t(labelKey) : t('nav.users')}
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
          {isUserDetail && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t('userDetail.title')}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-1">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  )
}
