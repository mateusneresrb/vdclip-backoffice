import type { AdminRole } from '@/features/auth/lib/permissions'

export interface AdminAccount {
  id: string
  name: string
  email: string
  role: AdminRole
  avatar?: string
  mfaEnabled: boolean
  lastLoginAt?: string
  createdAt?: string
}

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading' | 'mfa_required' | 'password_change_required'

// --- API response types ---

export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export interface MfaTokenResponse {
  mfa_required: true
  mfa_token: string
}

export interface PasswordChangeRequiredResponse {
  password_change_required: true
  password_change_token: string
}

export type LoginResponse = TokenResponse | MfaTokenResponse | PasswordChangeRequiredResponse

export interface AdminProfileResponse {
  id: string
  email: string
  first_name: string
  last_name: string | null
  picture_url: string | null
  has_mfa_enabled: boolean
  roles: string[]
  permissions: string[]
}

export interface MfaSetupResponse {
  secret: string
  qr_code: string
  provisioning_uri: string
}

export interface SessionResponse {
  id: string
  ip_address: string
  city: string | null
  region: string | null
  country: string | null
  user_agent: string
  last_activity_at: string
  created_at: string
}
