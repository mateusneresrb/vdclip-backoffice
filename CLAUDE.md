# VDClip BackOffice

SPA backoffice para gestão interna do VDClip.

## Tech Stack

- **Runtime**: Bun | **Build**: Vite 7 + SWC | **Framework**: React 19 + TypeScript (strict)
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York) | **Icons**: lucide-react
- **Routing**: TanStack Router (file-based, autoCodeSplitting) | **Data**: TanStack Query | **State**: Zustand (persist)
- **i18n**: react-i18next — **apenas PT-BR** | **Forms**: react-hook-form + zod
- **Lint**: @antfu/eslint-config + Prettier (no semicolons, single quotes, trailing commas)

## Commands

```bash
bun dev            # Dev server + gera routeTree.gen.ts
bun run build      # tsc + vite build
bun run lint       # ESLint
bun run lint:fix   # ESLint --fix
bun run format     # Prettier write
bun run format:check  # Prettier check (CI)
bun run typecheck  # tsc -b (type check only)
```

## Architecture

```
src/
  components/layout/  → sidebar, header, tema (ver layout/CLAUDE.md)
  components/charts/  → wrappers ApexCharts (ver charts/CLAUDE.md)
  components/ui/      → shadcn — NUNCA editar manualmente (ver ui/CLAUDE.md)
  components/shared/  → empty-state, page-header (ver shared/CLAUDE.md)
  features/{name}/    → módulos auto-contidos (ver features/CLAUDE.md)
  routes/             → TanStack Router file-based (ver routes/CLAUDE.md)
  stores/             → Zustand stores (ver stores/CLAUDE.md)
  hooks/              → hooks compartilhados (ver hooks/CLAUDE.md)
  lib/                → api-client, case-transform, utils (ver lib/CLAUDE.md)
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

**Regra geral**: se você leu um CLAUDE.md para fazer a tarefa e a tarefa mudou o que ele documenta, atualize-o antes de encerrar.

## DX Configuration

- `.editorconfig` — 2-space indent, LF line endings, UTF-8, 100-char max (alinhado com Prettier)
- `.prettierrc` — no semicolons, single quotes, trailing commas, 100 char width
- `eslint.config.mjs` — @antfu/eslint-config + prettier (ignora `src/components/ui/`, `routeTree.gen.ts`)
- `tsconfig.app.json` — strict mode, noUnusedLocals, noUnusedParameters, verbatimModuleSyntax
- `vite.config.ts` — autoCodeSplitting, optimizeDeps, manualChunks (charts, day-picker), WSL polling

## Future Enhancements (NOT implemented)

openapi-fetch, Vitest + Testing Library, Playwright, Storybook 8, Motion, Husky + lint-staged
