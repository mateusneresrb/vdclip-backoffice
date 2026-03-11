import { createFileRoute } from '@tanstack/react-router'

import { LoginForm } from '@/features/auth'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-zinc-950 px-4">
      {/* Background decoration */}
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

      {/* Centered form */}
      <div className="relative z-10 flex flex-1 items-center justify-center">
        <LoginForm />
      </div>
    </div>
  )
}
