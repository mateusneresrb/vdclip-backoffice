---
paths:
  - "src/**/*.css"
  - "src/index.css"
---

# CSS / Tailwind Rules

## Tailwind CSS 4

- Import: `@import "tailwindcss"` (not `@tailwind` directives)
- Custom variants: `@custom-variant dark (&:is(.dark *));`
- Theme tokens defined in `@theme inline {}` block in `index.css`

## Constraints

- Use CSS variables defined in `:root` and `.dark` in `index.css`
- NEVER use hardcoded colors — always reference semantic tokens
- New design tokens go in `index.css` `:root` / `.dark` blocks
- Animations: use `tw-animate-css` classes or Tailwind transitions
- Base styles in `@layer base {}` block
