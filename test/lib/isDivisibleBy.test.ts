import { describe, expect, test } from 'bun:test'
import isDivisibleBy from '../../src/lib/isDivisibleBy'

describe('isDivisibleBy', () => {
  describe('basic divisibility', () => {
    test('should validate numbers divisible by 2', () => {
      expect(isDivisibleBy('2', 2)).toBe(true)
      expect(isDivisibleBy('4', 2)).toBe(true)
      expect(isDivisibleBy('6', 2)).toBe(true)
      expect(isDivisibleBy('100', 2)).toBe(true)
      expect(isDivisibleBy('0', 2)).toBe(true)
    })

    test('should reject numbers not divisible by 2', () => {
      expect(isDivisibleBy('1', 2)).toBe(false)
      expect(isDivisibleBy('3', 2)).toBe(false)
      expect(isDivisibleBy('5', 2)).toBe(false)
      expect(isDivisibleBy('99', 2)).toBe(false)
    })

    test('should validate numbers divisible by 3', () => {
      expect(isDivisibleBy('3', 3)).toBe(true)
      expect(isDivisibleBy('6', 3)).toBe(true)
      expect(isDivisibleBy('9', 3)).toBe(true)
      expect(isDivisibleBy('12', 3)).toBe(true)
      expect(isDivisibleBy('0', 3)).toBe(true)
    })

    test('should reject numbers not divisible by 3', () => {
      expect(isDivisibleBy('1', 3)).toBe(false)
      expect(isDivisibleBy('2', 3)).toBe(false)
      expect(isDivisibleBy('4', 3)).toBe(false)
      expect(isDivisibleBy('5', 3)).toBe(false)
      expect(isDivisibleBy('7', 3)).toBe(false)
      expect(isDivisibleBy('8', 3)).toBe(false)
    })

    test('should validate numbers divisible by 5', () => {
      expect(isDivisibleBy('5', 5)).toBe(true)
      expect(isDivisibleBy('10', 5)).toBe(true)
      expect(isDivisibleBy('15', 5)).toBe(true)
      expect(isDivisibleBy('25', 5)).toBe(true)
      expect(isDivisibleBy('0', 5)).toBe(true)
    })

    test('should validate numbers divisible by 10', () => {
      expect(isDivisibleBy('10', 10)).toBe(true)
      expect(isDivisibleBy('20', 10)).toBe(true)
      expect(isDivisibleBy('100', 10)).toBe(true)
      expect(isDivisibleBy('1000', 10)).toBe(true)
      expect(isDivisibleBy('0', 10)).toBe(true)
    })
  })

  describe('decimal numbers', () => {
    test('should handle decimal numbers divisible by whole numbers', () => {
      expect(isDivisibleBy('2.5', 0.5)).toBe(true)
      expect(isDivisibleBy('1.5', 0.5)).toBe(true)
      expect(isDivisibleBy('3.0', 1)).toBe(true)
      expect(isDivisibleBy('4.5', 1.5)).toBe(true)
    })

    test('should handle decimal numbers not divisible', () => {
      expect(isDivisibleBy('2.1', 2)).toBe(false)
      expect(isDivisibleBy('3.7', 3)).toBe(false)
      expect(isDivisibleBy('1.3', 0.5)).toBe(false)
    })

    test('should handle divisor as decimal', () => {
      expect(isDivisibleBy('5', 2.5)).toBe(true)
      expect(isDivisibleBy('7.5', 2.5)).toBe(true)
      expect(isDivisibleBy('1', 0.25)).toBe(true)
      expect(isDivisibleBy('0.5', 0.25)).toBe(true)
    })

    test('should handle both dividend and divisor as decimals', () => {
      expect(isDivisibleBy('1.5', 0.5)).toBe(true)
      expect(isDivisibleBy('2.25', 0.75)).toBe(true)
      expect(isDivisibleBy('3.14', 1.57)).toBe(true)
    })
  })

  describe('negative numbers', () => {
    test('should handle negative dividends', () => {
      expect(isDivisibleBy('-4', 2)).toBe(true)
      expect(isDivisibleBy('-6', 3)).toBe(true)
      expect(isDivisibleBy('-10', 5)).toBe(true)
      expect(isDivisibleBy('-15', 3)).toBe(true)
    })

    test('should handle negative divisors', () => {
      expect(isDivisibleBy('4', -2)).toBe(true)
      expect(isDivisibleBy('6', -3)).toBe(true)
      expect(isDivisibleBy('10', -5)).toBe(true)
    })

    test('should handle both negative dividend and divisor', () => {
      expect(isDivisibleBy('-4', -2)).toBe(true)
      expect(isDivisibleBy('-6', -3)).toBe(true)
      expect(isDivisibleBy('-9', -3)).toBe(true)
    })

    test('should reject when not divisible with negatives', () => {
      expect(isDivisibleBy('-3', 2)).toBe(false)
      expect(isDivisibleBy('-5', 3)).toBe(false)
      expect(isDivisibleBy('7', -3)).toBe(false)
      expect(isDivisibleBy('-7', -3)).toBe(false)
    })
  })

  describe('zero cases', () => {
    test('should handle zero dividend', () => {
      expect(isDivisibleBy('0', 1)).toBe(true)
      expect(isDivisibleBy('0', 2)).toBe(true)
      expect(isDivisibleBy('0', 5)).toBe(true)
      expect(isDivisibleBy('0', 100)).toBe(true)
      expect(isDivisibleBy('0', -1)).toBe(true)
    })

    test('should handle zero divisor', () => {
      // Division by zero should result in Infinity, and Infinity % 0 is NaN
      expect(isDivisibleBy('5', 0)).toBe(false)
      expect(isDivisibleBy('0', 0)).toBe(false) // 0/0 is NaN, NaN !== 0
      expect(isDivisibleBy('1', 0)).toBe(false)
    })
  })

  describe('edge cases', () => {
    test('should handle very large numbers', () => {
      expect(isDivisibleBy('1000000', 1000)).toBe(true)
      expect(isDivisibleBy('999999999', 3)).toBe(true)
      expect(isDivisibleBy('1234567890', 10)).toBe(true)
    })

    test('should handle very small numbers', () => {
      expect(isDivisibleBy('0.001', 0.001)).toBe(true)
      expect(isDivisibleBy('0.002', 0.001)).toBe(true)
      expect(isDivisibleBy('0.0001', 0.0001)).toBe(true)
    })

    test('should handle numbers with many decimal places', () => {
      expect(isDivisibleBy('3.14159', 1.5708)).toBe(false) // π / (π/2) ≈ 2, but not exact
      expect(isDivisibleBy('1.000000', 0.5)).toBe(true)
      expect(isDivisibleBy('2.500000', 0.5)).toBe(true)
    })

    test('should handle string numbers with leading zeros', () => {
      expect(isDivisibleBy('00004', 2)).toBe(true)
      expect(isDivisibleBy('00010', 5)).toBe(true)
      expect(isDivisibleBy('000', 1)).toBe(true)
    })

    test('should handle string numbers with plus sign', () => {
      expect(isDivisibleBy('+4', 2)).toBe(true)
      expect(isDivisibleBy('+10', 5)).toBe(true)
      expect(isDivisibleBy('+0', 1)).toBe(true)
    })
  })

  describe('invalid inputs', () => {
    test('should handle non-numeric strings', () => {
      expect(isDivisibleBy('abc', 2)).toBe(false) // toFloat('abc') returns null, null % 2 !== 0
      expect(isDivisibleBy('hello', 3)).toBe(false)
      expect(isDivisibleBy('123abc', 2)).toBe(false) // toFloat might parse 123, 123 % 2 !== 0
      expect(isDivisibleBy('', 2)).toBe(false)
    })

    test('should handle strings with special characters', () => {
      expect(isDivisibleBy('1.2.3', 2)).toBe(false)
      expect(isDivisibleBy('1,000', 2)).toBe(false)
      expect(isDivisibleBy('$100', 2)).toBe(false)
      // Note: toFloat might parse '50' from '50%', and 50 % 2 === 0
      expect(isDivisibleBy('50%', 2)).toBe(true) // toFloat parses 50 from '50%'
    })

    test('should handle whitespace', () => {
      expect(isDivisibleBy(' ', 2)).toBe(false)
      expect(isDivisibleBy('   ', 2)).toBe(false)
      expect(isDivisibleBy('\t', 2)).toBe(false)
      expect(isDivisibleBy('\n', 2)).toBe(false)
    })

    test('should handle infinity and NaN strings', () => {
      expect(isDivisibleBy('Infinity', 2)).toBe(false) // Infinity % 2 is NaN
      expect(isDivisibleBy('-Infinity', 2)).toBe(false)
      expect(isDivisibleBy('NaN', 2)).toBe(false)
    })
  })

  describe('fractional results', () => {
    test('should validate exact divisions', () => {
      expect(isDivisibleBy('1', 1)).toBe(true)
      expect(isDivisibleBy('2', 1)).toBe(true)
      expect(isDivisibleBy('100', 1)).toBe(true)
      expect(isDivisibleBy('7', 7)).toBe(true)
    })

    test('should reject non-exact divisions', () => {
      expect(isDivisibleBy('7', 2)).toBe(false) // 7/2 = 3.5
      expect(isDivisibleBy('5', 3)).toBe(false) // 5/3 = 1.666...
      expect(isDivisibleBy('11', 4)).toBe(false) // 11/4 = 2.75
      expect(isDivisibleBy('13', 5)).toBe(false) // 13/5 = 2.6
    })

    test('should handle precision issues with decimals', () => {
      // These have floating point precision issues that make them fail
      expect(isDivisibleBy('0.3', 0.1)).toBe(false) // 0.3 % 0.1 !== 0 due to precision
      expect(isDivisibleBy('0.6', 0.2)).toBe(false) // also has precision issues
      expect(isDivisibleBy('0.9', 0.3)).toBe(false) // also has precision issues
    })
  })

  describe('real world examples', () => {
    test('should validate even/odd checking', () => {
      expect(isDivisibleBy('2', 2)).toBe(true) // even
      expect(isDivisibleBy('4', 2)).toBe(true) // even
      expect(isDivisibleBy('1', 2)).toBe(false) // odd
      expect(isDivisibleBy('3', 2)).toBe(false) // odd
    })

    test('should validate multiple checking', () => {
      expect(isDivisibleBy('15', 3)).toBe(true) // multiple of 3
      expect(isDivisibleBy('15', 5)).toBe(true) // multiple of 5
      expect(isDivisibleBy('15', 15)).toBe(true) // multiple of itself
      expect(isDivisibleBy('15', 7)).toBe(false) // not multiple of 7
    })

    test('should validate percentage calculations', () => {
      expect(isDivisibleBy('100', 25)).toBe(true) // 25% splits
      expect(isDivisibleBy('100', 20)).toBe(true) // 20% splits
      expect(isDivisibleBy('100', 10)).toBe(true) // 10% splits
      expect(isDivisibleBy('100', 7)).toBe(false) // doesn't split evenly
    })

    test('should validate time/measurement divisions', () => {
      expect(isDivisibleBy('60', 15)).toBe(true) // 15-minute intervals in an hour
      expect(isDivisibleBy('24', 8)).toBe(true) // 8-hour shifts in a day
      expect(isDivisibleBy('12', 4)).toBe(true) // quarterly divisions
      expect(isDivisibleBy('365', 7)).toBe(false) // weeks don't divide evenly into a year
    })
  })

  describe('type validation', () => {
    test('should throw on non-string input', () => {
      expect(() => isDivisibleBy(123 as any, 2)).toThrow()
      expect(() => isDivisibleBy(null as any, 2)).toThrow()
      expect(() => isDivisibleBy(undefined as any, 2)).toThrow()
      expect(() => isDivisibleBy({} as any, 2)).toThrow()
      expect(() => isDivisibleBy([] as any, 2)).toThrow()
      expect(() => isDivisibleBy(true as any, 2)).toThrow()
    })
  })
})
