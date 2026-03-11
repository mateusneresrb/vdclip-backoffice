import { Monitor, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@/components/layout/theme-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

const THEME_OPTIONS = [
  { value: 'light' as const, icon: Sun },
  { value: 'dark' as const, icon: Moon },
  { value: 'system' as const, icon: Monitor },
]

export function ProfilePreferencesTab() {
  const { t } = useTranslation('common')
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-6">
      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t('profile.preferences.theme')}
          </CardTitle>
          <CardDescription>
            {t('profile.preferences.themeDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {THEME_OPTIONS.map(({ value, icon: Icon }) => (
              <Button
                key={value}
                variant={theme === value ? 'default' : 'outline'}
                size="sm"
                className={cn('gap-2', theme === value && 'pointer-events-none')}
                onClick={() => setTheme(value)}
              >
                <Icon className="size-4" />
                {t(`theme.${value}`)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t('profile.preferences.notifications')}
          </CardTitle>
          <CardDescription>
            {t('profile.preferences.notificationsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="cursor-pointer">
              {t('profile.preferences.emailNotifications')}
            </Label>
            <Switch id="email-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="browser-notifications" className="cursor-pointer">
              {t('profile.preferences.browserNotifications')}
            </Label>
            <Switch id="browser-notifications" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
