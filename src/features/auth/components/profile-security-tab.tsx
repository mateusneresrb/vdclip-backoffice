import { Key, MapPin, Monitor, Shield, ShieldCheck, ShieldX } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import QRCode from 'react-qr-code'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import i18n from '@/i18n'
import { showSuccessToast } from '@/lib/toast'

import { useAuth } from '../hooks/use-auth'
import { useProfileSessions } from '../hooks/use-profile-sessions'
import { useAuthStore } from '../stores/auth-store'

// Mock QR code data — replace with actual API response when integrating
const MOCK_TOTP_SECRET = 'JBSWY3DPEHPK3PXP'

interface PasswordFormValues {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function ProfileSecurityTab() {
  const { t } = useTranslation('common')
  const { admin } = useAuth()
  const completeMfaSetup = useAuthStore((s) => s.completeMfaSetup)
  const { data: sessions, isLoading: sessionsLoading } = useProfileSessions()

  const [setupDialogOpen, setSetupDialogOpen] = useState(false)
  const [setupStep, setSetupStep] = useState<'scan' | 'verify'>('scan')
  const [otpValue, setOtpValue] = useState('')
  const [disableDialogOpen, setDisableDialogOpen] = useState(false)
  const [disableOtp, setDisableOtp] = useState('')

  const { register, handleSubmit, reset, watch } = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const currentPassword = watch('currentPassword')
  const newPassword = watch('newPassword')
  const confirmPassword = watch('confirmPassword')

  if (!admin) 
return null

  const onSubmitPassword = (_data: PasswordFormValues) => {
    // TODO: API call
    reset()
    showSuccessToast({ title: i18n.t('admin:toast.passwordChanged') })
  }

  const handleRevokeSession = (_sessionId: string) => {
    // TODO: API call
    showSuccessToast({ title: i18n.t('admin:toast.profileSessionRevoked') })
  }

  const handleOpenSetup = () => {
    setSetupStep('scan')
    setOtpValue('')
    setSetupDialogOpen(true)
  }

  const handleVerifyEnable = () => {
    // TODO: API call to enable MFA with otpValue
    completeMfaSetup()
    showSuccessToast({ title: i18n.t('admin:toast.mfaEnabled') })
    setSetupDialogOpen(false)
  }

  const handleDisable2fa = () => {
    // TODO: API call to disable MFA with disableOtp
    showSuccessToast({ title: i18n.t('admin:toast.mfaDisabled') })
    setDisableDialogOpen(false)
    setDisableOtp('')
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Key className="size-4" />
              {t('profile.changePassword')}
            </CardTitle>
            <CardDescription>
              {t('profile.changePasswordDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
              <div className="space-y-2">
                <Label>{t('profile.currentPassword')}</Label>
                <Input type="password" {...register('currentPassword')} />
              </div>
              <div className="space-y-2">
                <Label>{t('profile.newPassword')}</Label>
                <Input type="password" {...register('newPassword')} />
              </div>
              <div className="space-y-2">
                <Label>{t('profile.confirmPassword')}</Label>
                <Input type="password" {...register('confirmPassword')} />
              </div>
              <Button
                type="submit"
                disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
              >
                {t('profile.updatePassword')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 2FA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="size-4" />
              {t('profile.twoFactor')}
            </CardTitle>
            <CardDescription>
              {t('profile.twoFactorDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {admin.mfaEnabled ? (
                  <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-400">
                    <ShieldCheck className="mr-1 size-3" />
                    {t('profile.twoFactorEnabled')}
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <ShieldX className="mr-1 size-3" />
                    {t('profile.twoFactorDisabled')}
                  </Badge>
                )}
              </div>
              <Button
                variant={admin.mfaEnabled ? 'destructive' : 'default'}
                size="sm"
                onClick={admin.mfaEnabled ? () => setDisableDialogOpen(true) : handleOpenSetup}
              >
                {admin.mfaEnabled ? t('profile.disable2fa') : t('profile.enable2fa')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 2FA Setup Dialog */}
        <Dialog open={setupDialogOpen} onOpenChange={setSetupDialogOpen}>
          <DialogContent className="max-w-sm">
            {setupStep === 'scan' ? (
              <>
                <DialogHeader>
                  <DialogTitle>{t('profile.setup2faTitle')}</DialogTitle>
                  <DialogDescription>{t('profile.setup2faDescription')}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-2">
                  <div className="rounded-lg border bg-white p-3">
                    <QRCode
                      value={`otpauth://totp/VDClip:${encodeURIComponent(`${admin.name} (${admin.email})`)}?secret=${MOCK_TOTP_SECRET}&issuer=VDClip`}
                      size={192}
                      level="H"
                    />
                  </div>
                  <div className="w-full space-y-1.5">
                    <p className="text-xs text-muted-foreground">{t('profile.setup2faSecretLabel')}</p>
                    <code className="block w-full rounded-md bg-muted px-3 py-2 text-center font-mono text-sm tracking-widest">
                      {MOCK_TOTP_SECRET}
                    </code>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSetupDialogOpen(false)}>
                    {t('cancel')}
                  </Button>
                  <Button onClick={() => setSetupStep('verify')}>
                    {t('profile.setup2faVerify')}
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>{t('profile.setup2faVerifyTitle')}</DialogTitle>
                  <DialogDescription>{t('profile.setup2faVerifyDescription')}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-2">
                  <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                    <InputOTPGroup>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSetupStep('scan')}>
                    {t('profile.setup2faBack')}
                  </Button>
                  <Button onClick={handleVerifyEnable} disabled={otpValue.length < 6}>
                    {t('profile.setup2faVerify')}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Disable 2FA Dialog */}
        <Dialog open={disableDialogOpen} onOpenChange={setDisableDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>{t('profile.disable2faTitle')}</DialogTitle>
              <DialogDescription>{t('profile.disable2faDescription')}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-2">
              <InputOTP maxLength={6} value={disableOtp} onChange={setDisableOtp}>
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDisableDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button variant="destructive" onClick={handleDisable2fa} disabled={disableOtp.length < 6}>
                {t('profile.disable2faConfirm')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Monitor className="size-4" />
            {t('profile.sessions.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessionsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          ) : !sessions || sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('profile.sessions.noSessions')}</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session, index) => (
                <div key={session.id}>
                  {index > 0 && <Separator className="mb-3" />}
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {session.device}
                        </span>
                        {session.isCurrent && (
                          <Badge variant="secondary" className="text-xs">
                            {t('profile.sessions.current')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                        <span className="font-mono">{session.ip}</span>
                        {(session.city || session.country) && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="size-3" />
                            {[session.city, session.country].filter(Boolean).join(', ')}
                          </span>
                        )}
                        <span>
                          {t('profile.sessions.lastActive')}: {new Date(session.lastActiveAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 text-destructive hover:text-destructive"
                        onClick={() => handleRevokeSession(session.id)}
                      >
                        {t('profile.sessions.revoke')}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
