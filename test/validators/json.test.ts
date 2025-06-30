import { describe, expect, test } from 'bun:test'
import { json } from '../../src/validators/json'

describe('jsonValidator', () => {
  test('should validate JSON strings', () => {
    const validator = json().required()
    expect(validator.test('{"a":1}')).toBe(true)
    expect(validator.test('[1,2,3]')).toBe(true)
    expect(validator.test('123' as any)).toBe(false)
    expect(validator.test('not json' as any)).toBe(false)
  })

  test('should reject non-string values', () => {
    const validator = json().required()
    expect(validator.test(123 as any)).toBe(false)
    expect(validator.test(null as any)).toBe(false)
    expect(validator.test(undefined as any)).toBe(false)
  })

  test('should handle edge cases', () => {
    const validator = json().required()
    expect(validator.test('')).toBe(false)
    expect(validator.test('null')).toBe(false)
    expect(validator.test('true')).toBe(false)
    expect(validator.test('false')).toBe(false)
  })
})
