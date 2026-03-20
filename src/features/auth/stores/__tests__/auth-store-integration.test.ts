import type { AdminRole } from '@/features/auth/lib/permissions'
import type { AdminAccount } from '@/features/auth/types'

import { PERMISSIONS, ROLE_PERMISSIONS } from '@/features/auth/lib/permissions'
import { useAuthStore } from '@/features/auth/stores/auth-store'

function makeAdmin(overrides: Partial<AdminAccount> = {}): AdminAccount {
  return {
    id: 'admin-1',
    name: 'Test Admin',
    email: 'admin@vdclip.com',
    role: 'super_admin',
    mfaEnabled: true,
    ...overrides,
  }
}

describe('auth-store integration with permissions', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth()
  })

  // ── Login flow: super_admin gets ALL permissions ──────────────────

  it('setAdmin with super_admin role grants ALL permissions', () => {
    const admin = makeAdmin({ role: 'super_admin' })
    useAuthStore.getState().setAdmin(admin)

    const state = useAuthStore.getState()
    const allPermissions = Object.values(PERMISSIONS)

    expect(state.status).toBe('authenticated')
    expect(state.admin).toEqual(admin)
    expect(state.permissions.size).toBe(allPermissions.length)

    for (const perm of allPermissions) {
      expect(state.permissions.has(perm)).toBe(true)
    }
  })

  // ── Login flow: viewer gets limited permissions ───────────────────

  it('setAdmin with viewer role grants only viewer permissions', () => {
    const admin = makeAdmin({ role: 'viewer' })
    useAuthStore.getState().setAdmin(admin)

    const state = useAuthStore.getState()
    const viewerPerms = ROLE_PERMISSIONS.viewer

    expect(state.permissions.size).toBe(viewerPerms.length)

    for (const perm of viewerPerms) {
      expect(state.permissions.has(perm)).toBe(true)
    }
  })

  // ── Permission check: verify specific permissions per role ────────

  it.each<{ role: AdminRole; expected: string[]; absent: string[] }>([
    {
      role: 'finance_admin',
      expected: [PERMISSIONS.FINANCE_READ, PERMISSIONS.FINANCE_WRITE, PERMISSIONS.FINANCE_EXPORT],
      absent: [PERMISSIONS.USERS_READ, PERMISSIONS.ADMIN_WRITE, PERMISSIONS.AUDIT_READ],
    },
    {
      role: 'finance_viewer',
      expected: [PERMISSIONS.FINANCE_READ, PERMISSIONS.METRICS_READ, PERMISSIONS.SUBSCRIPTIONS_READ],
      absent: [PERMISSIONS.FINANCE_WRITE, PERMISSIONS.ADMIN_WRITE, PERMISSIONS.USERS_WRITE],
    },
    {
      role: 'support',
      expected: [PERMISSIONS.USERS_READ, PERMISSIONS.USERS_WRITE, PERMISSIONS.TEAMS_READ],
      absent: [PERMISSIONS.FINANCE_READ, PERMISSIONS.ADMIN_WRITE, PERMISSIONS.AUDIT_READ],
    },
    {
      role: 'viewer',
      expected: [PERMISSIONS.USERS_READ, PERMISSIONS.TEAMS_READ, PERMISSIONS.METRICS_READ],
      absent: [PERMISSIONS.USERS_WRITE, PERMISSIONS.FINANCE_READ, PERMISSIONS.ADMIN_WRITE],
    },
  ])('role "$role" has expected permissions and lacks absent ones', ({ role, expected, absent }) => {
    const admin = makeAdmin({ role })
    useAuthStore.getState().setAdmin(admin)

    const { permissions } = useAuthStore.getState()

    for (const perm of expected) {
      expect(permissions.has(perm)).toBe(true)
    }
    for (const perm of absent) {
      expect(permissions.has(perm)).toBe(false)
    }
  })

  // ── Backend-supplied permissions override role defaults ───────────

  it('setAdmin with explicit permissions uses those instead of role defaults', () => {
    const admin = makeAdmin({ role: 'viewer' })
    const customPerms = [PERMISSIONS.FINANCE_READ, PERMISSIONS.AUDIT_READ]

    useAuthStore.getState().setAdmin(admin, customPerms)

    const { permissions } = useAuthStore.getState()
    expect(permissions.size).toBe(2)
    expect(permissions.has(PERMISSIONS.FINANCE_READ)).toBe(true)
    expect(permissions.has(PERMISSIONS.AUDIT_READ)).toBe(true)
    // Default viewer perms should NOT be present
    expect(permissions.has(PERMISSIONS.USERS_READ)).toBe(false)
  })

  // ── Empty explicit permissions array falls back to role ───────────

  it('setAdmin with empty permissions array falls back to role permissions', () => {
    const admin = makeAdmin({ role: 'viewer' })
    useAuthStore.getState().setAdmin(admin, [])

    const { permissions } = useAuthStore.getState()
    expect(permissions.size).toBe(ROLE_PERMISSIONS.viewer.length)
  })

  // ── Status transitions ────────────────────────────────────────────

  it('transitions: unauthenticated → authenticated → mfa_required → unauthenticated', () => {
    const { getState } = useAuthStore

    // Initial state
    expect(getState().status).toBe('unauthenticated')

    // Login (authenticated)
    const admin = makeAdmin()
    getState().setAdmin(admin)
    expect(getState().status).toBe('authenticated')
    expect(getState().admin).toEqual(admin)

    // Transition to MFA required
    getState().setStatus('mfa_required')
    expect(getState().status).toBe('mfa_required')
    expect(getState().admin).toEqual(admin) // admin still set

    // Clear auth (logout)
    getState().clearAuth()
    expect(getState().status).toBe('unauthenticated')
    expect(getState().admin).toBeNull()
    expect(getState().permissions.size).toBe(0)
    expect(getState()._token).toBeNull()
    expect(getState()._mfaToken).toBeNull()
  })

  // ── Token management ──────────────────────────────────────────────

  it('setToken stores the JWT and clearAuth resets it', () => {
    const { getState } = useAuthStore

    getState().setToken('jwt-123')
    expect(getState()._token).toBe('jwt-123')

    getState().clearAuth()
    expect(getState()._token).toBeNull()
  })

  it('setMfaToken stores and clears MFA token', () => {
    const { getState } = useAuthStore

    getState().setMfaToken('mfa-abc')
    expect(getState()._mfaToken).toBe('mfa-abc')

    getState().setMfaToken(null)
    expect(getState()._mfaToken).toBeNull()
  })

  it('setPasswordChangeToken stores and clears password change token', () => {
    const { getState } = useAuthStore

    getState().setPasswordChangeToken('pct-xyz')
    expect(getState()._passwordChangeToken).toBe('pct-xyz')

    getState().setPasswordChangeToken(null)
    expect(getState()._passwordChangeToken).toBeNull()
  })

  // ── completeMfaSetup ─────────────────────────────────────────────

  it('completeMfaSetup sets mfaEnabled to true on current admin', () => {
    const admin = makeAdmin({ mfaEnabled: false })
    const { getState } = useAuthStore

    getState().setAdmin(admin)
    expect(getState().admin?.mfaEnabled).toBe(false)

    getState().completeMfaSetup()
    expect(getState().admin?.mfaEnabled).toBe(true)
  })

  it('completeMfaSetup is safe when admin is null', () => {
    const { getState } = useAuthStore

    // No admin set — should not throw
    getState().completeMfaSetup()
    expect(getState().admin).toBeNull()
  })
})
