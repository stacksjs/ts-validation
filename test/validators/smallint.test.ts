import { describe, expect, test } from 'bun:test'
import { smallint } from '../../src/validators/smallint'

describe('smallintValidator', () => {
  test('should validate smallint numbers', () => {
    const validator = smallint().required()
    expect(validator.test(0)).toBe(true)
    expect(validator.test(32767)).toBe(true)
    expect(validator.test(-32768)).toBe(true)
    expect(validator.test(32768)).toBe(false)
    expect(validator.test(-32769)).toBe(false)
  })

  test('should reject non-number values', () => {
    const validator = smallint().required()
    expect(validator.test('123' as any)).toBe(false)
    expect(validator.test(null as any)).toBe(false)
    expect(validator.test(undefined as any)).toBe(false)
    expect(validator.test(Number.NaN)).toBe(false)
  })

  test('should validate with min/max options', () => {
    const validator = smallint().min(-100).max(100)
    expect(validator.test(0)).toBe(true)
    expect(validator.test(-100)).toBe(true)
    expect(validator.test(100)).toBe(true)
    expect(validator.test(-101)).toBe(false)
    expect(validator.test(101)).toBe(false)
  })

  test('should handle edge cases', () => {
    const validator = smallint().required()
    expect(validator.test(Number.POSITIVE_INFINITY)).toBe(false)
    expect(validator.test(Number.NEGATIVE_INFINITY)).toBe(false)
    expect(validator.test(Number.NaN)).toBe(false)
  })
})
