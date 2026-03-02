---
paths:
  - "public/locales/**/*.json"
  - "src/i18n.ts"
---

# Translation Rules

## Languages

| Code  | Path                        |
|-------|-----------------------------|
| en    | `public/locales/en/`        |
| pt-BR | `public/locales/pt-BR/`     |
| es    | `public/locales/es/`        |

## Constraints

- ALWAYS update ALL 3 language files when adding/changing keys
- Keep keys in consistent order across all locale files
- Use nested keys: `section.subsection.key`
- Namespaces must be registered in `src/i18n.ts` `ns` array

## Key Naming

- Navigation: `nav.{page}`
- Actions: `actions.{verb}` (save, delete, cancel)
- Forms: `form.{field}.label`, `form.{field}.placeholder`
- Messages: `messages.success`, `messages.error`

## When Unsure About Translation

- Provide English text
- Prefix uncertain pt-BR/es translations with `[REVIEW]`
- Never leave a language file with missing keys
