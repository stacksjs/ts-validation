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

  describe('Boolean Validator', () => {
    test('basic boolean validation', () => {
      const validator = v.boolean()
      expect(validator.test(true)).toBe(true)
      expect(validator.test(false)).toBe(true)
      expect(validator.test('true' as any)).toBe(false)
      expect(validator.test(1 as any)).toBe(false)
    })

    test('isTrue validation', () => {
      const validator = v.boolean().isTrue()
      expect(validator.test(true)).toBe(true)
      expect(validator.test(false)).toBe(false)
    })

    test('isFalse validation', () => {
      const validator = v.boolean().isFalse()
      expect(validator.test(false)).toBe(true)
      expect(validator.test(true)).toBe(false)
    })

    test('custom boolean validation', () => {
      const validator = v.boolean().custom(
        value => value === true || value === false,
        'Must be a boolean value',
      )
      expect(validator.test(true)).toBe(true)
      expect(validator.test(false)).toBe(true)
    })
  })

  describe('Enum Validator', () => {
    test('string enum validation', () => {
      const validator = v.enum(['red', 'green', 'blue'] as const)
      expect(validator.test('red')).toBe(true)
      expect(validator.test('green')).toBe(true)
      expect(validator.test('blue')).toBe(true)
      expect(validator.test('yellow' as any)).toBe(false)
      expect(validator.test(123 as any)).toBe(false)
    })

    test('number enum validation', () => {
      const validator = v.enum([1, 2, 3] as const)
      expect(validator.test(1)).toBe(true)
      expect(validator.test(2)).toBe(true)
      expect(validator.test(3)).toBe(true)
      expect(validator.test(4 as any)).toBe(false)
      expect(validator.test('1' as any)).toBe(false)
    })

    test('custom enum validation', () => {
      const validator = v.enum(['admin', 'user', 'guest'] as const).custom(
        value => value !== 'guest',
        'Guest access is not allowed',
      )
      expect(validator.test('admin')).toBe(true)
      expect(validator.test('user')).toBe(true)
      expect(validator.test('guest')).toBe(false)
    })

    test('enum validation with readonly array', () => {
      const roles = ['admin', 'user', 'guest'] as const
      const validator = v.enum(roles)
      expect(validator.test('admin')).toBe(true)
      expect(validator.test('invalid' as any)).toBe(false)
    })
  })

  describe('Date Validator', () => {
    test('basic date validation', () => {
      const validator = v.date()
      expect(validator.test(new Date())).toBe(true)
      expect(validator.test(new Date('invalid'))).toBe(false)
      expect(validator.test('2023-01-01' as any)).toBe(false)
      expect(validator.test(123 as any)).toBe(false)
    })

    test('min date validation', () => {
      const minDate = new Date('2023-01-01')
      const validator = v.date().min(minDate)
      expect(validator.test(new Date('2023-01-01'))).toBe(true)
      expect(validator.test(new Date('2023-02-01'))).toBe(true)
      expect(validator.test(new Date('2022-12-31'))).toBe(false)
    })

    test('max date validation', () => {
      const maxDate = new Date('2023-12-31')
      const validator = v.date().max(maxDate)
      expect(validator.test(new Date('2023-12-31'))).toBe(true)
      expect(validator.test(new Date('2023-06-15'))).toBe(true)
      expect(validator.test(new Date('2024-01-01'))).toBe(false)
    })

    test('between dates validation', () => {
      const start = new Date('2023-01-01')
      const end = new Date('2023-12-31')
      const validator = v.date().between(start, end)
      expect(validator.test(new Date('2023-06-15'))).toBe(true)
      expect(validator.test(new Date('2023-01-01'))).toBe(true)
      expect(validator.test(new Date('2023-12-31'))).toBe(true)
      expect(validator.test(new Date('2022-12-31'))).toBe(false)
      expect(validator.test(new Date('2024-01-01'))).toBe(false)
    })

    test('isBefore validation', () => {
      const date = new Date('2023-12-31')
      const validator = v.date().isBefore(date)
      expect(validator.test(new Date('2023-12-30'))).toBe(true)
      expect(validator.test(new Date('2023-12-31'))).toBe(false)
      expect(validator.test(new Date('2024-01-01'))).toBe(false)
    })

    test('isAfter validation', () => {
      const date = new Date('2023-01-01')
      const validator = v.date().isAfter(date)
      expect(validator.test(new Date('2023-01-02'))).toBe(true)
      expect(validator.test(new Date('2023-01-01'))).toBe(false)
      expect(validator.test(new Date('2022-12-31'))).toBe(false)
    })

    test('isToday validation', () => {
      const validator = v.date().isToday()
      expect(validator.test(new Date())).toBe(true)
      expect(validator.test(new Date('2023-01-01'))).toBe(false)
    })

    test('isWeekend validation', () => {
      const validator = v.date().isWeekend()
      // Saturday
      expect(validator.test(new Date('2023-01-07'))).toBe(true)
      // Sunday
      expect(validator.test(new Date('2023-01-08'))).toBe(true)
      // Monday
      expect(validator.test(new Date('2023-01-09'))).toBe(false)
    })

    test('isWeekday validation', () => {
      const validator = v.date().isWeekday()
      // Monday
      expect(validator.test(new Date('2023-01-09'))).toBe(true)
      // Friday
      expect(validator.test(new Date('2023-01-13'))).toBe(true)
      // Saturday
      expect(validator.test(new Date('2023-01-07'))).toBe(false)
      // Sunday
      expect(validator.test(new Date('2023-01-08'))).toBe(false)
    })

    test('custom date validation', () => {
      const validator = v.date().custom(
        date => date.getFullYear() >= 2023,
        'Must be in 2023 or later',
      )
      expect(validator.test(new Date('2023-01-01'))).toBe(true)
      expect(validator.test(new Date('2022-12-31'))).toBe(false)
    })
  })

  describe('Object Validator', () => {
    test('basic object validation', () => {
      const validator = v.object()
      expect(validator.test({})).toBe(true)
      expect(validator.test({ foo: 'bar' })).toBe(true)
      expect(validator.test(null as any)).toBe(false)
      expect(validator.test([] as any)).toBe(false)
      expect(validator.test('not an object' as any)).toBe(false)
    })

    test('shape validation', () => {
      const validator = v.object().shape({
        name: v.string().min(2),
        age: v.number().min(18),
        email: v.string().email(),
      })

      expect(validator.test({
        name: 'John',
        age: 25,
        email: 'john@example.com',
      })).toBe(true)

      expect(validator.test({
        name: 'J', // too short
        age: 25,
        email: 'john@example.com',
      })).toBe(false)

      expect(validator.test({
        name: 'John',
        age: 16, // too young
        email: 'john@example.com',
      })).toBe(false)

      expect(validator.test({
        name: 'John',
        age: 25,
        email: 'invalid-email', // invalid email
      })).toBe(false)
    })

    test('nested object validation', () => {
      const validator = v.object().shape({
        user: v.object().shape({
          name: v.string().min(2),
          age: v.number().min(18),
        }),
        settings: v.object().shape({
          theme: v.string(),
          notifications: v.boolean(),
        }),
      })

      expect(validator.test({
        user: {
          name: 'John',
          age: 25,
        },
        settings: {
          theme: 'dark',
          notifications: true,
        },
      })).toBe(true)

      expect(validator.test({
        user: {
          name: 'J', // too short
          age: 25,
        },
        settings: {
          theme: 'dark',
          notifications: true,
        },
      })).toBe(false)
    })

    test('strict mode validation', () => {
      const validator = v.object().shape({
        name: v.string(),
        age: v.number(),
      }).strict()

      expect(validator.test({
        name: 'John',
        age: 25,
      })).toBe(true)

      expect(validator.test({
        name: 'John',
        age: 25,
        extra: 'field', // extra field not allowed in strict mode
      })).toBe(false)
    })

    test('complex object validation', () => {
      const validator = v.object().shape({
        name: v.string().min(2).max(50),
        email: v.string().email(),
        age: v.number().min(18).integer(),
        website: v.string().url().optional(),
        tags: v.array<string>().each(v.string()).optional(),
        address: v.object().shape({
          street: v.string(),
          city: v.string(),
          zip: v.string(),
        }).optional(),
      })

      expect(validator.test({
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
        website: 'https://example.com',
        tags: ['developer', 'typescript'],
        address: {
          street: '123 Main St',
          city: 'New York',
          zip: '10001',
        },
      })).toBe(true)

      const result = validator.validate({
        name: 'J', // too short
        email: 'invalid-email',
        age: 16, // too young
        website: 'not-a-url',
        tags: [123], // invalid tag type
        address: {
          street: '123 Main St',
          city: 'New York',
          zip: '10001',
        },
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toHaveLength(5)

      // Check specific error messages
      const errorMessages = result.errors.map(e => e.message)
      expect(errorMessages).toContain('name: Must be at least 2 characters long') // name too short
      expect(errorMessages).toContain('email: Must be a valid email address') // invalid email
      expect(errorMessages).toContain('age: Must be at least 18') // age too young
      expect(errorMessages).toContain('website: Must be a valid URL') // invalid URL
      expect(errorMessages).toContain('tags: Each item in array is invalid') // invalid array item type
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

  describe('custom validation', () => {
    test('should validate using custom validation function', () => {
      const result = v.custom(
        (value: string) => value.startsWith('test-'),
        'Must start with "test-"',
      ).validate('test-123')

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    test('should fail with custom error message', () => {
      const result = v.custom(
        (value: string) => value.startsWith('test-'),
        'Must start with "test-"',
      ).validate('invalid-123')

      expect(result.valid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].message).toBe('Must start with "test-"')
    })

    test('should handle optional values', () => {
      const result = v.custom(
        (value: string) => value.startsWith('test-'),
        'Must start with "test-"',
      ).optional().validate(undefined)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })
})
