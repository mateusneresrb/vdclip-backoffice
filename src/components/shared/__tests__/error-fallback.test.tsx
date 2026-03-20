import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ErrorFallback } from '@/components/shared/error-fallback'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>{children}</a>
  ),
}))

describe('errorFallback', () => {
  const defaultProps = {
    error: new Error('test'),
    reset: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title text', () => {
    render(<ErrorFallback {...defaultProps} />)

    expect(screen.getByText('error.title')).toBeInTheDocument()
  })

  it('renders description text', () => {
    render(<ErrorFallback {...defaultProps} />)

    expect(screen.getByText('error.description')).toBeInTheDocument()
  })

  it('has a "try again" button that calls reset when clicked', async () => {
    const user = userEvent.setup()
    render(<ErrorFallback {...defaultProps} />)

    const tryAgainButton = screen.getByText('error.tryAgain')
    await user.click(tryAgainButton)

    expect(defaultProps.reset).toHaveBeenCalledOnce()
  })

  it('has a link to /dashboard', () => {
    render(<ErrorFallback {...defaultProps} />)

    const link = screen.getByText('error.goHome')
    expect(link.closest('a')).toHaveAttribute('href', '/dashboard')
  })

  it('uses semantic i18n keys', () => {
    render(<ErrorFallback {...defaultProps} />)

    expect(screen.getByText('error.title')).toBeInTheDocument()
    expect(screen.getByText('error.description')).toBeInTheDocument()
    expect(screen.getByText('error.tryAgain')).toBeInTheDocument()
    expect(screen.getByText('error.goHome')).toBeInTheDocument()
  })
})
