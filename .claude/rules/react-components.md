---
paths:
  - "src/components/**/*.tsx"
  - "src/features/**/*.tsx"
---

# React Component Rules

## Responsive Design (Mobile-First) — ESSENCIAL

Breakpoints: `sm:` (640), `md:` (768), `lg:` (1024), `xl:` (1280). Sem prefixo = mobile.

### Grids (NUNCA pular breakpoints intermediários)
- 4 colunas: `grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
- 3 colunas: `grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3`
- 5 colunas: `grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5`
- Charts lado a lado: `grid gap-4 md:grid-cols-2`
- **PROIBIDO**: `sm:grid-cols-2 lg:grid-cols-4` (pular `md:` causa salto visual em tablets)

### Texto
- Valores grandes DEVEM escalar: `text-lg sm:text-2xl` (não `text-2xl` fixo)
- Nomes/emails DEVEM ter `truncate` para evitar overflow
- Badges: mínimo `text-[10px]` aceitável, mas preferir `text-xs`

### Layout
- Headers com controles: `flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between`
- TabsList: `<div className="overflow-x-auto"><TabsList className="w-max sm:w-auto">` (scroll horizontal no mobile, NUNCA flex-wrap)
- Spacing principal: `space-y-4 md:space-y-6`
- Full-height: `min-h-svh` NUNCA `min-h-screen`

### Tabelas
- 5+ colunas: usar `hidden md:block` (desktop) + card view `md:hidden` (mobile)
- Colunas secundárias: `hidden sm:table-cell`, `hidden md:table-cell`, `hidden lg:table-cell`
- Mostrar dados ocultos inline no mobile (ex: email abaixo do nome com classe `sm:hidden`)
- Sempre envolver tabela com `overflow-x-auto`

### Inputs & Controles
- Select/Input width: `w-full sm:w-44` (full mobile, fixo desktop)
- Touch targets: mínimo `h-7 w-7` para botões de ação (28px)
- Flex com items que empilham: `flex flex-col gap-2 sm:flex-row sm:items-center`

## Accessibility

- Icon-only buttons: ALWAYS add `<span className="sr-only">` text
- Semantic HTML: `<header>`, `<main>`, `<nav>`, `<section>`, `<aside>`
- One `<h1>` per page, heading hierarchy h1 > h2 > h3
- Form inputs: `<Label htmlFor>` + `autoComplete` attribute
- Use shadcn components for interactive elements (built-in a11y)

## Dark Mode

- ONLY use semantic colors: `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`
- NEVER use: `bg-white`, `text-black`, `bg-gray-*`, `text-gray-*`
- Use `dark:` variant ONLY when semantic tokens are insufficient

## i18n

- ALL user-facing text must use `t('key')` from `useTranslation()`
- NEVER hardcode text (including placeholders, aria-labels, titles)
- ONLY pt-BR: update `public/locales/pt-BR/` — no other languages exist in this project

## Code Style

- Named exports only (no `export default`)
- Static data arrays outside component (`as const`)
- Use `cn()` from `@/lib/utils` for conditional classes
- Import order: external libs → `@/` imports → relative imports
- NEVER place custom code in `src/components/ui/` (shadcn-only)
