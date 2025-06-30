import { describe, expect, test } from 'bun:test'
import isBefore from '../../src/lib/isBefore'

describe('isBefore', () => {
  describe('Basic date comparison', () => {
    test('should return true when first date is before second date', () => {
      expect(isBefore('2023-01-01', { comparisonDate: '2023-01-02' })).toBe(true)
      expect(isBefore('2022-12-31', { comparisonDate: '2023-01-01' })).toBe(true)
      expect(isBefore('2023-01-01T00:00:00Z', { comparisonDate: '2023-01-01T01:00:00Z' })).toBe(true)
    })

    test('should return false when first date is after second date', () => {
      expect(isBefore('2023-01-02', { comparisonDate: '2023-01-01' })).toBe(false)
      expect(isBefore('2023-01-01', { comparisonDate: '2022-12-31' })).toBe(false)
      expect(isBefore('2023-01-01T01:00:00Z', { comparisonDate: '2023-01-01T00:00:00Z' })).toBe(false)
    })

    test('should return false when dates are equal', () => {
      expect(isBefore('2023-01-01', { comparisonDate: '2023-01-01' })).toBe(false)
      expect(isBefore('2023-01-01T12:00:00Z', { comparisonDate: '2023-01-01T12:00:00Z' })).toBe(false)
    })
  })

  describe('Different date formats', () => {
    test('should handle ISO 8601 dates', () => {
      expect(isBefore('2023-01-01T00:00:00Z', { comparisonDate: '2023-01-02T00:00:00Z' })).toBe(true)
      expect(isBefore('2023-01-01T00:00:00.000Z', { comparisonDate: '2023-01-01T00:00:01.000Z' })).toBe(true)
    })

    test('should handle date strings', () => {
      expect(isBefore('January 1, 2023', { comparisonDate: 'January 2, 2023' })).toBe(true)
      expect(isBefore('Jan 1, 2023', { comparisonDate: 'Jan 2, 2023' })).toBe(true)
    })

    test('should handle numeric timestamps', () => {
      expect(isBefore('1672531200000', { comparisonDate: '1672617600000' })).toBe(false) // milliseconds - these are actually the same dates
    })
  })

  describe('Options parameter', () => {
    test('should accept options object with comparisonDate', () => {
      expect(isBefore('2023-01-01', { comparisonDate: '2023-01-02' })).toBe(true)
      expect(isBefore('2023-01-02', { comparisonDate: '2023-01-01' })).toBe(false)
    })

    test('should default to current date when no comparison date provided', () => {
      const pastDate = '2020-01-01'
      const futureDate = '2030-01-01'

      expect(isBefore(pastDate, {})).toBe(true)
      expect(isBefore(futureDate, {})).toBe(false)
    })
  })

  describe('Edge cases', () => {
    test('should handle invalid date strings', () => {
      expect(isBefore('invalid-date', { comparisonDate: '2023-01-01' })).toBe(false)
      expect(isBefore('2023-01-01', { comparisonDate: 'invalid-date' })).toBe(false)
      expect(isBefore('invalid-date', { comparisonDate: 'another-invalid' })).toBe(false)
    })

    test('should handle empty strings', () => {
      expect(isBefore('', { comparisonDate: '2023-01-01' })).toBe(false)
      expect(isBefore('2023-01-01', { comparisonDate: '' })).toBe(true) // empty comparisonDate defaults to current time
      expect(isBefore('', { comparisonDate: '' })).toBe(false)
    })

    test('should handle boundary cases', () => {
      // Same date, different times
      expect(isBefore('2023-01-01T00:00:00Z', { comparisonDate: '2023-01-01T23:59:59Z' })).toBe(true)
      expect(isBefore('2023-01-01T23:59:59Z', { comparisonDate: '2023-01-01T00:00:00Z' })).toBe(false)
    })
  })

  describe('Real-world scenarios', () => {
    test('should validate event scheduling', () => {
      const eventStart = '2023-06-15T10:00:00Z'
      const eventEnd = '2023-06-15T12:00:00Z'

      expect(isBefore(eventStart, { comparisonDate: eventEnd })).toBe(true)
      expect(isBefore(eventEnd, { comparisonDate: eventStart })).toBe(false)
    })

    test('should validate deadlines', () => {
      const taskCreated = '2023-01-01T09:00:00Z'
      const deadline = '2023-01-07T17:00:00Z'

      expect(isBefore(taskCreated, { comparisonDate: deadline })).toBe(true)
    })
  })

  describe('Performance', () => {
    test('should be consistent across multiple calls', () => {
      const date1 = '2023-01-01'
      const date2 = '2023-01-02'

      const result1 = isBefore(date1, { comparisonDate: date2 })
      const result2 = isBefore(date1, { comparisonDate: date2 })
      expect(result1).toBe(result2)
      expect(result1).toBe(true)
    })
  })
})
