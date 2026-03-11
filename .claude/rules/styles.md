---
paths:
  - "src/**/*.css"
  - "src/index.css"
  - "src/**/*.tsx"
  - "src/**/*.ts"
---

# CSS / Tailwind Rules

## Tailwind CSS 4

- Import: `@import "tailwindcss"` (not `@tailwind` directives)
- Custom variants: `@custom-variant dark (&:is(.dark *));`
- Theme tokens defined in `@theme inline {}` block in `index.css`
- Font: Inter (`--font-sans`)

## Semantic Color Tokens (ALWAYS use these — NEVER hardcode colors)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `bg-background` | white | dark gray #1d1d1f | page background |
| `text-foreground` | near-black | near-white | primary text |
| `bg-card` | white | slightly lighter dark | card surface |
| `text-card-foreground` | near-black | near-white | text on card |
| `bg-muted` | light gray | dark gray | subtle bg, inactive |
| `text-muted-foreground` | medium gray | lighter gray | secondary text, labels |
| `bg-primary` | amber oklch(0.702 0.202 45.648) | same | brand color, CTAs |
| `text-primary-foreground` | white | white | text on primary |
| `bg-secondary` | very light gray | dark gray | secondary actions |
| `bg-accent` | light gray | dark gray | hover states |
| `bg-destructive` | red | red | errors, delete |
| `border-border` | light gray | white/10% | dividers, outlines |
| `bg-input` | light gray | white/15% | input backgrounds |
| `ring-ring` | amber | amber | focus rings |

## Sidebar Tokens

- `bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-primary`, `bg-sidebar-accent`, `border-sidebar-border`
- Sidebar width: `--sidebar-width: 240px`, collapsed: `--sidebar-width-icon: 3.5rem`

## Chart Colors (`--chart-1` to `--chart-5`)

| Token | Light | Dark | Semantic use |
|-------|-------|------|-------------|
| `--chart-1` | oklch(0.68 0.18 45) Amber | oklch(0.78 0.17 45) | primary metric |
| `--chart-2` | oklch(0.62 0.17 185) Teal | oklch(0.73 0.15 185) | complementary |
| `--chart-3` | oklch(0.72 0.17 75) Warm Gold | oklch(0.82 0.15 75) | growth |
| `--chart-4` | oklch(0.63 0.16 135) Sage Green | oklch(0.74 0.14 135) | positive |
| `--chart-5` | oklch(0.58 0.23 20) Coral | oklch(0.70 0.21 20) | churn, negative, alerts |

In chart components: `color: 'var(--chart-N)'`

## Radius Scale

- `rounded-sm` = calc(radius - 4px)
- `rounded-md` = calc(radius - 2px)
- `rounded-lg` = radius (0.625rem — default)
- `rounded-xl` = calc(radius + 4px)
- `rounded-2xl`, `rounded-3xl`, `rounded-4xl` — larger

## Constraints

- NEVER: `bg-white`, `text-black`, `bg-gray-*`, `text-gray-*`, hardcoded hex/rgb
- NEVER: `min-h-screen` → use `min-h-svh`
- New design tokens: add to `index.css` `:root` and `.dark` blocks simultaneously
- Animations: `tw-animate-css` classes or Tailwind transitions
- Base styles in `@layer base {}`
- Dark mode via `.dark` class on `<html>` — NOT `prefers-color-scheme`
