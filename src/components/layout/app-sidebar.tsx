import {
  Calendar,
  Handshake,
  LayoutDashboard,
  FolderOpen,
  LayoutTemplate,
  Settings,
  User,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useMatchRoute } from '@tanstack/react-router'

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
} from '@/components/ui/sidebar'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { to: '/projects', icon: FolderOpen, labelKey: 'nav.projects' },
  { to: '/templates', icon: LayoutTemplate, labelKey: 'nav.templates' },
  { to: '/calendar', icon: Calendar, labelKey: 'nav.calendar' },
  { to: '/affiliate', icon: Handshake, labelKey: 'nav.affiliate' },
] as const

const footerItems = [
  { to: '/profile', icon: User, labelKey: 'nav.profile' },
  { to: '/settings', icon: Settings, labelKey: 'nav.settings' },
] as const

export function AppSidebar() {
  const { t } = useTranslation()
  const matchRoute = useMatchRoute()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
            VD
          </div>
          <span className="font-semibold text-lg">VDClip</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('nav.menu')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={!!matchRoute({ to: item.to, fuzzy: true })}
                  >
                    <Link to={item.to}>
                      <item.icon className="h-4 w-4" />
                      <span>{t(item.labelKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {footerItems.map((item) => (
            <SidebarMenuItem key={item.to}>
              <SidebarMenuButton
                asChild
                isActive={!!matchRoute({ to: item.to, fuzzy: true })}
              >
                <Link to={item.to}>
                  <item.icon className="h-4 w-4" />
                  <span>{t(item.labelKey)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
