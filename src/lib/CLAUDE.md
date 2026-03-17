# Lib

Utilitários base. Manter mínimo — sem dependências de features.

## Arquivos

| Arquivo | Responsabilidade |
|---------|-----------------|
| `api-client.ts` | HTTP client com auth, auto case transform, retry 401 |
| `case-transform.ts` | snake_case ↔ camelCase (runtime + compile-time types) |
| `toast.ts` | Wrappers para Sonner toasts |
| `utils.ts` | `cn()` para merge de classes Tailwind |

## `api-client.ts`

Cliente HTTP com conversão automática de case:

```ts
import { apiClient, ApiError } from '@/lib/api-client'

// GET — response auto-convertida para camelCase
const data = await apiClient.get<ApiCostEntry>('/cost-entries')
// data.categoryName (não category_name)

// POST — body auto-convertido para snake_case
await apiClient.post('/cost-entries', {
  categoryId: 'fc-1',     // enviado como category_id
  billingDate: '2026-03-01', // enviado como billing_date
})

// DELETE — 204 retorna undefined
await apiClient.delete('/cost-entries/123')
```

### Regras de Conversão

| Direção | O que converte | Exemplo |
|---------|---------------|---------|
| Response JSON | snake_case → camelCase | `first_name` → `firstName` |
| Request body | camelCase → snake_case | `categoryId` → `category_id` |
| Query params | **NÃO converte** | Sempre usar snake_case: `{ per_page: 100 }` |

### Error Handling

```ts
try {
  await apiClient.post('/foo', data)
} catch (err) {
  if (err instanceof ApiError) {
    err.status       // HTTP status code
    err.errorCode    // Backend error code ('CONFLICT', 'RATE_LIMITED')
    err.errorMessage // Backend error message
    err.body         // Full response body
  }
}
```

### Internals

- Base URL: `VITE_API_URL` (obrigatório — sem fallback)
- Prefixa automaticamente `/api` no path
- `Authorization: Bearer {token}` do auth store
- `credentials: 'include'` para cookies (refresh token)
- 401 → refresh + retry (skip auth endpoints para evitar loops)
- `refreshPromise` singleton previne refresh concorrentes

## `case-transform.ts`

- `CamelizeKeys<T>` / `SnakeizeKeys<T>` — tipos compile-time (transformação de chaves)
- `camelizeKeys()` / `snakeizeKeys()` — conversão runtime recursiva
- Handles nested objects e arrays, pula Date objects
- **NUNCA chamar manualmente** — `api-client.ts` faz automaticamente

## `cn()` (`utils.ts`)

Merge de classes Tailwind com suporte a condicionais. Combina `clsx` + `tailwind-merge`.

```ts
import { cn } from '@/lib/utils'

cn('px-4 py-2', isActive && 'bg-primary', className)
```
