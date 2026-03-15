import { zodResolver } from '@hookform/resolvers/zod'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod/v4'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.email('Email invalido'),
  password: z.string().min(1, 'Senha obrigatoria'),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm({ className }: { className?: string }) {
  const { t } = useTranslation('admin')
  const { login, verifyMfa, status } = useAuth()
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials')
  const [mfaCode, setMfaCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const isLoading = status === 'loading'

  const onLoginSubmit = async (data: LoginValues) => {
    setError(null)
    try {
      const result = await login(data.email, data.password)
      if (result.mfaRequired) {
        setStep('mfa')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.loginError'))
    }
  }

  const onMfaSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (mfaCode.length !== 6) 
return
    setError(null)
    try {
      await verifyMfa(mfaCode)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.mfaError'))
      setMfaCode('')
    }
  }

  return (
    <div className={cn('w-full max-w-sm', className)}>
      {step === 'credentials' ? (
        <div className="space-y-8">
          <div className="flex flex-col items-center gap-2">
            <img
              src="/vdclip-logo.svg"
              alt="VDClip"
              className="h-11"
            />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
              BackOffice
            </span>
          </div>

          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-center text-sm text-red-400">
                  {error}
                </div>
              )}
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">{t('auth.email')}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@vdclip.com"
                        autoComplete="email"
                        className="h-10 border-zinc-700/50 bg-zinc-800/50 text-white placeholder:text-zinc-500 focus-visible:border-orange-500/50 focus-visible:ring-orange-500/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">{t('auth.password')}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="h-10 border-zinc-700/50 bg-zinc-800/50 text-white placeholder:text-zinc-500 focus-visible:border-orange-500/50 focus-visible:ring-orange-500/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="h-10 w-full bg-gradient-to-r from-orange-500 to-orange-600 font-medium text-white shadow-lg shadow-orange-500/20 transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/30"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('auth.login')}
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-5">
            <div className="flex flex-col items-center gap-2">
              <img src="/vdclip-logo.svg" alt="VDClip" className="h-9" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                BackOffice
              </span>
            </div>

            <div className="flex w-full items-center gap-3">
              <div className="h-px flex-1 bg-zinc-800" />
              <div className="flex size-8 items-center justify-center rounded-full bg-zinc-800/80 ring-1 ring-zinc-700/50">
                <ShieldCheck className="size-4 text-orange-500" />
              </div>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>

            <div className="flex flex-col items-center gap-1">
              <h1 className="text-lg font-semibold tracking-tight text-white">
                {t('auth.mfaTitle')}
              </h1>
              <p className="text-center text-sm text-zinc-400">
                {t('auth.mfaDescription')}
              </p>
            </div>
          </div>

          <form onSubmit={onMfaSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-center text-sm text-red-400">
                {error}
              </div>
            )}
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={mfaCode}
                onChange={setMfaCode}
                autoFocus
              >
                <InputOTPGroup className="gap-2">
                  {Array.from({ length: 6 }, (_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="size-11 rounded-lg border border-zinc-700/50 bg-zinc-800/50 text-base text-white first:border-l"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                className="h-10 w-full bg-gradient-to-r from-orange-500 to-orange-600 font-medium text-white shadow-lg shadow-orange-500/20 transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/30"
                disabled={isLoading || mfaCode.length !== 6}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('auth.verify')}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300"
                onClick={() => {
                  setStep('credentials')
                  setMfaCode('')
                  setError(null)
                }}
                disabled={isLoading}
              >
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                {t('auth.back')}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
