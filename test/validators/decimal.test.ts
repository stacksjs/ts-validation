import { describe, expect, test } from 'bun:test'
import { decimal } from '../../src/validators/decimal'

describe('decimalValidator', () => {
  test('should validate decimal numbers', () => {
    const validator = decimal().required()
    expect(validator.test(123.45)).toBe(true)
    expect(validator.test(-45.67)).toBe(true)
    expect(validator.test(0.1)).toBe(true)
    expect(validator.test(123)).toBe(true) // integers are valid decimals
  })

  test('should reject non-number values', () => {
    const validator = decimal().required()
    expect(validator.test('123.45' as any)).toBe(false)
    expect(validator.test(null as any)).toBe(false)
    expect(validator.test(undefined as any)).toBe(false)
    expect(validator.test(Number.NaN)).toBe(false)
  })

  test('should validate with min/max options', () => {
    const validator = decimal().min(0).max(10)
    expect(validator.test(5.5)).toBe(true)
    expect(validator.test(0)).toBe(true)
    expect(validator.test(10)).toBe(true)
    expect(validator.test(-0.1)).toBe(false)
    expect(validator.test(10.1)).toBe(false)
  })
})
