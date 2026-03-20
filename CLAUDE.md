# VDClip BackOffice

SPA backoffice para gestão interna do VDClip.

## Tech Stack

- **Runtime**: Bun | **Build**: Vite 7 + SWC | **Framework**: React 19 + TypeScript (strict)
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York) | **Icons**: lucide-react
- **Routing**: TanStack Router (file-based, autoCodeSplitting) | **Data**: TanStack Query | **State**: Zustand (persist)
- **i18n**: react-i18next — **apenas PT-BR** | **Forms**: react-hook-form + zod
- **Lint**: @antfu/eslint-config + Prettier (no semicolons, single quotes, trailing commas)
- **Testing**: Vitest 4 + @testing-library/react + @testing-library/jest-dom + MSW

## Commands

```bash
bun dev            # Dev server + gera routeTree.gen.ts
bun run build      # tsc + vite build
bun run lint       # ESLint
bun run lint:fix   # ESLint --fix
bun run format     # Prettier write
bun run format:check  # Prettier check (CI)
bun run typecheck  # tsc -b (type check only)
bun run test       # Vitest single run
bun run test:watch # Vitest watch mode
```

## Architecture

```
src/
  components/layout/  → sidebar, header, tema (ver layout/CLAUDE.md)
  components/charts/  → wrappers ApexCharts (ver charts/CLAUDE.md)
  components/ui/      → shadcn — NUNCA editar manualmente (ver ui/CLAUDE.md)
  components/shared/  → empty-state, page-header, error-fallback (ver shared/CLAUDE.md)
  features/{name}/    → módulos auto-contidos (ver features/CLAUDE.md)
  routes/             → TanStack Router file-based (ver routes/CLAUDE.md)
  stores/             → Zustand stores (ver stores/CLAUDE.md)
  hooks/              → hooks compartilhados (ver hooks/CLAUDE.md)
  lib/                → api-client, case-transform, date-utils, format, toast, utils (ver lib/CLAUDE.md)
  test/               → setup.ts, test-utils.tsx, vitest.d.ts
  providers/          → QueryProvider (ver providers/CLAUDE.md)
  i18n.ts             → config react-i18next (pt-BR)
  router.tsx          → instância do router
  index.css           → Tailwind 4 + CSS variables (--chart-1..5, tokens)
```

## Code Style

- Named exports only — sem `export default`
- Import order: libs externas → `@/` aliases → imports relativos
- Path alias: `@/` → `src/`
- Dados estáticos fora do componente com `as const`
- Use `cn()` de `@/lib/utils` para classes condicionais
- Prefira composição (children/slots) em vez de configuração (muitos props)
- API types usam prefixo `Api*` com campos snake_case. Tipos runtime são `CamelizeKeys<Api*>`. Conversão é automática pelo `api-client`.
- Query params sempre em snake_case (`{ per_page: 100 }`). Request body em camelCase (auto-convertido).

## Critical Rules (DON'T)

- **DON'T** editar `src/components/ui/` — use `bunx shadcn@latest add <name>`
- **DON'T** editar `src/routeTree.gen.ts` — auto-gerado pelo TanStack Router plugin
- **DON'T** hardcode strings de texto — sempre `t('key')` com react-i18next
- **DON'T** criar traduções em outros idiomas — apenas PT-BR em `public/locales/pt-BR/`
- **DON'T** usar `bg-white`, `text-black`, `bg-gray-*` — usar tokens semânticos (`bg-background`, `text-foreground`)
- **DON'T** usar `min-h-screen` — usar `min-h-svh`
- **DON'T** usar `export default` — named exports only
- **DON'T** usar `<a>` para navegação interna — usar `<Link>` do `@tanstack/react-router`
- **DON'T** armazenar tokens de auth em localStorage — auth-store não é persistido

## Responsive Design (OBRIGATÓRIO)

**Todo componente DEVE ser responsivo.** Mobile-first é o padrão — Tailwind sem prefixo = mobile.

