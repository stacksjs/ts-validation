import { describe, expect, test } from 'bun:test'
import isDecimal from '../../src/lib/isDecimal'

describe('isDecimal', () => {
  describe('Basic decimal validation (en-US)', () => {
    test('should validate basic decimal numbers', () => {
      expect(isDecimal('123.45', {})).toBe(true)
      expect(isDecimal('0.5', {})).toBe(true)
      expect(isDecimal('999.999', {})).toBe(true)
      expect(isDecimal('1.0', {})).toBe(true)
    })

    test('should validate integers as decimals', () => {
      expect(isDecimal('123', {})).toBe(true)
      expect(isDecimal('0', {})).toBe(true)
      expect(isDecimal('999', {})).toBe(true)
    })

    test('should validate negative decimals', () => {
      expect(isDecimal('-123.45', {})).toBe(true)
      expect(isDecimal('-0.5', {})).toBe(true)
      expect(isDecimal('-999', {})).toBe(true)
    })

    test('should validate positive signed decimals', () => {
      expect(isDecimal('+123.45', {})).toBe(true)
      expect(isDecimal('+0.5', {})).toBe(true)
      expect(isDecimal('+999', {})).toBe(true)
    })

    test('should reject invalid formats', () => {
      expect(isDecimal('abc', {})).toBe(false)
      expect(isDecimal('123.45.67', {})).toBe(false)
      expect(isDecimal('123,45', {})).toBe(false) // wrong separator for en-US
      expect(isDecimal('123.', {})).toBe(false)
      expect(isDecimal('.123', {})).toBe(true) // valid decimal starting with dot
    })
  })

  describe('Force decimal option', () => {
    test('should require decimal point when force_decimal is true', () => {
      expect(isDecimal('123.45', { force_decimal: true })).toBe(true)
      expect(isDecimal('0.5', { force_decimal: true })).toBe(true)
      expect(isDecimal('123', { force_decimal: true })).toBe(false) // no decimal point
      expect(isDecimal('0', { force_decimal: true })).toBe(false) // no decimal point
    })

    test('should allow integers when force_decimal is false', () => {
      expect(isDecimal('123.45', { force_decimal: false })).toBe(true)
      expect(isDecimal('123', { force_decimal: false })).toBe(true)
      expect(isDecimal('0', { force_decimal: false })).toBe(true)
    })
  })

  describe('Decimal digits option', () => {
    test('should validate specific number of decimal digits', () => {
      expect(isDecimal('123.45', { decimal_digits: '2' })).toBe(true)
      expect(isDecimal('123.4', { decimal_digits: '1' })).toBe(true)
      expect(isDecimal('123.456', { decimal_digits: '3' })).toBe(true)
    })

    test('should reject wrong number of decimal digits', () => {
      expect(isDecimal('123.45', { decimal_digits: '1' })).toBe(false)
      expect(isDecimal('123.4', { decimal_digits: '2' })).toBe(false)
      expect(isDecimal('123.456', { decimal_digits: '2' })).toBe(false)
    })

    test('should handle range of decimal digits', () => {
      expect(isDecimal('123.4', { decimal_digits: '1,3' })).toBe(true)
      expect(isDecimal('123.45', { decimal_digits: '1,3' })).toBe(true)
      expect(isDecimal('123.456', { decimal_digits: '1,3' })).toBe(true)
      expect(isDecimal('123.4567', { decimal_digits: '1,3' })).toBe(false)
    })

    test('should handle unlimited decimal digits', () => {
      expect(isDecimal('123.4', { decimal_digits: '1,' })).toBe(true)
      expect(isDecimal('123.4567890123', { decimal_digits: '1,' })).toBe(true)
    })
  })

  describe('Locale support', () => {
    test('should validate European format with comma decimal separator', () => {
      expect(isDecimal('123,45', { locale: 'de-DE' })).toBe(true)
      expect(isDecimal('0,5', { locale: 'de-DE' })).toBe(true)
      expect(isDecimal('-123,45', { locale: 'de-DE' })).toBe(true)
    })

    test('should reject wrong separator for locale', () => {
      expect(isDecimal('123.45', { locale: 'de-DE' })).toBe(false) // should use comma
      expect(isDecimal('123,45', { locale: 'en-US' })).toBe(false) // should use period
    })

    test('should handle Arabic numerals', () => {
      expect(isDecimal('123٫45', { locale: 'ar' })).toBe(true) // Arabic uses ٫ as decimal separator
      expect(isDecimal('0٫5', { locale: 'ar' })).toBe(true)
    })

    test('should throw error for invalid locale', () => {
      expect(() => isDecimal('123.45', { locale: 'invalid-locale' })).toThrow()
      expect(() => isDecimal('123.45', { locale: 'xx-XX' })).toThrow()
    })
  })

  describe('Edge cases', () => {
    test('should handle empty string', () => {
      expect(isDecimal('', {})).toBe(false)
    })

    test('should handle whitespace', () => {
      expect(isDecimal('  123.45  ', {})).toBe(false) // spaces are not automatically removed
      expect(isDecimal('123 .45', {})).toBe(false) // internal spaces not allowed
      expect(isDecimal('123. 45', {})).toBe(false) // internal spaces not allowed
    })

    test('should reject blacklisted values', () => {
      expect(isDecimal('', {})).toBe(false)
      expect(isDecimal('-', {})).toBe(false)
      expect(isDecimal('+', {})).toBe(false)
      expect(isDecimal(' - ', {})).toBe(false) // spaces removed, then blacklisted
      expect(isDecimal(' + ', {})).toBe(false) // spaces removed, then blacklisted
    })

    test('should handle leading zeros', () => {
      expect(isDecimal('0123.45', {})).toBe(true)
      expect(isDecimal('00.5', {})).toBe(true)
      expect(isDecimal('000', {})).toBe(true)
    })

    test('should handle very long decimal numbers', () => {
      const longDecimal = `123.${'4'.repeat(100)}`
      expect(isDecimal(longDecimal, { decimal_digits: '1,' })).toBe(true)
    })
  })

  describe('Real-world use cases', () => {
    test('should validate currency amounts', () => {
      expect(isDecimal('19.99', { decimal_digits: '2' })).toBe(true)
      expect(isDecimal('1.50', { decimal_digits: '2' })).toBe(true)
      expect(isDecimal('0.01', { decimal_digits: '2' })).toBe(true)
      expect(isDecimal('1000.00', { decimal_digits: '2' })).toBe(true)
    })

    test('should validate scientific measurements', () => {
      expect(isDecimal('3.14159', { decimal_digits: '1,' })).toBe(true)
      expect(isDecimal('2.71828', { decimal_digits: '1,' })).toBe(true)
      expect(isDecimal('9.80665', { decimal_digits: '1,' })).toBe(true)
    })

    test('should validate percentages', () => {
      expect(isDecimal('99.9', { decimal_digits: '1' })).toBe(true)
      expect(isDecimal('50.0', { decimal_digits: '1' })).toBe(true)
      expect(isDecimal('0.1', { decimal_digits: '1' })).toBe(true)
    })

    test('should validate coordinates', () => {
      expect(isDecimal('40.7128', { decimal_digits: '4' })).toBe(true) // NYC latitude
      expect(isDecimal('-74.0060', { decimal_digits: '4' })).toBe(true) // NYC longitude
      expect(isDecimal('51.5074', { decimal_digits: '4' })).toBe(true) // London latitude
    })

    test('should validate European prices', () => {
      expect(isDecimal('19,99', { locale: 'de-DE', decimal_digits: '2' })).toBe(true)
      expect(isDecimal('1,50', { locale: 'de-DE', decimal_digits: '2' })).toBe(true)
      expect(isDecimal('1000,00', { locale: 'de-DE', decimal_digits: '2' })).toBe(true)
    })
  })

  describe('Combined options', () => {
    test('should handle multiple options together', () => {
      const options = {
        force_decimal: true,
        decimal_digits: '2',
        locale: 'en-US',
      }

      expect(isDecimal('123.45', options)).toBe(true)
      expect(isDecimal('123', options)).toBe(false) // force_decimal requires decimal point
      expect(isDecimal('123.456', options)).toBe(false) // wrong number of digits
      expect(isDecimal('123,45', options)).toBe(false) // wrong locale separator
    })

    test('should handle European locale with forced decimal', () => {
      const options = {
        force_decimal: true,
        decimal_digits: '2',
        locale: 'de-DE',
      }

      expect(isDecimal('123,45', options)).toBe(true)
      expect(isDecimal('123', options)).toBe(false)
      expect(isDecimal('123.45', options)).toBe(false) // wrong separator
    })
  })

  describe('Input validation', () => {
    test('should throw error for non-string input', () => {
      expect(() => isDecimal(null as any, {})).toThrow()
      expect(() => isDecimal(undefined as any, {})).toThrow()
      expect(() => isDecimal(123.45 as any, {})).toThrow()
      expect(() => isDecimal([] as any, {})).toThrow()
      expect(() => isDecimal({} as any, {})).toThrow()
    })
  })

  describe('Performance', () => {
    test('should be consistent across multiple calls', () => {
      const input = '123.45'
      const options = { locale: 'en-US', decimal_digits: '2' }

      const result1 = isDecimal(input, options)
      const result2 = isDecimal(input, options)
      expect(result1).toBe(result2)
      expect(result1).toBe(true)
    })

    test('should handle many decimal places efficiently', () => {
      const manyDecimals = `1.${'2'.repeat(1000)}`
      expect(isDecimal(manyDecimals, { decimal_digits: '1,' })).toBe(true)
    })
  })
})
