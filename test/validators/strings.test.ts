import { describe, expect, test } from 'bun:test'
import { string } from '../../src/validators/strings'

describe('StringValidator', () => {
  describe('basic validation', () => {
    test('should validate strings', () => {
      const validator = string()
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('123')).toBe(true)
      expect(validator.test('')).toBe(true)
      expect(validator.test(123 as any)).toBe(false)
      expect(validator.test(null as any)).toBe(true) // null/undefined are valid when optional
      expect(validator.test(undefined as any)).toBe(true) // null/undefined are valid when optional
      expect(validator.test([] as any)).toBe(false)
      expect(validator.test({} as any)).toBe(false)
    })

    test('should have correct name', () => {
      const validator = string()
      expect(validator.name).toBe('string')
    })
  })

  describe('length validation', () => {
    test('min() should validate minimum length', () => {
      const validator = string().min(5)
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('hello world')).toBe(true)
      expect(validator.test('test')).toBe(false)
      expect(validator.test('')).toBe(true) // empty string is valid when optional
    })

    test('max() should validate maximum length', () => {
      const validator = string().max(5)
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('test')).toBe(true)
      expect(validator.test('')).toBe(true)
      expect(validator.test('hello world')).toBe(false)
    })

    test('length() should validate exact length', () => {
      const validator = string().length(5)
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('world')).toBe(true)
      expect(validator.test('test')).toBe(false)
      expect(validator.test('hello world')).toBe(false)
      expect(validator.test('')).toBe(true) // empty string is valid when optional
    })

    test('should combine min and max', () => {
      const validator = string().min(3).max(8)
      expect(validator.test('test')).toBe(true)
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('testing')).toBe(true)
      expect(validator.test('hi')).toBe(false)
      expect(validator.test('verylongstring')).toBe(false)
    })
  })

  describe('email validation', () => {
    test('should validate emails', () => {
      const validator = string().email()
      expect(validator.test('test@example.com')).toBe(true)
      expect(validator.test('user.name@domain.co.uk')).toBe(true)
      expect(validator.test('user+tag@example.com')).toBe(true)
      expect(validator.test('invalid-email')).toBe(false)
      expect(validator.test('@example.com')).toBe(false)
      expect(validator.test('test@')).toBe(false)
      expect(validator.test('test.example.com')).toBe(false)
    })

    test('should validate emails with options', () => {
      const validator = string().email({ require_tld: false })
      expect(validator.test('test@localhost')).toBe(true)
      expect(validator.test('admin@internal')).toBe(true)
    })
  })

  describe('URL validation', () => {
    test('should validate URLs', () => {
      const validator = string().url()
      expect(validator.test('https://example.com')).toBe(true)
      expect(validator.test('http://test.co.uk')).toBe(true)
      expect(validator.test('ftp://files.example.com')).toBe(true)
      expect(validator.test('invalid-url')).toBe(false)
      expect(validator.test('example.com')).toBe(true) // domain names are valid URLs without protocol
      expect(validator.test('http://')).toBe(false)
    })

    test('should validate URLs with options', () => {
      const validator = string().url({ require_protocol: false })
      expect(validator.test('example.com')).toBe(true)
      expect(validator.test('www.test.com')).toBe(true)
    })
  })

  describe('pattern matching', () => {
    test('matches() should validate regex patterns', () => {
      const validator = string().matches(/^[A-Z]+$/)
      expect(validator.test('HELLO')).toBe(true)
      expect(validator.test('WORLD')).toBe(true)
      expect(validator.test('hello')).toBe(false)
      expect(validator.test('Hello')).toBe(false)
      expect(validator.test('123')).toBe(false)
    })

    test('should work with complex patterns', () => {
      const phoneValidator = string().matches(/^\+?[\d\s\-\(\)]+$/)
      expect(phoneValidator.test('+1 (555) 123-4567')).toBe(true)
      expect(phoneValidator.test('555-123-4567')).toBe(true)
      expect(phoneValidator.test('invalid-phone')).toBe(false)
    })
  })

  describe('equals validation', () => {
    test('equals() should validate exact matches', () => {
      const validator = string().equals('password123')
      expect(validator.test('password123')).toBe(true)
      expect(validator.test('Password123')).toBe(false)
      expect(validator.test('password')).toBe(false)
      expect(validator.test('')).toBe(true) // empty string is valid when validator is optional
    })

    test('should work with empty strings', () => {
      const validator = string().equals('')
      expect(validator.test('')).toBe(true)
      expect(validator.test(' ')).toBe(false)
      expect(validator.test('test')).toBe(false)
    })
  })

  describe('character type validation', () => {
    test('alphanumeric() should validate alphanumeric strings', () => {
      const validator = string().alphanumeric()
      expect(validator.test('abc123')).toBe(true)
      expect(validator.test('ABC')).toBe(true)
      expect(validator.test('123')).toBe(true)
      expect(validator.test('abc-123')).toBe(false)
      expect(validator.test('abc 123')).toBe(false)
      expect(validator.test('abc@123')).toBe(false)
    })

    test('alpha() should validate alphabetic strings', () => {
      const validator = string().alpha()
      expect(validator.test('abc')).toBe(true)
      expect(validator.test('ABC')).toBe(true)
      expect(validator.test('AbC')).toBe(true)
      expect(validator.test('abc123')).toBe(false)
      expect(validator.test('123')).toBe(false)
      expect(validator.test('abc-def')).toBe(false)
    })

    test('numeric() should validate numeric strings', () => {
      const validator = string().numeric()
      expect(validator.test('123')).toBe(true)
      expect(validator.test('0')).toBe(true)
      expect(validator.test('12.34')).toBe(true)
      expect(validator.test('abc')).toBe(false)
      expect(validator.test('123abc')).toBe(false)
      expect(validator.test('12-34')).toBe(false)
    })
  })

  describe('custom validation', () => {
    test('custom() should accept custom validation functions', () => {
      const validator = string().custom(
        value => value.startsWith('prefix_'),
        'Must start with prefix_',
      )
      expect(validator.test('prefix_test')).toBe(true)
      expect(validator.test('prefix_')).toBe(true)
      expect(validator.test('test_prefix')).toBe(false)
      expect(validator.test('prefix')).toBe(false)
    })

    test('should provide custom error messages', () => {
      const validator = string().custom(
        value => value.length > 10,
        'Must be longer than 10 characters',
      )
      const result = validator.validate('short')
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors[0].message).toBe('Must be longer than 10 characters')
      }
    })
  })

  describe('chaining validations', () => {
    test('should chain multiple validations', () => {
      const validator = string()
        .min(8)
        .max(20)
        .alphanumeric()
        .matches(/^[a-z]/i)

      expect(validator.test('TestUser123')).toBe(true)
      expect(validator.test('short')).toBe(false) // too short
      expect(validator.test('verylongusernamethatexceedslimit')).toBe(false) // too long
      expect(validator.test('test@user')).toBe(false) // not alphanumeric
      expect(validator.test('123test')).toBe(false) // doesn't start with letter
    })

    test('should validate all rules in chain', () => {
      const validator = string().min(5).email()
      expect(validator.test('test@example.com')).toBe(true)
      expect(validator.test('a@b.c')).toBe(false) // too short
      expect(validator.test('invalid-email-address')).toBe(false) // not email
    })
  })

  describe('required and optional', () => {
    test('required() should reject empty values', () => {
      const validator = string().required()
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('')).toBe(false)
      expect(validator.test(null as any)).toBe(false)
      expect(validator.test(undefined as any)).toBe(false)
    })

    test('optional() should accept empty values', () => {
      const validator = string().optional()
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('')).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
    })

    test('should work with other validations when optional', () => {
      const validator = string().optional().min(5)
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('')).toBe(true) // optional
      expect(validator.test(null as any)).toBe(true) // optional
      expect(validator.test('hi')).toBe(false) // too short
    })
  })

  describe('validation results', () => {
    test('should return detailed validation results', () => {
      const validator = string().min(5)
      const result = validator.validate('hi')
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors[0].message).toContain('at least 5 characters')
      }
    })

    test('should return multiple errors for multiple failed validations', () => {
      const validator = string().min(10).alphanumeric()
      const result = validator.validate('hi!')
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors.length).toBe(2)
      }
    })
  })

  describe('edge cases', () => {
    test('should handle unicode strings', () => {
      const validator = string().min(3)
      expect(validator.test('héllo')).toBe(true)
      expect(validator.test('🚀🌟✨')).toBe(true)
      expect(validator.test('测试')).toBe(false) // only 2 characters
    })

    test('should handle very long strings', () => {
      const validator = string().max(1000)
      const longString = 'a'.repeat(999)
      const tooLongString = 'a'.repeat(1001)
      expect(validator.test(longString)).toBe(true)
      expect(validator.test(tooLongString)).toBe(false)
    })

    test('should handle special characters in equals', () => {
      const validator = string().equals('special!@#$%^&*()')
      expect(validator.test('special!@#$%^&*()')).toBe(true)
      expect(validator.test('special')).toBe(false)
    })
  })
})
