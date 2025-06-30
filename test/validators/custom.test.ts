import { describe, expect, test } from 'bun:test'
import { custom } from '../../src/validators/custom'

describe('CustomValidator', () => {
  describe('basic validation', () => {
    test('should validate using custom function', () => {
      const validator = custom((value: any) => typeof value === 'string' && value.length > 0, 'Must be non-empty string')

      expect(validator.test('hello')).toBe(true)
      expect(validator.test('world')).toBe(true)
      expect(validator.test('')).toBe(true) // empty string is valid when optional
      expect(validator.test(123 as any)).toBe(false)
      expect(validator.test(null as any)).toBe(true) // null/undefined are allowed by default
      expect(validator.test(undefined as any)).toBe(true) // null/undefined are allowed by default
    })

    test('should have correct name', () => {
      const validator = custom(() => true, 'Always valid')
      expect(validator.name).toBe('custom')
    })
  })

  describe('custom error messages', () => {
    test('should use custom error message', () => {
      const validator = custom(
        (value: any) => typeof value === 'number' && value > 0,
        'Must be a positive number',
      )

      const result = validator.validate(-5)
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors[0].message).toBe('Must be a positive number')
      }
    })

    test('should use provided error message', () => {
      const validator = custom((value: any) => value === 'valid', 'Must be valid')

      const result = validator.validate('invalid')
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors[0].message).toBe('Must be valid')
      }
    })
  })

  describe('complex validation scenarios', () => {
    test('should validate email format', () => {
      const emailValidator = custom(
        (value: any) => {
          if (typeof value !== 'string')
            return false
          const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
          return emailRegex.test(value)
        },
        'Must be a valid email address',
      )

      expect(emailValidator.test('user@example.com')).toBe(true)
      expect(emailValidator.test('test.email+tag@domain.co.uk')).toBe(true)
      expect(emailValidator.test('invalid-email')).toBe(false)
      expect(emailValidator.test('user@')).toBe(false)
      expect(emailValidator.test('@domain.com')).toBe(false)
      expect(emailValidator.test(123 as any)).toBe(false)
    })

    test('should validate password strength', () => {
      const passwordValidator = custom(
        (value: any) => {
          if (typeof value !== 'string')
            return false
          return value.length >= 8
            && /[A-Z]/.test(value)
            && /[a-z]/.test(value)
            && /[0-9]/.test(value)
            && /[^A-Z0-9]/i.test(value)
        },
        'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
      )

      expect(passwordValidator.test('StrongPass123!')).toBe(true)
      expect(passwordValidator.test('MySecure@Pass1')).toBe(true)
      expect(passwordValidator.test('weak')).toBe(false)
      expect(passwordValidator.test('NoNumbers!')).toBe(false)
      expect(passwordValidator.test('nonumbers123!')).toBe(false)
      expect(passwordValidator.test('NoSpecial123')).toBe(false)
    })

    test('should validate array conditions', () => {
      const arrayValidator = custom(
        (value: any) => {
          return Array.isArray(value)
            && value.length > 0
            && value.every((item: any) => typeof item === 'string')
        },
        'Must be a non-empty array of strings',
      )

      expect(arrayValidator.test(['hello', 'world'])).toBe(true)
      expect(arrayValidator.test(['single'])).toBe(true)
      expect(arrayValidator.test([])).toBe(false)
      expect(arrayValidator.test(['mixed', 123] as any)).toBe(false)
      expect(arrayValidator.test('not-array' as any)).toBe(false)
      expect(arrayValidator.test(null as any)).toBe(true) // null is valid when validator is optional
    })

    test('should validate object properties', () => {
      const objectValidator = custom(
        (value: any) => {
          return typeof value === 'object'
            && value !== null
            && 'name' in value
            && 'age' in value
            && typeof value.name === 'string'
            && typeof value.age === 'number'
            && value.age >= 0
        },
        'Must be an object with name (string) and age (non-negative number)',
      )

      expect(objectValidator.test({ name: 'John', age: 30 })).toBe(true)
      expect(objectValidator.test({ name: 'Jane', age: 0 })).toBe(true)
      expect(objectValidator.test({ name: 'Bob', age: -1 })).toBe(false)
      expect(objectValidator.test({ name: 'Alice' })).toBe(false)
      expect(objectValidator.test({ age: 25 })).toBe(false)
      expect(objectValidator.test({ name: 123, age: 30 } as any)).toBe(false)
      expect(objectValidator.test(null as any)).toBe(true) // null is valid when validator is optional
    })
  })

  describe('required and optional', () => {
    test('required() should reject null/undefined', () => {
      const validator = custom((value: any) => typeof value === 'string', 'Must be a string').required()

      expect(validator.test('hello')).toBe(true)
      expect(validator.test(null as any)).toBe(false)
      expect(validator.test(undefined as any)).toBe(false)
      expect(validator.test(123 as any)).toBe(false)
    })

    test('optional() should accept null/undefined', () => {
      const validator = custom((value: any) => typeof value === 'string', 'Must be a string').optional()

      expect(validator.test('hello')).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
      expect(validator.test(123 as any)).toBe(false) // still fails custom validation
    })

    test('should work with complex validation when optional', () => {
      const validator = custom(
        (value: any) => typeof value === 'number' && value > 0,
        'Must be positive number',
      ).optional()

      expect(validator.test(5)).toBe(true)
      expect(validator.test(null as any)).toBe(true) // optional
      expect(validator.test(undefined as any)).toBe(true) // optional
      expect(validator.test(-5)).toBe(false) // fails custom validation
      expect(validator.test('5' as any)).toBe(false) // wrong type
    })
  })

  describe('complex custom validations', () => {
    test('should handle multiple validation criteria in one function', () => {
      const validator = custom(
        (value: any) => {
          return typeof value === 'string'
            && value.length >= 3
            && /^[A-Z]+$/i.test(value)
        },
        'Must be a string with at least 3 letters only',
      )

      expect(validator.test('hello')).toBe(true)
      expect(validator.test('abc')).toBe(true)
      expect(validator.test('ab')).toBe(false) // too short
      expect(validator.test('hello123')).toBe(false) // contains numbers
      expect(validator.test(123 as any)).toBe(false) // not a string
    })

    test('should provide detailed error message for complex validation', () => {
      const validator = custom(
        (value: any) => typeof value === 'string' && value.length >= 5,
        'Must be a string with at least 5 characters',
      )

      const result = validator.validate(123 as any)
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors[0].message).toBe('Must be a string with at least 5 characters')
      }
    })
  })

  describe('real-world validation scenarios', () => {
    test('should validate credit card numbers', () => {
      const creditCardValidator = custom(
        (value: any) => {
          if (typeof value !== 'string')
            return false
          const cleaned = value.replace(/\D/g, '')
          return cleaned.length >= 13 && cleaned.length <= 19
        },
        'Must be a valid credit card number',
      )

      expect(creditCardValidator.test('4111111111111111')).toBe(true) // Visa
      expect(creditCardValidator.test('4111-1111-1111-1111')).toBe(true) // With dashes
      expect(creditCardValidator.test('4111 1111 1111 1111')).toBe(true) // With spaces
      expect(creditCardValidator.test('411111111111')).toBe(false) // Too short
      expect(creditCardValidator.test('41111111111111111111')).toBe(false) // Too long
      expect(creditCardValidator.test('not-a-number')).toBe(false)
    })

    test('should validate phone numbers', () => {
      const phoneValidator = custom(
        (value: any) => {
          if (typeof value !== 'string')
            return false
          const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
          return phoneRegex.test(value)
        },
        'Must be a valid phone number',
      )

      expect(phoneValidator.test('+1234567890')).toBe(true)
      expect(phoneValidator.test('(555) 123-4567')).toBe(true)
      expect(phoneValidator.test('555-123-4567')).toBe(true)
      expect(phoneValidator.test('5551234567')).toBe(true)
      expect(phoneValidator.test('123')).toBe(false) // Too short
      expect(phoneValidator.test('not-a-phone')).toBe(false)
    })

    test('should validate URL formats', () => {
      const urlValidator = custom(
        (value: any) => {
          if (typeof value !== 'string')
            return false
          try {
            // eslint-disable-next-line no-new
            new URL(value)
            return true
          }
          catch {
            return false
          }
        },
        'Must be a valid URL',
      )

      expect(urlValidator.test('https://example.com')).toBe(true)
      expect(urlValidator.test('http://localhost:3000')).toBe(true)
      expect(urlValidator.test('https://sub.domain.com/path?query=value')).toBe(true)
      expect(urlValidator.test('ftp://files.example.com')).toBe(true)
      expect(urlValidator.test('not-a-url')).toBe(false)
      expect(urlValidator.test('http://')).toBe(false)
      expect(urlValidator.test('')).toBe(true) // empty string is valid when validator is optional
    })

    test('should validate JSON strings', () => {
      const jsonValidator = custom(
        (value: any) => {
          if (typeof value !== 'string')
            return false
          try {
            JSON.parse(value)
            return true
          }
          catch {
            return false
          }
        },
        'Must be valid JSON',
      )

      expect(jsonValidator.test('{"name": "John", "age": 30}')).toBe(true)
      expect(jsonValidator.test('["apple", "banana", "cherry"]')).toBe(true)
      expect(jsonValidator.test('"simple string"')).toBe(true)
      expect(jsonValidator.test('123')).toBe(true)
      expect(jsonValidator.test('true')).toBe(true)
      expect(jsonValidator.test('null')).toBe(true)
      expect(jsonValidator.test('{invalid json}')).toBe(false)
      expect(jsonValidator.test('undefined')).toBe(false)
    })
  })

  describe('edge cases', () => {
    test('should handle functions that throw errors', () => {
      const throwingValidator = custom((value: any) => {
        if (value === 'throw') {
          throw new Error('Validation function threw an error')
        }
        return value === 'valid'
      }, 'Must be valid')

      expect(throwingValidator.test('valid')).toBe(true)
      expect(throwingValidator.test('invalid')).toBe(false)
      // Should handle thrown errors gracefully - but currently throws
      expect(() => throwingValidator.test('throw')).toThrow('Validation function threw an error')
    })

    test('should handle async-like validation functions', () => {
      const validator = custom((value: any) => {
        // Simulate some complex validation logic
        if (typeof value !== 'string')
          return false
        return value.split('').reverse().join('') === value // palindrome check
      }, 'Must be a palindrome')

      expect(validator.test('racecar')).toBe(true)
      expect(validator.test('level')).toBe(true)
      expect(validator.test('hello')).toBe(false)
      expect(validator.test(123 as any)).toBe(false)
    })

    test('should handle validation with complex data structures', () => {
      const complexValidator = custom(
        (value: any) => {
          if (!Array.isArray(value))
            return false
          return value.every(item =>
            typeof item === 'object'
            && item !== null
            && 'id' in item
            && 'name' in item
            && typeof item.id === 'number'
            && typeof item.name === 'string',
          )
        },
        'Must be an array of objects with id (number) and name (string)',
      )

      expect(complexValidator.test([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ])).toBe(true)

      expect(complexValidator.test([])).toBe(true) // empty array is valid

      expect(complexValidator.test([
        { id: 1, name: 'John' },
        { id: '2', name: 'Jane' }, // invalid id type
      ] as any)).toBe(false)

      expect(complexValidator.test([
        { id: 1 }, // missing name
        { id: 2, name: 'Jane' },
      ] as any)).toBe(false)
    })
  })

  describe('validation results', () => {
    test('should return detailed validation results', () => {
      const validator = custom(
        (value: any) => typeof value === 'number' && value > 10,
        'Must be a number greater than 10',
      )

      const result = validator.validate(5)
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors[0].message).toBe('Must be a number greater than 10')
      }
    })

    test('should return success for valid values', () => {
      const validator = custom((value: any) => typeof value === 'string', 'Must be a string')
      const result = validator.validate('hello')

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([]) // errors is an empty array for valid results
    })
  })

  describe('type safety and TypeScript integration', () => {
    test('should work with typed validation functions', () => {
      // This would be enforced by TypeScript in real usage
      const typedValidator = custom<string>(
        (value: string) => value.length > 0,
        'String must not be empty',
      )

      expect(typedValidator.test('hello')).toBe(true)
      expect(typedValidator.test('')).toBe(true) // empty string is valid when validator is optional
    })

    test('should maintain type information through chaining', () => {
      const validator = custom<string>(
        (value: string) => value.length >= 3,
        'Must be at least 3 characters',
      )

      expect(validator.test('test')).toBe(true)
      expect(validator.test('ab')).toBe(false)
      expect(validator.test('')).toBe(true) // empty is valid when optional
    })
  })
})
