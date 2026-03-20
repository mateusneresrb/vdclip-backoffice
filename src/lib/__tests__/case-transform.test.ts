import { camelizeKeys, snakeizeKeys } from '../case-transform'

describe('camelizeKeys', () => {
  it('converts a simple snake_case object to camelCase', () => {
    const input = { first_name: 'John' }
    expect(camelizeKeys(input)).toEqual({ firstName: 'John' })
  })

  it('converts nested objects recursively', () => {
    const input = { user_info: { last_name: 'Doe' } }
    expect(camelizeKeys(input)).toEqual({ userInfo: { lastName: 'Doe' } })
  })

  it('converts arrays of objects', () => {
    const input = [
      { first_name: 'John', last_name: 'Doe' },
      { first_name: 'Jane', last_name: 'Smith' },
    ]
    expect(camelizeKeys(input)).toEqual([
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Smith' },
    ])
  })

  it('preserves Date objects unchanged', () => {
    const date = new Date('2026-03-19')
    const input = { created_at: date }
    const result = camelizeKeys(input)
    expect(result).toEqual({ createdAt: date })
    expect((result as { createdAt: Date }).createdAt).toBeInstanceOf(Date)
  })

  it('passes through primitive strings', () => {
    expect(camelizeKeys('hello_world')).toBe('hello_world')
  })

  it('passes through primitive numbers', () => {
    expect(camelizeKeys(42)).toBe(42)
  })

  it('passes through booleans', () => {
    expect(camelizeKeys(true)).toBe(true)
  })

  it('passes through null', () => {
    expect(camelizeKeys(null)).toBeNull()
  })

  it('passes through undefined', () => {
    expect(camelizeKeys(undefined)).toBeUndefined()
  })
})

describe('snakeizeKeys', () => {
  it('converts a simple camelCase object to snake_case', () => {
    const input = { firstName: 'John' }
    expect(snakeizeKeys(input)).toEqual({ first_name: 'John' })
  })

  it('converts nested objects recursively', () => {
    const input = { userInfo: { lastName: 'Doe' } }
    expect(snakeizeKeys(input)).toEqual({ user_info: { last_name: 'Doe' } })
  })

  it('converts arrays of objects', () => {
    const input = [
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Smith' },
    ]
    expect(snakeizeKeys(input)).toEqual([
      { first_name: 'John', last_name: 'Doe' },
      { first_name: 'Jane', last_name: 'Smith' },
    ])
  })

  it('preserves Date objects unchanged', () => {
    const date = new Date('2026-03-19')
    const input = { createdAt: date }
    const result = snakeizeKeys(input)
    expect(result).toEqual({ created_at: date })
    expect((result as { created_at: Date }).created_at).toBeInstanceOf(Date)
  })
})
