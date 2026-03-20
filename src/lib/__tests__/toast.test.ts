import { ApiError } from '../api-client'
import { showMutationError } from '../toast'

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}))

// Mock i18n — return the key itself, except for known apiError keys
vi.mock('@/i18n', () => ({
  i18n: {
    t: vi.fn((key: string) => {
      const translations: Record<string, string> = {
        'admin:toast.apiError.COST_CENTER_SLUG_EXISTS': 'Já existe um centro de custo com esse identificador',
        'admin:toast.apiError.MFA_INVALID_CODE': 'Código de verificação inválido',
      }
      return translations[key] ?? key
    }),
  },
}))

const { toast } = await import('sonner')

describe('showMutationError', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows translated message for known API error code', () => {
    const err = new ApiError(409, { error: { code: 'COST_CENTER_SLUG_EXISTS', message: 'Slug already exists' } })

    showMutationError(err, 'Erro genérico')

    expect(toast.error).toHaveBeenCalledWith(
      'Já existe um centro de custo com esse identificador',
      { description: undefined },
    )
  })

  it('shows fallback title with API message as description for unknown error code', () => {
    const err = new ApiError(400, { error: { code: 'UNKNOWN_CODE', message: 'Something specific went wrong' } })

    showMutationError(err, 'Erro genérico')

    expect(toast.error).toHaveBeenCalledWith(
      'Erro genérico',
      { description: 'Something specific went wrong' },
    )
  })

  it('shows generic fallback when error has no code', () => {
    const err = new ApiError(500, { error: { message: 'Internal server error' } })

    showMutationError(err, 'Erro genérico')

    expect(toast.error).toHaveBeenCalledWith(
      'Erro genérico',
      { description: 'Internal server error' },
    )
  })

  it('shows generic fallback for non-ApiError', () => {
    const err = new Error('Network error')

    showMutationError(err, 'Erro genérico')

    expect(toast.error).toHaveBeenCalledWith(
      'Erro genérico',
      { description: undefined },
    )
  })

  it('shows generic fallback when API error has no message', () => {
    const err = new ApiError(500, null)

    showMutationError(err, 'Erro genérico')

    expect(toast.error).toHaveBeenCalledWith(
      'Erro genérico',
      { description: undefined },
    )
  })

  it('does not use HTTP status as description', () => {
    // errorMessage returns "HTTP 500" when no message in body
    const err = new ApiError(500, { error: {} })

    showMutationError(err, 'Erro genérico')

    // Should NOT show "HTTP 500" as description
    expect(toast.error).toHaveBeenCalledWith(
      'Erro genérico',
      { description: undefined },
    )
  })
})
