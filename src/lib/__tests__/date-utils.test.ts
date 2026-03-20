import { getDateParams } from '../date-utils'

vi.mock('@/features/admin/types', () => ({}))

describe('getDateParams', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-19T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns date_from 7 days ago for "7d"', () => {
    const result = getDateParams('7d')
    expect(result).toEqual({ date_from: '2026-03-12', date_to: '2026-03-19' })
  })

  it('returns date_from 30 days ago for "30d"', () => {
    const result = getDateParams('30d')
    expect(result).toEqual({ date_from: '2026-02-17', date_to: '2026-03-19' })
  })

  it('returns date_from 90 days ago for "90d"', () => {
    const result = getDateParams('90d')
    expect(result).toEqual({ date_from: '2025-12-19', date_to: '2026-03-19' })
  })

  it('returns date_from 1 year ago for "12m"', () => {
    const result = getDateParams('12m')
    expect(result).toEqual({ date_from: '2025-03-19', date_to: '2026-03-19' })
  })

  it('returns date_from Jan 1 of current year for "ytd"', () => {
    const result = getDateParams('ytd')
    expect(result).toEqual({ date_from: '2026-01-01', date_to: '2026-03-19' })
  })

  it('returns date_from 2024-01-01 for "all"', () => {
    const result = getDateParams('all')
    expect(result).toEqual({ date_from: '2024-01-01', date_to: '2026-03-19' })
  })

  it('returns date_from 1 day ago for "1d"', () => {
    const result = getDateParams('1d')
    expect(result).toEqual({ date_from: '2026-03-18', date_to: '2026-03-19' })
  })

  it('returns date_from 3 days ago for "3d"', () => {
    const result = getDateParams('3d')
    expect(result).toEqual({ date_from: '2026-03-16', date_to: '2026-03-19' })
  })

  it('falls back to 30 days for unknown string', () => {
    const result = getDateParams('unknown')
    expect(result).toEqual({ date_from: '2026-02-17', date_to: '2026-03-19' })
  })

  it('returns YYYY-MM-DD formatted strings', () => {
    const result = getDateParams('7d')
    expect(result.date_from).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(result.date_to).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
