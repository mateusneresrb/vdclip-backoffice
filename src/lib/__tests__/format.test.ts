import { formatCurrency } from '../format'

describe('formatCurrency', () => {
  it('formats USD with dollar sign and thousands separator', () => {
    const result = formatCurrency(1000)
    expect(result).toContain('$')
    expect(result).toContain('1,000')
  })

  it('formats BRL with R$ symbol', () => {
    const result = formatCurrency(1500.50, 'BRL')
    expect(result).toContain('R$')
  })

  it('respects maximumFractionDigits option', () => {
    const result = formatCurrency(1000, 'USD', { maximumFractionDigits: 0 })
    expect(result).toContain('$')
    expect(result).toContain('1,000')
    expect(result).not.toContain('.')
  })

  it('formats zero correctly', () => {
    const result = formatCurrency(0)
    expect(result).toContain('$')
    expect(result).toContain('0')
  })

  it('formats negative values correctly', () => {
    const result = formatCurrency(-500)
    expect(result).toContain('500')
    // Intl may use a minus sign or parentheses depending on locale
    expect(result).toMatch(/-|(\()/)
  })
})
