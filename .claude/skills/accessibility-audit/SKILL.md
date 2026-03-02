---
name: accessibility-audit
description: Audit a component or page for WCAG 2.1 AA compliance. Checks semantic HTML, keyboard navigation, screen reader support, color contrast, focus management, and ARIA usage.
argument-hint: "[file-path or 'full' for complete audit]"
allowed-tools: Read, Grep, Glob
---

# Accessibility Audit (WCAG 2.1 AA)

Perform a thorough accessibility review of the specified component or the full codebase.

## Target

$ARGUMENTS

## Audit Checklist

### 1. Perceivable

#### 1.1 Text Alternatives
- [ ] All images have meaningful `alt` text (or `alt=""` for decorative images)
- [ ] Icon-only buttons have `<span className="sr-only">` with descriptive text
- [ ] Complex graphics have extended descriptions
- [ ] SVG icons have `aria-hidden="true"` when decorative

#### 1.2 Adaptable
- [ ] Semantic HTML used: `<header>`, `<main>`, `<nav>`, `<section>`, `<aside>`, `<footer>`
- [ ] Heading hierarchy is logical: one `<h1>` per page, then `<h2>`, `<h3>`
- [ ] Lists use `<ul>`/`<ol>` + `<li>`, not styled divs
- [ ] Tables use `<th>`, `<caption>`, `scope` attributes
- [ ] Content order in DOM matches visual order

#### 1.3 Distinguishable
- [ ] Text contrast ratio meets 4.5:1 (normal) or 3:1 (large text)
- [ ] Non-text contrast meets 3:1 (borders, icons, form controls)
- [ ] Color is not the only visual means of conveying info
- [ ] Text can be resized to 200% without loss of content
- [ ] Content reflows at 320px viewport (no horizontal scroll)

### 2. Operable

#### 2.1 Keyboard Accessible
- [ ] All interactive elements are reachable via Tab key
- [ ] Tab order follows logical reading order
- [ ] No keyboard traps (user can always Tab away)
- [ ] Modal dialogs trap focus correctly and restore on close
- [ ] Dropdown menus support Arrow keys, Enter, Escape
- [ ] Skip-to-content link exists (for long navigation)

#### 2.2 Focus Indicators
- [ ] Focus ring is visible on all interactive elements
- [ ] `outline-none` is never used without a replacement focus style
- [ ] Focus moves to correct element after actions (route change, modal open)
- [ ] Focus is not lost when DOM elements are removed/replaced

#### 2.3 Navigation
- [ ] Consistent navigation across pages (sidebar, header)
- [ ] Multiple ways to reach each page (sidebar nav + breadcrumbs)
- [ ] Current page is indicated in navigation (`aria-current="page"` or visual active state)
- [ ] Page titles are unique and descriptive

### 3. Understandable

#### 3.1 Readable
- [ ] `<html lang="...">` attribute matches current language
- [ ] Language changes within content are marked with `lang` attribute
- [ ] Abbreviations are explained on first use

#### 3.2 Predictable
- [ ] No unexpected context changes on focus or input
- [ ] Form submission requires explicit action (button click)
- [ ] Navigation is consistent across pages

#### 3.3 Input Assistance
- [ ] Form inputs have associated `<Label>` with `htmlFor`
- [ ] Required fields are indicated (not by color alone)
- [ ] Error messages identify the field and describe the fix
- [ ] Form inputs have appropriate `type` (email, tel, url, etc.)
- [ ] `autoComplete` attributes match input purpose
- [ ] Input constraints are communicated (min, max, pattern)

### 4. Robust

#### 4.1 Compatible
- [ ] Valid HTML (no duplicate IDs, proper nesting)
- [ ] ARIA attributes are used correctly (`aria-label`, `aria-describedby`, `aria-expanded`, etc.)
- [ ] Custom components have appropriate ARIA roles
- [ ] `aria-live` regions for dynamic content updates
- [ ] Status messages use `role="status"` or `aria-live="polite"`

## Common Issues in This Project

- shadcn/ui components generally have good a11y, but verify custom wrappers
- TanStack Router `<Link>` renders as `<a>` — ensure meaningful link text
- i18n: verify `<html lang>` updates when language changes
- Theme toggle: verify screen readers announce the current theme
- Sidebar: verify mobile sheet has proper focus trap

## Output Format

```
## Accessibility Audit Report

### Compliance Level: [AA Compliant | Partial | Non-Compliant]

### Critical (Must Fix)
- [WCAG criterion] [issue] [location] [fix]

### Major (Should Fix)
- [WCAG criterion] [issue] [location] [fix]

### Minor (Nice to Fix)
- [WCAG criterion] [issue] [location] [fix]

### Passed
- [what's compliant]

### Recommendations
- [improvements beyond WCAG requirements]
```
