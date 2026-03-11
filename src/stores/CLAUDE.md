# Stores (Zustand)

Stores globais de estado da UI. Todos usam `zustand` com `persist` middleware (exceto `useAuthStore`).

## Inventário

### `useSidebarStore` (`sidebar-store.ts`)
Estado de abertura/fechamento da sidebar desktop.

```ts
interface SidebarState {
  isOpen: boolean
  toggle: () => void
  setOpen: (open: boolean) => void
}
```

- Persistido: `localStorage['sidebar-store']`
- **Não confundir com `useSidebar()`** do shadcn — o shadcn controla mobile/desktop internamente via `SidebarProvider`

### `useProductFilterStore` / `useProductFilter` (`src/hooks/use-product-filter.ts`)
Filtro de produto global (VDClip vs Business).

```ts
type ProductFilter = 'all' | 'vdclip' | 'business'

// Usar wrapper:
const { currentProduct, setCurrentProduct } = useProductFilter()
```

- Persistido: `localStorage['product-filter']`
- Padrão: `'all'`

### `useAuthStore` (`src/features/auth/stores/auth-store.ts`)
Estado de autenticação. **NÃO persistido** (segurança).

```ts
interface AuthState {
  admin: AdminAccount | null
  permissions: Set<string>
  status: AuthStatus
  setAdmin(admin): void
  clearAuth(): void
  setStatus(status): void
}
```

- `status`: `'idle' | 'loading' | 'authenticated' | 'unauthenticated'`
- `permissions` é derivado de `ROLE_PERMISSIONS[admin.role]` no `setAdmin()`
- Usado em `routes/_app.tsx` via `.getState()` (não hook) no `beforeLoad`

## Regras

- Seletores granulares: `useStore(s => s.value)` — nunca `useStore()` completo
- Actions (funções) também via seletor individual para evitar re-renders
- Não duplicar estado que já existe em TanStack Query (server state vai nos hooks)
- Zustand = estado de UI/client; TanStack Query = estado de servidor
