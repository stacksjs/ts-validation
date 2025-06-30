import { describe, expect, test } from 'bun:test'
import { number } from '../../src/validators/numbers'

describe('NumberValidator', () => {
  describe('basic validation', () => {
    test('should validate numbers', () => {
      const validator = number()
      expect(validator.test(123)).toBe(true)
      expect(validator.test(0)).toBe(true)
      expect(validator.test(-123)).toBe(true)
      expect(validator.test(3.14)).toBe(true)
      expect(validator.test(Number.POSITIVE_INFINITY)).toBe(true)
      expect(validator.test(Number.NEGATIVE_INFINITY)).toBe(true)
      expect(validator.test(Number.NaN)).toBe(false)
      expect(validator.test('123' as any)).toBe(false)
      expect(validator.test(null as any)).toBe(true) // null/undefined are valid when optional
      expect(validator.test(undefined as any)).toBe(true) // null/undefined are valid when optional
      expect(validator.test([] as any)).toBe(false)
      expect(validator.test({} as any)).toBe(false)
    })

    test('should have correct name', () => {
      const validator = number()
      expect(validator.name).toBe('number')
    })
  })

  describe('range validation', () => {
    test('min() should validate minimum value', () => {
      const validator = number().min(10)
      expect(validator.test(10)).toBe(true)
      expect(validator.test(15)).toBe(true)
      expect(validator.test(100)).toBe(true)
      expect(validator.test(9)).toBe(false)
      expect(validator.test(0)).toBe(false)
      expect(validator.test(-5)).toBe(false)
    })

    test('max() should validate maximum value', () => {
      const validator = number().max(100)
      expect(validator.test(100)).toBe(true)
      expect(validator.test(50)).toBe(true)
      expect(validator.test(0)).toBe(true)
      expect(validator.test(-10)).toBe(true)
      expect(validator.test(101)).toBe(false)
      expect(validator.test(200)).toBe(false)
    })

    test('should combine min and max', () => {
      const validator = number().min(0).max(100)
      expect(validator.test(0)).toBe(true)
      expect(validator.test(50)).toBe(true)
      expect(validator.test(100)).toBe(true)
      expect(validator.test(-1)).toBe(false)
      expect(validator.test(101)).toBe(false)
    })
  })

  describe('length validation', () => {
    test('length() should validate digit count', () => {
      const validator = number().length(3)
      expect(validator.test(123)).toBe(true)
      expect(validator.test(999)).toBe(true)
      expect(validator.test(100)).toBe(true)
      expect(validator.test(12)).toBe(false)
      expect(validator.test(1234)).toBe(false)
      expect(validator.test(0)).toBe(false)
    })

    test('should handle negative numbers in length validation', () => {
      const validator = number().length(4)
      expect(validator.test(-123)).toBe(true) // "-123" has 4 characters
      expect(validator.test(-12)).toBe(false) // "-12" has 3 characters
    })
  })

  describe('type validation', () => {
    test('integer() should validate integers', () => {
      const validator = number().integer()
      expect(validator.test(123)).toBe(true)
      expect(validator.test(0)).toBe(true)
      expect(validator.test(-456)).toBe(true)
      expect(validator.test(3.14)).toBe(false)
      expect(validator.test(0.1)).toBe(false)
    })

    test('integer() with options', () => {
      const validator = number().integer({ min: 0, max: 100 })
      expect(validator.test(50)).toBe(true)
      expect(validator.test(0)).toBe(true)
      expect(validator.test(100)).toBe(true)
      expect(validator.test(-1)).toBe(false)
      expect(validator.test(101)).toBe(false)
      expect(validator.test(50.5)).toBe(false)
    })

    test('float() should validate floating point numbers', () => {
      const validator = number().float()
      expect(validator.test(3.14)).toBe(true)
      expect(validator.test(0.1)).toBe(true)
      expect(validator.test(-2.5)).toBe(true)
      expect(validator.test(123)).toBe(true) // integers are valid floats
      expect(validator.test(0)).toBe(true)
    })

    test('float() with options', () => {
      const validator = number().float({ min: 0, max: 10 })
      expect(validator.test(5.5)).toBe(true)
      expect(validator.test(0)).toBe(true)
      expect(validator.test(10)).toBe(true)
      expect(validator.test(-0.1)).toBe(false)
      expect(validator.test(10.1)).toBe(false)
    })

    test('decimal() should validate decimal numbers', () => {
      const validator = number().decimal()
      expect(validator.test(123.45)).toBe(true)
      expect(validator.test(0.1)).toBe(true)
      expect(validator.test(123)).toBe(true)
      expect(validator.test(-45.67)).toBe(true)
    })
  })

  describe('sign validation', () => {
    test('positive() should validate positive numbers', () => {
      const validator = number().positive()
      expect(validator.test(1)).toBe(true)
      expect(validator.test(0.1)).toBe(true)
      expect(validator.test(1000)).toBe(true)
      expect(validator.test(0)).toBe(false)
      expect(validator.test(-1)).toBe(false)
      expect(validator.test(-0.1)).toBe(false)
    })

    test('negative() should validate negative numbers', () => {
      const validator = number().negative()
      expect(validator.test(-1)).toBe(true)
      expect(validator.test(-0.1)).toBe(true)
      expect(validator.test(-1000)).toBe(true)
      expect(validator.test(0)).toBe(false)
      expect(validator.test(1)).toBe(false)
      expect(validator.test(0.1)).toBe(false)
    })
  })

  describe('divisibility validation', () => {
    test('divisibleBy() should validate divisibility', () => {
      const validator = number().divisibleBy(5)
      expect(validator.test(10)).toBe(true)
      expect(validator.test(15)).toBe(true)
      expect(validator.test(0)).toBe(true)
      expect(validator.test(-10)).toBe(true)
      expect(validator.test(7)).toBe(false)
      expect(validator.test(3)).toBe(false)
    })

    test('should work with decimal divisors', () => {
      const validator = number().divisibleBy(0.5)
      expect(validator.test(1)).toBe(true)
      expect(validator.test(1.5)).toBe(true)
      expect(validator.test(2)).toBe(true)
      expect(validator.test(1.3)).toBe(false)
    })
  })

  describe('custom validation', () => {
    test('custom() should accept custom validation functions', () => {
      const validator = number().custom(
        value => value % 2 === 0,
        'Must be even',
      )
      expect(validator.test(2)).toBe(true)
      expect(validator.test(4)).toBe(true)
      expect(validator.test(0)).toBe(true)
      expect(validator.test(-2)).toBe(true)
      expect(validator.test(1)).toBe(false)
      expect(validator.test(3)).toBe(false)
      expect(validator.test(-1)).toBe(false)
    })

    test('should provide custom error messages', () => {
      const validator = number().custom(
        value => value > 100,
        'Must be greater than 100',
      )
      const result = validator.validate(50)
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors[0].message).toBe('Must be greater than 100')
      }
    })
  })

  describe('chaining validations', () => {
    test('should chain multiple validations', () => {
      const validator = number()
        .min(0)
        .max(100)
        .integer()
        .positive()

      expect(validator.test(50)).toBe(true)
      expect(validator.test(1)).toBe(true)
      expect(validator.test(-1)).toBe(false) // not positive
      expect(validator.test(101)).toBe(false) // too large
      expect(validator.test(50.5)).toBe(false) // not integer
    })

    test('should validate complex number constraints', () => {
      const validator = number()
        .min(10)
        .max(1000)
        .divisibleBy(10)
        .custom(n => n.toString().length <= 3, 'Max 3 digits')

      expect(validator.test(100)).toBe(true)
      expect(validator.test(50)).toBe(true) // 50 is divisible by 10
      expect(validator.test(1010)).toBe(false) // too large
      expect(validator.test(5)).toBe(false) // too small
    })
  })

  describe('required and optional', () => {
    test('required() should reject null/undefined', () => {
      const validator = number().required()
      expect(validator.test(0)).toBe(true)
      expect(validator.test(-1)).toBe(true)
      expect(validator.test(null as any)).toBe(false)
      expect(validator.test(undefined as any)).toBe(false)
    })

    test('optional() should accept null/undefined', () => {
      const validator = number().optional()
      expect(validator.test(123)).toBe(true)
      expect(validator.test(0)).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
    })

    test('should work with other validations when optional', () => {
      const validator = number().optional().min(10)
      expect(validator.test(15)).toBe(true)
      expect(validator.test(null as any)).toBe(true) // optional
      expect(validator.test(undefined as any)).toBe(true) // optional
      expect(validator.test(5)).toBe(false) // too small
    })
  })

  describe('validation results', () => {
    test('should return detailed validation results', () => {
      const validator = number().min(10)
      const result = validator.validate(5)
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors[0].message).toContain('at least 10')
      }
    })

    test('should return multiple errors for multiple failed validations', () => {
      const validator = number().min(10).integer()
      const result = validator.validate(5.5)
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors.length).toBe(2)
      }
    })
  })

  describe('edge cases', () => {
    test('should handle very large numbers', () => {
      const validator = number().max(Number.MAX_SAFE_INTEGER)
      expect(validator.test(Number.MAX_SAFE_INTEGER)).toBe(true)
      expect(validator.test(Number.MAX_SAFE_INTEGER + 1)).toBe(false)
    })

    test('should handle very small numbers', () => {
      const validator = number().min(Number.MIN_SAFE_INTEGER)
      expect(validator.test(Number.MIN_SAFE_INTEGER)).toBe(true)
      expect(validator.test(Number.MIN_SAFE_INTEGER - 1)).toBe(false)
    })

    test('should handle zero correctly', () => {
      const validator = number()
      expect(validator.test(0)).toBe(true)
      expect(validator.test(-0)).toBe(true)
    })

    test('should handle infinity', () => {
      const validator = number()
      expect(validator.test(Number.POSITIVE_INFINITY)).toBe(true)
      expect(validator.test(Number.NEGATIVE_INFINITY)).toBe(true)
    })

    test('should reject NaN', () => {
      const validator = number()
      expect(validator.test(Number.NaN)).toBe(false)
      expect(validator.test(0 / 0)).toBe(false)
    })
  })
})
