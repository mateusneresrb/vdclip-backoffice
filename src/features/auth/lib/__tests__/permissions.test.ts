import { PERMISSIONS, ROLE_PERMISSIONS } from '@/features/auth/lib/permissions'

describe('pERMISSIONS object', () => {
  it('has exactly 17 permission keys', () => {
    expect(Object.keys(PERMISSIONS)).toHaveLength(17)
  })

  it('contains all expected permission keys', () => {
    const expectedKeys = [
      'USERS_READ',
      'USERS_WRITE',
      'USERS_DELETE',
      'TEAMS_READ',
      'TEAMS_WRITE',
      'FINANCE_READ',
      'FINANCE_WRITE',
      'FINANCE_EXPORT',
      'METRICS_READ',
      'METRICS_EXPORT',
      'ADMIN_READ',
      'ADMIN_WRITE',
      'AUDIT_READ',
      'PROVIDERS_READ',
      'PROVIDERS_WRITE',
      'SUBSCRIPTIONS_READ',
      'SUBSCRIPTIONS_WRITE',
    ]

    for (const key of expectedKeys) {
      expect(PERMISSIONS).toHaveProperty(key)
    }
  })

  it('has unique values for each permission', () => {
    const values = Object.values(PERMISSIONS)
    expect(new Set(values).size).toBe(values.length)
  })

  it('uses colon-separated namespace:action format', () => {
    for (const value of Object.values(PERMISSIONS)) {
      expect(value).toMatch(/^[a-z_]+:[a-z_]+$/)
    }
  })
})

