# VDClip BackOffice

SPA backoffice para gestão interna do VDClip.

## Requisitos

- [Bun](https://bun.sh/) >= 1.x

## Setup

```bash
bun install
bun dev       # http://localhost:5173/
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `bun dev` | Dev server + gera `routeTree.gen.ts` |
| `bun run build` | Type-check + build de produção |
| `bun run lint` | ESLint |
| `bun run lint:fix` | ESLint --fix |
| `bun run format` | Prettier |

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Runtime | Bun |
| Framework | React 19 + TypeScript (strict) |
| Build | Vite 7 |
| Estilo | Tailwind CSS 4 + shadcn/ui (New York) |
| Roteamento | TanStack Router (file-based) |
| Server State | TanStack Query |
| Client State | Zustand (persist) |
| i18n | react-i18next — apenas PT-BR |
| Formulários | react-hook-form + Zod |
| Ícones | Lucide React |
| Charts | ApexCharts (wrappers próprios) |
| Lint/Format | @antfu/eslint-config + Prettier |

## Estrutura

```
src/
  components/
    charts/     → wrappers ApexCharts (AreaChart, BarChart, etc.)
    layout/     → AdminSidebar, AdminHeader, ThemeProvider
    shared/     → PageHeader, EmptyState, PaginationControls
    ui/         → shadcn/ui — NUNCA editar manualmente
  features/     → módulos por domínio (componentes, hooks, types)
  hooks/        → hooks compartilhados (usePagination, useIsMobile, etc.)
  lib/          → utils.ts (cn)
  providers/    → QueryProvider
  routes/       → TanStack Router file-based
    _app.tsx    → layout protegido (auth guard + sidebar)
    _app/       → rotas protegidas
    login.tsx   → rota pública
  stores/       → Zustand stores (sidebar, product filter)
public/
  locales/
    pt-BR/
      admin.json    → traduções do backoffice
      common.json   → traduções globais
```

## Rotas

| Rota | Feature |
|------|---------|
| `/` | Redirect para `/dashboard` |
| `/login` | Login |
| `/dashboard` | Dashboard geral |
| `/revenue` | Métricas SaaS |
| `/finance` | Contabilidade interna |
| `/users` / `/users/:id` | Usuários VDClip |
| `/teams` / `/teams/:id` | Times |
| `/business/companies` / `/business/users` | VDClip Business (B2B) |
| `/admin` | Gestão de admins do backoffice |
| `/audit` | Logs de auditoria |
| `/providers` | Integrações externas |
| `/profile` | Perfil do admin logado |

## Features Principais

| Feature | Descrição |
|---------|-----------|
| `dashboard` | Visão geral: usuários, projetos, créditos, MRR básico |
| `revenue` | Métricas SaaS: LTV/CAC, NRR, churn, unit economics |
| `finance` | Contabilidade interna: fluxo de caixa, custos, contas |
| `users` | Gestão de usuários do VDClip |
| `teams` | Times e membros |
| `auth` | Login, perfil, RBAC por role |
| `admin-users` | Admins do backoffice: contas, roles, sessões |
| `audit` | Logs de auditoria e autenticação |
| `business` | VDClip Business (B2B) |
| `providers` | Integrações: AI, pagamento, publicação |

## Adicionar Componente shadcn/ui

```bash
bunx shadcn@latest add <nome>
```

## Adicionar Nova Rota (checklist)

1. Criar `src/routes/_app/{nome}.tsx`
2. Adicionar item em `src/components/layout/admin-sidebar.tsx`
3. Adicionar label em `src/components/layout/admin-header.tsx` (`routeLabels`)
4. Adicionar `nav.{nome}` em `public/locales/pt-BR/admin.json`
5. Rodar `bun dev` para regenerar `routeTree.gen.ts`

## Claude Code

Configuração em `.claude/`:

- **`CLAUDE.md`** + **`src/*/CLAUDE.md`** — contexto detalhado por diretório
- **`.claude/rules/`** — regras por tipo de arquivo (estilos, rotas, componentes, traduções, stores)
- **`.claude/skills/`** — skills: `ui-component`, `create-feature`, `create-route`, `i18n-add`, etc.
- **`.claude/settings.json`** — permissões de projeto

> Estado atual: todos os hooks retornam mock data — sem integração de API real.
