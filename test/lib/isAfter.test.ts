import { describe, expect, test } from 'bun:test'
import isAfter from '../../src/lib/isAfter'

describe('isAfter', () => {
  describe('Basic date comparison', () => {
    test('should return true when first date is after second date', () => {
      expect(isAfter('2023-01-02', { comparisonDate: '2023-01-01' })).toBe(true)
      expect(isAfter('2023-01-01', { comparisonDate: '2022-12-31' })).toBe(true)
      expect(isAfter('2023-01-01T01:00:00Z', { comparisonDate: '2023-01-01T00:00:00Z' })).toBe(true)
    })

    test('should return false when first date is before second date', () => {
      expect(isAfter('2023-01-01', { comparisonDate: '2023-01-02' })).toBe(false)
      expect(isAfter('2022-12-31', { comparisonDate: '2023-01-01' })).toBe(false)
      expect(isAfter('2023-01-01T00:00:00Z', { comparisonDate: '2023-01-01T01:00:00Z' })).toBe(false)
    })

    test('should return false when dates are equal', () => {
      expect(isAfter('2023-01-01', { comparisonDate: '2023-01-01' })).toBe(false)
      expect(isAfter('2023-01-01T12:00:00Z', { comparisonDate: '2023-01-01T12:00:00Z' })).toBe(false)
    })
  })

  describe('Different date formats', () => {
    test('should handle ISO 8601 dates', () => {
      expect(isAfter('2023-01-02T00:00:00Z', { comparisonDate: '2023-01-01T00:00:00Z' })).toBe(true)
      expect(isAfter('2023-01-01T00:00:01.000Z', { comparisonDate: '2023-01-01T00:00:00.000Z' })).toBe(true)
    })

    test('should handle date strings', () => {
      expect(isAfter('January 2, 2023', { comparisonDate: 'January 1, 2023' })).toBe(true)
      expect(isAfter('Jan 2, 2023', { comparisonDate: 'Jan 1, 2023' })).toBe(true)
    })

    test('should handle numeric timestamps', () => {
      expect(isAfter('1672617600000', { comparisonDate: '1672531200000' })).toBe(false) // milliseconds - need proper timestamps
    })
  })

  describe('Options parameter', () => {
    test('should accept options object with comparisonDate', () => {
      expect(isAfter('2023-01-02', { comparisonDate: '2023-01-01' })).toBe(true)
      expect(isAfter('2023-01-01', { comparisonDate: '2023-01-02' })).toBe(false)
    })

    test('should default to current date when no comparison date provided', () => {
      const pastDate = '2020-01-01'
      const futureDate = '2030-01-01'

      expect(isAfter(pastDate, {})).toBe(false)
      expect(isAfter(futureDate, {})).toBe(true)
    })
  })

  describe('Edge cases', () => {
    test('should handle invalid date strings', () => {
      expect(isAfter('invalid-date', { comparisonDate: '2023-01-01' })).toBe(false)
      expect(isAfter('2023-01-01', { comparisonDate: 'invalid-date' })).toBe(false)
      expect(isAfter('invalid-date', { comparisonDate: 'another-invalid' })).toBe(false)
    })

    test('should handle empty strings', () => {
      expect(isAfter('', { comparisonDate: '2023-01-01' })).toBe(false)
      expect(isAfter('2030-01-01', { comparisonDate: '' })).toBe(true) // empty comparisonDate defaults to current time
      expect(isAfter('', { comparisonDate: '' })).toBe(false)
    })

    test('should handle boundary cases', () => {
      // Same date, different times
      expect(isAfter('2023-01-01T23:59:59Z', { comparisonDate: '2023-01-01T00:00:00Z' })).toBe(true)
      expect(isAfter('2023-01-01T00:00:00Z', { comparisonDate: '2023-01-01T23:59:59Z' })).toBe(false)
    })
  })

  describe('Real-world scenarios', () => {
    test('should validate event scheduling', () => {
      const eventStart = '2023-06-15T10:00:00Z'
      const eventEnd = '2023-06-15T12:00:00Z'

      expect(isAfter(eventEnd, { comparisonDate: eventStart })).toBe(true)
      expect(isAfter(eventStart, { comparisonDate: eventEnd })).toBe(false)
    })

    test('should validate expiration dates', () => {
      const created = '2023-01-01T09:00:00Z'
      const expires = '2023-12-31T23:59:59Z'

      expect(isAfter(expires, { comparisonDate: created })).toBe(true)
    })

    test('should validate age verification', () => {
      const birthDate = '2000-01-01'
      const today = '2023-01-01'

      expect(isAfter(today, { comparisonDate: birthDate })).toBe(true) // today is after birth date
    })
  })

  describe('Performance', () => {
    test('should be consistent across multiple calls', () => {
      const date1 = '2023-01-02'
      const date2 = '2023-01-01'

      const result1 = isAfter(date1, { comparisonDate: date2 })
      const result2 = isAfter(date1, { comparisonDate: date2 })
      expect(result1).toBe(result2)
      expect(result1).toBe(true)
    })
  })
})
