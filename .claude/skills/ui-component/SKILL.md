---
name: ui-component
description: Create a new UI component following VDClip Dashboard conventions. Use when asked to build a new component, page section, or reusable UI element. Ensures responsive design, accessibility, i18n, dark mode support, and proper shadcn/ui integration.
argument-hint: "[component-name] [description]"
---

# Create UI Component

You are creating a UI component for the VDClip Dashboard project. Follow every rule below strictly.

## Context

- This is a React 19 + TypeScript project using Tailwind CSS 4 and shadcn/ui (New York style)
- Path alias: `@/` maps to `src/`
- Icons: `lucide-react` only
- i18n: `react-i18next` with `useTranslation()` — namespaces: `common`, `dashboard`
- Routing: TanStack Router — use `<Link>` from `@tanstack/react-router`, never `<a>` for internal links
- State: Zustand stores in `src/stores/` — TanStack Query for server state

## Arguments

Component: $ARGUMENTS

## Step-by-step

1. **Determine placement**: Decide where the component belongs:
   - `src/components/layout/` — layout-level (sidebar, header, footers)
   - `src/features/{feature}/components/` — feature-specific
   - `src/components/` — shared across features
   - NEVER place custom components inside `src/components/ui/` (reserved for shadcn)

2. **Research existing patterns**: Read similar components in the codebase to match style, imports, and structure.

3. **Create the component** following these rules:

### Responsive Design (Mobile-First) — MANDATORY

- Start with mobile layout, then add breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- Use `min-h-svh` instead of `min-h-screen` for full-height layouts
- Grids: Always start with `grid-cols-1` then scale up (`sm:grid-cols-2 lg:grid-cols-4`)
- Spacing: Use responsive spacing (`gap-3 sm:gap-4 lg:gap-6`, `p-4 md:p-6`)
- Typography: Scale text responsively (`text-sm sm:text-base`, `text-xl sm:text-2xl`)
- Hide/show elements per breakpoint: `hidden sm:block`, `sm:hidden`
- Flex wrapping: Use `flex-wrap` when items could overflow on mobile
- Max widths: Apply `max-w-*` on content containers to prevent overly wide content on large screens
- Images/media: Always use `max-w-full` and `h-auto`, or aspect-ratio utilities

### Accessibility — MANDATORY

- All icon-only buttons MUST have `<span className="sr-only">` with descriptive text
- Use semantic HTML: `<section>`, `<article>`, `<nav>`, `<aside>`, `<header>`, `<footer>`
- Every page/section should have exactly one `<h1>`, with proper heading hierarchy (h1 > h2 > h3)
- All form inputs MUST have `<Label htmlFor="...">` and matching `id`
- Add `autoComplete` attributes on inputs (email, password, name, etc.)
- Interactive elements must be focusable and keyboard-navigable
- Use `aria-label` or `aria-describedby` when visual label is insufficient
- Color must not be the only way to convey information (add icons or text)
- Prefer shadcn components for interactive elements (Button, DropdownMenu, Dialog, etc.) — they include built-in a11y

### Internationalization — MANDATORY

- ALL user-facing strings must use `t('key')` from `useTranslation()`
- Use the `common` namespace for shared UI text, feature namespace for feature-specific text
- Add the translation keys to pt-BR locale
- Never hardcode text strings (including aria-labels and placeholders)

### Dark Mode — MANDATORY

- Use Tailwind semantic colors: `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, etc.
- Use `dark:` variant ONLY when semantic colors are insufficient
- Never use hardcoded colors like `bg-white`, `text-black`, `bg-gray-100`
- Test that the component looks correct in both light and dark themes

### Code Quality

- Named exports only (no default exports)
- Extract data arrays/configs as `const` outside the component (avoid re-creation on render)
- Use `as const` for static arrays to get narrow types
- Props interface at the top of the file if the component accepts props
- Keep components focused — one responsibility per component
- Use `cn()` from `@/lib/utils` for conditional class merging
- Prefer composition over configuration (slots/children over many props)

4. **Add translations**: Create or update translation files in `public/locales/pt-BR/`

5. **Verify**: Mentally walk through the component at 3 viewport sizes:
   - Mobile (320px) — everything stacks, readable, tappable
   - Tablet (768px) — 2-column grids, more horizontal space
   - Desktop (1280px) — full layout, sidebars visible

## Output

- The component file(s)
- Updated translation files (all 3 languages)
- Brief explanation of responsive breakpoints used and accessibility features included
