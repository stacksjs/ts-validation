import { describe, expect, test } from 'bun:test'
import isInt from '../../src/lib/isInt'

describe('isInt', () => {
  describe('basic validation', () => {
    test('should validate integer strings', () => {
      expect(isInt('123', {})).toBe(true)
      expect(isInt('0', {})).toBe(true)
      expect(isInt('-123', {})).toBe(true)
      expect(isInt('+123', {})).toBe(true)
      expect(isInt('1000000', {})).toBe(true)
    })

    test('should reject non-integer strings', () => {
      expect(isInt('123.45', {})).toBe(false) // decimal
      expect(isInt('abc', {})).toBe(false) // letters
      expect(isInt('123abc', {})).toBe(false) // mixed
      expect(isInt('', {})).toBe(false) // empty
      expect(isInt(' ', {})).toBe(false) // whitespace only
      expect(isInt('12.0', {})).toBe(false) // decimal with .0
    })

    test('should handle edge cases', () => {
      expect(isInt('000', {})).toBe(true) // leading zeros by default
      expect(isInt('007', {})).toBe(true) // leading zeros
      expect(isInt('+0', {})).toBe(true) // positive zero
      expect(isInt('-0', {})).toBe(true) // negative zero
    })
  })

  describe('leading zeros option', () => {
    test('should allow leading zeros by default', () => {
      expect(isInt('000', {})).toBe(true)
      expect(isInt('007', {})).toBe(true)
      expect(isInt('0123', {})).toBe(true)
      expect(isInt('-007', {})).toBe(true)
      expect(isInt('+007', {})).toBe(true)
    })

    test('should reject leading zeros when allow_leading_zeroes is false', () => {
      expect(isInt('000', { allow_leading_zeroes: false })).toBe(false)
      expect(isInt('007', { allow_leading_zeroes: false })).toBe(false)
      expect(isInt('0123', { allow_leading_zeroes: false })).toBe(false)
      expect(isInt('-007', { allow_leading_zeroes: false })).toBe(false)
      expect(isInt('+007', { allow_leading_zeroes: false })).toBe(false)
    })

    test('should allow single zero even when leading zeros are disabled', () => {
      expect(isInt('0', { allow_leading_zeroes: false })).toBe(true)
      expect(isInt('+0', { allow_leading_zeroes: false })).toBe(true)
      expect(isInt('-0', { allow_leading_zeroes: false })).toBe(true)
    })

    test('should allow non-zero numbers without leading zeros', () => {
      expect(isInt('123', { allow_leading_zeroes: false })).toBe(true)
      expect(isInt('-456', { allow_leading_zeroes: false })).toBe(true)
      expect(isInt('+789', { allow_leading_zeroes: false })).toBe(true)
    })
  })

  describe('min/max validation', () => {
    test('should validate minimum values', () => {
      expect(isInt('10', { min: 5 })).toBe(true) // 10 >= 5
      expect(isInt('5', { min: 5 })).toBe(true) // 5 >= 5
      expect(isInt('4', { min: 5 })).toBe(false) // 4 < 5
      expect(isInt('-10', { min: -5 })).toBe(false) // -10 < -5
      expect(isInt('-5', { min: -5 })).toBe(true) // -5 >= -5
    })

    test('should validate maximum values', () => {
      expect(isInt('10', { max: 15 })).toBe(true) // 10 <= 15
      expect(isInt('15', { max: 15 })).toBe(true) // 15 <= 15
      expect(isInt('16', { max: 15 })).toBe(false) // 16 > 15
      expect(isInt('-5', { max: -1 })).toBe(true) // -5 <= -1
      expect(isInt('0', { max: -1 })).toBe(false) // 0 > -1
    })

    test('should validate range (min and max)', () => {
      expect(isInt('5', { min: 1, max: 10 })).toBe(true) // 1 <= 5 <= 10
      expect(isInt('1', { min: 1, max: 10 })).toBe(true) // boundary
      expect(isInt('10', { min: 1, max: 10 })).toBe(true) // boundary
      expect(isInt('0', { min: 1, max: 10 })).toBe(false) // below min
      expect(isInt('11', { min: 1, max: 10 })).toBe(false) // above max
    })
  })

  describe('lt/gt validation', () => {
    test('should validate less than (lt)', () => {
      expect(isInt('5', { lt: 10 })).toBe(true) // 5 < 10
      expect(isInt('9', { lt: 10 })).toBe(true) // 9 < 10
      expect(isInt('10', { lt: 10 })).toBe(false) // 10 is not < 10
      expect(isInt('11', { lt: 10 })).toBe(false) // 11 > 10
    })

    test('should validate greater than (gt)', () => {
      expect(isInt('15', { gt: 10 })).toBe(true) // 15 > 10
      expect(isInt('11', { gt: 10 })).toBe(true) // 11 > 10
      expect(isInt('10', { gt: 10 })).toBe(false) // 10 is not > 10
      expect(isInt('9', { gt: 10 })).toBe(false) // 9 < 10
    })

    test('should validate strict range (gt and lt)', () => {
      expect(isInt('5', { gt: 1, lt: 10 })).toBe(true) // 1 < 5 < 10
      expect(isInt('2', { gt: 1, lt: 10 })).toBe(true) // 1 < 2 < 10
      expect(isInt('9', { gt: 1, lt: 10 })).toBe(true) // 1 < 9 < 10
      expect(isInt('1', { gt: 1, lt: 10 })).toBe(false) // 1 is not > 1
      expect(isInt('10', { gt: 1, lt: 10 })).toBe(false) // 10 is not < 10
    })
  })

  describe('combined validation options', () => {
    test('should combine leading zeros and range validation', () => {
      expect(isInt('007', { allow_leading_zeroes: false, min: 1, max: 10 })).toBe(false) // leading zeros
      expect(isInt('7', { allow_leading_zeroes: false, min: 1, max: 10 })).toBe(true) // valid
      expect(isInt('0', { allow_leading_zeroes: false, min: 1, max: 10 })).toBe(false) // below min
    })

    test('should combine all validation options', () => {
      const options = {
        allow_leading_zeroes: false,
        min: 5,
        max: 50,
        gt: 4,
        lt: 51,
      }

      expect(isInt('10', options)).toBe(true) // valid
      expect(isInt('5', options)).toBe(true) // min boundary
      expect(isInt('50', options)).toBe(true) // max boundary
      expect(isInt('4', options)).toBe(false) // not > 4
      expect(isInt('51', options)).toBe(false) // not < 51
      expect(isInt('007', options)).toBe(false) // leading zeros
    })
  })

  describe('edge cases', () => {
    test('should handle very large numbers', () => {
      expect(isInt('9007199254740991', {})).toBe(true) // Number.MAX_SAFE_INTEGER
      expect(isInt('999999999999999999999', {})).toBe(true) // beyond safe integer
      expect(isInt('-9007199254740991', {})).toBe(true) // Number.MIN_SAFE_INTEGER
    })

    test('should handle scientific notation strings', () => {
      expect(isInt('1e5', {})).toBe(false) // scientific notation
      expect(isInt('1E5', {})).toBe(false) // scientific notation uppercase
      expect(isInt('1.23e4', {})).toBe(false) // decimal scientific notation
    })

    test('should handle whitespace', () => {
      expect(isInt(' 123', {})).toBe(false) // leading whitespace
      expect(isInt('123 ', {})).toBe(false) // trailing whitespace
      expect(isInt(' 123 ', {})).toBe(false) // surrounding whitespace
      expect(isInt('1 23', {})).toBe(false) // internal whitespace
    })

    test('should handle special characters', () => {
      expect(isInt('123.', {})).toBe(false) // trailing dot
      expect(isInt('.123', {})).toBe(false) // leading dot
      expect(isInt('12,345', {})).toBe(false) // comma separator
      expect(isInt('123_456', {})).toBe(false) // underscore separator
    })

    test('should handle multiple signs', () => {
      expect(isInt('++123', {})).toBe(false) // double positive
      expect(isInt('--123', {})).toBe(false) // double negative
      expect(isInt('+-123', {})).toBe(false) // mixed signs
      expect(isInt('-+123', {})).toBe(false) // mixed signs
    })
  })

  describe('real-world use cases', () => {
    test('should validate user ages', () => {
      expect(isInt('25', { min: 0, max: 150 })).toBe(true)
      expect(isInt('0', { min: 0, max: 150 })).toBe(true) // newborn
      expect(isInt('150', { min: 0, max: 150 })).toBe(true) // very old
      expect(isInt('-1', { min: 0, max: 150 })).toBe(false) // negative age
      expect(isInt('200', { min: 0, max: 150 })).toBe(false) // too old
    })

    test('should validate port numbers', () => {
      expect(isInt('80', { min: 1, max: 65535 })).toBe(true) // HTTP
      expect(isInt('443', { min: 1, max: 65535 })).toBe(true) // HTTPS
      expect(isInt('3000', { min: 1, max: 65535 })).toBe(true) // dev server
      expect(isInt('0', { min: 1, max: 65535 })).toBe(false) // invalid port
      expect(isInt('65536', { min: 1, max: 65535 })).toBe(false) // too high
    })

    test('should validate quantities', () => {
      expect(isInt('1', { min: 1 })).toBe(true) // minimum quantity
      expect(isInt('100', { min: 1 })).toBe(true) // bulk quantity
      expect(isInt('0', { min: 1 })).toBe(false) // zero quantity
      expect(isInt('-5', { min: 1 })).toBe(false) // negative quantity
    })

    test('should validate pagination parameters', () => {
      expect(isInt('1', { min: 1 })).toBe(true) // first page
      expect(isInt('10', { min: 1 })).toBe(true) // valid page
      expect(isInt('0', { min: 1 })).toBe(false) // invalid page
      expect(isInt('-1', { min: 1 })).toBe(false) // negative page
    })

    test('should validate year values', () => {
      expect(isInt('2023', { min: 1900, max: 2100 })).toBe(true) // current year
      expect(isInt('1950', { min: 1900, max: 2100 })).toBe(true) // past year
      expect(isInt('2050', { min: 1900, max: 2100 })).toBe(true) // future year
      expect(isInt('1899', { min: 1900, max: 2100 })).toBe(false) // too old
      expect(isInt('2101', { min: 1900, max: 2100 })).toBe(false) // too far future
    })
  })

  describe('parameter validation', () => {
    test('should handle non-string inputs gracefully', () => {
      expect(() => isInt(123 as any, {})).toThrow() // number
      expect(() => isInt(null as any, {})).toThrow() // null
      expect(() => isInt(undefined as any, {})).toThrow() // undefined
      expect(() => isInt([] as any, {})).toThrow() // array
      expect(() => isInt({} as any, {})).toThrow() // object
    })

    test('should handle missing options object', () => {
      expect(isInt('123', {})).toBe(true)
      expect(isInt('123', undefined as any)).toBe(true) // undefined options
    })

    test('should handle partial options objects', () => {
      expect(isInt('123', { min: 100 })).toBe(true) // only min
      expect(isInt('123', { max: 200 })).toBe(true) // only max
      expect(isInt('123', { allow_leading_zeroes: false })).toBe(true) // only leading zeros
    })
  })

  describe('performance considerations', () => {
    test('should handle many validations efficiently', () => {
      const numbers = Array.from({ length: 1000 }, (_, i) => i.toString())

      const start = Date.now()
      numbers.forEach(num => isInt(num, { min: 0, max: 1000 }))
      const end = Date.now()

      expect(end - start).toBeLessThan(100) // Should complete in under 100ms
    })

    test('should handle very long number strings efficiently', () => {
      const longNumber = '1'.repeat(1000) // 1000 digit number

      const start = Date.now()
      isInt(longNumber, {})
      const end = Date.now()

      expect(end - start).toBeLessThan(50) // Should complete quickly
    })
  })

  describe('boundary value testing', () => {
    test('should handle JavaScript number limits', () => {
      const maxSafeInt = '9007199254740991' // Number.MAX_SAFE_INTEGER
      const minSafeInt = '-9007199254740991' // Number.MIN_SAFE_INTEGER

      expect(isInt(maxSafeInt, {})).toBe(true)
      expect(isInt(minSafeInt, {})).toBe(true)

      // Beyond safe integer limits - still valid as strings
      expect(isInt('9007199254740992', {})).toBe(true)
      expect(isInt('-9007199254740992', {})).toBe(true)
    })

    test('should handle zero in various forms', () => {
      expect(isInt('0', {})).toBe(true)
      expect(isInt('+0', {})).toBe(true)
      expect(isInt('-0', {})).toBe(true)
      expect(isInt('00', {})).toBe(true) // with leading zero
      expect(isInt('000', {})).toBe(true) // multiple leading zeros
    })

    test('should handle boundary conditions for options', () => {
      // Test exact boundaries
      expect(isInt('10', { min: 10 })).toBe(true) // exactly min
      expect(isInt('10', { max: 10 })).toBe(true) // exactly max
      expect(isInt('10', { gt: 9 })).toBe(true) // just above gt
      expect(isInt('10', { lt: 11 })).toBe(true) // just below lt

      // Test boundary failures
      expect(isInt('9', { min: 10 })).toBe(false) // just below min
      expect(isInt('11', { max: 10 })).toBe(false) // just above max
      expect(isInt('10', { gt: 10 })).toBe(false) // equal to gt
      expect(isInt('10', { lt: 10 })).toBe(false) // equal to lt
    })
  })
})