describe('rOLE_PERMISSIONS', () => {
  it('defines permissions for all five roles', () => {
    expect(Object.keys(ROLE_PERMISSIONS).sort()).toEqual(
      ['finance_admin', 'finance_viewer', 'super_admin', 'support', 'viewer'].sort(),
    )
  })

  describe('super_admin', () => {
    it('has ALL permissions', () => {
      const allPermissions = Object.values(PERMISSIONS)
      const superAdminPerms = ROLE_PERMISSIONS.super_admin

      expect(superAdminPerms).toHaveLength(allPermissions.length)
      for (const perm of allPermissions) {
        expect(superAdminPerms).toContain(perm)
      }
    })

    it('has no duplicate permissions', () => {
      const perms = ROLE_PERMISSIONS.super_admin
      expect(new Set(perms).size).toBe(perms.length)
    })
  })

  describe('finance_admin', () => {
    it('has finance, metrics, and subscriptions permissions', () => {
      const expected = [
        PERMISSIONS.FINANCE_READ,
        PERMISSIONS.FINANCE_WRITE,
        PERMISSIONS.FINANCE_EXPORT,
        PERMISSIONS.METRICS_READ,
        PERMISSIONS.SUBSCRIPTIONS_READ,
        PERMISSIONS.SUBSCRIPTIONS_WRITE,
      ]
      expect(ROLE_PERMISSIONS.finance_admin).toEqual(expect.arrayContaining(expected))
      expect(ROLE_PERMISSIONS.finance_admin).toHaveLength(expected.length)
    })

    it('does NOT have admin, audit, users, teams, or providers permissions', () => {
      const forbidden = [
        PERMISSIONS.ADMIN_READ,
        PERMISSIONS.ADMIN_WRITE,
        PERMISSIONS.AUDIT_READ,
        PERMISSIONS.USERS_READ,
        PERMISSIONS.USERS_WRITE,
        PERMISSIONS.USERS_DELETE,
        PERMISSIONS.TEAMS_READ,
        PERMISSIONS.TEAMS_WRITE,
        PERMISSIONS.PROVIDERS_READ,
        PERMISSIONS.PROVIDERS_WRITE,
        PERMISSIONS.METRICS_EXPORT,
      ]
      for (const perm of forbidden) {
        expect(ROLE_PERMISSIONS.finance_admin).not.toContain(perm)
      }
    })
  })

  describe('finance_viewer', () => {
    it('has only read permissions for finance, metrics, and subscriptions', () => {
      const expected = [
        PERMISSIONS.FINANCE_READ,
        PERMISSIONS.METRICS_READ,
        PERMISSIONS.SUBSCRIPTIONS_READ,
      ]
      expect(ROLE_PERMISSIONS.finance_viewer).toEqual(expect.arrayContaining(expected))
      expect(ROLE_PERMISSIONS.finance_viewer).toHaveLength(expected.length)
    })

    it('does NOT have write or export permissions', () => {
      const forbidden = [
        PERMISSIONS.FINANCE_WRITE,
        PERMISSIONS.FINANCE_EXPORT,
        PERMISSIONS.SUBSCRIPTIONS_WRITE,
        PERMISSIONS.METRICS_EXPORT,
      ]
      for (const perm of forbidden) {
        expect(ROLE_PERMISSIONS.finance_viewer).not.toContain(perm)
      }
    })
  })

  describe('viewer', () => {
    it('has only read permissions for users, teams, and metrics', () => {
      const expected = [
        PERMISSIONS.USERS_READ,
        PERMISSIONS.TEAMS_READ,
        PERMISSIONS.METRICS_READ,
      ]
      expect(ROLE_PERMISSIONS.viewer).toEqual(expect.arrayContaining(expected))
      expect(ROLE_PERMISSIONS.viewer).toHaveLength(expected.length)
    })

    it('does NOT have any write, delete, or other permissions', () => {
      const forbidden = [
        PERMISSIONS.USERS_WRITE,
        PERMISSIONS.USERS_DELETE,
        PERMISSIONS.TEAMS_WRITE,
        PERMISSIONS.FINANCE_READ,
        PERMISSIONS.FINANCE_WRITE,
        PERMISSIONS.FINANCE_EXPORT,
        PERMISSIONS.METRICS_EXPORT,
        PERMISSIONS.ADMIN_READ,
        PERMISSIONS.ADMIN_WRITE,
        PERMISSIONS.AUDIT_READ,
        PERMISSIONS.PROVIDERS_READ,
        PERMISSIONS.PROVIDERS_WRITE,
        PERMISSIONS.SUBSCRIPTIONS_READ,
        PERMISSIONS.SUBSCRIPTIONS_WRITE,
      ]
      for (const perm of forbidden) {
        expect(ROLE_PERMISSIONS.viewer).not.toContain(perm)
      }
    })
  })

  describe('support', () => {
    it('has users read/write, teams read, and subscriptions read', () => {
      const expected = [
        PERMISSIONS.USERS_READ,
        PERMISSIONS.USERS_WRITE,
        PERMISSIONS.TEAMS_READ,
        PERMISSIONS.SUBSCRIPTIONS_READ,
      ]
      expect(ROLE_PERMISSIONS.support).toEqual(expect.arrayContaining(expected))
      expect(ROLE_PERMISSIONS.support).toHaveLength(expected.length)
    })

    it('does NOT have delete, admin, finance, audit, or providers permissions', () => {
      const forbidden = [
        PERMISSIONS.USERS_DELETE,
        PERMISSIONS.TEAMS_WRITE,
        PERMISSIONS.FINANCE_READ,
        PERMISSIONS.FINANCE_WRITE,
        PERMISSIONS.FINANCE_EXPORT,
        PERMISSIONS.METRICS_READ,
        PERMISSIONS.METRICS_EXPORT,
        PERMISSIONS.ADMIN_READ,
        PERMISSIONS.ADMIN_WRITE,
        PERMISSIONS.AUDIT_READ,
        PERMISSIONS.PROVIDERS_READ,
        PERMISSIONS.PROVIDERS_WRITE,
        PERMISSIONS.SUBSCRIPTIONS_WRITE,
      ]
      for (const perm of forbidden) {
        expect(ROLE_PERMISSIONS.support).not.toContain(perm)
      }
    })
  })

  describe('each role has no extra permissions', () => {
    it('every permission in each role exists in the PERMISSIONS object', () => {
      const allPermValues = new Set<string>(Object.values(PERMISSIONS))

      for (const [, perms] of Object.entries(ROLE_PERMISSIONS)) {
        for (const perm of perms) {
          expect(allPermValues.has(perm)).toBe(true)
        }
        // No duplicates within a role
        expect(new Set(perms).size).toBe(perms.length)
      }
    })
  })
})
