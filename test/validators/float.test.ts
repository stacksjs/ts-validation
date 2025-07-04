import { describe, expect, it } from 'bun:test'
import { float } from '../../src/validators/float'

describe('floatValidator', () => {
  it('should validate float numbers', () => {
    const validator = float()
    expect(validator.test(3.14)).toBe(true)
    expect(validator.test(-2.5)).toBe(true)
    expect(validator.test(0)).toBe(true)
    expect(validator.test(123)).toBe(true) // integers are valid floats
  })

  it('should reject non-number values', () => {
    const validator = float().required()
    expect(validator.test('3.14' as any)).toBe(false)
    expect(validator.test(null as any)).toBe(false)
    expect(validator.test(undefined as any)).toBe(false)
    expect(validator.test(Number.NaN)).toBe(false)
  })

  it('should validate with min/max options', () => {
    const validator = float().min(0).max(10)
    expect(validator.test(5.5)).toBe(true)
    expect(validator.test(0)).toBe(true)
    expect(validator.test(10)).toBe(true)
    expect(validator.test(-0.1)).toBe(false)
    expect(validator.test(10.1)).toBe(false)
  })

  it('should handle edge cases', () => {
    const validator = float()
    expect(validator.test(Number.POSITIVE_INFINITY)).toBe(true)
    expect(validator.test(Number.NEGATIVE_INFINITY)).toBe(true)
    expect(validator.test(Number.NaN)).toBe(false)
  })
})
