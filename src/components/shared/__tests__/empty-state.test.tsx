import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Search } from 'lucide-react'

import { EmptyState } from '@/components/shared/empty-state'

describe('emptyState', () => {
  it('renders title and description', () => {
    render(
      <EmptyState
        icon={Search}
        title="No results found"
        description="Try adjusting your search"
      />,
    )

    expect(screen.getByText('No results found')).toBeInTheDocument()
    expect(screen.getByText('Try adjusting your search')).toBeInTheDocument()
  })

  it('renders action button when provided', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <EmptyState
        icon={Search}
        title="No results"
        action={{ label: 'Create new', onClick }}
      />,
    )

    const button = screen.getByText('Create new')
    expect(button).toBeInTheDocument()

    await user.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renders icon when provided', () => {
    render(
      <EmptyState
        icon={Search}
        title="No results"
      />,
    )

    const statusContainer = screen.getByRole('status')
    expect(statusContainer.querySelector('svg')).toBeInTheDocument()
  })

  it('does not render action when not provided', () => {
    render(
      <EmptyState
        icon={Search}
        title="No results"
      />,
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
