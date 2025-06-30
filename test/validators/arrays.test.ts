import { describe, expect, test } from 'bun:test'
import { array } from '../../src/validators/arrays'
import { number } from '../../src/validators/numbers'
import { string } from '../../src/validators/strings'

describe('ArrayValidator', () => {
  describe('basic validation', () => {
    test('should validate arrays', () => {
      const validator = array<any>()
      expect(validator.test([])).toBe(true)
      expect(validator.test([1, 2, 3])).toBe(true)
      expect(validator.test(['a', 'b', 'c'])).toBe(true)
      expect(validator.test([1, 'a', true])).toBe(true)
      expect(validator.test('not an array' as any)).toBe(false)
      expect(validator.test(123 as any)).toBe(false)
      expect(validator.test({} as any)).toBe(false)
      expect(validator.test(null as any)).toBe(true) // null/undefined are valid when optional
      expect(validator.test(undefined as any)).toBe(true) // null/undefined are valid when optional
    })

    test('should have correct name', () => {
      const validator = array<any>()
      expect(validator.name).toBe('array')
    })
  })

  describe('length validation', () => {
    test('min() should validate minimum length', () => {
      const validator = array<number>().min(2)
      expect(validator.test([1, 2])).toBe(true)
      expect(validator.test([1, 2, 3])).toBe(true)
      expect(validator.test([1, 2, 3, 4, 5])).toBe(true)
      expect(validator.test([1])).toBe(false)
      expect(validator.test([])).toBe(false) // empty array fails min length requirement
    })

    test('max() should validate maximum length', () => {
      const validator = array<number>().max(3)
      expect(validator.test([])).toBe(true)
      expect(validator.test([1])).toBe(true)
      expect(validator.test([1, 2, 3])).toBe(true)
      expect(validator.test([1, 2, 3, 4])).toBe(false)
      expect(validator.test([1, 2, 3, 4, 5])).toBe(false)
    })

    test('length() should validate exact length', () => {
      const validator = array<number>().length(3)
      expect(validator.test([1, 2, 3])).toBe(true)
      expect(validator.test([1, 2])).toBe(false)
      expect(validator.test([1, 2, 3, 4])).toBe(false)
      expect(validator.test([])).toBe(false) // empty array fails exact length requirement

      const stringValidator = array<string>().length(3)
      expect(stringValidator.test(['a', 'b', 'c'])).toBe(true)
    })

    test('should combine min and max', () => {
      const validator = array<number>().min(2).max(4)
      expect(validator.test([1, 2])).toBe(true)
      expect(validator.test([1, 2, 3])).toBe(true)
      expect(validator.test([1, 2, 3, 4])).toBe(true)
      expect(validator.test([1])).toBe(false)
      expect(validator.test([1, 2, 3, 4, 5])).toBe(false)
    })
  })

  describe('item validation', () => {
    test('each() should validate each item with string validator', () => {
      const validator = array<string>().each(string().min(2))
      expect(validator.test(['ab', 'cd', 'ef'])).toBe(true)
      expect(validator.test(['hello', 'world'])).toBe(true)
      expect(validator.test(['a', 'bc'])).toBe(false) // 'a' is too short
      expect(validator.test(['ab', 'c'])).toBe(false) // 'c' is too short
      expect(validator.test([])).toBe(true) // empty array is valid
    })

    test('each() should validate each item with number validator', () => {
      const validator = array<number>().each(number().min(0))
      expect(validator.test([1, 2, 3])).toBe(true)
      expect(validator.test([0, 10, 100])).toBe(true)
      expect(validator.test([-1, 2, 3])).toBe(false) // -1 is below minimum
      expect(validator.test([1, -2, 3])).toBe(false) // -2 is below minimum
      expect(validator.test([])).toBe(true) // empty array is valid
    })

    test('each() should work with complex validators', () => {
      const validator = array<string>().each(
        string().min(3).max(10).alphanumeric(),
      )
      expect(validator.test(['abc123', 'def456'])).toBe(true)
      expect(validator.test(['test', 'user', 'data'])).toBe(true)
      expect(validator.test(['ab', 'test'])).toBe(false) // 'ab' too short
      expect(validator.test(['test', 'verylongstring'])).toBe(false) // too long
      expect(validator.test(['test', 'user@123'])).toBe(false) // not alphanumeric
    })
  })

  describe('uniqueness validation', () => {
    test('unique() should validate unique primitive values', () => {
      const numberValidator = array<number>().unique()
      expect(numberValidator.test([1, 2, 3])).toBe(true)
      expect(numberValidator.test([1, 1, 3])).toBe(false)
      expect(numberValidator.test([])).toBe(true) // empty array is unique
      expect(numberValidator.test([1])).toBe(true) // single item is unique

      const stringValidator = array<string>().unique()
      expect(stringValidator.test(['a', 'b', 'c'])).toBe(true)
      expect(stringValidator.test(['a', 'b', 'a'])).toBe(false)
    })

    test('unique() should validate unique object values', () => {
      const validator = array<object>().unique()
      expect(validator.test([{ a: 1 }, { b: 2 }])).toBe(true)
      expect(validator.test([{ a: 1 }, { a: 1 }])).toBe(false)
      expect(validator.test([{ a: 1 }, { a: 2 }])).toBe(true)
    })

    test('unique() should handle mixed types', () => {
      const validator = array<any>().unique()
      expect(validator.test([1, 'a', true])).toBe(true)
      expect(validator.test([1, '1', true])).toBe(true) // different types
      expect(validator.test([1, 1, 'a'])).toBe(false)
      expect(validator.test(['a', 'a', 1])).toBe(false)
    })
  })

  describe('chaining validations', () => {
    test('should chain multiple validations', () => {
      const validator = array<string>()
        .min(2)
        .max(5)
        .each(string().min(3))
        .unique()

      expect(validator.test(['abc', 'def'])).toBe(true)
      expect(validator.test(['hello', 'world', 'test'])).toBe(true)
      expect(validator.test(['ab'])).toBe(false) // too short array
      expect(validator.test(['abc', 'def', 'ghi', 'jkl', 'mno', 'pqr'])).toBe(false) // too long array
      expect(validator.test(['ab', 'cd'])).toBe(false) // items too short
      expect(validator.test(['abc', 'abc'])).toBe(false) // not unique
    })

    test('should validate complex array constraints', () => {
      const validator = array<number>()
        .min(1)
        .max(10)
        .each(number().min(0).max(100).integer())
        .unique()

      expect(validator.test([1, 2, 3])).toBe(true)
      expect(validator.test([0, 50, 100])).toBe(true)
      expect(validator.test([])).toBe(false) // too short
      expect(validator.test([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])).toBe(false) // too long
      expect(validator.test([1, 2, -1])).toBe(false) // negative number
      expect(validator.test([1, 2, 101])).toBe(false) // number too large
      expect(validator.test([1, 2, 3.5])).toBe(false) // not integer
      expect(validator.test([1, 2, 1])).toBe(false) // not unique
    })
  })

  describe('required and optional', () => {
    test('required() should reject null/undefined', () => {
      const validator = array<any>().required()
      expect(validator.test([])).toBe(true)
      expect(validator.test([1, 2, 3])).toBe(true)
      expect(validator.test(null as any)).toBe(false)
      expect(validator.test(undefined as any)).toBe(false)
    })

    test('optional() should accept null/undefined', () => {
      const validator = array<any>().optional()
      expect(validator.test([1, 2, 3])).toBe(true)
      expect(validator.test([])).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
    })

    test('should work with other validations when optional', () => {
      const validator = array<number>().optional().min(2)
      expect(validator.test([1, 2, 3])).toBe(true)
      expect(validator.test(null as any)).toBe(true) // optional
      expect(validator.test(undefined as any)).toBe(true) // optional
      expect(validator.test([1])).toBe(false) // too short
    })
  })

  describe('validation results', () => {
    test('should return detailed validation results', () => {
      const validator = array<number>().min(3)
      const result = validator.validate([1, 2])
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors[0].message).toContain('at least 3 items')
      }
    })

    test('should return multiple errors for multiple failed validations', () => {
      const validator = array<string>().min(3).each(string().min(5))
      const result = validator.validate(['ab', 'cd'])
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors.length).toBe(2) // min length + each validation
      }
    })
  })

  describe('edge cases', () => {
    test('should handle nested arrays', () => {
      const validator = array<number[]>()
      expect(validator.test([[1, 2], [3, 4]])).toBe(true)
      expect(validator.test([[], [1]])).toBe(true)
      expect(validator.test([[1, 2], 'not array' as any])).toBe(true) // Array validator only checks if it's an array, not item types
    })

    test('should handle very large arrays', () => {
      const validator = array<number>().max(1000)
      const largeArray = Array.from({ length: 999 }, (_, i) => i)
      const tooLargeArray = Array.from({ length: 1001 }, (_, i) => i)
      expect(validator.test(largeArray)).toBe(true)
      expect(validator.test(tooLargeArray)).toBe(false)
    })

    test('should handle arrays with null/undefined items', () => {
      const validator = array<any>()
      expect(validator.test([1, null, 3])).toBe(true)
      expect(validator.test([1, undefined, 3])).toBe(true)
      expect(validator.test([null, null])).toBe(true)
    })

    test('should handle sparse arrays', () => {
      const validator = array<any>()
      const sparseArray = [1, , 3] // eslint-disable-line no-sparse-arrays
      expect(validator.test(sparseArray)).toBe(true)
    })

    test('unique() should handle arrays with undefined/null', () => {
      const validator = array<any>().unique()
      expect(validator.test([null, undefined, 1])).toBe(true)
      expect(validator.test([null, null])).toBe(false)
      expect(validator.test([undefined, undefined])).toBe(false)
    })
  })

  describe('type safety', () => {
    test('should work with typed arrays', () => {
      const stringValidator = array<string>()
      const numberValidator = array<number>()
      const booleanValidator = array<boolean>()

      expect(stringValidator.test(['a', 'b'])).toBe(true)
      expect(numberValidator.test([1, 2])).toBe(true)
      expect(booleanValidator.test([true, false])).toBe(true)

      // These would fail TypeScript compilation in real usage
      expect(stringValidator.test([1, 2] as any)).toBe(true) // runtime allows it
      expect(numberValidator.test(['a', 'b'] as any)).toBe(true) // runtime allows it
    })
  })
})
