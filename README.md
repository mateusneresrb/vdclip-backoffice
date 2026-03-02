# VDClip Dashboard

Dashboard SPA para a plataforma VDClip de gerenciamento de video clips.

## Requisitos

- [Bun](https://bun.sh/) >= 1.x

## Setup

```bash
# Instalar dependencias
bun install

# Iniciar servidor de desenvolvimento
bun dev
```

O servidor inicia em `http://localhost:5173/`.

## Scripts

| Comando            | Descricao                          |
|--------------------|------------------------------------|
| `bun dev`          | Servidor de desenvolvimento + HMR  |
| `bun run build`    | Type-check + build de producao     |
| `bun run preview`  | Preview do build de producao       |
| `bun run lint`     | Verificar codigo com ESLint        |
| `bun run lint:fix` | Corrigir erros do ESLint           |
| `bun run format`   | Formatar codigo com Prettier       |

## Stack

| Camada         | Tecnologia                                     |
|----------------|-------------------------------------------------|
| Runtime        | Bun                                             |
| Framework      | React 19 + TypeScript (strict)                  |
| Build          | Vite 7                                          |
| Estilo         | Tailwind CSS 4 + shadcn/ui                      |
| Roteamento     | TanStack Router (file-based)                    |
| Server State   | TanStack Query                                  |
| Client State   | Zustand                                         |
| i18n           | react-i18next (EN, PT-BR, ES)                   |
| Formularios    | react-hook-form + Zod                           |
| Icones         | Lucide React                                    |
| Lint/Format    | ESLint (@antfu/eslint-config) + Prettier        |

## Estrutura do Projeto

```
src/
  components/
    layout/             # Sidebar, header, theme, language switcher
    ui/                 # Componentes shadcn/ui (nao editar manualmente)
  features/             # Modulos por feature (componentes, hooks, types)
  hooks/                # Hooks compartilhados
  lib/                  # Utilitarios (cn, etc.)
  providers/            # Context providers (QueryProvider)
  routes/               # Rotas file-based (TanStack Router)
    _authenticated/     # Rotas protegidas (layout com sidebar)
  stores/               # Zustand stores
  types/                # Tipos TypeScript compartilhados
```

## Funcionalidades

- **Tema**: Dark / Light / System com persistencia em localStorage
- **Multi-idioma**: Ingles, Portugues (BR), Espanhol — troca em tempo real
- **Sidebar responsiva**: Collapsa automaticamente em mobile (Sheet)
- **Layout responsivo**: Mobile-first com breakpoints Tailwind

## Rotas

| Rota          | Descricao                  |
|---------------|----------------------------|
| `/`           | Redirect para `/dashboard` |
| `/login`      | Pagina de login            |
| `/dashboard`  | Painel principal           |
| `/projects`   | Projetos                   |
| `/templates`  | Modelos                    |
| `/calendar`   | Calendario                 |
| `/profile`    | Perfil                     |
| `/settings`   | Configuracoes              |
| `/affiliate`  | Afiliado                   |

## Adicionar Componente shadcn/ui

```bash
bunx shadcn@latest add <nome-do-componente>
```

## Adicionar Nova Rota

1. Criar arquivo em `src/routes/_authenticated/{nome}.tsx`
2. Adicionar item no sidebar (`app-sidebar.tsx`)
3. Adicionar label no header (`header.tsx`)
4. Adicionar traducoes nos 3 idiomas (`public/locales/`)
5. Rodar `bun dev` para gerar route tree

## AI (Claude Code)

O projeto inclui configuracao para Claude Code em `.claude/`:

- **`CLAUDE.md`** — Contexto do projeto, regras e gotchas
- **`.claude/rules/`** — Regras por tipo de arquivo (componentes, rotas, traducoes, estilos, stores)
- **`.claude/skills/`** — 9 skills: `ui-component`, `ui-review`, `create-feature`, `create-route`, `i18n-add`, `security-audit`, `create-test`, `accessibility-audit`, `performance-review`
- **`.claude/settings.json`** — Permissoes de projeto
