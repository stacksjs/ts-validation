import { decimal } from '../../src/validators/decimal'

describe('decimalValidator', () => {
  it('should validate decimal numbers', () => {
    const validator = decimal()
    expect(validator.test(123.45)).toBe(true)
    expect(validator.test(-45.67)).toBe(true)
    expect(validator.test(0.1)).toBe(true)
    expect(validator.test(123)).toBe(true) // integers are valid decimals
  })

  it('should reject non-number values', () => {
    const validator = decimal()
    expect(validator.test('123.45')).toBe(false)
    expect(validator.test(null)).toBe(false)
    expect(validator.test(undefined)).toBe(false)
    expect(validator.test(Number.NaN)).toBe(false)
  })

  it('should validate with min/max options', () => {
    const validator = decimal().min(0).max(10)
    expect(validator.test(5.5)).toBe(true)
    expect(validator.test(0)).toBe(true)
    expect(validator.test(10)).toBe(true)
    expect(validator.test(-0.1)).toBe(false)
    expect(validator.test(10.1)).toBe(false)
  })
})
