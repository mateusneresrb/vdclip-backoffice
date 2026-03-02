---
paths:
  - "src/components/**/*.tsx"
  - "src/features/**/*.tsx"
---

# React Component Rules

## Responsive Design (Mobile-First)

- Start with mobile, add breakpoints: `sm:` (640), `md:` (768), `lg:` (1024), `xl:` (1280)
- Grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Spacing: responsive (`gap-3 sm:gap-4`, `p-4 md:p-6`)
- Typography: scale (`text-sm sm:text-base`, `text-xl sm:text-2xl`)
- Full-height: `min-h-svh` NOT `min-h-screen`
- Use `flex-wrap` when items could overflow

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
- Update ALL 3 locale files: `en`, `pt-BR`, `es`

## Code Style

- Named exports only (no `export default`)
- Static data arrays outside component (`as const`)
- Use `cn()` from `@/lib/utils` for conditional classes
- Import order: external libs → `@/` imports → relative imports
- NEVER place custom code in `src/components/ui/` (shadcn-only)
