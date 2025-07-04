import type { ValidationError, ValidationErrorMap, ValidationErrors } from '../src/types'
import { describe, expect, test } from 'bun:test'
import { v } from '../src/validation'

// Add type guard functions at the top
function isValidationErrorArray(errors: ValidationErrors): errors is ValidationError[] {
  return Array.isArray(errors)
}

function isValidationErrorMap(errors: ValidationErrors): errors is ValidationErrorMap {
  return !Array.isArray(errors)
}

describe('Validation Library', () => {
  describe('String Validator', () => {
    test('basic string validation', () => {
      const validator = v.string()
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('123')).toBe(true)
      expect(validator.test('')).toBe(true)
    })

    test('required string validation', () => {
      const validator = v.string().min(1).required()
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('123')).toBe(true)
      expect(validator.test('')).toBe(false)
      expect(validator.test(null as any)).toBe(false)
      expect(validator.test(undefined as any)).toBe(false)
    })

    test('optional string validation', () => {
      const validator = v.string().optional()
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('123')).toBe(true)
      expect(validator.test('')).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
    })

    test('required string with other validations', () => {
      const validator = v.string().min(3).max(10).required()
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('hi')).toBe(false) // too short
      expect(validator.test('hello world')).toBe(false) // too long
      expect(validator.test('')).toBe(false) // required
      expect(validator.test(null as any)).toBe(false) // required
    })

    test('optional string with other validations', () => {
      const validator = v.string().optional().min(3).max(10)
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('hi')).toBe(false) // too short
      expect(validator.test('hello world')).toBe(false) // too long
      expect(validator.test('')).toBe(true) // optional
      expect(validator.test(null as any)).toBe(true) // optional
      expect(validator.test(undefined as any)).toBe(true) // optional
    })

    test('required string validation with detailed errors', () => {
      const validator = v.string().required()
      const result = validator.validate('')
      expect(result.valid).toBe(false)
      if (isValidationErrorArray(result.errors)) {
        expect(result.errors[0].message).toBe('This field is required')
      }
    })

    test('required string validation with null', () => {
      const validator = v.string().required()
      const result = validator.validate(null as any)
      expect(result.valid).toBe(false)
      if (isValidationErrorArray(result.errors)) {
        expect(result.errors[0].message).toBe('This field is required')
      }
    })

    test('required string validation with undefined', () => {
      const validator = v.string().required()
      const result = validator.validate(undefined as any)
      expect(result.valid).toBe(false)
      if (isValidationErrorArray(result.errors)) {
        expect(result.errors[0].message).toBe('This field is required')
      }
    })

    test('optional string validation with empty values', () => {
      const validator = v.string().optional()
      expect(validator.validate('').valid).toBe(true)
      expect(validator.validate(null as any).valid).toBe(true)
      expect(validator.validate(undefined as any).valid).toBe(true)
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

    test('equals validation - useful for password confirmation', () => {
      const password = 'mySecurePassword123'
      const validator = v.string().equals(password)

      expect(validator.test(password)).toBe(true)
      expect(validator.test('differentPassword')).toBe(false)

      // Test with empty strings
      const emptyValidator = v.string().equals('')
      expect(emptyValidator.test('')).toBe(true)
      expect(emptyValidator.test('not-empty')).toBe(false)
    })

    test('complex object shape validation with multiple errors per field', () => {
      const formValidator = v.object().shape({
        name: v.string().min(20),
        email: v.string().email(),
        password: v.password()
          .min(8)
          .alphanumeric()
          .hasUppercase()
          .hasSpecialCharacters(),
      })

      // Test invalid data
      const testPassword = '123456' // Only numbers, no letters
      const result = formValidator.validate({
        name: 'John', // too short
        email: 'invalid.email', // invalid email
        password: testPassword, // too short, only numbers, no uppercase, no special chars
      })

      expect(result.valid).toBe(false)
      if (isValidationErrorMap(result.errors)) {
        // Name validation
        expect(result.errors.name).toBeDefined()
        expect(result.errors.name?.length).toBe(1)
        expect(result.errors.name?.[0].message).toBe('Must be at least 20 characters long')

        // Email validation
        expect(result.errors.email).toBeDefined()
        expect(result.errors.email?.length).toBe(1)
        expect(result.errors.email?.[0].message).toBe('Must be a valid email address')

        // Password validation - should have multiple errors
        expect(result.errors.password).toBeDefined()
        expect(result.errors.password?.length).toBeGreaterThan(2)
        const passwordErrors = result.errors.password?.map((e: ValidationError) => e.message)
        expect(passwordErrors).toContain('Password must be at least 8 characters long')
        expect(passwordErrors).toContain('Password must contain both letters and numbers')
        expect(passwordErrors).toContain('Password must contain at least one uppercase letter')
        expect(passwordErrors).toContain('Password must contain at least one special character')

        // Test total number of error fields
        expect(Object.keys(result.errors).length).toBe(3)
      }

      // Test with valid data
      const validPassword = 'ValidP@ss123'
      const validResult = formValidator.validate({
        name: 'This is a name that is definitely long enough',
        email: 'valid@email.com',
        password: validPassword,
      })

      expect(validResult.valid).toBe(true)
      if (isValidationErrorMap(validResult.errors)) {
        expect(Object.keys(validResult.errors)).toHaveLength(0)
      }
    })
  })

  describe('Password Validator', () => {
    test('basic password validation', () => {
      const validator = v.password()
      expect(validator.test('password123')).toBe(true)
      expect(validator.test('')).toBe(true)
      expect(validator.test(123 as any)).toBe(false)
    })

    test('password matching validation', () => {
      const originalPassword = 'MySecureP@ss123'

      const validator = v.password().matches(originalPassword)

      expect(validator.test(originalPassword)).toBe(true)
      expect(validator.test('DifferentP@ss123')).toBe(false)
    })

    test('password length validation', () => {
      const validator = v.password().min(8).max(20)

      const result = validator.validate('123')

      expect(result.valid).toBe(false)
      if (isValidationErrorArray(result.errors)) {
        expect(result.errors[0].message).toBe('Password must be at least 8 characters long')
      }

      expect(validator.test('Secure123')).toBe(true)
      expect(validator.test('Short1')).toBe(false)
      expect(validator.test('ThisPasswordIsWayTooLongToBeValid123')).toBe(false)
    })

    test('password character requirements', () => {
      const validator = v.password()
        .hasUppercase()
        .hasLowercase()
        .hasNumbers()
        .hasSpecialCharacters()

      // Valid password with all requirements
      expect(validator.test('MySecureP@ss123')).toBe(true)

      // Missing uppercase
      expect(validator.test('mysecurep@ss123')).toBe(false)

      // Missing lowercase
      expect(validator.test('MYSECUREP@SS123')).toBe(false)

      // Missing numbers
      expect(validator.test('MySecureP@ssword')).toBe(false)

      // Missing special characters
      expect(validator.test('MySecurePass123')).toBe(false)
    })

    test('comprehensive password validation with multiple rules', () => {
      const validator = v.password()
        .min(8)
        .max(20)
        .hasUppercase()
        .hasLowercase()
        .hasNumbers()
        .hasSpecialCharacters()

      const result = validator.validate('weak')
      expect(result.valid).toBe(false)

      if (isValidationErrorMap(result.errors)) {
        expect(Object.keys(result.errors)).toContain('password')
        expect(result.errors.password?.length).toBeGreaterThan(0)

        // Check specific error messages
        const errorMessages = result.errors.password?.map((e: ValidationError) => e.message) || []
        expect(errorMessages).toContain('Password must be at least 8 characters long')
        expect(errorMessages).toContain('Password must contain at least one uppercase letter')
        expect(errorMessages).toContain('Password must contain at least one number')
        expect(errorMessages).toContain('Password must contain at least one special character')
      }

      // Test a valid password
      const validResult = validator.validate('MySecureP@ss123')
      expect(validResult.valid).toBe(true)
      if (isValidationErrorMap(validResult.errors)) {
        expect(Object.keys(validResult.errors)).toHaveLength(0)
      }
    })

    test('alphanumeric password validation', () => {
      const validator = v.password().alphanumeric()
      expect(validator.test('Password123')).toBe(true)
      expect(validator.test('Password@123')).toBe(true)
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
      const validator = v.float()
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
      const validator = v.enum(['red', 'green', 'blue'])
      expect(validator.test('red')).toBe(true)
      expect(validator.test('green')).toBe(true)
      expect(validator.test('blue')).toBe(true)
      expect(validator.test('yellow' as any)).toBe(false)
      expect(validator.test(123 as any)).toBe(false)
    })

    test('custom enum validation', () => {
      const validator = v.enum(['admin', 'user', 'guest']).custom(
        value => value !== 'guest',
        'Guest access is not allowed',
      )
      expect(validator.test('admin')).toBe(true)
      expect(validator.test('user')).toBe(true)
      expect(validator.test('guest')).toBe(false)
    })

    test('enum validation with readonly array', () => {
      const roles = ['admin', 'user', 'guest']
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
  })

  describe('Datetime Validator', () => {
    test('datetime validation', () => {
      const validator = v.datetime()
      // Valid dates within MySQL DATETIME range
      expect(validator.test(new Date('1000-01-01'))).toBe(true)
      expect(validator.test(new Date('2023-01-01'))).toBe(true)
      expect(validator.test(new Date('9999-12-31'))).toBe(true)

      // Invalid dates outside MySQL DATETIME range
      expect(validator.test(new Date('0999-12-31'))).toBe(false)
      expect(validator.test(new Date('10000-01-01'))).toBe(false)

      // Invalid inputs
      expect(validator.test('2023-01-01' as any)).toBe(false)
      expect(validator.test(123 as any)).toBe(false)
      expect(validator.test(new Date('invalid'))).toBe(false)
    })
  })

  describe('Object Validator', () => {
    test('basic object validation', () => {
      const validator = v.object().required()
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
      if (isValidationErrorMap(result.errors)) {
        expect(Object.keys(result.errors).length).toBe(5)
        // Check specific error messages
        expect(result.errors.name?.[0].message).toBe('Must be at least 2 characters long')
        expect(result.errors.email?.[0].message).toBe('Must be a valid email address')
        expect(result.errors.age?.[0].message).toBe('Must be at least 18')
        expect(result.errors.website?.[0].message).toBe('Must be a valid URL')
        expect(result.errors.tags?.[0].message).toBe('Each item in array is invalid')
      }
    })
  })

  describe('Validation Results', () => {
    test('validate returns detailed results', () => {
      const validator = v.string().min(5).max(10)
      const result = validator.validate('hi')
      expect(result.valid).toBe(false)
      if (isValidationErrorMap(result.errors)) {
        expect(Object.keys(result.errors)).toContain('name')
        expect(result.errors.name?.length).toBe(1)
        expect(result.errors.name?.[0].message).toBe('Must be at least 5 characters long')
      }
    })

    test('multiple validation errors', () => {
      const validator = v.string().min(5).max(10).alphanumeric()
      const result = validator.validate('hi!')
      expect(result.valid).toBe(false)
      if (isValidationErrorMap(result.errors)) {
        expect(Object.keys(result.errors)).toContain('username')
        expect(result.errors.username?.length).toBeGreaterThan(1)

        const errorMessages = result.errors.username?.map(e => e.message) || []
        expect(errorMessages).toContain('Must be at least 5 characters long')
        expect(errorMessages).toContain('Must only contain letters and numbers')
      }
    })
  })

  describe('custom validation', () => {
    test('should validate using custom validation function', () => {
      const result = v.custom(
        (value: string) => value.startsWith('test-'),
        'Must start with "test-"',
      ).validate('invalid-123')

      expect(result.valid).toBe(false)
      if (isValidationErrorMap(result.errors)) {
        expect(result.errors.custom?.[0].message).toBe('Must start with "test-"')
      }
    })

    test('should fail with custom error message', () => {
      const result = v.custom(
        (value: string) => value.startsWith('test-'),
        'Must start with "test-"',
      ).validate('invalid-123')

      expect(result.valid).toBe(false)
      if (isValidationErrorMap(result.errors)) {
        expect(result.errors.custom?.[0].message).toBe('Must start with "test-"')
      }
    })

    test('should handle optional values', () => {
      const result = v.custom(
        (value: string) => value.startsWith('test-'),
        'Must start with "test-"',
      ).optional().validate(undefined as any)

      expect(result.valid).toBe(true)
    })
  })

  describe('Timestamp Validator', () => {
    test('timestamp validation', () => {
      const validator = v.timestamp()
      // Valid timestamps within MySQL TIMESTAMP range
      expect(validator.test(0)).toBe(true) // 1970-01-01 00:00:00 UTC
      expect(validator.test(1683912345)).toBe(true)
      expect(validator.test(2147483647)).toBe(true) // 2038-01-19 03:14:07 UTC

      // Invalid timestamps outside MySQL TIMESTAMP range
      expect(validator.test(-1)).toBe(false)
      expect(validator.test(2147483648)).toBe(false)

      // Invalid inputs
      expect(validator.test('abc')).toBe(false)
      expect(validator.test('123456789')).toBe(false) // too short
      expect(validator.test('12345678901234')).toBe(false) // too long
    })
  })

  describe('Unix Validator', () => {
    test('unix timestamp validation', () => {
      const validator = v.unix()
      // Valid Unix timestamps (seconds)
      expect(validator.test(0)).toBe(true) // 1970-01-01 00:00:00 UTC
      expect(validator.test(1683912345)).toBe(true)
      expect(validator.test('1683912345')).toBe(true)

      // Valid Unix timestamps (milliseconds)
      expect(validator.test(1683912345000)).toBe(true)
      expect(validator.test('1683912345000')).toBe(true)

      // Invalid Unix timestamps
      expect(validator.test(-1)).toBe(false) // negative
      expect(validator.test('123456789')).toBe(false) // too short
      expect(validator.test('12345678901234')).toBe(false) // too long
      expect(validator.test('abc')).toBe(false) // invalid string
    })
  })
})
