import { Link, useMatches } from '@tanstack/react-router'
import { BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
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
  revenue: 'nav.saasMetrics',
  finance: 'nav.contabilidade',
  admin: 'nav.administradores',
  audit: 'nav.auditoria',
  providers: 'nav.providers',
  profile: 'nav.profile',
}

const parentLabels: Record<string, string> = {
  business: 'nav.productBusiness',
}

const productRoutes: Record<string, string> = {
  users: 'nav.productVdclip',
  teams: 'nav.productVdclip',
  revenue: 'nav.productVdclip',
}

/** Labels for child segments under a parent (e.g. business/users → nav.businessUsers) */
const childLabels: Record<string, Record<string, string>> = {
  business: {
    users: 'nav.businessUsers',
    companies: 'nav.businessCompanies',
  },
}

type QuickLink =
  | { href: string; label: string; type: 'icon'; icon: typeof BookOpen; color: string }
  | { href: string; label: string; type: 'favicon'; favicon: string }

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
  const matches = useMatches()
  const lastMatch = matches[matches.length - 1]
  const segments = lastMatch?.pathname.split('/').filter(Boolean) ?? []
  const lastSegment = segments[segments.length - 1] ?? 'dashboard'

  const isUserDetail = segments.includes('users') && !segments.includes('business') && segments.length > 1
  const isTeamDetail = segments.includes('teams') && segments.length > 1
  const isBusinessCompanyDetail = segments[0] === 'business' && segments[1] === 'companies' && segments.length > 2
  const isDetailPage = isUserDetail || isTeamDetail || isBusinessCompanyDetail
  const parentSegment = segments.length >= 2 ? segments[0] : undefined
  const hasParent = !!parentSegment && !!parentLabels[parentSegment]
  const productLabel = !hasParent ? productRoutes[segments[0]] : undefined
  const labelKey = hasParent
    ? (childLabels[parentSegment]?.[lastSegment] ?? routeLabels[lastSegment])
    : routeLabels[lastSegment]

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 md:px-4">
      <SidebarTrigger className="-ml-1 shrink-0" />

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
          {(hasParent || productLabel) && (
            <>
              <BreadcrumbItem>
                <span className="text-muted-foreground">
                  {hasParent ? t(parentLabels[parentSegment!]) : t(productLabel!)}
                </span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          {!isBusinessCompanyDetail && (
            <BreadcrumbItem>
              {isDetailPage ? (
                <span className="text-muted-foreground">
                  {isUserDetail ? t('nav.users') : t('nav.teams')}
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
          {isBusinessCompanyDetail && (
            <>
              <BreadcrumbItem>
                <span className="text-muted-foreground">
                  {t('nav.businessCompanies')}
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

      {/* Quick access links — desktop only */}
      <div className="ml-auto hidden items-center gap-0.5 sm:flex">
        <TooltipProvider delayDuration={300}>
          {quickLinks.map((link) => (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
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
