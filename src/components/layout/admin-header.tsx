import { Link, useMatches } from '@tanstack/react-router'
import { BookOpen, Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const routeLabels: Record<string, string> = {
  dashboard: 'nav.dashboard',
  users: 'nav.users',
  teams: 'nav.teams',
  companies: 'nav.companies',
  revenue: 'nav.saasMetrics',
  finance: 'nav.contabilidade',
  admin: 'nav.administradores',
  audit: 'nav.auditoria',
  providers: 'nav.providers',
  profile: 'nav.profile',
}

const productRoutes: Record<string, string> = {
  users: 'nav.productVdclip',
  teams: 'nav.productVdclip',
  revenue: 'nav.productVdclip',
  companies: 'nav.productVdclip',
}

type QuickLink =
  | { href: string; label: string; type: 'icon'; icon: typeof BookOpen; color: string; desktopOnly?: boolean }
  | { href: string; label: string; type: 'favicon'; favicon: string; desktopOnly?: boolean }

const quickLinks: QuickLink[] = [
  {
    href: 'https://docs.vdclip.com/',
    type: 'icon',
    icon: BookOpen,
    label: 'Documentação',
    color: 'text-blue-500',
  },
  {
    href: 'https://dashboard.tawk.to/login',
    type: 'favicon',
    favicon: 'https://www.google.com/s2/favicons?domain=tawk.to&sz=32',
    label: 'Tawk (Suporte)',
    desktopOnly: true,
  },
  {
    href: 'https://vendors.paddle.com/',
    type: 'favicon',
    favicon: 'https://www.google.com/s2/favicons?domain=paddle.com&sz=32',
    label: 'Paddle',
  },
  {
    href: 'https://woovi.com/',
    type: 'favicon',
    favicon: 'https://www.google.com/s2/favicons?domain=woovi.com&sz=32',
    label: 'Woovi',
  },
  {
    href: 'https://vdclip.awsapps.com/start',
    type: 'favicon',
    favicon: 'https://www.google.com/s2/favicons?domain=aws.amazon.com&sz=32',
    label: 'AWS',
    desktopOnly: true,
  },
]

function QuickLinkIcon({ link }: { link: QuickLink }) {
  if (link.type === 'icon') {
    const Icon = link.icon
    return <Icon className={`h-4 w-4 ${link.color}`} />
  }
  return <img src={link.favicon} alt={link.label} className="h-4 w-4 rounded-sm object-contain" />
}

export function AdminHeader() {
  const { t } = useTranslation('admin')
  const { toggleSidebar } = useSidebar()
  const matches = useMatches()
  const lastMatch = matches[matches.length - 1]
  const segments = lastMatch?.pathname.split('/').filter(Boolean) ?? []
  const lastSegment = segments[segments.length - 1] ?? 'dashboard'

  const isUserDetail = segments.includes('users') && segments.length > 1
  const isTeamDetail = segments.includes('teams') && segments.length > 1
  const isCompanyDetail = segments[0] === 'companies' && segments.length > 1
  const isDetailPage = isUserDetail || isTeamDetail || isCompanyDetail
  const productLabel = productRoutes[segments[0]]
  const labelKey = routeLabels[lastSegment] ?? routeLabels[segments[0]]

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 md:px-4">
      {/* Hamburger menu — mobile only */}
      <Button
        variant="ghost"
        size="icon"
        className="-ml-1 size-7 shrink-0 sm:hidden"
        onClick={toggleSidebar}
        aria-label="Menu"
      >
        <Menu className="size-5" />
      </Button>
      {/* Panel toggle — desktop only */}
      <SidebarTrigger className="-ml-1 hidden shrink-0 sm:inline-flex" />

      {/* Logo + BackOffice — mobile only */}
      <Link to="/dashboard" className="flex shrink-0 items-center gap-2 sm:hidden">
        <img src="/vdclip-logo.svg" alt="VDClip" className="h-6 w-auto" />
        <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary dark:bg-white/10 dark:text-white">
          BackOffice
        </span>
      </Link>

      <Separator orientation="vertical" className="mr-2 hidden h-4 sm:block" />

      {/* Breadcrumb — desktop only */}
      <Breadcrumb className="hidden min-w-0 flex-1 sm:flex">
        <BreadcrumbList>
          {productLabel && (
            <>
              <BreadcrumbItem>
                <span className="text-muted-foreground">
                  {t(productLabel)}
                </span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          {!isCompanyDetail && (
            <BreadcrumbItem>
              {isDetailPage ? (
                <span className="text-muted-foreground">
                  {isUserDetail ? t('nav.users') : isTeamDetail ? t('nav.teams') : t('nav.companies')}
                </span>
              ) : (
                <BreadcrumbPage>
                  {labelKey ? t(labelKey) : t('nav.dashboard')}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          )}
          {isUserDetail && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t('userDetail.title')}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
          {isTeamDetail && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t('teams.detail.title')}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
          {isCompanyDetail && (
            <>
              <BreadcrumbItem>
                <span className="text-muted-foreground">
                  {t('nav.companies')}
                </span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t('business.companyDetail.title')}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Quick access links */}
      <div className="ml-auto flex items-center gap-0.5">
        <TooltipProvider delayDuration={300}>
          {quickLinks.map((link) => (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn('h-8 w-8', link.desktopOnly && 'hidden sm:inline-flex')}
                  asChild
                >
                  <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                    <QuickLinkIcon link={link} />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{link.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </header>
  )
}
