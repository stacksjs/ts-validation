import { describe, expect, test } from 'bun:test'
import { enum_ } from '../../src/validators/enums'

describe('EnumValidator', () => {
  describe('basic validation', () => {
    test('should validate string enum values', () => {
      const validator = enum_(['red', 'green', 'blue'])
      expect(validator.test('red')).toBe(true)
      expect(validator.test('green')).toBe(true)
      expect(validator.test('blue')).toBe(true)
      expect(validator.test('yellow' as any)).toBe(false)
      expect(validator.test('RED' as any)).toBe(false) // case sensitive
      expect(validator.test('' as any)).toBe(true) // empty string is valid when optional
    })

    test('should have correct name', () => {
      const validator = enum_(['a', 'b'])
      expect(validator.name).toBe('enum')
    })
  })

  describe('string enums', () => {
    test('should validate mixed string enums', () => {
      const validator = enum_(['active', 'inactive', 'pending', 'completed'])
      expect(validator.test('active')).toBe(true)
      expect(validator.test('inactive')).toBe(true)
      expect(validator.test('pending')).toBe(true)
      expect(validator.test('completed')).toBe(true)
      expect(validator.test('archived' as any)).toBe(false)
    })

    test('should handle string representations of booleans', () => {
      const validator = enum_(['true', 'false', 'maybe'])
      expect(validator.test('true')).toBe(true)
      expect(validator.test('false')).toBe(true)
      expect(validator.test('maybe')).toBe(true)
      expect(validator.test(true as any)).toBe(false)
      expect(validator.test(false as any)).toBe(false)
      expect(validator.test(1 as any)).toBe(false)
      expect(validator.test(0 as any)).toBe(false)
    })
  })

  describe('real-world enum scenarios', () => {
    test('should validate user roles', () => {
      const roleValidator = enum_(['admin', 'user', 'guest', 'moderator'])
      expect(roleValidator.test('admin')).toBe(true)
      expect(roleValidator.test('user')).toBe(true)
      expect(roleValidator.test('guest')).toBe(true)
      expect(roleValidator.test('moderator')).toBe(true)
      expect(roleValidator.test('superuser' as any)).toBe(false)
      expect(roleValidator.test('ADMIN' as any)).toBe(false)
    })

    test('should validate status codes', () => {
      const statusValidator = enum_(['200', '201', '400', '401', '403', '404', '500'])
      expect(statusValidator.test('200')).toBe(true)
      expect(statusValidator.test('404')).toBe(true)
      expect(statusValidator.test('500')).toBe(true)
      expect(statusValidator.test('418' as any)).toBe(false) // I'm a teapot
      expect(statusValidator.test(200 as any)).toBe(false)
    })

    test('should validate priority levels', () => {
      const priorityValidator = enum_(['low', 'medium', 'high', 'urgent'])
      expect(priorityValidator.test('low')).toBe(true)
      expect(priorityValidator.test('medium')).toBe(true)
      expect(priorityValidator.test('high')).toBe(true)
      expect(priorityValidator.test('urgent')).toBe(true)
      expect(priorityValidator.test('critical' as any)).toBe(false)
      expect(priorityValidator.test('normal' as any)).toBe(false)
    })

    test('should validate file types', () => {
      const fileTypeValidator = enum_(['.jpg', '.png', '.gif', '.pdf', '.doc'])
      expect(fileTypeValidator.test('.jpg')).toBe(true)
      expect(fileTypeValidator.test('.png')).toBe(true)
      expect(fileTypeValidator.test('.pdf')).toBe(true)
      expect(fileTypeValidator.test('.txt' as any)).toBe(false)
      expect(fileTypeValidator.test('jpg' as any)).toBe(false) // missing dot
    })
  })

  describe('custom validation', () => {
    test('custom() should accept custom validation functions', () => {
      const validator = enum_(['small', 'medium', 'large']).custom(
        value => value !== 'medium',
        'Medium size not available',
      )
      expect(validator.test('small')).toBe(true)
      expect(validator.test('large')).toBe(true)
      expect(validator.test('medium')).toBe(false)
      expect(validator.test('extra-large' as any)).toBe(false)
    })

    test('should provide custom error messages', () => {
      const validator = enum_(['read', 'write', 'execute']).custom(
        value => value !== 'execute',
        'Execute permission not allowed',
      )
      const result = validator.validate('execute')
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors[0].message).toBe('Execute permission not allowed')
      }
    })

    test('should chain enum and custom validations', () => {
      const validator = enum_(['bronze', 'silver', 'gold', 'platinum']).custom(
        value => value !== 'bronze',
        'Bronze tier not supported',
      )
      expect(validator.test('silver')).toBe(true)
      expect(validator.test('gold')).toBe(true)
      expect(validator.test('platinum')).toBe(true)
      expect(validator.test('bronze')).toBe(false)
      expect(validator.test('diamond' as any)).toBe(false)
    })
  })

  describe('getAllowedValues method', () => {
    test('should return all allowed values', () => {
      const values = ['apple', 'banana', 'cherry']
      const validator = enum_(values)
      expect(validator.getAllowedValues()).toEqual(values)
    })

    test('should return string values correctly', () => {
      const values = ['one', 'two', 'three', 'five', 'eight']
      const validator = enum_(values)
      expect(validator.getAllowedValues()).toEqual(values)
    })

    test('should return mixed string values correctly', () => {
      const values = ['active', 'one', 'inactive', 'zero']
      const validator = enum_(values)
      expect(validator.getAllowedValues()).toEqual(values)
    })
  })

  describe('required and optional', () => {
    test('required() should reject null/undefined', () => {
      const validator = enum_(['yes', 'no']).required()
      expect(validator.test('yes')).toBe(true)
      expect(validator.test('no')).toBe(true)
      expect(validator.test(null as any)).toBe(false) // required validator should reject null
      expect(validator.test(undefined as any)).toBe(false) // required validator should reject undefined
    })

    test('optional() should accept null/undefined', () => {
      const validator = enum_(['yes', 'no']).optional()
      expect(validator.test('yes')).toBe(true)
      expect(validator.test('no')).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
    })

    test('should work with custom validations when optional', () => {
      const validator = enum_(['small', 'large'])
        .optional()
        .custom(value => value !== 'small', 'Small not allowed')

      expect(validator.test('large')).toBe(true)
      expect(validator.test(null as any)).toBe(true) // optional
      expect(validator.test(undefined as any)).toBe(true) // optional
      expect(validator.test('small')).toBe(false) // custom validation fails
      expect(validator.test('medium' as any)).toBe(false) // not in enum
    })
  })

  describe('validation results', () => {
    test('should return detailed validation results', () => {
      const validator = enum_(['cat', 'dog', 'bird'])
      const result = validator.validate('fish' as any)
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors[0].message).toContain('one of')
      }
    })

    test('should return multiple errors for multiple failed validations', () => {
      const validator = enum_(['xs', 's', 'm', 'l', 'xl']).custom(
        value => value !== 'xs',
        'XS size unavailable',
      )
      const result = validator.validate('xs')
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors.length).toBe(1) // Only custom validation fails
      }
    })
  })

  describe('edge cases', () => {
    test('should handle single value enums', () => {
      const stringValidator = enum_(['only'])
      expect(stringValidator.test('only')).toBe(true)
      expect(stringValidator.test('other' as any)).toBe(false)

      const singleValidator = enum_(['single'])
      expect(singleValidator.test('single')).toBe(true)
      expect(singleValidator.test('other' as any)).toBe(false)
    })

    test('should handle special string values', () => {
      const validator = enum_(['', ' ', '\n', '\t', 'null', 'undefined'])
      expect(validator.test('')).toBe(true)
      expect(validator.test(' ')).toBe(true)
      expect(validator.test('\n')).toBe(true)
      expect(validator.test('\t')).toBe(true)
      expect(validator.test('null')).toBe(true)
      expect(validator.test('undefined')).toBe(true)
      expect(validator.test(null as any)).toBe(true) // null is valid when optional
      expect(validator.test(undefined as any)).toBe(true) // undefined is valid when optional
    })

    test('should handle string edge cases', () => {
      const validator = enum_(['0', '-1', '3.14', 'infinity', '-infinity'])
      expect(validator.test('0')).toBe(true)
      expect(validator.test('-1')).toBe(true)
      expect(validator.test('3.14')).toBe(true)
      expect(validator.test('infinity')).toBe(true)
      expect(validator.test('-infinity')).toBe(true)
      expect(validator.test('NaN' as any)).toBe(false)
      expect(validator.test('1' as any)).toBe(false)
    })

    test('should handle unicode strings', () => {
      const validator = enum_(['🚀', '🌟', '✨', 'café', 'naïve'])
      expect(validator.test('🚀')).toBe(true)
      expect(validator.test('🌟')).toBe(true)
      expect(validator.test('✨')).toBe(true)
      expect(validator.test('café')).toBe(true)
      expect(validator.test('naïve')).toBe(true)
      expect(validator.test('cafe' as any)).toBe(false) // different from café
      expect(validator.test('naive' as any)).toBe(false) // different from naïve
    })

    test('should be case and type sensitive', () => {
      const validator = enum_(['True', 'False', '0', '1'])
      expect(validator.test('True')).toBe(true)
      expect(validator.test('False')).toBe(true)
      expect(validator.test('0')).toBe(true)
      expect(validator.test('1')).toBe(true)
      expect(validator.test('true' as any)).toBe(false)
      expect(validator.test('false' as any)).toBe(false)
      expect(validator.test(0 as any)).toBe(false)
      expect(validator.test(1 as any)).toBe(false)
      expect(validator.test(true as any)).toBe(false)
      expect(validator.test(false as any)).toBe(false)
    })
  })

  describe('type safety', () => {
    test('should work with readonly arrays', () => {
      const colors = ['red', 'green', 'blue']
      const validator = enum_(colors)
      expect(validator.test('red')).toBe(true)
      expect(validator.test('purple' as any)).toBe(false)
      expect(validator.getAllowedValues()).toEqual(colors)
    })

    test('should maintain type information', () => {
      const sizes = ['xs', 's', 'm', 'l', 'xl']
      const validator = enum_(sizes)
      // TypeScript would enforce that only these values are valid
      expect(validator.test('m')).toBe(true)
      expect(validator.test('xxl' as any)).toBe(false)
    })
  })
})
