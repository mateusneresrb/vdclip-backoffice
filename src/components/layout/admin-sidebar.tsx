import { BarChart3, Plug, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useMatchRoute } from '@tanstack/react-router'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const navItems = [
  { to: '/admin/metrics', icon: BarChart3, labelKey: 'admin:nav.metrics' },
  { to: '/admin/users', icon: Users, labelKey: 'admin:nav.users' },
  { to: '/admin/providers', icon: Plug, labelKey: 'admin:nav.providers' },
] as const

export function AdminSidebar() {
  const { t } = useTranslation('admin')
  const matchRoute = useMatchRoute()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive text-destructive-foreground font-bold text-sm">
            VA
          </div>
          <span className="font-semibold text-lg">{t('nav.title')}</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('nav.management')}</SidebarGroupLabel>
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
                      <span>{t(item.labelKey.replace('admin:', ''))}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
