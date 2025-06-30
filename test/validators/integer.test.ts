import { integer } from '../../src/validators/integer'

describe('integerValidator', () => {
  it('should validate integer numbers', () => {
    const validator = integer()
    expect(validator.test(0)).toBe(true)
    expect(validator.test(123)).toBe(true)
    expect(validator.test(-456)).toBe(true)
    expect(validator.test(3.14)).toBe(false)
  })

  it('should reject non-number values', () => {
    const validator = integer()
    expect(validator.test('123')).toBe(false)
    expect(validator.test(null)).toBe(false)
    expect(validator.test(undefined)).toBe(false)
    expect(validator.test(Number.NaN)).toBe(false)
  })

  it('should validate with min/max options', () => {
    const validator = integer().min(0).max(10)
    expect(validator.test(0)).toBe(true)
    expect(validator.test(10)).toBe(true)
    expect(validator.test(-1)).toBe(false)
    expect(validator.test(11)).toBe(false)
  })

  it('should handle edge cases', () => {
    const validator = integer()
    expect(validator.test(Number.POSITIVE_INFINITY)).toBe(false)
    expect(validator.test(Number.NEGATIVE_INFINITY)).toBe(false)
    expect(validator.test(Number.NaN)).toBe(false)
  })
})
