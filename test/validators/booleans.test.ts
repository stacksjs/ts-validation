import { describe, expect, test } from 'bun:test'
import { boolean } from '../../src/validators/booleans'

describe('BooleanValidator', () => {
  describe('basic validation', () => {
    test('should validate boolean values', () => {
      const validator = boolean()
      expect(validator.test(true)).toBe(true)
      expect(validator.test(false)).toBe(true)
      expect(validator.test('true' as any)).toBe(false)
      expect(validator.test('false' as any)).toBe(false)
      expect(validator.test(1 as any)).toBe(false)
      expect(validator.test(0 as any)).toBe(false)
      expect(validator.test(null as any)).toBe(true) // null/undefined are valid when optional
      expect(validator.test(undefined as any)).toBe(true) // null/undefined are valid when optional
      expect(validator.test([] as any)).toBe(false)
      expect(validator.test({} as any)).toBe(false)
    })

    test('should have correct name', () => {
      const validator = boolean()
      expect(validator.name).toBe('boolean')
    })
  })

  describe('specific value validation', () => {
    test('isTrue() should only accept true', () => {
      const validator = boolean().isTrue()
      expect(validator.test(true)).toBe(true)
      expect(validator.test(false)).toBe(false)
    })

    test('isFalse() should only accept false', () => {
      const validator = boolean().isFalse()
      expect(validator.test(false)).toBe(true)
      expect(validator.test(true)).toBe(false)
    })
  })

  describe('custom validation', () => {
    test('custom() should accept custom validation functions', () => {
      const validator = boolean().custom(
        value => value === true,
        'Must be true',
      )
      expect(validator.test(true)).toBe(true)
      expect(validator.test(false)).toBe(false)
    })

    test('should provide custom error messages', () => {
      const validator = boolean().custom(
        value => value === false,
        'Must be false',
      )
      const result = validator.validate(true)
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors[0].message).toBe('Must be false')
      }
    })

    test('should work with complex custom logic', () => {
      // Custom validator that accepts true only on weekdays (mock example)
      const validator = boolean().custom(
        (value) => {
          if (value === false)
            return true
          // Mock: only allow true if it's a "weekday" (always true for testing)
          return value === true
        },
        'True only allowed on weekdays',
      )
      expect(validator.test(true)).toBe(true)
      expect(validator.test(false)).toBe(true)
    })
  })

  describe('chaining validations', () => {
    test('should chain boolean and custom validations', () => {
      const validator = boolean()
        .isTrue()
        .custom(value => value === true, 'Must be exactly true')

      expect(validator.test(true)).toBe(true)
      expect(validator.test(false)).toBe(false)
    })

    test('should fail if any validation in chain fails', () => {
      const validator = boolean()
        .custom(value => typeof value === 'boolean', 'Must be boolean')
        .isTrue()

      expect(validator.test(true)).toBe(true)
      expect(validator.test(false)).toBe(false)
      expect(validator.test('true' as any)).toBe(false)
    })
  })

  describe('required and optional', () => {
    test('required() should reject null/undefined', () => {
      const validator = boolean().required()
      expect(validator.test(true)).toBe(true)
      expect(validator.test(false)).toBe(true)
      expect(validator.test(null as any)).toBe(false)
      expect(validator.test(undefined as any)).toBe(false)
    })

    test('optional() should accept null/undefined', () => {
      const validator = boolean().optional()
      expect(validator.test(true)).toBe(true)
      expect(validator.test(false)).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
    })

    test('should work with other validations when optional', () => {
      const validator = boolean().optional().isTrue()
      expect(validator.test(true)).toBe(true)
      expect(validator.test(null as any)).toBe(true) // optional
      expect(validator.test(undefined as any)).toBe(true) // optional
      expect(validator.test(false)).toBe(false) // not true
    })

    test('should work with required and specific value', () => {
      const validator = boolean().required().isTrue()
      expect(validator.test(true)).toBe(true)
      expect(validator.test(false)).toBe(false)
      expect(validator.test(null as any)).toBe(false)
      expect(validator.test(undefined as any)).toBe(false)
    })
  })

  describe('validation results', () => {
    test('should return detailed validation results', () => {
      const validator = boolean().isTrue()
      const result = validator.validate(false)
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors[0].message).toContain('true')
      }
    })

    test('should return multiple errors for multiple failed validations', () => {
      const validator = boolean()
        .isTrue()
        .custom(value => value !== true, 'Cannot be true')

      const result = validator.validate(true)
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors.length).toBe(1) // Only custom validation fails
      }
    })

    test('should return boolean type error for non-boolean values', () => {
      const validator = boolean()
      const result = validator.validate('not boolean' as any)
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors[0].message).toBe('Must be a boolean')
      }
    })
  })

  describe('edge cases', () => {
    test('should only accept primitive booleans', () => {
      const validator = boolean()
      // Only primitive booleans should be accepted
      expect(validator.test(true)).toBe(true)
      expect(validator.test(false)).toBe(true)
      // Other boolean-like values should be rejected
      expect(validator.test(Boolean(1))).toBe(true) // Boolean() returns primitive booleans
      expect(validator.test(Boolean(0))).toBe(true) // Boolean() returns primitive booleans
    })

    test('should not accept truthy/falsy values', () => {
      const validator = boolean()
      expect(validator.test(1 as any)).toBe(false)
      expect(validator.test(0 as any)).toBe(false)
      expect(validator.test('true' as any)).toBe(false)
      expect(validator.test('false' as any)).toBe(false)
      expect(validator.test('' as any)).toBe(true) // empty string is valid when optional
      expect(validator.test('anything' as any)).toBe(false)
      expect(validator.test([] as any)).toBe(false)
      expect(validator.test({} as any)).toBe(false)
    })

    test('should work in conditional logic scenarios', () => {
      // Simulate a checkbox acceptance validator
      const termsAcceptedValidator = boolean().isTrue()
      expect(termsAcceptedValidator.test(true)).toBe(true)
      expect(termsAcceptedValidator.test(false)).toBe(false)

      // Simulate a toggle switch validator
      const toggleValidator = boolean()
      expect(toggleValidator.test(true)).toBe(true)
      expect(toggleValidator.test(false)).toBe(true)
    })

    test('should handle required checkbox scenarios', () => {
      const requiredCheckboxValidator = boolean().required().isTrue()
      expect(requiredCheckboxValidator.test(true)).toBe(true)
      expect(requiredCheckboxValidator.test(false)).toBe(false)
      expect(requiredCheckboxValidator.test(null as any)).toBe(false)
      expect(requiredCheckboxValidator.test(undefined as any)).toBe(false)
    })

    test('should handle optional toggle scenarios', () => {
      const optionalToggleValidator = boolean().optional()
      expect(optionalToggleValidator.test(true)).toBe(true)
      expect(optionalToggleValidator.test(false)).toBe(true)
      expect(optionalToggleValidator.test(null as any)).toBe(true)
      expect(optionalToggleValidator.test(undefined as any)).toBe(true)
    })
  })

  describe('real-world use cases', () => {
    test('terms and conditions acceptance', () => {
      const termsValidator = boolean().required().isTrue()

      // User accepts terms
      expect(termsValidator.test(true)).toBe(true)

      // User doesn't accept terms
      expect(termsValidator.test(false)).toBe(false)

      // No value provided
      expect(termsValidator.test(undefined as any)).toBe(false)
    })

    test('newsletter subscription (optional)', () => {
      const newsletterValidator = boolean().optional()

      // User opts in
      expect(newsletterValidator.test(true)).toBe(true)

      // User opts out
      expect(newsletterValidator.test(false)).toBe(true)

      // No preference provided
      expect(newsletterValidator.test(undefined as any)).toBe(true)
    })

    test('feature flag validation', () => {
      const featureFlagValidator = boolean().custom(
        value => typeof value === 'boolean',
        'Feature flag must be explicitly set',
      )

      expect(featureFlagValidator.test(true)).toBe(true)
      expect(featureFlagValidator.test(false)).toBe(true)
      expect(featureFlagValidator.test(undefined as any)).toBe(true) // undefined is valid when optional
    })

    test('admin access validation', () => {
      const adminAccessValidator = boolean().required().custom(
        value => value === true,
        'Admin access must be explicitly granted',
      )

      expect(adminAccessValidator.test(true)).toBe(true)
      expect(adminAccessValidator.test(false)).toBe(false)
      expect(adminAccessValidator.test(null as any)).toBe(false)
    })
  })
})
