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

## `api-client.ts`

Cliente HTTP base para chamadas autenticadas à API do backoffice.

```ts
import { apiClient } from '@/lib/api-client'

apiClient.get<T>(path, params?)   // GET com query params
apiClient.post<T>(path, body)     // POST com JSON body
apiClient.put<T>(path, body)      // PUT com JSON body
apiClient.patch<T>(path, body)    // PATCH com JSON body
apiClient.delete<T>(path)         // DELETE
```

- Base URL: `VITE_API_URL` (default `http://localhost:8001`)
- Prefixa automaticamente `/api` no path
- Inclui `Authorization: Bearer {token}` do auth store
- `credentials: 'include'` para cookies (refresh token)
- Intercepta 401 → tenta refresh → retry (ou logout)
- Não usar para endpoints de auth — usar `authApi` de `features/auth/lib/auth-api.ts`
