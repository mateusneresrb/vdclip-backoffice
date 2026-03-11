import { useTranslation } from 'react-i18next'
import QRCode from 'react-qr-code'

import { Button } from '@/components/ui/button'
import i18n from '@/i18n'

import { showSuccessToast } from '@/lib/toast'

import { useAuth } from '../hooks/use-auth'
import { useAuthStore } from '../stores/auth-store'

// Mock TOTP data — replace with actual API response (MFA setup endpoint) when integrating
const MOCK_TOTP_SECRET = 'JBSWY3DPEHPK3PXP'

const isDev = import.meta.env.DEV

export function MfaSetupWall() {
  const { t } = useTranslation('common')
  const { admin } = useAuth()
  const completeMfaSetup = useAuthStore((s) => s.completeMfaSetup)

  const label = admin ? `${admin.name} (${admin.email})` : 'admin@vdclip.com'
  const otpauthUri = `otpauth://totp/VDClip:${encodeURIComponent(label)}?secret=${MOCK_TOTP_SECRET}&issuer=VDClip`

  const handleActivate = () => {
    // TODO: call API to finalize MFA setup
    completeMfaSetup()
    showSuccessToast({ title: i18n.t('admin:toast.mfaEnabled') })
  }

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-zinc-950 px-4">
      {/* Background decoration — matches login page */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[300px] -top-[300px] size-[600px] rounded-full bg-orange-500/[0.07] blur-[120px]" />
        <div className="absolute -bottom-[200px] -right-[200px] size-[500px] rounded-full bg-orange-600/[0.05] blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 size-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-800/30 blur-[150px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2">
            <img src="/vdclip-logo.svg" alt="VDClip" className="h-11" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
              BackOffice
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-1.5 text-center">
            <h1 className="text-lg font-semibold tracking-tight text-white">
              {t('profile.mfaRequired')}
            </h1>
            <p className="text-sm text-zinc-400">
              {t('profile.mfaRequiredDescription')}
            </p>
            {admin?.email && (
              <p className="font-mono text-xs text-zinc-500">{admin.email}</p>
            )}
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-xs text-zinc-400">
              {t('profile.setup2faDescription')}
            </p>

            <div className="rounded-xl border border-zinc-800 bg-white p-3">
              <QRCode value={otpauthUri} size={192} level="H" />
            </div>

            <div className="w-full space-y-1.5">
              <p className="text-center text-xs text-zinc-500">{t('profile.setup2faSecretLabel')}</p>
              <code className="block w-full select-all rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-center font-mono text-sm tracking-widest text-white">
                {MOCK_TOTP_SECRET}
              </code>
            </div>
          </div>

          {/* Activate button */}
          <Button
            className="h-10 w-full bg-gradient-to-r from-orange-500 to-orange-600 font-medium text-white shadow-lg shadow-orange-500/20 transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/30"
            onClick={handleActivate}
          >
            {t('profile.enable2fa')}
          </Button>

          {/* Dev bypass */}
          {isDev && (
            <div className="rounded-lg border border-dashed border-amber-400/30 bg-amber-400/5 p-3 text-center">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-amber-500/70">
                Dev Mode
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="w-full border border-amber-400/20 text-amber-600 hover:bg-amber-400/10 hover:text-amber-500 dark:text-amber-400"
                onClick={handleActivate}
              >
                {t('profile.mfaDevBypass')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
