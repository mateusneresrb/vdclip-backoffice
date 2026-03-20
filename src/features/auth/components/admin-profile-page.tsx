import { Activity, Settings, Shield, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PageHeader } from '@/components/shared/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useAuth } from '../hooks/use-auth'

import { ProfileActivityTab } from './profile-activity-tab'
import { ProfileGeneralTab } from './profile-general-tab'
import { ProfilePreferencesTab } from './profile-preferences-tab'
import { ProfileSecurityTab } from './profile-security-tab'

export function AdminProfilePage() {
  const { t } = useTranslation('common')
  const { admin } = useAuth()

  if (!admin) 
return null

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader title={t('profile.title')} description={t('profile.description')} />

      <Tabs defaultValue="general">
        <div className="-mb-px overflow-x-auto overflow-y-hidden">
        <TabsList className="w-max sm:w-auto">
          <TabsTrigger value="general" className="gap-1.5">
            <User className="hidden size-3.5 sm:block" />
            {t('profile.tabs.general')}
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5">
            <Shield className="hidden size-3.5 sm:block" />
            {t('profile.tabs.security')}
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-1.5">
            <Activity className="hidden size-3.5 sm:block" />
            {t('profile.tabs.activity')}
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-1.5">
            <Settings className="hidden size-3.5 sm:block" />
            {t('profile.tabs.preferences')}
          </TabsTrigger>
        </TabsList>
        </div>

        <TabsContent value="general" className="mt-6">
          <ProfileGeneralTab />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <ProfileSecurityTab />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ProfileActivityTab />
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <ProfilePreferencesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
