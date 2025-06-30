import { describe, expect, test } from 'bun:test'
import { date } from '../../src/validators/dates'

describe('DateValidator', () => {
  describe('basic validation', () => {
    test('should validate Date objects', () => {
      const validator = date()
      expect(validator.test(new Date())).toBe(true)
      expect(validator.test(new Date('2023-01-01'))).toBe(true)
      expect(validator.test(new Date('2023-12-31T23:59:59Z'))).toBe(true)
      expect(validator.test('2023-01-01' as any)).toBe(false)
      expect(validator.test(1672531200000 as any)).toBe(false) // timestamp
      expect(validator.test(null as any)).toBe(true) // null/undefined are valid when optional
      expect(validator.test(undefined as any)).toBe(true) // null/undefined are valid when optional
    })

    test('should reject invalid Date objects', () => {
      const validator = date()
      expect(validator.test(new Date('invalid'))).toBe(false)
      expect(validator.test(new Date('not-a-date'))).toBe(false)
      expect(validator.test(new Date(Number.NaN))).toBe(false)
    })

    test('should have correct name', () => {
      const validator = date()
      expect(validator.name).toBe('date')
    })
  })

  describe('validation behavior', () => {
    test('should validate only Date objects', () => {
      const validator = date()

      // Valid dates
      expect(validator.test(new Date('2023-06-12'))).toBe(true) // Monday
      expect(validator.test(new Date('2023-06-13'))).toBe(true) // Tuesday
      expect(validator.test(new Date('2023-06-14'))).toBe(true) // Wednesday
      expect(validator.test(new Date('2023-06-15'))).toBe(true) // Thursday
      expect(validator.test(new Date('2023-06-16'))).toBe(true) // Friday
      expect(validator.test(new Date('2023-06-10'))).toBe(true) // Saturday
      expect(validator.test(new Date('2023-06-11'))).toBe(true) // Sunday
    })

    test('should reject invalid inputs', () => {
      const validator = date()
      const result = validator.validate('2022-12-31' as any)

      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors[0].message).toBe('Must be a valid date')
      }
    })

    test('should validate date ranges', () => {
      const validator = date()

      expect(validator.test(new Date('2023-06-15'))).toBe(true)
      expect(validator.test(new Date('2023-05-15'))).toBe(true)
      expect(validator.test(new Date('2022-06-15'))).toBe(true)
      expect(validator.test(new Date('2022-05-15'))).toBe(true)
    })
  })

  describe('required and optional', () => {
    test('required() should reject null/undefined', () => {
      const validator = date().required()
      expect(validator.test(new Date())).toBe(true)
      expect(validator.test(null as any)).toBe(false)
      expect(validator.test(undefined as any)).toBe(false)
    })

    test('optional() should accept null/undefined', () => {
      const validator = date().optional()
      expect(validator.test(new Date())).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
    })

    test('should work with validations when optional', () => {
      const validator = date()
        .optional()

      expect(validator.test(new Date('2023-06-15'))).toBe(true) // valid date
      expect(validator.test(null as any)).toBe(true) // optional
      expect(validator.test(undefined as any)).toBe(true) // optional
      expect(validator.test(new Date('2022-12-31'))).toBe(true) // valid date
    })
  })

  describe('real-world date scenarios', () => {
    test('should validate all dates equally', () => {
      const validator = date()

      expect(validator.test(new Date('2023-06-12'))).toBe(true) // Monday
      expect(validator.test(new Date('2023-06-16'))).toBe(true) // Friday
      expect(validator.test(new Date('2023-06-10'))).toBe(true) // Saturday
      expect(validator.test(new Date('2023-06-11'))).toBe(true) // Sunday
    })

    test('should validate dates from different years', () => {
      const currentYear = new Date().getFullYear()
      const validator = date()

      const thisYear = new Date(`${currentYear}-06-15`)
      const lastYear = new Date(`${currentYear - 1}-06-15`)
      const nextYear = new Date(`${currentYear + 1}-06-15`)

      expect(validator.test(thisYear)).toBe(true)
      expect(validator.test(lastYear)).toBe(true)
      expect(validator.test(nextYear)).toBe(true)
    })

    test('should validate dates from different months', () => {
      const validator = date()

      expect(validator.test(new Date('2023-06-15'))).toBe(true)
      expect(validator.test(new Date('2023-06-01'))).toBe(true)
      expect(validator.test(new Date('2023-06-30'))).toBe(true)
      expect(validator.test(new Date('2023-05-31'))).toBe(true)
      expect(validator.test(new Date('2023-07-01'))).toBe(true)
    })

    test('should validate dates with different times', () => {
      const validator = date()

      const morningEvent = new Date('2023-06-15T10:00:00')
      const afternoonEvent = new Date('2023-06-15T14:00:00')
      const eveningEvent = new Date('2023-06-15T19:00:00')
      const earlyMorning = new Date('2023-06-15T07:00:00')

      expect(validator.test(morningEvent)).toBe(true)
      expect(validator.test(afternoonEvent)).toBe(true)
      expect(validator.test(eveningEvent)).toBe(true)
      expect(validator.test(earlyMorning)).toBe(true)
    })
  })

  describe('edge cases', () => {
    test('should handle leap year dates', () => {
      const validator = date()
      expect(validator.test(new Date('2024-02-29'))).toBe(true) // leap year
      expect(validator.test(new Date('2023-02-29'))).toBe(true) // creates valid Date object (Feb 28, 2023)
    })

    test('should handle timezone differences', () => {
      const validator = date()
      const utcDate = new Date('2023-06-15T12:00:00Z')
      const localDate = new Date('2023-06-15T12:00:00')

      expect(validator.test(utcDate)).toBe(true)
      expect(validator.test(localDate)).toBe(true)
    })

    test('should handle extreme dates', () => {
      const validator = date()
      const veryOldDate = new Date('1900-01-01')
      const veryFutureDate = new Date('2100-12-31')
      const jsMinDate = new Date(-8640000000000000) // JS min date
      const jsMaxDate = new Date(8640000000000000) // JS max date

      expect(validator.test(veryOldDate)).toBe(true)
      expect(validator.test(veryFutureDate)).toBe(true)
      expect(validator.test(jsMinDate)).toBe(true)
      expect(validator.test(jsMaxDate)).toBe(true)
    })

    test('should handle date objects with invalid values', () => {
      const validator = date()

      // These create invalid Date objects
      expect(validator.test(new Date('invalid-date-string'))).toBe(false)
      expect(validator.test(new Date(''))).toBe(false)
      expect(validator.test(new Date('abc'))).toBe(false)
      expect(validator.test(new Date(undefined as any))).toBe(false)
    })

    test('should handle various date formats', () => {
      const validator = date()

      // Valid date formats
      expect(validator.test(new Date('2023-06-15'))).toBe(true)
      expect(validator.test(new Date('2023-06-15T10:30:00'))).toBe(true)
      expect(validator.test(new Date('2023-06-15T10:30:00Z'))).toBe(true)
      expect(validator.test(new Date('2023-06-15T10:30:00+05:00'))).toBe(true)
      expect(validator.test(new Date('Jun 15, 2023'))).toBe(true)
      expect(validator.test(new Date('06/15/2023'))).toBe(true)
      expect(validator.test(new Date(1686825600000))).toBe(true) // timestamp
    })
  })

  describe('validation results', () => {
    test('should return detailed validation results', () => {
      const validator = date()
      const result = validator.validate(new Date('invalid'))

      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors[0].message).toBe('Must be a valid date')
      }
    })

    test('should return success for valid dates', () => {
      const validator = date()
      const result = validator.validate(new Date('2023-06-15'))

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    test('should return error messages for invalid dates', () => {
      const validator = date()
      const result = validator.validate('2023-06-11' as any) // Invalid type

      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors[0].message).toBe('Must be a valid date')
      }
    })
  })

  describe('chaining validations', () => {
    test('should chain basic validations', () => {
      const validator = date()
        .required()

      const validDate = new Date('2023-06-15') // Thursday
      const sunday = new Date('2023-06-11') // Sunday
      const oldDate = new Date('2022-06-15') // 2022

      expect(validator.test(validDate)).toBe(true)
      expect(validator.test(sunday)).toBe(true) // Valid date
      expect(validator.test(oldDate)).toBe(true) // Valid date
      expect(validator.test(null as any)).toBe(false) // required
    })
  })

  describe('type safety', () => {
    test('should only accept Date objects as valid', () => {
      const validator = date()

      // Only Date objects should be valid
      expect(validator.test(new Date())).toBe(true)

      // Everything else should be invalid
      expect(validator.test('2023-06-15' as any)).toBe(false)
      expect(validator.test(1686825600000 as any)).toBe(false)
      expect(validator.test({ year: 2023, month: 6, day: 15 } as any)).toBe(false)
      expect(validator.test([2023, 6, 15] as any)).toBe(false)
      expect(validator.test(true as any)).toBe(false)
      expect(validator.test(false as any)).toBe(false)
    })
  })
})
