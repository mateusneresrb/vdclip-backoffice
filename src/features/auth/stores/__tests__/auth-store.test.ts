import type { AdminAccount } from '@/features/auth/types'

import { PERMISSIONS, ROLE_PERMISSIONS } from '@/features/auth/lib/permissions'
import { useAuthStore } from '@/features/auth/stores/auth-store'

function makeAdmin(overrides: Partial<AdminAccount> = {}): AdminAccount {
  return {
    id: 'admin-1',
    name: 'Test Admin',
    email: 'admin@vdclip.com',
    role: 'super_admin',
    mfaEnabled: false,
    ...overrides,
  }
}

beforeEach(() => {
  useAuthStore.getState().clearAuth()
})

describe('auth-store initial state', () => {
  it('has admin as null', () => {
    expect(useAuthStore.getState().admin).toBeNull()
  })

  it('has status as unauthenticated', () => {
    expect(useAuthStore.getState().status).toBe('unauthenticated')
  })

  it('has empty permissions set', () => {
    const { permissions } = useAuthStore.getState()
    expect(permissions).toBeInstanceOf(Set)
    expect(permissions.size).toBe(0)
  })

  it('has null tokens', () => {
    const state = useAuthStore.getState()
    expect(state._token).toBeNull()
    expect(state._mfaToken).toBeNull()
    expect(state._passwordChangeToken).toBeNull()
  })
})

describe('setAdmin', () => {
  it('sets admin and derives permissions from role when no explicit permissions given', () => {
    const admin = makeAdmin({ role: 'viewer' })

    useAuthStore.getState().setAdmin(admin)

    const state = useAuthStore.getState()
    expect(state.admin).toEqual(admin)
    expect(state.status).toBe('authenticated')

    const expected = new Set(ROLE_PERMISSIONS.viewer)
    expect(state.permissions).toEqual(expected)
  })

  it('derives super_admin permissions from ROLE_PERMISSIONS', () => {
    const admin = makeAdmin({ role: 'super_admin' })

    useAuthStore.getState().setAdmin(admin)

    const state = useAuthStore.getState()
    for (const perm of Object.values(PERMISSIONS)) {
      expect(state.permissions.has(perm)).toBe(true)
    }
  })

  it('derives finance_admin permissions from ROLE_PERMISSIONS', () => {
    const admin = makeAdmin({ role: 'finance_admin' })

    useAuthStore.getState().setAdmin(admin)

    const state = useAuthStore.getState()
    expect(state.permissions).toEqual(new Set(ROLE_PERMISSIONS.finance_admin))
  })

  it('uses explicit permissions array instead of role defaults', () => {
    const admin = makeAdmin({ role: 'super_admin' })
    const customPerms = [PERMISSIONS.USERS_READ, PERMISSIONS.TEAMS_READ]

    useAuthStore.getState().setAdmin(admin, customPerms)

    const state = useAuthStore.getState()
    expect(state.permissions).toEqual(new Set(customPerms))
    expect(state.permissions.size).toBe(2)
  })

  it('falls back to role permissions when explicit permissions array is empty', () => {
    const admin = makeAdmin({ role: 'support' })

    useAuthStore.getState().setAdmin(admin, [])

    const state = useAuthStore.getState()
    expect(state.permissions).toEqual(new Set(ROLE_PERMISSIONS.support))
  })

  it('sets status to authenticated', () => {
    useAuthStore.getState().setAdmin(makeAdmin())
    expect(useAuthStore.getState().status).toBe('authenticated')
  })
})

describe('setToken', () => {
  it('stores the access token', () => {
    useAuthStore.getState().setToken('jwt-abc-123')
    expect(useAuthStore.getState()._token).toBe('jwt-abc-123')
  })

  it('overwrites a previously stored token', () => {
    useAuthStore.getState().setToken('old-token')
    useAuthStore.getState().setToken('new-token')
    expect(useAuthStore.getState()._token).toBe('new-token')
  })
})

describe('setMfaToken', () => {
  it('stores the MFA token', () => {
    useAuthStore.getState().setMfaToken('mfa-token-xyz')
    expect(useAuthStore.getState()._mfaToken).toBe('mfa-token-xyz')
  })

  it('can set MFA token to null', () => {
    useAuthStore.getState().setMfaToken('mfa-token-xyz')
    useAuthStore.getState().setMfaToken(null)
    expect(useAuthStore.getState()._mfaToken).toBeNull()
  })
})

describe('clearAuth', () => {
  it('resets all state to initial values', () => {
    // Set up non-default state
    useAuthStore.getState().setAdmin(makeAdmin(), [PERMISSIONS.USERS_READ])
    useAuthStore.getState().setToken('some-token')
    useAuthStore.getState().setMfaToken('mfa-token')
    useAuthStore.getState().setPasswordChangeToken('pwd-token')

    // Verify state is not initial
    expect(useAuthStore.getState().admin).not.toBeNull()

    // Clear
    useAuthStore.getState().clearAuth()

    const state = useAuthStore.getState()
    expect(state.admin).toBeNull()
    expect(state.permissions.size).toBe(0)
    expect(state.status).toBe('unauthenticated')
    expect(state._token).toBeNull()
    expect(state._mfaToken).toBeNull()
    expect(state._passwordChangeToken).toBeNull()
  })
})

describe('setStatus', () => {
  it('updates status to loading', () => {
    useAuthStore.getState().setStatus('loading')
    expect(useAuthStore.getState().status).toBe('loading')
  })

  it('updates status to mfa_required', () => {
    useAuthStore.getState().setStatus('mfa_required')
    expect(useAuthStore.getState().status).toBe('mfa_required')
  })

  it('updates status to password_change_required', () => {
    useAuthStore.getState().setStatus('password_change_required')
    expect(useAuthStore.getState().status).toBe('password_change_required')
  })
})

describe('completeMfaSetup', () => {
  it('sets mfaEnabled to true on the current admin', () => {
    const admin = makeAdmin({ mfaEnabled: false })
    useAuthStore.getState().setAdmin(admin)

    useAuthStore.getState().completeMfaSetup()

    expect(useAuthStore.getState().admin?.mfaEnabled).toBe(true)
  })

  it('keeps admin as null when no admin is set', () => {
    useAuthStore.getState().completeMfaSetup()
    expect(useAuthStore.getState().admin).toBeNull()
  })

  it('preserves other admin fields when setting mfaEnabled', () => {
    const admin = makeAdmin({ name: 'Jane Doe', email: 'jane@vdclip.com', mfaEnabled: false })
    useAuthStore.getState().setAdmin(admin)

    useAuthStore.getState().completeMfaSetup()

    const updatedAdmin = useAuthStore.getState().admin
    expect(updatedAdmin?.name).toBe('Jane Doe')
    expect(updatedAdmin?.email).toBe('jane@vdclip.com')
    expect(updatedAdmin?.mfaEnabled).toBe(true)
  })
})
