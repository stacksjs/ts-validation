import { describe, expect, test } from 'bun:test'
import { unix } from '../../src/validators/unix'

describe('UnixValidator', () => {
  describe('basic validation', () => {
    test('should validate valid Unix timestamps', () => {
      const validator = unix()

      // Valid Unix timestamps
      expect(validator.test(0)).toBe(true) // Unix epoch
      expect(validator.test(1609459200)).toBe(true) // 2021-01-01 00:00:00 UTC
      expect(validator.test(2147483647)).toBe(true) // 2038-01-19 03:14:07 UTC
      expect(validator.test(4102444800)).toBe(true) // 2100-01-01 00:00:00 UTC

      // String timestamps (must be 10-13 digits)
      expect(validator.test('1609459200')).toBe(true) // 10 digits
      expect(validator.test('2147483647')).toBe(true) // 10 digits
    })

    test('should validate millisecond timestamps', () => {
      const validator = unix()

      // 13-digit timestamps (milliseconds)
      expect(validator.test('1609459200000')).toBe(true) // 2021-01-01 00:00:00.000 UTC
      expect(validator.test('1234567890123')).toBe(true)
      expect(validator.test(1609459200000)).toBe(true) // large numbers are valid
    })

    test('should reject invalid timestamps', () => {
      const validator = unix()

      // Negative values
      expect(validator.test(-1)).toBe(false) // negative timestamp
      expect(validator.test(-946684800)).toBe(false) // negative timestamp

      // Invalid string formats
      expect(validator.test('abc')).toBe(false)
      expect(validator.test('123abc')).toBe(false)
      expect(validator.test('')).toBe(true) // empty is valid when optional

      // Wrong length strings
      expect(validator.test('123')).toBe(false) // too short
      expect(validator.test('0')).toBe(false) // too short (1 digit)
      expect(validator.test('12345678901234')).toBe(false) // too long

      // Non-numeric types
      expect(validator.test(true as any)).toBe(true) // boolean is valid when optional
      expect(validator.test(null as any)).toBe(true) // null is valid when optional
      expect(validator.test(undefined as any)).toBe(true) // undefined is valid when optional
      expect(validator.test({} as any)).toBe(false)
      expect(validator.test([] as any)).toBe(true) // array is valid when optional
    })

    test('should have correct name', () => {
      const validator = unix()
      expect(validator.name).toBe('unix')
    })
  })

  describe('positive number validation', () => {
    test('should accept zero and positive numbers', () => {
      const validator = unix()

      expect(validator.test(0)).toBe(true) // Unix epoch
      expect(validator.test(1)).toBe(true)
      expect(validator.test(1000000)).toBe(true)
      expect(validator.test(9999999999)).toBe(true) // far future
    })

    test('should reject negative numbers', () => {
      const validator = unix()

      expect(validator.test(-1)).toBe(false)
      expect(validator.test(-100)).toBe(false)
      expect(validator.test(-946684800)).toBe(false) // before Unix epoch
    })
  })

  describe('string length validation', () => {
    test('should accept valid length strings', () => {
      const validator = unix()

      // 10-digit strings (seconds)
      expect(validator.test('1234567890')).toBe(true)
      expect(validator.test('9999999999')).toBe(true)

      // 11-12 digit strings
      expect(validator.test('12345678901')).toBe(true)
      expect(validator.test('123456789012')).toBe(true)

      // 13-digit strings (milliseconds)
      expect(validator.test('1234567890123')).toBe(true)
    })

    test('should reject invalid length strings', () => {
      const validator = unix()

      // Too short
      expect(validator.test('1')).toBe(false)
      expect(validator.test('123456789')).toBe(false) // 9 digits

      // Too long
      expect(validator.test('12345678901234')).toBe(false) // 14 digits
      expect(validator.test('123456789012345')).toBe(false) // 15 digits
    })
  })

  describe('required and optional', () => {
    test('required() should reject null/undefined', () => {
      const validator = unix().required()
      expect(validator.test(1609459200)).toBe(true)
      expect(validator.test('1609459200')).toBe(true)
      expect(validator.test(null as any)).toBe(false)
      expect(validator.test(undefined as any)).toBe(false)
    })

    test('optional() should accept null/undefined', () => {
      const validator = unix().optional()
      expect(validator.test(1609459200)).toBe(true)
      expect(validator.test('1609459200')).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
    })

    test('should work with validations when optional', () => {
      const validator = unix().optional()
      expect(validator.test(1609459200)).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
      expect(validator.test(-1)).toBe(false) // invalid timestamp
    })
  })

  describe('validation results', () => {
    test('should return detailed validation results', () => {
      const validator = unix()
      const result = validator.validate(-1)

      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors.length).toBeGreaterThan(0)
        expect(result.errors[0].message).toContain('Must be a valid Unix timestamp')
      }
    })

    test('should return success for valid timestamps', () => {
      const validator = unix()
      const result = validator.validate(1609459200)

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })
  })

  describe('edge cases', () => {
    test('should handle zero timestamp', () => {
      const validator = unix()
      expect(validator.test(0)).toBe(true) // Unix epoch
      expect(validator.test('0000000000')).toBe(true) // 10-digit string of zeros
    })

    test('should handle large timestamps', () => {
      const validator = unix()
      expect(validator.test(4102444800)).toBe(true) // 2100-01-01
      expect(validator.test(9999999999)).toBe(true) // far future
      expect(validator.test('9999999999')).toBe(true)
    })

    test('should handle floating point numbers', () => {
      const validator = unix()
      expect(validator.test(1609459200.5)).toBe(true) // Fractional seconds are valid
      expect(validator.test(1609459200.999)).toBe(true)
    })

    test('should handle scientific notation', () => {
      const validator = unix()
      expect(validator.test(1.6094592e9)).toBe(true) // 1609459200 in scientific notation
    })

    test('should handle string with leading zeros', () => {
      const validator = unix()
      expect(validator.test('0001609459200')).toBe(true) // 13 digits with leading zeros
      expect(validator.test('0000000000000')).toBe(true) // 13 digits, value 0
    })
  })

  describe('real-world use cases', () => {
    test('should validate API timestamps', () => {
      const validator = unix()

      // Common API timestamp values
      expect(validator.test(1609459200)).toBe(true) // 2021-01-01
      expect(validator.test(1640995200)).toBe(true) // 2022-01-01
      expect(validator.test(1672531200)).toBe(true) // 2023-01-01

      // Future timestamps
      expect(validator.test(4102444800)).toBe(true) // 2100-01-01

      // Invalid values
      expect(validator.test(-1)).toBe(false)
    })

    test('should validate system timestamps', () => {
      const validator = unix()

      // Current time
      const now = Math.floor(Date.now() / 1000)
      expect(validator.test(now)).toBe(true)

      // Recent timestamps
      expect(validator.test(now - 3600)).toBe(true) // 1 hour ago
      expect(validator.test(now - 86400)).toBe(true) // 1 day ago

      // Future timestamps
      expect(validator.test(now + 3600)).toBe(true) // 1 hour from now
    })

    test('should validate log timestamps', () => {
      const validator = unix()

      // Application log timestamps
      expect(validator.test(1609459200)).toBe(true)
      expect(validator.test(1640995200)).toBe(true)

      // System log timestamps
      const systemTime = Math.floor(Date.now() / 1000)
      expect(validator.test(systemTime)).toBe(true)
    })

    test('should validate file timestamps', () => {
      const validator = unix()

      // File creation/modification times
      expect(validator.test(1609459200)).toBe(true) // Created 2021
      expect(validator.test(1640995200)).toBe(true) // Modified 2022

      // Future file timestamps
      expect(validator.test(4102444800)).toBe(true) // Future file
    })

    test('should validate cache expiry timestamps', () => {
      const validator = unix()

      // Cache expiry times
      const now = Math.floor(Date.now() / 1000)
      const oneHour = now + 3600
      const oneDay = now + 86400
      const oneWeek = now + 604800

      expect(validator.test(oneHour)).toBe(true)
      expect(validator.test(oneDay)).toBe(true)
      expect(validator.test(oneWeek)).toBe(true)
    })
  })

  describe('type conversions', () => {
    test('should handle string to number conversion', () => {
      const validator = unix()

      expect(validator.test('1609459200')).toBe(true)
      expect(validator.test('0000000000')).toBe(true) // 10-digit zero string
      expect(validator.test('9999999999')).toBe(true)
    })

    test('should handle number inputs', () => {
      const validator = unix()

      expect(validator.test(1609459200)).toBe(true)
      expect(validator.test(0)).toBe(true)
      expect(validator.test(9999999999)).toBe(true)
    })

    test('should reject non-convertible strings', () => {
      const validator = unix()

      expect(validator.test('abc')).toBe(false)
      expect(validator.test('12.34.56')).toBe(false)
      expect(validator.test('2021-01-01T00:00:00Z')).toBe(false) // ISO string
    })
  })

  describe('performance considerations', () => {
    test('should handle many unix timestamp validations efficiently', () => {
      const validator = unix()
      const timestamps = Array.from({ length: 1000 }, (_, i) => 1609459200 + i)

      const start = Date.now()
      timestamps.forEach(ts => validator.test(ts))
      const end = Date.now()

      expect(end - start).toBeLessThan(100) // Should complete in under 100ms
    })
  })

  describe('comparison with TimestampValidator', () => {
    test('should accept timestamps beyond MySQL range', () => {
      const validator = unix()

      // Beyond MySQL TIMESTAMP range (which ends at 2038)
      expect(validator.test(4102444800)).toBe(true) // 2100-01-01
      expect(validator.test(7258118400)).toBe(true) // 2200-01-01
      expect(validator.test(9999999999)).toBe(true) // far future

      // These would be rejected by TimestampValidator
      expect(validator.test(2147483648)).toBe(true) // 2038-01-19 03:14:08
      expect(validator.test(3000000000)).toBe(true) // 2065-01-24
    })

    test('should still reject negative values like TimestampValidator', () => {
      const validator = unix()

      expect(validator.test(-1)).toBe(false)
      expect(validator.test(-946684800)).toBe(false) // 1940-01-01
    })
  })

  describe('type safety', () => {
    test('should work with typed number values', () => {
      const validator = unix()
      const typedNumber: number = 1609459200
      expect(validator.test(typedNumber)).toBe(true)
    })

    test('should work with typed string values', () => {
      const validator = unix()
      const typedString: string = '1609459200'
      expect(validator.test(typedString)).toBe(true)
    })

    test('should maintain type information for validated timestamps', () => {
      const validator = unix()
      const result = validator.validate(1609459200)
      expect(result.valid).toBe(true)
    })
  })
})
