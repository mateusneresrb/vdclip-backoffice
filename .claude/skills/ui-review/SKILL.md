---
name: ui-review
description: Review a UI component or page for responsiveness, accessibility, dark mode, i18n compliance, and best practices. Use when you want a quality audit of existing UI code.
argument-hint: "[file-path or component-name]"
allowed-tools: Read, Grep, Glob
---

# UI Review

Perform a thorough UI quality review of the specified component or file.

## Target

$ARGUMENTS

## Review Checklist

Read the target file(s) and evaluate each category below. For each issue found, provide the exact file path, line number, the problem, and a concrete fix.

### 1. Responsive Design (Weight: Critical)

- [ ] Uses mobile-first breakpoints (`sm:`, `md:`, `lg:`, `xl:`) — NOT desktop-first
- [ ] Grids start with `grid-cols-1` and scale up
- [ ] Spacing is responsive (`p-4 md:p-6`, `gap-3 sm:gap-4`)
- [ ] Typography scales (`text-sm sm:text-base`, `text-xl sm:text-2xl`)
- [ ] No fixed widths that break on small screens (no `w-[500px]` without `max-w-full`)
- [ ] Uses `min-h-svh` instead of `min-h-screen` for full-height layouts
- [ ] Flex containers use `flex-wrap` when items could overflow
- [ ] Images/media have `max-w-full h-auto` or use aspect-ratio
- [ ] Content containers have `max-w-*` to prevent ultra-wide text
- [ ] No horizontal overflow at 320px viewport

### 2. Accessibility (Weight: Critical)

- [ ] Icon-only buttons have `<span className="sr-only">` text
- [ ] Semantic HTML used (`<header>`, `<main>`, `<nav>`, `<section>`, `<article>`)
- [ ] Proper heading hierarchy (one `h1` per page, then h2, h3...)
- [ ] Form inputs have `<Label htmlFor>` associations
- [ ] Form inputs have `autoComplete` attributes
- [ ] Interactive elements are keyboard-navigable
- [ ] Color is not the only indicator of state (icons/text supplement)
- [ ] `aria-label` or `aria-describedby` used where visual label is absent
- [ ] Focus indicators are visible (not removed with `outline-none` without replacement)
- [ ] No `div` or `span` used as buttons — use `<Button>` or `<button>`

### 3. Dark Mode (Weight: High)

- [ ] Uses semantic Tailwind colors (`bg-background`, `text-foreground`, `border-border`, etc.)
- [ ] No hardcoded colors (`bg-white`, `text-black`, `bg-gray-*`, `text-gray-*`)
- [ ] `dark:` variant only used when semantic tokens are insufficient
- [ ] Shadows/overlays adapt to dark mode

### 4. Internationalization (Weight: High)

- [ ] All user-facing text uses `t('key')` from `useTranslation()`
- [ ] No hardcoded strings (including placeholders, titles, aria-labels)
- [ ] Translation keys exist in all 3 locale files (en, pt-BR, es)
- [ ] Text containers handle varying text lengths (Portuguese/Spanish can be 30% longer than English)

### 5. Code Quality (Weight: Medium)

- [ ] Named exports (no default exports)
- [ ] Static data extracted outside component
- [ ] Uses `cn()` for conditional classes
- [ ] Props have TypeScript interface
- [ ] No unused imports or variables
- [ ] Follows project import order: external libs > @/ imports > relative imports
- [ ] Uses shadcn components instead of raw HTML where available

### 6. Performance (Weight: Medium)

- [ ] No inline object/array creation in JSX (`style={{}}`, `className={[].join()}`)
- [ ] Event handlers extracted or memoized when passed to child components
- [ ] Lists have stable `key` props (not array index unless truly static)
- [ ] Heavy components are candidates for lazy loading

## Output Format

```
## UI Review: [Component Name]

### Score: X/10

### Critical Issues
- [issue with fix]

### Warnings
- [issue with fix]

### Passed
- [what's good]

### Recommendations
- [improvements]
```
