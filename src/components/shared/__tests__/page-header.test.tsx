import { render, screen } from '@testing-library/react'

import { PageHeader } from '@/components/shared/page-header'

describe('pageHeader', () => {
  it('renders title', () => {
    render(<PageHeader title="Users" />)

    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<PageHeader title="Users" description="Manage all users" />)

    expect(screen.getByText('Manage all users')).toBeInTheDocument()
  })

  it('renders children (action buttons)', () => {
    render(
      <PageHeader title="Users">
        <button type="button">Export</button>
      </PageHeader>,
    )

    expect(screen.getByText('Export')).toBeInTheDocument()
  })

  it('does not render description section when not provided', () => {
    const { container } = render(<PageHeader title="Users" />)

    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs).toHaveLength(0)
  })
})
