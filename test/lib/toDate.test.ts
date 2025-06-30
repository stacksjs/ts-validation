import { describe, expect, test } from 'bun:test'
import toDate from '../../src/lib/toDate'

describe('toDate', () => {
  describe('basic date conversion', () => {
    test('should convert ISO date strings', () => {
      expect(toDate('2023-01-01')).toEqual(new Date('2023-01-01'))
      expect(toDate('2023-12-31')).toEqual(new Date('2023-12-31'))
      expect(toDate('2000-02-29')).toEqual(new Date('2000-02-29')) // leap year
      expect(toDate('1999-12-31')).toEqual(new Date('1999-12-31'))
    })

    test('should convert ISO datetime strings', () => {
      expect(toDate('2023-01-01T00:00:00')).toEqual(new Date('2023-01-01T00:00:00'))
      expect(toDate('2023-01-01T12:30:45')).toEqual(new Date('2023-01-01T12:30:45'))
      expect(toDate('2023-12-31T23:59:59')).toEqual(new Date('2023-12-31T23:59:59'))
    })

    test('should convert ISO datetime strings with timezone', () => {
      expect(toDate('2023-01-01T00:00:00Z')).toEqual(new Date('2023-01-01T00:00:00Z'))
      expect(toDate('2023-01-01T12:30:45.123Z')).toEqual(new Date('2023-01-01T12:30:45.123Z'))
      expect(toDate('2023-01-01T12:30:45+05:30')).toEqual(new Date('2023-01-01T12:30:45+05:30'))
      expect(toDate('2023-01-01T12:30:45-08:00')).toEqual(new Date('2023-01-01T12:30:45-08:00'))
    })

    test('should convert US date format', () => {
      expect(toDate('01/01/2023')).toEqual(new Date('01/01/2023'))
      expect(toDate('12/31/2023')).toEqual(new Date('12/31/2023'))
      expect(toDate('02/29/2000')).toEqual(new Date('02/29/2000')) // leap year
      expect(toDate('1/1/2023')).toEqual(new Date('1/1/2023'))
    })

    test('should handle timestamp strings', () => {
      expect(toDate('1672531200000')).toBeNull() // pure number strings aren't valid date strings for Date.parse
      expect(toDate('1640995200000')).toBeNull() // pure number strings aren't valid date strings for Date.parse
      expect(toDate('0')).toEqual(new Date('0')) // '0' is parsed as year 2000 by Date.parse
    })
  })

  describe('various date formats', () => {
    test('should convert different separator formats', () => {
      expect(toDate('2023-01-01')).toEqual(new Date('2023-01-01'))
      expect(toDate('2023/01/01')).toEqual(new Date('2023/01/01'))
      expect(toDate('2023.01.01')).toEqual(new Date('2023.01.01'))
      expect(toDate('01-01-2023')).toEqual(new Date('01-01-2023'))
    })

    test('should convert month names', () => {
      expect(toDate('January 1, 2023')).toEqual(new Date('January 1, 2023'))
      expect(toDate('Jan 1, 2023')).toEqual(new Date('Jan 1, 2023'))
      expect(toDate('December 31, 2023')).toEqual(new Date('December 31, 2023'))
      expect(toDate('Dec 31, 2023')).toEqual(new Date('Dec 31, 2023'))
    })

    test('should convert various time formats', () => {
      expect(toDate('2023-01-01 12:30')).toEqual(new Date('2023-01-01 12:30'))
      expect(toDate('2023-01-01 12:30:45')).toEqual(new Date('2023-01-01 12:30:45'))
      expect(toDate('2023-01-01 12:30:45.123')).toEqual(new Date('2023-01-01 12:30:45.123'))
    })

    test('should handle relative date strings', () => {
      expect(toDate('now')).toBeNull() // 'now' is not a valid date string for Date.parse
      expect(toDate('today')).toBeNull() // 'today' is not a valid date string for Date.parse
      // These relative strings are not supported by Date.parse
    })
  })

  describe('whitespace handling', () => {
    test('should handle leading whitespace', () => {
      expect(toDate(' 2023-01-01')).toEqual(new Date('2023-01-01')) // Date.parse handles leading whitespace for dates
      expect(toDate('  2023-01-01T12:30:45')).toBeNull() // Date.parse doesn't handle leading whitespace for datetime strings
      expect(toDate('\t01/01/2023')).toEqual(new Date('01/01/2023')) // Date.parse handles leading whitespace for simple dates
      expect(toDate('\n2023-01-01')).toEqual(new Date('2023-01-01')) // Date.parse handles leading whitespace for dates
    })

    test('should handle trailing whitespace', () => {
      expect(toDate('2023-01-01 ')).toEqual(new Date('2023-01-01')) // Date.parse handles trailing whitespace for dates
      expect(toDate('2023-01-01T12:30:45  ')).toBeNull() // Date.parse doesn't handle trailing whitespace for datetime strings
      expect(toDate('01/01/2023\t')).toEqual(new Date('01/01/2023')) // Date.parse handles trailing whitespace for simple dates
      expect(toDate('2023-01-01\n')).toEqual(new Date('2023-01-01')) // Date.parse handles trailing whitespace for dates
    })

    test('should handle surrounding whitespace', () => {
      expect(toDate(' 2023-01-01 ')).toEqual(new Date('2023-01-01')) // Date.parse handles surrounding whitespace for dates
      expect(toDate('  2023-01-01T12:30:45  ')).toBeNull() // Date.parse doesn't handle surrounding whitespace for datetime strings
      expect(toDate('\t01/01/2023\t')).toEqual(new Date('01/01/2023')) // Date.parse handles surrounding whitespace for simple dates
      expect(toDate(' \n 2023-01-01 \t ')).toEqual(new Date('2023-01-01')) // Date.parse handles surrounding whitespace for dates
    })
  })

  describe('invalid input handling', () => {
    test('should return null for invalid strings', () => {
      expect(toDate('invalid')).toBeNull()
      expect(toDate('hello world')).toBeNull()
      expect(toDate('2023-13-01')).toBeNull() // invalid month
      expect(toDate('2023-01-32')).toBeNull() // invalid day
      expect(toDate('not a date')).toBeNull()
    })

    test('should return null for empty and whitespace-only strings', () => {
      expect(toDate('')).toBeNull()
      expect(toDate('   ')).toBeNull()
      expect(toDate('\t')).toBeNull()
      expect(toDate('\n')).toBeNull()
      expect(toDate('\r')).toBeNull()
    })

    test('should handle malformed date strings', () => {
      expect(toDate('2023/13/01')).toBeNull() // invalid month returns null
      expect(toDate('2023/02/30')).toEqual(new Date('2023/02/30')) // invalid day for February rolls over
      expect(toDate('2023-02-29')).toEqual(new Date('2023-02-29')) // invalid day for non-leap year rolls over
      expect(toDate('25:00:00')).toBeNull() // invalid hour returns null
    })
  })

  describe('edge cases', () => {
    test('should handle leap years correctly', () => {
      expect(toDate('2000-02-29')).toEqual(new Date('2000-02-29')) // leap year
      expect(toDate('2004-02-29')).toEqual(new Date('2004-02-29')) // leap year
      expect(toDate('1900-02-29')).toEqual(new Date('1900-02-29')) // not a leap year (century rule)
      expect(toDate('2100-02-29')).toEqual(new Date('2100-02-29')) // not a leap year (century rule)
    })

    test('should handle year boundaries', () => {
      expect(toDate('1970-01-01')).toEqual(new Date('1970-01-01')) // Unix epoch
      expect(toDate('2038-01-19')).toEqual(new Date('2038-01-19')) // near 32-bit timestamp limit
      expect(toDate('1900-01-01')).toEqual(new Date('1900-01-01')) // early 20th century
      expect(toDate('2100-01-01')).toEqual(new Date('2100-01-01')) // future date
    })

    test('should handle month boundaries', () => {
      expect(toDate('2023-01-31')).toEqual(new Date('2023-01-31')) // end of January
      expect(toDate('2023-02-28')).toEqual(new Date('2023-02-28')) // end of February (non-leap)
      expect(toDate('2023-04-30')).toEqual(new Date('2023-04-30')) // end of April
      expect(toDate('2023-12-31')).toEqual(new Date('2023-12-31')) // end of year
    })

    test('should handle time boundaries', () => {
      expect(toDate('2023-01-01T00:00:00')).toEqual(new Date('2023-01-01T00:00:00')) // start of day
      expect(toDate('2023-01-01T23:59:59')).toEqual(new Date('2023-01-01T23:59:59')) // end of day
      expect(toDate('2023-01-01T12:00:00')).toEqual(new Date('2023-01-01T12:00:00')) // noon
      expect(toDate('2023-01-01T00:00:00.000')).toEqual(new Date('2023-01-01T00:00:00.000')) // with milliseconds
    })
  })

  describe('real-world use cases', () => {
    test('should convert user input dates', () => {
      expect(toDate('1990-05-15')).toEqual(new Date('1990-05-15')) // birth date
      expect(toDate('2023-12-25')).toEqual(new Date('2023-12-25')) // holiday
      expect(toDate('2024-02-14')).toEqual(new Date('2024-02-14')) // valentine's day
      expect(toDate('2023-07-04')).toEqual(new Date('2023-07-04')) // independence day
    })

    test('should convert API response dates', () => {
      expect(toDate('2023-01-01T08:30:00Z')).toEqual(new Date('2023-01-01T08:30:00Z')) // UTC timestamp
      expect(toDate('2023-01-01T12:30:45.123Z')).toEqual(new Date('2023-01-01T12:30:45.123Z')) // with milliseconds
      expect(toDate('1672531200000')).toBeNull() // Unix timestamp strings aren't parsed
    })

    test('should convert form input dates', () => {
      expect(toDate('01/15/1990')).toEqual(new Date('01/15/1990')) // MM/DD/YYYY
      expect(toDate('12/25/2023')).toEqual(new Date('12/25/2023')) // MM/DD/YYYY
      expect(toDate('2023-12-25')).toEqual(new Date('2023-12-25')) // YYYY-MM-DD
    })

    test('should convert database dates', () => {
      expect(toDate('2023-01-01 08:30:00')).toEqual(new Date('2023-01-01 08:30:00')) // MySQL datetime
      expect(toDate('2023-01-01T08:30:00.000Z')).toEqual(new Date('2023-01-01T08:30:00.000Z')) // ISO with milliseconds
    })

    test('should convert log timestamps', () => {
      expect(toDate('2023-01-01T08:30:45.123Z')).toEqual(new Date('2023-01-01T08:30:45.123Z'))
      expect(toDate('2023-01-01 08:30:45')).toEqual(new Date('2023-01-01 08:30:45'))
      expect(toDate('Jan 1 08:30:45 2023')).toEqual(new Date('Jan 1 08:30:45 2023'))
    })
  })

  describe('timezone handling', () => {
    test('should handle UTC timezone', () => {
      expect(toDate('2023-01-01T12:00:00Z')).toEqual(new Date('2023-01-01T12:00:00Z'))
      expect(toDate('2023-01-01T12:00:00.000Z')).toEqual(new Date('2023-01-01T12:00:00.000Z'))
      expect(toDate('2023-01-01T12:00:00+00:00')).toEqual(new Date('2023-01-01T12:00:00+00:00'))
    })

    test('should handle positive timezone offsets', () => {
      expect(toDate('2023-01-01T12:00:00+05:30')).toEqual(new Date('2023-01-01T12:00:00+05:30')) // India
      expect(toDate('2023-01-01T12:00:00+09:00')).toEqual(new Date('2023-01-01T12:00:00+09:00')) // Japan
      expect(toDate('2023-01-01T12:00:00+01:00')).toEqual(new Date('2023-01-01T12:00:00+01:00')) // Central Europe
    })

    test('should handle negative timezone offsets', () => {
      expect(toDate('2023-01-01T12:00:00-05:00')).toEqual(new Date('2023-01-01T12:00:00-05:00')) // Eastern US
      expect(toDate('2023-01-01T12:00:00-08:00')).toEqual(new Date('2023-01-01T12:00:00-08:00')) // Pacific US
      expect(toDate('2023-01-01T12:00:00-03:00')).toEqual(new Date('2023-01-01T12:00:00-03:00')) // Brazil
    })
  })

  describe('performance considerations', () => {
    test('should handle many conversions efficiently', () => {
      const testDates = [
        '2023-01-01',
        '2023-12-31',
        '01/01/2023',
        '12/31/2023',
        '2023-01-01T12:30:45',
        '2023-01-01T12:30:45Z',
        '1672531200000',
        'January 1, 2023',
        'Jan 1, 2023',
      ]

      const start = Date.now()
      testDates.forEach((dateStr) => {
        toDate(dateStr)
      })
      const end = Date.now()

      expect(end - start).toBeLessThan(50) // Should complete quickly
    })

    test('should handle very long date strings efficiently', () => {
      const longDateString = '2023-01-01T12:30:45.123456789Z'

      const start = Date.now()
      const result = toDate(longDateString)
      const end = Date.now()

      expect(result).toBeInstanceOf(Date)
      expect(end - start).toBeLessThan(50) // Should handle quickly
    })
  })

  describe('date validation', () => {
    test('should create valid Date objects for valid inputs', () => {
      const validDate = toDate('2023-01-01')
      expect(validDate).toBeInstanceOf(Date)
      expect(validDate!.getTime()).not.toBeNaN()
    })

    test('should return null for invalid inputs', () => {
      const invalidDate = toDate('invalid date')
      expect(invalidDate).toBeNull()
    })

    test('should handle edge cases in date validation', () => {
      // These should create valid Date objects (Date.parse handles overflow)
      expect(toDate('2023-02-30')).toEqual(new Date('2023-02-30')) // rolls over to March 2nd
      expect(toDate('2023-13-01')).toBeNull() // invalid month returns null
      expect(toDate('2023-01-32')).toBeNull() // invalid day returns null
    })
  })

  describe('integration scenarios', () => {
    test('should work with form date inputs', () => {
      // Common form date formats
      expect(toDate('2023-01-01')).toEqual(new Date('2023-01-01')) // HTML date input
      expect(toDate('01/01/2023')).toEqual(new Date('01/01/2023')) // US format
      expect(toDate('2023-01-01T12:30')).toEqual(new Date('2023-01-01T12:30')) // datetime-local input
    })

    test('should work with API date parsing', () => {
      // Common API date formats
      expect(toDate('2023-01-01T12:30:45Z')).toEqual(new Date('2023-01-01T12:30:45Z')) // ISO 8601
      expect(toDate('1672531200000')).toBeNull() // Unix timestamp strings aren't parsed
      expect(toDate('2023-01-01T12:30:45.123Z')).toEqual(new Date('2023-01-01T12:30:45.123Z')) // with milliseconds
    })

    test('should work with database date parsing', () => {
      // Common database date formats
      expect(toDate('2023-01-01 12:30:45')).toEqual(new Date('2023-01-01 12:30:45')) // MySQL datetime
      expect(toDate('2023-01-01T12:30:45.000Z')).toEqual(new Date('2023-01-01T12:30:45.000Z')) // PostgreSQL timestamp
    })
  })

  describe('error handling', () => {
    test('should handle non-string input gracefully', () => {
      expect(toDate(123 as any)).toEqual(new Date(Date.parse(123 as any))) // numbers are parsed as date strings, not timestamps
      expect(toDate(null as any)).toBeNull()
      expect(toDate(undefined as any)).toBeNull()
      expect(toDate({} as any)).toBeNull() // objects return null
      expect(toDate([] as any)).toBeNull() // arrays return null
      expect(toDate(true as any)).toBeNull() // booleans return null
    })
  })

  describe('comparison with Date constructor', () => {
    test('should behave similarly to Date constructor', () => {
      const testCases = [
        '2023-01-01',
        '2023-12-31',
        '01/01/2023',
        '2023-01-01T12:30:45',
        '2023-01-01T12:30:45Z',
        'January 1, 2023',
        'invalid date',
        '',
      ]

      testCases.forEach((testCase) => {
        const toDateResult = toDate(testCase)
        const dateConstructorResult = new Date(testCase)

        if (toDateResult === null && Number.isNaN(dateConstructorResult.getTime())) {
          // Both indicate invalid date (null vs Invalid Date)
          expect(toDateResult).toBeNull()
          expect(Number.isNaN(dateConstructorResult.getTime())).toBe(true)
        }
        else if (toDateResult !== null) {
          expect(toDateResult.getTime()).toBe(dateConstructorResult.getTime())
        }
      })
    })
  })

  describe('date arithmetic compatibility', () => {
    test('should work with date arithmetic operations', () => {
      const date1 = toDate('2023-01-01')
      const date2 = toDate('2023-01-02')

      expect(date2!.getTime() - date1!.getTime()).toBe(24 * 60 * 60 * 1000) // 1 day in milliseconds
    })

    test('should work with date comparison operations', () => {
      const date1 = toDate('2023-01-01')
      const date2 = toDate('2023-01-02')

      expect(date1! < date2!).toBe(true)
      expect(date2! > date1!).toBe(true)
      expect(date1!.getTime() === toDate('2023-01-01')!.getTime()).toBe(true)
    })
  })
})
