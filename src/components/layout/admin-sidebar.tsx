import { Link, useMatchRoute, useNavigate } from '@tanstack/react-router'
import {
  BarChart3,
  BookOpen,
  Building2,
  Check,
  ChevronDown,
  ChevronsUpDown,
  DollarSign,
  FileSearch,
  KeyRound,
  LogOut,
  Monitor,
  Moon,
  Network,
  Plug,
  Sun,
  User,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@/components/layout/theme-provider'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAuth, useHasPermission } from '@/features/auth'
import { PERMISSIONS } from '@/features/auth/lib/permissions'
import { cn } from '@/lib/utils'

interface NavItem {
  to: string
  search?: Record<string, string>
  icon: React.ComponentType<{ className?: string }>
  labelKey: string
  permission?: string
  children?: NavSubItem[]
}

interface NavSubItem {
  to: string
  search?: Record<string, string>
  icon: React.ComponentType<{ className?: string }>
  labelKey: string
}

interface NavSection {
  labelKey: string
  items: NavItem[]
  defaultOpen?: boolean
}

const sections: NavSection[] = [
  {
    labelKey: 'nav.overview',
    defaultOpen: true,
    items: [
      { to: '/dashboard', icon: BarChart3, labelKey: 'nav.dashboard', permission: PERMISSIONS.METRICS_READ },
    ],
  },
  {
    labelKey: 'nav.productVdclip',
    defaultOpen: true,
    items: [
      { to: '/revenue', icon: DollarSign, labelKey: 'nav.saasMetrics', permission: PERMISSIONS.FINANCE_READ },
      { to: '/users', icon: Users, labelKey: 'nav.users', permission: PERMISSIONS.USERS_READ },
      { to: '/teams', icon: Network, labelKey: 'nav.teams', permission: PERMISSIONS.TEAMS_READ },
    ],
  },
  {
    labelKey: 'nav.productBusiness',
    defaultOpen: true,
    items: [
      { to: '/business/companies', icon: Building2, labelKey: 'nav.businessCompanies', permission: PERMISSIONS.USERS_READ },
      { to: '/business/users', icon: Users, labelKey: 'nav.businessUsers', permission: PERMISSIONS.USERS_READ },
    ],
  },
  {
    labelKey: 'nav.financial',
    defaultOpen: true,
    items: [
      { to: '/finance', icon: BookOpen, labelKey: 'nav.contabilidade', permission: PERMISSIONS.FINANCE_READ },
    ],
  },
  {
    labelKey: 'nav.administration',
    defaultOpen: true,
    items: [
      { to: '/admin', icon: KeyRound, labelKey: 'nav.administradores', permission: PERMISSIONS.ADMIN_READ },
      { to: '/audit', icon: FileSearch, labelKey: 'nav.auditoria', permission: PERMISSIONS.AUDIT_READ },
      { to: '/providers', icon: Plug, labelKey: 'nav.providers', permission: PERMISSIONS.PROVIDERS_READ },
    ],
  },
]

const themes = [
  { value: 'light', label: 'theme.light', icon: Sun },
  { value: 'dark', label: 'theme.dark', icon: Moon },
  { value: 'system', label: 'theme.system', icon: Monitor },
] as const

export function AdminSidebar() {
  const { t } = useTranslation('admin')
  const { t: tCommon } = useTranslation('common')
  const matchRoute = useMatchRoute()
  const navigate = useNavigate()
  const { admin, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { isMobile, setOpenMobile } = useSidebar()

  const ActiveThemeIcon = themes.find((th) => th.value === theme)?.icon ?? Monitor
  const initials = admin ? admin.name.slice(0, 2).toUpperCase() : ''

  const handleNavigate = isMobile ? () => setOpenMobile(false) : undefined

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border/40 px-4 py-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3">
        <div className="flex items-center gap-2">
          <SidebarMenu className="flex-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                className="hover:bg-transparent active:bg-transparent md:h-auto md:p-0 group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-0"
              >
                <Link to="/dashboard" onClick={handleNavigate} className="flex w-full items-center justify-center">
                  <img
                    src="/vdclip-icon.svg"
                    alt="VDClip"
                    className="hidden size-8 shrink-0 group-data-[collapsible=icon]:!block"
                  />
                  <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:!hidden">
                    <img
                      src="/vdclip-logo.svg"
                      alt="VDClip"
                      className="h-8 w-auto"
                    />
                    <span className="mt-0.5 rounded-sm bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary dark:bg-white/10 dark:text-white">
                      BackOffice
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Close button — mobile only */}
          {isMobile && (
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              aria-label="Fechar menu"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-1 pt-1">
        {sections.map((section) => (
          <CollapsibleNavGroup
            key={section.labelKey}
            section={section}
            matchRoute={matchRoute}
            t={t}
            onNavigate={handleNavigate}
          />
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/40 px-3 pb-3 pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="rounded-md transition-colors hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent"
                >
                  <Avatar className="size-7 shrink-0 rounded-full">
                    <AvatarFallback className="rounded-full bg-primary/10 text-[11px] font-medium text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-sm font-medium text-sidebar-foreground">
                      {admin?.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {admin?.role ? t(`adminUsers.roles.${admin.role}`) : ''}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground/40" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-8 rounded-full">
                      <AvatarFallback className="rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid text-left leading-tight">
                      <span className="truncate text-sm font-medium">{admin?.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{admin?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => { navigate({ to: '/profile' }); if (isMobile) 
setOpenMobile(false) }}>
                    <User className="mr-2 size-4" />
                    {t('nav.profile')}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <ActiveThemeIcon className="mr-2 size-4" />
                      {tCommon('theme.toggle')}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent sideOffset={8}>
                      {themes.map((th) => (
                        <DropdownMenuItem key={th.value} onClick={() => setTheme(th.value)}>
                          <th.icon className="mr-2 size-4" />
                          <span className="flex-1">{tCommon(th.label)}</span>
                          {theme === th.value && <Check className="ml-2 size-4 text-primary" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 size-4" />
                  {tCommon('common.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

function CollapsibleNavGroup({
  section,
  matchRoute,
  t,
  onNavigate,
}: {
  section: NavSection
  matchRoute: ReturnType<typeof useMatchRoute>
  t: (key: string) => string
  onNavigate?: () => void
}) {
  const [open, setOpen] = useState(section.defaultOpen ?? true)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <SidebarGroup className="py-1">
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="cursor-pointer select-none hover:text-foreground">
            <span className="flex-1">{t(section.labelKey)}</span>
            <ChevronDown className={cn(
              'size-3.5 transition-transform duration-200',
              !open && '-rotate-90',
            )} />
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {section.items.map((item) => (
                item.children
                  ? <CollapsibleNavItem key={item.to + item.labelKey} item={item} matchRoute={matchRoute} t={t} onNavigate={onNavigate} />
                  : <PermissionNavItem key={item.to} item={item} matchRoute={matchRoute} t={t} onNavigate={onNavigate} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}

function CollapsibleNavItem({
  item,
  matchRoute,
  t,
  onNavigate,
}: {
  item: NavItem
  matchRoute: ReturnType<typeof useMatchRoute>
  t: (key: string) => string
  onNavigate?: () => void
}) {
  const hasPermission = useHasPermission(item.permission ?? '')
  const isActive = !!matchRoute({ to: item.to, fuzzy: true })
  const [open, setOpen] = useState(isActive)

  if (item.permission && !hasPermission) 
return null

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={t(item.labelKey)}
            className={cn(
              'h-8 gap-3 rounded-md text-sm text-sidebar-foreground transition-colors',
              'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              isActive && 'font-medium text-sidebar-accent-foreground',
            )}
          >
            <item.icon className="size-4 shrink-0" />
            <span className="flex-1">{t(item.labelKey)}</span>
            <ChevronDown className={cn(
              'size-3 transition-transform duration-200',
              !open && '-rotate-90',
            )} />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children?.map((child) => (
              <SidebarMenuSubItem key={child.labelKey}>
                <SidebarMenuSubButton
                  asChild
                  className={cn(
                    'text-sidebar-foreground transition-colors',
                    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )}
                >
                  <Link to={child.to} search={child.search} onClick={onNavigate}>
                    <child.icon className="size-3.5 shrink-0" />
                    <span>{t(child.labelKey)}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

function PermissionNavItem({
  item,
  matchRoute,
  t,
  onNavigate,
}: {
  item: NavItem
  matchRoute: ReturnType<typeof useMatchRoute>
  t: (key: string) => string
  onNavigate?: () => void
}) {
  const hasPermission = useHasPermission(item.permission ?? '')
  const isActive = !!matchRoute({ to: item.to, fuzzy: true })

  if (item.permission && !hasPermission) 
return null

  return (
    <SidebarMenuItem className="relative">
      {isActive && (
        <div className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-primary transition-all duration-200 group-data-[collapsible=icon]:hidden" />
      )}
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={t(item.labelKey)}
        className={cn(
          'h-8 gap-3 rounded-md text-sm text-sidebar-foreground transition-colors',
          'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
          isActive && 'bg-sidebar-accent font-medium text-sidebar-accent-foreground',
        )}
      >
        <Link to={item.to} search={item.search} onClick={onNavigate}>
          <item.icon className="size-4 shrink-0" />
          <span>{t(item.labelKey)}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
