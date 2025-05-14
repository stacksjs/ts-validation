import { describe, expect, test } from 'bun:test'
import { v } from '../src/validation'

describe('Validation Library', () => {
  describe('String Validator', () => {
    test('basic string validation', () => {
      const validator = v.string()
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('123')).toBe(true)
      expect(validator.test('')).toBe(true)
    })

    test('min length validation', () => {
      const validator = v.string().min(5)
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('hi')).toBe(false)
    })

    test('max length validation', () => {
      const validator = v.string().max(5)
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('hello world')).toBe(false)
    })

    test('exact length validation', () => {
      const validator = v.string().length(5)
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('hi')).toBe(false)
      expect(validator.test('hello world')).toBe(false)
    })

    test('email validation', () => {
      const validator = v.string().email()
      expect(validator.test('test@example.com')).toBe(true)
      expect(validator.test('invalid-email')).toBe(false)
    })

    test('alphanumeric validation', () => {
      const validator = v.string().alphanumeric()
      expect(validator.test('abc123')).toBe(true)
      expect(validator.test('abc-123')).toBe(false)
    })
  })

  describe('Number Validator', () => {
    test('basic number validation', () => {
      const validator = v.number()
      expect(validator.test(123)).toBe(true)
      expect(validator.test(Number.NaN)).toBe(false)
      expect(validator.test(0)).toBe(true)
    })

    test('min value validation', () => {
      const validator = v.number().min(5)
      expect(validator.test(10)).toBe(true)
      expect(validator.test(3)).toBe(false)
    })

    test('max value validation', () => {
      const validator = v.number().max(10)
      expect(validator.test(5)).toBe(true)
      expect(validator.test(15)).toBe(false)
    })

    test('integer validation', () => {
      const validator = v.number().integer()
      expect(validator.test(5)).toBe(true)
      expect(validator.test(5.5)).toBe(false)
    })

    test('float validation', () => {
      const validator = v.number().float()
      expect(validator.test(5.5)).toBe(true)
      expect(validator.test(5)).toBe(true)
    })
  })

  describe('Array Validator', () => {
    test('basic array validation', () => {
      const validator = v.array<number>()
      expect(validator.test([1, 2, 3])).toBe(true)
      expect(validator.test([])).toBe(true)
      expect(validator.test('not an array' as any)).toBe(false)
    })

    test('min length validation', () => {
      const validator = v.array<number>().min(2)
      expect(validator.test([1, 2])).toBe(true)
      expect(validator.test([1])).toBe(false)
    })

    test('max length validation', () => {
      const validator = v.array<number>().max(3)
      expect(validator.test([1, 2, 3])).toBe(true)
      expect(validator.test([1, 2, 3, 4])).toBe(false)
    })

    test('exact length validation', () => {
      const validator = v.array<number>().length(3)
      expect(validator.test([1, 2, 3])).toBe(true)
      expect(validator.test([1, 2])).toBe(false)
      expect(validator.test([1, 2, 3, 4])).toBe(false)
    })

    test('each item validation', () => {
      const validator = v.array<number>().each(v.number().min(0))
      expect(validator.test([1, 2, 3])).toBe(true)
      expect(validator.test([-1, 2, 3])).toBe(false)
    })

    test('unique values validation', () => {
      const validator = v.array<number>().unique()
      expect(validator.test([1, 2, 3])).toBe(true)
      expect(validator.test([1, 1, 2])).toBe(false)
    })

    test('complex array validation', () => {
      const validator = v.array<string>()
        .min(2)
        .max(4)
        .each(v.string().min(2))
        .unique()

      expect(validator.test(['ab', 'cd'])).toBe(true)
      expect(validator.test(['a'])).toBe(false) // too short
      expect(validator.test(['ab', 'cd', 'ef', 'gh', 'ij'])).toBe(false) // too long
      expect(validator.test(['ab', 'a'])).toBe(false) // item too short
      expect(validator.test(['ab', 'ab'])).toBe(false) // not unique
    })
  })

  describe('Validation Results', () => {
    test('validate returns detailed results', () => {
      const validator = v.string().min(5).max(10)
      const result = validator.validate('hi')
      expect(result.valid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].message).toBe('Must be at least 5 characters long')
    })

    test('multiple validation errors', () => {
      const validator = v.string().min(5).max(10).alphanumeric()
      const result = validator.validate('hi!')
      expect(result.valid).toBe(false)
      expect(result.errors).toHaveLength(2)
    })
  })
})
