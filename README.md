<p align="center">
  <img src="public/vdclip-logo.svg" alt="VDClip" height="48" />
</p>

<p align="center">
  <b>BackOffice</b> — SPA de gestao interna da plataforma VDClip.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Bun-runtime-f9f1e1?logo=bun&logoColor=black" alt="Bun" />
  <img src="https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white" alt="Vite 7" />
</p>

---

## Requisitos

- [Bun](https://bun.sh/) >= 1.x
- [Node.js](https://nodejs.org/) >= 20 (para compatibilidade com ferramentas)

## Setup

```bash
# Instalar dependencias
bun install

# Copiar variaveis de ambiente
cp .env.example .env

# Iniciar servidor de desenvolvimento
bun dev
```

O servidor inicia em `http://localhost:5173/`.

> Em modo de desenvolvimento, o [MSW 2](https://mswjs.io/) intercepta todas as chamadas de API e retorna dados mock realistas — nenhum backend e necessario para rodar localmente.

## Variaveis de Ambiente

| Variavel | Descricao | Default |
|----------|-----------|---------|
| `VITE_API_URL` | URL base da API do backend | `http://localhost:8001` |

## Scripts

| Comando | Descricao |
|---------|-----------|
| `bun dev` | Servidor de desenvolvimento + HMR + gera `routeTree.gen.ts` |
| `bun run build` | Type-check (`tsc`) + build de producao (`vite build`) |
| `bun run preview` | Preview do build de producao |
| `bun run lint` | Verificar codigo com ESLint |
| `bun run lint:fix` | Corrigir erros do ESLint |
| `bun run format` | Formatar codigo com Prettier |
| `bun run test` | Rodar todos os testes (Vitest) |
| `bun run test:watch` | Testes em modo watch |
| `bun run test:coverage` | Testes com relatorio de cobertura (v8) |
| `bun run typecheck` | Verificacao de tipos (tsc) |

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
| Formularios | react-hook-form + Zod 4 |
| Icones | Lucide React |
| Charts | ApexCharts (wrappers proprios) |
| Mock API | MSW 2 (Mock Service Worker) |
| Testes | Vitest 4 + Testing Library + MSW |
| Lint/Format | @antfu/eslint-config + Prettier |

## Estrutura do Projeto

```
src/
  components/
    charts/               # Wrappers ApexCharts (AreaChart, BarChart, DonutChart, etc.)
    layout/               # AdminSidebar, AdminHeader, ThemeProvider
    shared/               # PageHeader, EmptyState, PaginationControls
    ui/                   # Componentes shadcn/ui (nao editar manualmente)
  features/               # Modulos por dominio (componentes, hooks, types)
  hooks/                  # Hooks compartilhados (usePagination, useIsMobile, etc.)
  lib/                    # api-client, case-transform, date-utils, format, toast, utils (cn)
  mocks/                  # MSW handlers e dados mock
  test/                   # Setup Vitest, test-utils (QueryClient wrapper)
  providers/              # QueryProvider (TanStack Query)
  routes/                 # Rotas file-based (TanStack Router)
    _app.tsx              # Layout protegido (auth guard + sidebar)
    _app/                 # Rotas protegidas
    login.tsx             # Rota publica
  stores/                 # Zustand stores (sidebar, product filter)
public/
  locales/
    pt-BR/
      admin.json          # Traducoes do backoffice
      common.json         # Traducoes globais
```

## Rotas

| Rota | Feature | Permissao |
|------|---------|-----------|
| `/` | Redirect para `/dashboard` | — |
| `/login` | Login | Publica |
| `/dashboard` | Dashboard geral (usuarios, projetos, creditos, MRR) | `METRICS_READ` |
| `/revenue` | Metricas SaaS (LTV/CAC, NRR, churn, unit economics) | `SUBSCRIPTIONS_READ` |
| `/finance` | Contabilidade interna (fluxo de caixa, custos, contas) | `FINANCE_READ` |
| `/users` / `/users/:id` | Usuarios VDClip | `USERS_READ` |
| `/teams` / `/teams/:id` | Times e membros | `TEAMS_READ` |
| `/companies` / `/companies/:id` | VDClip Business (B2B) | `USERS_READ` |
| `/admin` | Gestao de admins do backoffice | `ADMIN_READ` |
| `/audit` | Logs de auditoria | `AUDIT_READ` |
| `/providers` | Integracoes externas (AI, pagamento, publicacao) | `PROVIDERS_READ` |
| `/profile` | Perfil do admin logado | Autenticado |

## Features

| Feature | Descricao |
|---------|-----------|
| **Dashboard** | Visao geral operacional: usuarios, projetos, creditos, MRR basico, graficos de tendencia |
| **Revenue** | Metricas SaaS avancadas: LTV, CAC, NRR, churn, unit economics, cohort analysis |
| **Finance** | Contabilidade interna: fluxo de caixa (USD/BRL), custos recorrentes/pontuais, contas a receber, contas bancarias, plano de contas, impostos, centros de custo |
| **Users** | Gestao de usuarios: perfil, assinaturas, creditos, projetos, atividade |
| **Teams** | Times e membros: composicao, metricas de uso, atividade |
| **Business** | VDClip Business (B2B): empresas, usuarios corporativos |
| **Auth** | Login, perfil do admin, RBAC por role (5 roles) |
| **Admin Users** | Admins do backoffice: contas, roles, permissoes, sessoes ativas |
| **Audit** | Logs de auditoria e autenticacao com filtros avancados |
| **Providers** | Integracoes externas: AI providers, gateways de pagamento, redes sociais |

## Autenticacao e Permissoes

O backoffice utiliza RBAC com 5 roles:

| Role | Descricao |
|------|-----------|
| `super_admin` | Acesso total |
| `finance_admin` | Financeiro completo |
| `finance_viewer` | Financeiro somente leitura |
| `support` | Suporte ao usuario |
| `viewer` | Somente leitura |

O `PermissionGuard` esconde UI sem permissao (nao redireciona — apenas oculta elementos).

## Adicionar Componente shadcn/ui

```bash
bunx shadcn@latest add <nome-do-componente>
```

> **Importante**: Nunca editar arquivos em `src/components/ui/` manualmente.

## Adicionar Nova Rota (checklist)

1. Criar `src/routes/_app/{nome}.tsx`
2. Adicionar item em `src/components/layout/admin-sidebar.tsx`
3. Adicionar label em `src/components/layout/admin-header.tsx` (`routeLabels`)
4. Adicionar `nav.{nome}` em `public/locales/pt-BR/admin.json`
5. Rodar `bun dev` para regenerar `routeTree.gen.ts`

## Mock API (MSW)

Em desenvolvimento, o MSW 2 intercepta chamadas HTTP e retorna dados realistas:

- **Handlers**: `src/mocks/handlers/` (um arquivo por dominio)
- **Setup**: `src/mocks/browser.ts` (ativado em `main.tsx` apenas em `import.meta.env.DEV`)
- **Cliente HTTP**: `src/lib/api-client.ts` — `get/post/patch/delete` com `Authorization` header automatico

Em producao, as mesmas chamadas vao para `VITE_API_URL`.

## Testes

O projeto usa **Vitest 4** com **Testing Library** e **MSW** para testes unitarios e de integracao.

```bash
bun run test         # Rodar todos os testes
bun run test:watch   # Modo watch (re-roda ao salvar)
bun run test:coverage # Com relatorio de cobertura
```

### Cobertura atual (130 testes)

| Modulo | Testes | Descricao |
|--------|--------|-----------|
| `lib/` (utilitarios) | 66 | api-client (unit + MSW), case-transform, date-utils, formatCurrency |
| `auth/` (store + permissoes) | 50 | auth-store (state + actions), ROLE_PERMISSIONS por role, integracao |
| `shared/` (componentes) | 13 | ErrorFallback, EmptyState, PageHeader |

### Adicionar novo teste

1. Criar `__tests__/` ao lado do codigo testado
2. Nomear `*.test.ts` (puro) ou `*.test.tsx` (componentes)
3. Vitest globals sao automaticos — nao importar `describe`/`it`/`expect`
4. Para componentes: mockar `react-i18next` e `@tanstack/react-router`
5. Para API: usar MSW `setupServer` de `msw/node`

## Claude Code

O projeto inclui configuracao para Claude Code em `.claude/`:

- **`CLAUDE.md`** + **`src/*/CLAUDE.md`** — contexto detalhado por diretorio
- **`.claude/rules/`** — regras por tipo de arquivo (estilos, rotas, componentes, traducoes, stores)
- **`.claude/skills/`** — skills: `ui-component`, `create-feature`, `create-route`, `i18n-add`, `security-audit`, `create-test`, `accessibility-audit`, `performance-review`
- **`.claude/settings.json`** — permissoes de projeto

> **Estado atual**: hooks financeiros usam `api-client.ts` com MSW em dev. Apenas `useAdminUserAffiliate` ainda retorna mock data direto (sem endpoint no backend).