### Regras de Grid
- **NUNCA** pular de `sm:` direto para `lg:` em grids com 4+ colunas — sempre incluir `md:` intermediário
- Padrão para 4 colunas: `grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
- Padrão para 3 colunas: `grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3`
- Padrão para 5 colunas: `grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5`
- Charts lado a lado: `grid gap-4 md:grid-cols-2`

### Regras de Texto
- Valores grandes (`text-2xl`, `text-xl`) DEVEM ter variante mobile: `text-lg sm:text-2xl`
- Nomes de usuário/time DEVEM ter `truncate` para prevenir overflow
- Emails DEVEM ter `truncate`

### Regras de Layout
- Flex row com conteúdo que pode empilhar: `flex flex-col gap-2 sm:flex-row sm:items-center`
- TabsList: `<div className="-mb-px overflow-x-auto overflow-y-hidden"><TabsList className="w-max sm:w-auto">` (scroll horizontal fino no mobile, sem vertical)
- Headers com controles: `flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between`
- Spacing responsivo: `space-y-4 md:space-y-6` para containers principais

### Regras de Tabela
- Tabelas com 5+ colunas DEVEM ter mobile card view: `hidden md:block` (tabela) + `md:hidden` (cards)
- Colunas menos importantes: `hidden sm:table-cell`, `hidden md:table-cell`, `hidden lg:table-cell`
- Mostrar dado ocultado inline no mobile (ex: email abaixo do nome com `sm:hidden`)
- Wrapping sempre: `overflow-x-auto` no container da tabela

### Regras de Componentes
- Botões de ação (copy, edit): mínimo `h-7 w-7` (touch target)
- Select widths: `w-full sm:w-44` (full no mobile, fixo no desktop)
- Input widths: `w-full sm:w-64` (idem)
- Dialogs: shadcn já é responsivo — confiar no default
- Valores monetários: `whitespace-nowrap` para evitar quebra de linha em valores formatados
- Ícones em tabs com 5+ itens: `hidden sm:block` para reduzir largura do scroll no mobile

## Gotchas

- `routeTree.gen.ts` só existe após `bun dev` — rodar uma vez ao criar novas rotas
- shadcn Sidebar tem seu próprio `SidebarProvider` — não confundir com `useSidebarStore` (Zustand)
- i18n carrega traduções de `public/locales/pt-BR/` em runtime — NÃO é bundled
- Tailwind CSS 4 usa `@import "tailwindcss"` — NÃO as diretivas `@tailwind`
- Tema usa estratégia de classe CSS (`.dark` no `<html>`) — NÃO `prefers-color-scheme`
- **MSW 2 implementado** — hooks financeiros usam `api-client.ts`; MSW intercepta em dev, API real em prod
- `src/lib/api-client.ts` — cliente HTTP base (`get/post/patch/delete`) com `Authorization` header do auth-store
- `src/mocks/handlers/finance.ts` — handlers MSW para todos os endpoints financeiros
- `src/mocks/browser.ts` — setup do service worker (ativado em `main.tsx` apenas em `import.meta.env.DEV`)
- Hooks **ainda mock**: `useAdminUserAffiliate` (no backend endpoint)

## Path-Specific Rules

Regras detalhadas em `.claude/rules/` (carregam automaticamente por path):
- `react-components.md` — componentes React, responsividade, a11y, dark mode
- `routes.md` — criação de rotas, templates
- `stores-and-hooks.md` — Zustand, TanStack Query
- `styles.md` — Tailwind CSS 4, tokens CSS
- `translations.md` — i18n, pt-BR only

## Documentation Maintenance (OBRIGATÓRIO)

Sempre que uma mudança for feita no código, atualizar os CLAUDE.md relevantes **na mesma sessão**:

| Tipo de mudança | CLAUDE.md a atualizar |
|----------------|----------------------|
| Nova feature ou componente | `src/features/CLAUDE.md` + `src/features/{name}/CLAUDE.md` |
| Nova rota | `src/routes/CLAUDE.md` + sidebar checklist |
| Novo hook compartilhado | `src/hooks/CLAUDE.md` |
| Novo store | `src/stores/CLAUDE.md` |
| Novo token CSS / cor | `.claude/rules/styles.md` tabela de tokens |
| Novo componente shadcn | `src/components/ui/CLAUDE.md` tabela de componentes |
| Nova chave de tradução (seção nova) | `public/locales/CLAUDE.md` |
| Mudança em tipo central (admin/types) | `src/features/admin/CLAUDE.md` |
| Mudança em permissão/role | `src/features/auth/CLAUDE.md` |
| Novo componente shared | `src/components/shared/CLAUDE.md` |
| Novo teste ou mudança em padrão de teste | Seção `Testing` neste arquivo + tabela de testes |
| Mudança em lib/ (novo util) | `src/lib/CLAUDE.md` tabela de arquivos |

**Regra geral**: se você leu um CLAUDE.md para fazer a tarefa e a tarefa mudou o que ele documenta, atualize-o antes de encerrar.

## Testing

```bash
bun run test           # Vitest single run
bun run test:watch     # Vitest watch mode
bun run test:coverage  # Vitest + coverage (v8)
```

- **Framework**: Vitest 4 + @testing-library/react + @testing-library/jest-dom + MSW 2
- **Environment**: jsdom (configurado em `vite.config.ts` → `test`)
- **Setup**: `src/test/setup.ts` (importa jest-dom matchers)
- **Test utils**: `src/test/test-utils.tsx` (`createQueryWrapper()` para hooks com QueryClient)
- **Globals**: `describe`, `it`, `expect`, `vi`, `beforeEach`, `afterEach` globais — **NÃO importar de vitest**
- **Convenção de arquivos**: `src/**/__tests__/*.test.{ts,tsx}` — pasta `__tests__/` ao lado do código testado
- **MSW node**: `msw/node` (`setupServer`) para testes de integração com API

### Testes existentes (130 tests, 11 arquivos)

| Arquivo | Tests | O que testa |
|---------|-------|------------|
| `lib/__tests__/case-transform.test.ts` | 13 | `camelizeKeys`, `snakeizeKeys`: flat, nested, arrays, Date passthrough, primitivos |
| `lib/__tests__/date-utils.test.ts` | 10 | `getDateParams` todos os períodos (1d..all), formato YYYY-MM-DD, fallback |
| `lib/__tests__/format.test.ts` | 5 | `formatCurrency` USD/BRL, options, zero, negativo |
| `lib/__tests__/api-client.test.ts` | 30 | GET/POST/PATCH/PUT/DELETE, auth headers, case-transform, ApiError, 204, 401 refresh+retry |
| `lib/__tests__/api-client-integration.test.ts` | 8 | MSW integration: HTTP real, camelização, query params, 404, auth header |
| `auth/stores/__tests__/auth-store.test.ts` | 19 | setAdmin, setToken, clearAuth, completeMfaSetup, role→permissions |
| `auth/stores/__tests__/auth-store-integration.test.ts` | 13 | Login flows completos, transições de role, permission checks por role |
| `auth/lib/__tests__/permissions.test.ts` | 18 | PERMISSIONS (17 keys), ROLE_PERMISSIONS por role, no extras, no duplicates |
| `shared/__tests__/error-fallback.test.tsx` | 5 | Render, reset button, Link to /dashboard, i18n keys |
| `shared/__tests__/empty-state.test.tsx` | 4 | Title, description, action button, icon |
| `shared/__tests__/page-header.test.tsx` | 4 | Title, description, children slot |

### O que testar (guia por camada)

| Camada | Ferramenta | Padrão |
|--------|-----------|--------|
| Utilitários (`lib/`) | Vitest puro | Input/output direto, edge cases |
| Stores (Zustand) | Vitest puro | Chamar actions via `getState()`, verificar estado |
| Permissões | Vitest puro | Verificar ROLE_PERMISSIONS mapping por role |
| API client (unit) | Vitest + `vi.fn()` no `globalThis.fetch` | Mock fetch, verificar URL/headers/body |
| API client (integration) | Vitest + MSW `setupServer` | HTTP real interceptado, case-transform end-to-end |
| Componentes | Testing Library `render` + `screen` | Render → query DOM → assert texto/interações |

### Padrão de Mock

```ts
// Mock de módulos (ANTES dos imports)
vi.mock('@/features/auth/stores/auth-store', () => ({
  useAuthStore: { getState: vi.fn(() => ({ _token: 'test-token' })) },
}))

// Mock de i18n (para componentes)
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

// Mock de TanStack Router (para componentes com <Link>)
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
}))
```

### Regras de Teste

- **NÃO** importar `describe`/`it`/`expect`/`vi` de vitest — são globais
- **NÃO** usar `vi.stubEnv()` para `VITE_API_URL` — o módulo captura no load time. Usar `import.meta.env.VITE_API_URL`
- **SEMPRE** usar `vi.useFakeTimers()` + `vi.setSystemTime(new Date('...Z'))` para testes com datas (sufixo `Z` para UTC)
- **SEMPRE** resetar stores no `beforeEach` (ex: `useAuthStore.getState().clearAuth()`)
- **SEMPRE** usar `onUnhandledRequest: 'warn'` no MSW setupServer (evita falsos positivos)
- Testes de componente: mockar `react-i18next` e `@tanstack/react-router`
- Testes de store: chamar actions direto via `getState()`, não renderizar componentes

## DX Configuration

- `.editorconfig` — 2-space indent, LF line endings, UTF-8, 100-char max (alinhado com Prettier)
- `.prettierrc` — no semicolons, single quotes, trailing commas, 100 char width
- `eslint.config.mjs` — @antfu/eslint-config + prettier (ignora `src/components/ui/`, `routeTree.gen.ts`)
- `tsconfig.app.json` — strict mode, noUnusedLocals, noUnusedParameters, verbatimModuleSyntax
- `vite.config.ts` — autoCodeSplitting, optimizeDeps, manualChunks (charts, day-picker), test config, WSL polling

## Future Enhancements (NOT implemented)

openapi-fetch, Playwright, Storybook 8, Motion, Husky + lint-staged
