import { describe, expect, test } from 'bun:test'
import { timestamp } from '../../src/validators/timestamps'
import { timestampTz } from '../../src/validators/timestamptz'

describe('TimestampTzValidator', () => {
  describe('basic validation', () => {
    test('should validate numeric Unix timestamps', () => {
      const validator = timestampTz()

      // Valid Unix timestamps
      expect(validator.test(0)).toBe(true) // 1970-01-01 00:00:00 UTC
      expect(validator.test(1609459200)).toBe(true) // 2021-01-01 00:00:00 UTC
      expect(validator.test(2147483647)).toBe(true) // 2038-01-19 03:14:07 UTC (max)
    })

    test('should validate string Unix timestamps', () => {
      const validator = timestampTz()

      // Valid string timestamps (must be 10-13 digits)
      expect(validator.test('1609459200')).toBe(true) // 10 digits
      expect(validator.test('2147483647')).toBe(true) // 10 digits
      expect(validator.test('0000000000000')).toBe(true) // 13 digits, value 0
    })

    test('should validate ISO 8601 format with timezone', () => {
      const validator = timestampTz()

      // ISO 8601 with Z timezone
      expect(validator.test('2023-12-25T10:30:00Z')).toBe(true)
      expect(validator.test('2021-01-01T00:00:00Z')).toBe(true)
      expect(validator.test('2038-01-19T03:14:07Z')).toBe(true)

      // ISO 8601 with offset timezone
      expect(validator.test('2023-12-25T10:30:00+05:00')).toBe(true)
      expect(validator.test('2023-12-25T10:30:00-08:00')).toBe(true)
      expect(validator.test('2023-12-25T10:30:00+00:00')).toBe(true)

      // ISO 8601 with milliseconds and timezone
      expect(validator.test('2023-12-25T10:30:00.123Z')).toBe(true)
      expect(validator.test('2023-12-25T10:30:00.456+05:00')).toBe(true)
    })

    test('should validate RFC 3339 format with timezone', () => {
      const validator = timestampTz()

      // RFC 3339 with Z timezone
      expect(validator.test('2023-12-25 10:30:00Z')).toBe(true)
      expect(validator.test('2021-01-01 00:00:00Z')).toBe(true)

      // RFC 3339 with offset timezone
      expect(validator.test('2023-12-25 10:30:00+05:00')).toBe(true)
      expect(validator.test('2023-12-25 10:30:00-08:00')).toBe(true)

      // RFC 3339 with milliseconds and timezone
      expect(validator.test('2023-12-25 10:30:00.123Z')).toBe(true)
      expect(validator.test('2023-12-25 10:30:00.456+05:00')).toBe(true)
    })

    test('should validate other timezone formats', () => {
      const validator = timestampTz()

      // ISO with milliseconds and Z
      expect(validator.test('2023-12-25T10:30:00.000Z')).toBe(true)
      expect(validator.test('2023-12-25T10:30:00.123Z')).toBe(true)

      // UTC suffix
      expect(validator.test('2023-12-25 10:30:00 UTC')).toBe(true)
      expect(validator.test('2021-01-01 00:00:00 UTC')).toBe(true)

      // GMT suffix
      expect(validator.test('2023-12-25 10:30:00 GMT')).toBe(true)
      expect(validator.test('2021-01-01 00:00:00 GMT')).toBe(true)

      // Timezone abbreviations
      expect(validator.test('2023-12-25 10:30:00 EST')).toBe(true)
      expect(validator.test('2023-12-25 10:30:00 PST')).toBe(true)
      expect(validator.test('2023-12-25 10:30:00 UTC')).toBe(true)
    })
  })

  describe('rejecting invalid formats', () => {
    test('should reject timestamps without timezone', () => {
      const validator = timestampTz()

      // ISO 8601 without timezone
      expect(validator.test('2023-12-25T10:30:00')).toBe(false)
      expect(validator.test('2021-01-01T00:00:00')).toBe(false)

      // RFC 3339 without timezone
      expect(validator.test('2023-12-25 10:30:00')).toBe(false)
      expect(validator.test('2021-01-01 00:00:00')).toBe(false)

      // Date only
      expect(validator.test('2023-12-25')).toBe(false)
      expect(validator.test('2021-01-01')).toBe(false)
    })

    test('should reject invalid numeric timestamps', () => {
      const validator = timestampTz()

      // Out of range
      expect(validator.test(-1)).toBe(false) // before 1970
      expect(validator.test(2147483648)).toBe(false) // after 2038

      // Invalid string formats
      expect(validator.test('abc')).toBe(false)
      expect(validator.test('123abc')).toBe(false)

      // Wrong length strings
      expect(validator.test('123')).toBe(false) // too short
      expect(validator.test('0')).toBe(false) // too short (1 digit)
      expect(validator.test('12345678901234')).toBe(false) // too long
    })

    test('should reject invalid timezone formats', () => {
      const validator = timestampTz()

      // Invalid timezone offsets
      expect(validator.test('2023-12-25T10:30:00+25:00')).toBe(false) // invalid hour
      expect(validator.test('2023-12-25T10:30:00+05:60')).toBe(false) // invalid minute
      expect(validator.test('2023-12-25T10:30:00+5:30')).toBe(false) // missing leading zero

      // Invalid timezone abbreviations
      expect(validator.test('2023-12-25 10:30:00 INVALID')).toBe(false)
      expect(validator.test('2023-12-25 10:30:00 XX')).toBe(false) // too short

      // Malformed strings
      expect(validator.test('2023-12-25T10:30:00+')).toBe(false) // incomplete offset
      expect(validator.test('2023-12-25T10:30:00Zabc')).toBe(false) // extra characters
    })

    test('should reject non-timestamp types', () => {
      const validator = timestampTz().required()

      expect(validator.test(true)).toBe(false)
      expect(validator.test(null)).toBe(false)
      expect(validator.test(undefined)).toBe(false)
      expect(validator.test({})).toBe(false)
      expect(validator.test([])).toBe(false)
    })
  })

  describe('MySQL timestamp range validation', () => {
    test('should accept timestamps within MySQL range', () => {
      const validator = timestampTz()

      // Boundary values
      expect(validator.test(0)).toBe(true) // 1970-01-01 00:00:00
      expect(validator.test(2147483647)).toBe(true) // 2038-01-19 03:14:07

      // Common values
      expect(validator.test(946684800)).toBe(true) // 2000-01-01 00:00:00
      expect(validator.test(1577836800)).toBe(true) // 2020-01-01 00:00:00

      // String equivalents
      expect(validator.test('1577836800')).toBe(true)
    })

    test('should reject timestamps outside MySQL range', () => {
      const validator = timestampTz()

      // Before 1970
      expect(validator.test(-1)).toBe(false)
      expect(validator.test(-946684800)).toBe(false) // 1940-01-01

      // After 2038
      expect(validator.test(2147483648)).toBe(false) // 2038-01-19 03:14:08
      expect(validator.test(4102444800)).toBe(false) // 2100-01-01

      // String equivalents
      expect(validator.test('-1')).toBe(false)
      expect(validator.test('2147483648')).toBe(false)
    })
  })

  describe('string length validation for Unix timestamps', () => {
    test('should accept valid length strings', () => {
      const validator = timestampTz()

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
      const validator = timestampTz()

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
      const validator = timestampTz().required()
      expect(validator.test(1609459200)).toBe(true)
      expect(validator.test('1609459200')).toBe(true)
      expect(validator.test('2023-12-25T10:30:00Z')).toBe(true)
      expect(validator.test(null as any)).toBe(false)
      expect(validator.test(undefined as any)).toBe(false)
    })

    test('optional() should accept null/undefined', () => {
      const validator = timestampTz().optional()
      expect(validator.test(1609459200)).toBe(true)
      expect(validator.test('1609459200')).toBe(true)
      expect(validator.test('2023-12-25T10:30:00Z')).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
    })

    test('should work with validations when optional', () => {
      const validator = timestampTz().optional()
      expect(validator.test(1609459200)).toBe(true)
      expect(validator.test('2023-12-25T10:30:00Z')).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
      expect(validator.test(-1)).toBe(false) // invalid timestamp
      expect(validator.test('2023-12-25T10:30:00')).toBe(false) // missing timezone
    })
  })

  describe('validation results', () => {
    test('should return detailed validation results', () => {
      const validator = timestampTz()
      const result = validator.validate('2023-12-25T10:30:00') // missing timezone

      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors.length).toBeGreaterThan(0)
        expect(result.errors[0].message).toContain('Must be a valid timestamp with timezone')
      }
    })

    test('should return success for valid timestamps', () => {
      const validator = timestampTz()
      const result = validator.validate('2023-12-25T10:30:00Z')

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })
  })

  describe('edge cases', () => {
    test('should handle zero timestamp', () => {
      const validator = timestampTz()
      expect(validator.test(0)).toBe(true) // Unix epoch
      expect(validator.test('0000000000')).toBe(true) // 10-digit string of zeros
    })

    test('should handle maximum valid timestamp', () => {
      const validator = timestampTz()
      expect(validator.test(2147483647)).toBe(true) // 2038-01-19 03:14:07
      expect(validator.test('2147483647')).toBe(true)
    })

    test('should handle floating point numbers', () => {
      const validator = timestampTz()
      expect(validator.test(1609459200.5)).toBe(true) // Fractional seconds are valid
      expect(validator.test(1609459200.999)).toBe(true)
    })

    test('should handle scientific notation', () => {
      const validator = timestampTz()
      expect(validator.test(1.6094592e9)).toBe(true) // 1609459200 in scientific notation
    })

    test('should handle string with leading zeros', () => {
      const validator = timestampTz()
      expect(validator.test('0001609459200')).toBe(true) // 13 digits with leading zeros
      expect(validator.test('0000000000000')).toBe(true) // 13 digits, value 0
    })

    test('should handle whitespace in timezone strings', () => {
      const validator = timestampTz()
      expect(validator.test(' 2023-12-25T10:30:00Z ')).toBe(true) // trimmed
      expect(validator.test(' 2023-12-25 10:30:00 UTC ')).toBe(true) // trimmed
    })
  })

  describe('real-world use cases', () => {
    test('should validate API timestamps with timezone', () => {
      const validator = timestampTz()

      // Common API timestamp formats
      expect(validator.test('2023-12-25T10:30:00Z')).toBe(true) // ISO 8601 UTC
      expect(validator.test('2023-12-25T10:30:00+05:00')).toBe(true) // ISO 8601 with offset
      expect(validator.test('2023-12-25 10:30:00 UTC')).toBe(true) // RFC format

      // Invalid API values
      expect(validator.test('2023-12-25T10:30:00')).toBe(false) // missing timezone
      expect(validator.test('2023-12-25')).toBe(false) // date only
    })

    test('should validate database timestamptz fields', () => {
      const validator = timestampTz()

      // PostgreSQL timestamptz format
      expect(validator.test('2023-12-25T10:30:00Z')).toBe(true)
      expect(validator.test('2023-12-25T10:30:00.123Z')).toBe(true)
      expect(validator.test('2023-12-25T10:30:00+05:00')).toBe(true)

      // Unix timestamps (also valid for timestamptz)
      expect(validator.test(1609459200)).toBe(true)
      expect(validator.test('1609459200')).toBe(true)
    })

    test('should validate log timestamps with timezone', () => {
      const validator = timestampTz()

      // Application log timestamps with timezone
      expect(validator.test('2023-01-15T09:30:45.123Z')).toBe(true)
      expect(validator.test('2023-06-20T14:15:30.456Z')).toBe(true)
      expect(validator.test('2023-12-25 10:30:00 UTC')).toBe(true)

      // Unix timestamps
      const now = Math.floor(Date.now() / 1000)
      expect(validator.test(now)).toBe(true)
    })
  })

  describe('comparison with TimestampValidator', () => {
    test('should be more restrictive than regular timestamp', () => {
      const timestampTzValidator = timestampTz()
      const timestampValidator = timestamp()

      // Both should accept numeric timestamps
      expect(timestampTzValidator.test(1609459200)).toBe(true)
      expect(timestampValidator.test(1609459200)).toBe(true)

      // Both should accept string timestamps
      expect(timestampTzValidator.test('1609459200')).toBe(true)
      expect(timestampValidator.test('1609459200')).toBe(true)

      // TimestampTz should reject strings without timezone
      expect(timestampTzValidator.test('2023-12-25T10:30:00')).toBe(false)
      expect(timestampValidator.test('2023-12-25T10:30:00')).toBe(false) // regular timestamp also rejects this

      // TimestampTz should accept strings with timezone
      expect(timestampTzValidator.test('2023-12-25T10:30:00Z')).toBe(true)
      expect(timestampValidator.test('2023-12-25T10:30:00Z')).toBe(false) // regular timestamp rejects this
    })
  })
})
