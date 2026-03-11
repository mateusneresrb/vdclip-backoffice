---
name: i18n-add
description: Add translation keys to pt-BR locale file. Use when new text needs to be internationalized, or when auditing missing translations.
argument-hint: "[namespace] [key] [en-text] [pt-br-text] [es-text]"
---

# Add Translations

Add or update translation keys across all 3 supported languages.

## Input

$ARGUMENTS

## Supported Languages

| Code  | Language   | Locale Path                    |
|-------|------------|--------------------------------|
| pt-BR | Portuguese | `public/locales/pt-BR/`        |

## Namespaces

| Namespace   | File          | Purpose                         |
|-------------|---------------|----------------------------------|
| common      | common.json   | Shared UI: nav, theme, buttons   |
| dashboard   | dashboard.json| Dashboard-specific text          |

New namespaces can be created — just add the JSON files and register in `src/i18n.ts` `ns` array.

## Rules

1. **Apenas atualizar o locale pt-BR
2. **Use nested keys** with dot notation: `section.subsection.key`
3. **Keep translations contextual** — "Save" for a save button vs "save" for a concept are different
4. **Handle plurals** if needed using i18next plural syntax: `key_one`, `key_other`
5. **Handle interpolation** with `{{variable}}` syntax: `"Welcome, {{name}}!"`
6. **If unsure about a translation**: provide the English text and mark pt-BR/es with `[REVIEW]` prefix
7. **Key naming conventions**:
   - Navigation: `nav.{page-name}`
   - Actions: `actions.{verb}` (save, delete, cancel, confirm)
   - Forms: `form.{field}.label`, `form.{field}.placeholder`, `form.{field}.error`
   - Messages: `messages.{type}` (success, error, info)

## Steps

1. Read the target namespace file for all 3 languages
2. Add the new key(s) maintaining alphabetical order within each section
3. Ensure valid JSON after editing
4. If creating a new namespace, also update `src/i18n.ts` to include it in the `ns` array

## Audit Mode

If invoked without specific keys (e.g., `/i18n-add audit`), scan all source files for:
- Hardcoded strings that should be translated
- `t('...')` calls referencing keys that don't exist in locale files
- Keys that exist in one language but not another
- Unused translation keys
