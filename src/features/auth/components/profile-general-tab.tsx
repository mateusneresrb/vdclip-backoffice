import { ShieldCheck, ShieldX, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ROLE_PERMISSIONS } from '@/features/auth/lib/permissions'

import { useAuth } from '../hooks/use-auth'

export function ProfileGeneralTab() {
  const { t } = useTranslation('common')
  const { t: tAdmin } = useTranslation('admin')
  const { admin } = useAuth()

  if (!admin) 
return null

  const initials = admin.name.slice(0, 2).toUpperCase()
  const permissions = ROLE_PERMISSIONS[admin.role] ?? []

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="size-4" />
            {t('profile.personalInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="text-lg font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="truncate text-lg font-semibold">{admin.name}</p>
              <p className="truncate text-sm text-muted-foreground">{admin.email}</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('profile.role')}</span>
              <Badge variant="secondary">
                {tAdmin(`adminUsers.roles.${admin.role}`)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('profile.mfaStatus')}</span>
              <Badge
                variant="outline"
                className={admin.mfaEnabled
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-muted-foreground'
                }
              >
                {admin.mfaEnabled ? (
                  <><ShieldCheck className="mr-1 size-3" />{tAdmin('adminUsers.mfaOn')}</>
                ) : (
                  <><ShieldX className="mr-1 size-3" />{tAdmin('adminUsers.mfaOff')}</>
                )}
              </Badge>
            </div>
            {admin.lastLoginAt && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('profile.lastLogin')}</span>
                <span>{new Date(admin.lastLoginAt).toLocaleString()}</span>
              </div>
            )}
            {admin.createdAt && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('profile.memberSince')}</span>
                <span>{new Date(admin.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t('profile.permissions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {permissions.map((permission) => (
              <Badge key={permission} variant="outline" className="text-xs">
                {permission}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
