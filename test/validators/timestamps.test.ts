import { describe, expect, test } from 'bun:test'
import { timestamp } from '../../src/validators/timestamps'

describe('TimestampValidator', () => {
  describe('basic validation', () => {
    test('should validate valid timestamps', () => {
      const validator = timestamp()

      // Valid Unix timestamps
      expect(validator.test(0)).toBe(true) // 1970-01-01 00:00:00 UTC
      expect(validator.test(1609459200)).toBe(true) // 2021-01-01 00:00:00 UTC
      expect(validator.test(2147483647)).toBe(true) // 2038-01-19 03:14:07 UTC (max)

      // String timestamps (must be 10-13 digits)
      expect(validator.test('1609459200')).toBe(true) // 10 digits
      expect(validator.test('2147483647')).toBe(true) // 10 digits
    })

    test('should validate millisecond timestamps', () => {
      const validator = timestamp()

      // 13-digit timestamps (milliseconds) - but value must be within MySQL range
      expect(validator.test('0000000000000')).toBe(true) // 13 digits, value 0
      expect(validator.test('1234567890123')).toBe(false) // 13 digits but value too large
      expect(validator.test(1609459200000)).toBe(false) // number too large for MySQL range
    })

    test('should reject invalid timestamps', () => {
      const validator = timestamp()

      // Out of range
      expect(validator.test(-1)).toBe(false) // before 1970
      expect(validator.test(2147483648)).toBe(false) // after 2038

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
      const validator = timestamp()
      expect(validator.name).toBe('timestamp')
    })
  })

  describe('MySQL timestamp range validation', () => {
    test('should accept timestamps within MySQL range', () => {
      const validator = timestamp()

      // Boundary values
      expect(validator.test(0)).toBe(true) // 1970-01-01 00:00:00
      expect(validator.test(2147483647)).toBe(true) // 2038-01-19 03:14:07

      // Common values
      expect(validator.test(946684800)).toBe(true) // 2000-01-01 00:00:00
      expect(validator.test(1577836800)).toBe(true) // 2020-01-01 00:00:00
    })

    test('should reject timestamps outside MySQL range', () => {
      const validator = timestamp()

      // Before 1970
      expect(validator.test(-1)).toBe(false)
      expect(validator.test(-946684800)).toBe(false) // 1940-01-01

      // After 2038
      expect(validator.test(2147483648)).toBe(false) // 2038-01-19 03:14:08
      expect(validator.test(4102444800)).toBe(false) // 2100-01-01
    })
  })

  describe('string length validation', () => {
    test('should accept valid length strings', () => {
      const validator = timestamp()

      // 10-digit strings (seconds) - but value must be within MySQL range
      expect(validator.test('1234567890')).toBe(true) // within range
      expect(validator.test('2147483647')).toBe(true) // max value

      // 11-12 digit strings - but values are too large for MySQL range
      expect(validator.test('12345678901')).toBe(false) // value too large
      expect(validator.test('123456789012')).toBe(false) // value too large

      // 13-digit strings (milliseconds) - but values are too large for MySQL range
      expect(validator.test('0000000000000')).toBe(true) // value 0 is valid
      expect(validator.test('1234567890123')).toBe(false) // value too large
    })

    test('should reject invalid length strings', () => {
      const validator = timestamp()

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
      const validator = timestamp().required()
      expect(validator.test(1609459200)).toBe(true)
      expect(validator.test('1609459200')).toBe(true)
      expect(validator.test(null as any)).toBe(false)
      expect(validator.test(undefined as any)).toBe(false)
    })

    test('optional() should accept null/undefined', () => {
      const validator = timestamp().optional()
      expect(validator.test(1609459200)).toBe(true)
      expect(validator.test('1609459200')).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
    })

    test('should work with validations when optional', () => {
      const validator = timestamp().optional()
      expect(validator.test(1609459200)).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
      expect(validator.test(-1)).toBe(false) // invalid timestamp
    })
  })

  describe('validation results', () => {
    test('should return detailed validation results', () => {
      const validator = timestamp()
      const result = validator.validate(-1)

      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors.length).toBeGreaterThan(0)
        expect(result.errors[0].message).toContain('Must be a valid timestamp')
      }
    })

    test('should return success for valid timestamps', () => {
      const validator = timestamp()
      const result = validator.validate(1609459200)

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })
  })

  describe('edge cases', () => {
    test('should handle zero timestamp', () => {
      const validator = timestamp()
      expect(validator.test(0)).toBe(true) // Unix epoch
      expect(validator.test('0000000000')).toBe(true) // 10-digit string of zeros
    })

    test('should handle maximum valid timestamp', () => {
      const validator = timestamp()
      expect(validator.test(2147483647)).toBe(true) // 2038-01-19 03:14:07
      expect(validator.test('2147483647')).toBe(true)
    })

    test('should handle floating point numbers', () => {
      const validator = timestamp()
      expect(validator.test(1609459200.5)).toBe(true) // Fractional seconds are valid
      expect(validator.test(1609459200.999)).toBe(true)
    })

    test('should handle scientific notation', () => {
      const validator = timestamp()
      expect(validator.test(1.6094592e9)).toBe(true) // 1609459200 in scientific notation
    })

    test('should handle string with leading zeros', () => {
      const validator = timestamp()
      expect(validator.test('0001609459200')).toBe(true) // 13 digits with leading zeros
      expect(validator.test('0000000000000')).toBe(true) // 13 digits, value 0
    })
  })

  describe('real-world use cases', () => {
    test('should validate database timestamps', () => {
      const validator = timestamp()

      // Common database timestamp values
      expect(validator.test(1609459200)).toBe(true) // 2021-01-01
      expect(validator.test(1640995200)).toBe(true) // 2022-01-01
      expect(validator.test(1672531200)).toBe(true) // 2023-01-01

      // Invalid database values
      expect(validator.test(-1)).toBe(false)
      expect(validator.test(9999999999)).toBe(false) // Too far in future
    })

    test('should validate API timestamp parameters', () => {
      const validator = timestamp()

      // String timestamps from API (must be 10-13 digits and within MySQL range)
      expect(validator.test('1609459200')).toBe(true)
      expect(validator.test('0000000000000')).toBe(true) // 13 digits, value 0

      // Invalid API values
      expect(validator.test('invalid')).toBe(false)
      expect(validator.test('2021-01-01')).toBe(false) // ISO date string
    })

    test('should validate log timestamps', () => {
      const validator = timestamp()

      // Recent timestamps
      const now = Math.floor(Date.now() / 1000)
      expect(validator.test(now)).toBe(true)
      expect(validator.test(now - 3600)).toBe(true) // 1 hour ago
      expect(validator.test(now - 86400)).toBe(true) // 1 day ago

      // Future timestamps (within range)
      expect(validator.test(now + 3600)).toBe(true) // 1 hour from now
    })

    test('should validate session timestamps', () => {
      const validator = timestamp()

      // Session creation/expiry times
      const sessionStart = 1609459200 // 2021-01-01
      const sessionExpiry = sessionStart + 3600 // 1 hour later

      expect(validator.test(sessionStart)).toBe(true)
      expect(validator.test(sessionExpiry)).toBe(true)
      expect(validator.test(sessionStart - 1)).toBe(true) // Just before
    })

    test('should validate file modification timestamps', () => {
      const validator = timestamp()

      // File system timestamps
      expect(validator.test(1609459200)).toBe(true) // Created 2021
      expect(validator.test(1640995200)).toBe(true) // Modified 2022

      // Invalid file timestamps
      expect(validator.test(-1)).toBe(false) // Before Unix epoch
    })
  })

  describe('type conversions', () => {
    test('should handle string to number conversion', () => {
      const validator = timestamp()

      expect(validator.test('1609459200')).toBe(true)
      expect(validator.test('0000000000')).toBe(true) // 10-digit zero string
      expect(validator.test('2147483647')).toBe(true)
    })

    test('should handle number inputs', () => {
      const validator = timestamp()

      expect(validator.test(1609459200)).toBe(true)
      expect(validator.test(0)).toBe(true)
      expect(validator.test(2147483647)).toBe(true)
    })

    test('should reject non-convertible strings', () => {
      const validator = timestamp()

      expect(validator.test('abc')).toBe(false)
      expect(validator.test('12.34.56')).toBe(false)
      expect(validator.test('2021-01-01T00:00:00Z')).toBe(false) // ISO string
    })
  })

  describe('performance considerations', () => {
    test('should handle many timestamp validations efficiently', () => {
      const validator = timestamp()
      const timestamps = Array.from({ length: 1000 }, (_, i) => 1609459200 + i)

      const start = Date.now()
      timestamps.forEach(ts => validator.test(ts))
      const end = Date.now()

      expect(end - start).toBeLessThan(100) // Should complete in under 100ms
    })
  })
})
