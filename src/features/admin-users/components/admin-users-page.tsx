import { useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/shared/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { AdminRolesTab } from './admin-roles-tab'
import { AdminSessionsTab } from './admin-sessions-tab'
import { AdminUsersListTab } from './admin-users-list-tab'

const VALID_TABS = ['users', 'roles', 'sessions'] as const
type AdminTab = typeof VALID_TABS[number]

export function AdminUsersPage() {
  const { t } = useTranslation('admin')
  const { tab } = useSearch({ from: '/_app/admin' })
  const navigate = useNavigate()
  const activeTab: AdminTab = VALID_TABS.includes(tab as AdminTab) ? (tab as AdminTab) : 'users'

  function handleTabChange(value: string) {
    navigate({ to: '/admin', search: { tab: value }, replace: true })
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('nav.administradores')} description={t('adminUsers.pageDescription')} />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="users">{t('adminUsers.tabUsers')}</TabsTrigger>
          <TabsTrigger value="roles">{t('adminUsers.tabRoles')}</TabsTrigger>
          <TabsTrigger value="sessions">{t('adminUsers.tabSessions')}</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <AdminUsersListTab />
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <AdminRolesTab />
        </TabsContent>

        <TabsContent value="sessions" className="mt-6">
          <AdminSessionsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
