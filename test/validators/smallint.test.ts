import { smallint } from '../../src/validators/smallint'

describe('smallintValidator', () => {
  it('should validate smallint numbers', () => {
    const validator = smallint()
    expect(validator.test(0)).toBe(true)
    expect(validator.test(32767)).toBe(true)
    expect(validator.test(-32768)).toBe(true)
    expect(validator.test(32768)).toBe(false)
    expect(validator.test(-32769)).toBe(false)
  })

  it('should reject non-number values', () => {
    const validator = smallint().required()
    expect(validator.test('123')).toBe(false)
    expect(validator.test(null)).toBe(false)
    expect(validator.test(undefined)).toBe(false)
    expect(validator.test(Number.NaN)).toBe(false)
  })

  it('should validate with min/max options', () => {
    const validator = smallint().min(-100).max(100)
    expect(validator.test(0)).toBe(true)
    expect(validator.test(-100)).toBe(true)
    expect(validator.test(100)).toBe(true)
    expect(validator.test(-101)).toBe(false)
    expect(validator.test(101)).toBe(false)
  })

  it('should handle edge cases', () => {
    const validator = smallint().required()
    expect(validator.test(Number.POSITIVE_INFINITY)).toBe(false)
    expect(validator.test(Number.NEGATIVE_INFINITY)).toBe(false)
    expect(validator.test(Number.NaN)).toBe(false)
  })
})
