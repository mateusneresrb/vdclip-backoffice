# Lib

Utilitários base. Manter mínimo — sem dependências de features.

## `cn()` (`utils.ts`)

Merge de classes Tailwind com suporte a condicionais. Combina `clsx` + `tailwind-merge`.

```ts
import { cn } from '@/lib/utils'

cn('px-4 py-2', isActive && 'bg-primary', className)
cn('text-sm', { 'font-bold': isBold, 'text-muted-foreground': !isBold })
```

Usar sempre que classes Tailwind forem condicionais ou precisarem de override seguro.
