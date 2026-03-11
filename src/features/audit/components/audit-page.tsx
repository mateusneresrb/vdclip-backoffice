import { useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/shared/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { AuditLogsTab } from './audit-logs-tab'
import { AuthLogsTab } from './auth-logs-tab'

const VALID_TABS = ['audit', 'auth'] as const
type AuditTab = typeof VALID_TABS[number]

export function AuditPage() {
  const { t } = useTranslation('admin')
  const { tab } = useSearch({ from: '/_app/audit' })
  const navigate = useNavigate()
  const activeTab: AuditTab = VALID_TABS.includes(tab as AuditTab) ? (tab as AuditTab) : 'audit'

  function handleTabChange(value: string) {
    navigate({ to: '/audit', search: { tab: value }, replace: true })
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('nav.auditoria')} description={t('audit.pageDescription')} />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="audit">{t('audit.tabAudit')}</TabsTrigger>
          <TabsTrigger value="auth">{t('audit.tabAuth')}</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="mt-6">
          <AuditLogsTab />
        </TabsContent>

        <TabsContent value="auth" className="mt-6">
          <AuthLogsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
