import { describe, expect, test } from 'bun:test'
import { datetime } from '../../src/validators/datetimes'

describe('DatetimeValidator', () => {
  describe('basic validation', () => {
    test('should validate valid Date objects', () => {
      const validator = datetime()

      // Valid Date objects
      expect(validator.test(new Date('2021-01-01'))).toBe(true)
      expect(validator.test(new Date('2023-12-31'))).toBe(true)
      expect(validator.test(new Date())).toBe(true) // current date
      expect(validator.test(new Date(2021, 0, 1))).toBe(true) // using constructor
    })

    test('should reject non-Date values', () => {
      const validator = datetime()

      expect(validator.test('2021-01-01' as any)).toBe(false) // string
      expect(validator.test(1609459200000 as any)).toBe(false) // timestamp
      expect(validator.test(123 as any)).toBe(false) // number
      expect(validator.test(true as any)).toBe(false) // boolean is rejected
      expect(validator.test(null as any)).toBe(true) // null is valid when optional
      expect(validator.test(undefined as any)).toBe(true) // undefined is valid when optional
      expect(validator.test({} as any)).toBe(false) // object
      expect(validator.test([] as any)).toBe(false) // array is rejected
    })

    test('should reject invalid Date objects', () => {
      const validator = datetime()

      expect(validator.test(new Date('invalid'))).toBe(false) // Invalid date
      expect(validator.test(new Date(Number.NaN))).toBe(false) // NaN date
    })

    test('should have correct name', () => {
      const validator = datetime()
      expect(validator.name).toBe('datetime')
    })
  })

  describe('MySQL datetime range validation', () => {
    test('should accept dates within MySQL range (1000-9999)', () => {
      const validator = datetime()

      // Boundary values
      expect(validator.test(new Date('1000-01-01'))).toBe(true) // min year
      expect(validator.test(new Date('9999-12-31'))).toBe(true) // max year

      // Common values
      expect(validator.test(new Date('2000-01-01'))).toBe(true)
      expect(validator.test(new Date('2023-06-15'))).toBe(true)
    })

    test('should reject dates outside MySQL range', () => {
      const validator = datetime()

      // Before year 1000
      expect(validator.test(new Date('0999-12-31'))).toBe(false)
      expect(validator.test(new Date('0500-01-01'))).toBe(false)

      // After year 9999
      expect(validator.test(new Date('10000-01-01'))).toBe(false)
      expect(validator.test(new Date('12000-01-01'))).toBe(false)
    })
  })

  describe('required and optional', () => {
    test('required() should reject null/undefined', () => {
      const validator = datetime().required()
      expect(validator.test(new Date())).toBe(true)
      expect(validator.test(null as any)).toBe(false)
      expect(validator.test(undefined as any)).toBe(false)
    })

    test('optional() should accept null/undefined', () => {
      const validator = datetime().optional()
      expect(validator.test(new Date())).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
    })

    test('should work with validations when optional', () => {
      const validator = datetime().optional()
      expect(validator.test(new Date('2021-01-01'))).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
      expect(validator.test(new Date('0999-01-01'))).toBe(false) // outside range
    })
  })

  describe('validation results', () => {
    test('should return detailed validation results', () => {
      const validator = datetime()
      const result = validator.validate(new Date('0999-01-01'))

      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors.length).toBeGreaterThan(0)
        expect(result.errors[0].message).toContain('Must be a valid datetime')
      }
    })

    test('should return success for valid dates', () => {
      const validator = datetime()
      const result = validator.validate(new Date('2021-01-01'))

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })
  })

  describe('edge cases', () => {
    test('should handle leap years correctly', () => {
      const validator = datetime()

      // Leap years
      expect(validator.test(new Date('2000-02-29'))).toBe(true) // divisible by 400
      expect(validator.test(new Date('2004-02-29'))).toBe(true) // divisible by 4
      expect(validator.test(new Date('1600-02-29'))).toBe(true) // divisible by 400

      // Non-leap years - JavaScript Date adjusts these to valid dates
      expect(validator.test(new Date('1900-02-29'))).toBe(true) // adjusted to March 1
      expect(validator.test(new Date('2001-02-29'))).toBe(true) // adjusted to March 1
    })

    test('should handle timezone differences', () => {
      const validator = datetime()

      // Different timezone representations of same time
      const utc = new Date('2021-01-01T00:00:00Z')
      const local = new Date('2021-01-01T00:00:00')

      expect(validator.test(utc)).toBe(true)
      expect(validator.test(local)).toBe(true)
    })

    test('should handle extreme valid dates', () => {
      const validator = datetime()

      // Boundary dates
      expect(validator.test(new Date('1000-01-01T00:00:00Z'))).toBe(true)
      expect(validator.test(new Date('9999-12-31T23:59:59Z'))).toBe(true)
    })

    test('should handle different date formats', () => {
      const validator = datetime()

      // Various date constructor formats
      expect(validator.test(new Date(2021, 0, 1))).toBe(true) // year, month, day
      expect(validator.test(new Date(2021, 0, 1, 12, 30, 45))).toBe(true) // with time
      expect(validator.test(new Date(1609459200000))).toBe(true) // from timestamp
    })
  })

  describe('real-world use cases', () => {
    test('should validate user birth dates', () => {
      const validator = datetime()

      // Reasonable birth dates
      expect(validator.test(new Date('1990-05-15'))).toBe(true)
      expect(validator.test(new Date('2000-12-25'))).toBe(true)
      expect(validator.test(new Date('1950-01-01'))).toBe(true)

      // Unreasonable birth dates
      expect(validator.test(new Date('0500-01-01'))).toBe(false) // too old
      expect(validator.test(new Date('10000-01-01'))).toBe(false) // too far future
    })

    test('should validate appointment dates', () => {
      const validator = datetime()

      // Valid appointment dates
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      expect(validator.test(tomorrow)).toBe(true)

      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      expect(validator.test(nextWeek)).toBe(true)
    })

    test('should validate event dates', () => {
      const validator = datetime()

      // Historical events
      expect(validator.test(new Date('1969-07-20'))).toBe(true) // Moon landing
      expect(validator.test(new Date('2000-01-01'))).toBe(true) // Y2K

      // Future events
      expect(validator.test(new Date('2030-01-01'))).toBe(true)
      expect(validator.test(new Date('2050-12-31'))).toBe(true)
    })

    test('should validate database datetime fields', () => {
      const validator = datetime()

      // Typical database datetime values
      expect(validator.test(new Date('2021-01-01T10:30:00'))).toBe(true)
      expect(validator.test(new Date('2023-12-31T23:59:59'))).toBe(true)

      // Created/updated timestamps
      const now = new Date()
      expect(validator.test(now)).toBe(true)

      const created = new Date('2021-06-15T14:30:00')
      expect(validator.test(created)).toBe(true)
    })

    test('should validate log timestamps', () => {
      const validator = datetime()

      // Application log timestamps
      expect(validator.test(new Date('2023-01-15T09:30:45.123Z'))).toBe(true)
      expect(validator.test(new Date('2023-06-20T14:15:30.456Z'))).toBe(true)

      // System log timestamps
      const systemTime = new Date()
      expect(validator.test(systemTime)).toBe(true)
    })
  })

  describe('type safety', () => {
    test('should work with typed Date values', () => {
      const validator = datetime()
      const typedDate: Date = new Date('2021-01-01')
      expect(validator.test(typedDate)).toBe(true)
    })

    test('should maintain type information for validated dates', () => {
      const validator = datetime()
      const result = validator.validate(new Date('2021-01-01'))
      expect(result.valid).toBe(true)
    })
  })

  describe('performance considerations', () => {
    test('should handle many datetime validations efficiently', () => {
      const validator = datetime()
      const dates = Array.from({ length: 1000 }, (_, i) => {
        const date = new Date('2021-01-01')
        date.setDate(date.getDate() + i)
        return date
      })

      const start = Date.now()
      dates.forEach(date => validator.test(date))
      const end = Date.now()

      expect(end - start).toBeLessThan(100) // Should complete in under 100ms
    })
  })

  describe('date validation specifics', () => {
    test('should validate time components', () => {
      const validator = datetime()

      // Valid times
      expect(validator.test(new Date('2021-01-01T00:00:00'))).toBe(true) // midnight
      expect(validator.test(new Date('2021-01-01T12:00:00'))).toBe(true) // noon
      expect(validator.test(new Date('2021-01-01T23:59:59'))).toBe(true) // end of day

      // With milliseconds
      expect(validator.test(new Date('2021-01-01T12:30:45.123'))).toBe(true)
    })

    test('should validate different months', () => {
      const validator = datetime()

      // All months
      for (let month = 0; month < 12; month++) {
        expect(validator.test(new Date(2021, month, 15))).toBe(true)
      }
    })

    test('should validate month boundaries', () => {
      const validator = datetime()

      // Month boundaries
      expect(validator.test(new Date('2021-01-31'))).toBe(true) // January
      expect(validator.test(new Date('2021-02-28'))).toBe(true) // February non-leap
      expect(validator.test(new Date('2020-02-29'))).toBe(true) // February leap
      expect(validator.test(new Date('2021-04-30'))).toBe(true) // April
      expect(validator.test(new Date('2021-12-31'))).toBe(true) // December
    })
  })
})
