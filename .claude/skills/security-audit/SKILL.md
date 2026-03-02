---
name: security-audit
description: Perform a security audit on the codebase or a specific file. Checks for XSS, injection, auth issues, sensitive data exposure, dependency vulnerabilities, and frontend-specific security concerns.
argument-hint: "[file-path or 'full' for complete audit]"
allowed-tools: Read, Grep, Glob, Bash
---

# Security Audit

Perform a security review of the VDClip Dashboard codebase.

## Target

$ARGUMENTS

## Audit Categories

### 1. Cross-Site Scripting (XSS) — Critical

- [ ] No unsafe innerHTML patterns without sanitization (use DOMPurify if needed)
- [ ] User input is never directly interpolated into HTML
- [ ] URLs from user input are validated before use in `href`, `src`, `action`
- [ ] `javascript:` protocol is blocked in dynamic URLs
- [ ] React's built-in escaping is not bypassed

### 2. Injection Attacks — Critical

- [ ] No string concatenation in API URLs (use template literals with encoded params)
- [ ] Query parameters are encoded with `encodeURIComponent`
- [ ] No unsafe code execution patterns (dynamic code evaluation, string-based timers)
- [ ] No dynamic `import()` with user-controlled paths

### 3. Authentication & Authorization — Critical

- [ ] Auth tokens not stored in localStorage (prefer httpOnly cookies)
- [ ] Auth state checked before rendering protected routes
- [ ] Redirects after login don't use unvalidated URLs (open redirect)
- [ ] Session timeout handling exists
- [ ] CSRF protection considered for state-changing requests

### 4. Sensitive Data Exposure — High

- [ ] No API keys, tokens, or secrets in source code
- [ ] No sensitive data in URL query parameters
- [ ] No secrets in translation files or public assets
- [ ] `.env` files are in `.gitignore`
- [ ] Console.log doesn't leak sensitive information
- [ ] Error messages don't expose internal implementation details

### 5. Dependencies — High

- [ ] Check for known vulnerabilities: run audit command
- [ ] No outdated packages with known CVEs
- [ ] Lock file (`bun.lock`) is committed
- [ ] No dependencies from untrusted sources

### 6. Client-Side Data Handling — Medium

- [ ] LocalStorage/sessionStorage doesn't store sensitive data
- [ ] Zustand persist stores don't contain auth tokens or PII
- [ ] Form data is validated client-side AND will be validated server-side
- [ ] File uploads validate type and size before sending

### 7. Network Security — Medium

- [ ] API calls use HTTPS only
- [ ] CORS is properly configured (not wildcard in production)
- [ ] Fetch/axios interceptors handle auth token refresh
- [ ] Request timeouts are configured
- [ ] Error responses don't leak server internals

### 8. Frontend-Specific — Medium

- [ ] External links include `rel="noopener noreferrer"` with `target="_blank"`
- [ ] No iframe embedding of untrusted content without sandbox
- [ ] CSP-compatible code (no inline scripts/styles that bypass CSP)
- [ ] Proper meta tags for security (viewport, charset)
- [ ] No use of `window.location` with unsanitized data

## Output Format

```
## Security Audit Report

### Scan Date: YYYY-MM-DD
### Scope: [full | file path]

### Critical Issues (Fix immediately)
- [CVE/issue with location and fix]

### High Issues (Fix before release)
- [issue with location and fix]

### Medium Issues (Plan to fix)
- [issue with location and fix]

### Low Issues (Best practice improvements)
- [issue with location and fix]

### Passed Checks
- [what's secure]

### Recommendations
- [architectural security improvements]
```
