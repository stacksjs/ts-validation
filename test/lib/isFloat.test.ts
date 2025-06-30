import { describe, expect, test } from 'bun:test'
import isFloat from '../../src/lib/isFloat'

describe('isFloat', () => {
  describe('basic float validation', () => {
    test('should validate basic float numbers', () => {
      expect(isFloat('123.45')).toBe(true)
      expect(isFloat('0.1')).toBe(true)
      expect(isFloat('1.0')).toBe(true)
      expect(isFloat('999.999')).toBe(true)
      expect(isFloat('0.0')).toBe(true)
    })

    test('should validate negative float numbers', () => {
      expect(isFloat('-123.45')).toBe(true)
      expect(isFloat('-0.1')).toBe(true)
      expect(isFloat('-1.0')).toBe(true)
      expect(isFloat('-999.999')).toBe(true)
    })

    test('should validate positive float numbers with explicit sign', () => {
      expect(isFloat('+123.45')).toBe(true)
      expect(isFloat('+0.1')).toBe(true)
      expect(isFloat('+1.0')).toBe(true)
      expect(isFloat('+999.999')).toBe(true)
    })

    test('should validate integers as floats', () => {
      expect(isFloat('123')).toBe(true)
      expect(isFloat('0')).toBe(true)
      expect(isFloat('-456')).toBe(true)
      expect(isFloat('+789')).toBe(true)
    })

    test('should validate scientific notation', () => {
      expect(isFloat('1e10')).toBe(true)
      expect(isFloat('1E10')).toBe(true)
      expect(isFloat('1.23e-4')).toBe(true)
      expect(isFloat('1.23E+4')).toBe(true)
      expect(isFloat('-1.23e-4')).toBe(true)
      expect(isFloat('+1.23E+4')).toBe(true)
    })

    test('should reject invalid float strings', () => {
      expect(isFloat('abc')).toBe(false)
      expect(isFloat('123abc')).toBe(false)
      expect(isFloat('12.34.56')).toBe(false)
      expect(isFloat('12..34')).toBe(false)
      expect(isFloat('12.34e')).toBe(false)
      expect(isFloat('12.34e+')).toBe(false)
      expect(isFloat('12.34e-')).toBe(false)
    })

    test('should reject empty and invalid strings', () => {
      expect(isFloat('')).toBe(false)
      expect(isFloat('.')).toBe(false)
      expect(isFloat(',')).toBe(false)
      expect(isFloat('-')).toBe(false)
      expect(isFloat('+')).toBe(false)
      expect(isFloat(' ')).toBe(false)
      expect(isFloat('  123.45  ')).toBe(false)
    })
  })

  describe('locale-specific decimal separators', () => {
    test('should validate German locale with comma separator', () => {
      expect(isFloat('123,45', { locale: 'de-DE' })).toBe(true)
      expect(isFloat('0,1', { locale: 'de-DE' })).toBe(true)
      expect(isFloat('-123,45', { locale: 'de-DE' })).toBe(true)
      expect(isFloat('+123,45', { locale: 'de-DE' })).toBe(true)
    })

    test('should validate French locale with comma separator', () => {
      expect(isFloat('123,45', { locale: 'fr-FR' })).toBe(true)
      expect(isFloat('0,1', { locale: 'fr-FR' })).toBe(true)
      expect(isFloat('-123,45', { locale: 'fr-FR' })).toBe(true)
      expect(isFloat('+123,45', { locale: 'fr-FR' })).toBe(true)
    })

    test('should validate English locale with dot separator', () => {
      expect(isFloat('123.45', { locale: 'en-US' })).toBe(true)
      expect(isFloat('0.1', { locale: 'en-US' })).toBe(true)
      expect(isFloat('-123.45', { locale: 'en-US' })).toBe(true)
      expect(isFloat('+123.45', { locale: 'en-US' })).toBe(true)
    })

    test('should reject wrong separator for locale', () => {
      expect(isFloat('123.45', { locale: 'de-DE' })).toBe(false)
      expect(isFloat('123,45', { locale: 'en-US' })).toBe(false)
    })

    test('should reject all formats for unknown locale', () => {
      // Unknown locales cause regex construction to fail, rejecting all formats
      expect(isFloat('123.45', { locale: 'unknown' as any })).toBe(false)
      expect(isFloat('123,45', { locale: 'unknown' as any })).toBe(false)
    })
  })

  describe('range validation with min/max options', () => {
    test('should validate minimum value', () => {
      expect(isFloat('10.5', { min: 10 })).toBe(true)
      expect(isFloat('10.0', { min: 10 })).toBe(true)
      expect(isFloat('15.5', { min: 10 })).toBe(true)
      expect(isFloat('9.9', { min: 10 })).toBe(false)
    })

    test('should validate maximum value', () => {
      expect(isFloat('9.5', { max: 10 })).toBe(true)
      expect(isFloat('10.0', { max: 10 })).toBe(true)
      expect(isFloat('5.5', { max: 10 })).toBe(true)
      expect(isFloat('10.1', { max: 10 })).toBe(false)
    })

    test('should validate range with both min and max', () => {
      expect(isFloat('5.5', { min: 5, max: 10 })).toBe(true)
      expect(isFloat('7.5', { min: 5, max: 10 })).toBe(true)
      expect(isFloat('10.0', { min: 5, max: 10 })).toBe(true)
      expect(isFloat('5.0', { min: 5, max: 10 })).toBe(true)
      expect(isFloat('4.9', { min: 5, max: 10 })).toBe(false)
      expect(isFloat('10.1', { min: 5, max: 10 })).toBe(false)
    })

    test('should validate with negative ranges', () => {
      expect(isFloat('-5.5', { min: -10, max: -1 })).toBe(true)
      expect(isFloat('-10.0', { min: -10, max: -1 })).toBe(true)
      expect(isFloat('-1.0', { min: -10, max: -1 })).toBe(true)
      expect(isFloat('-0.9', { min: -10, max: -1 })).toBe(false)
      expect(isFloat('-10.1', { min: -10, max: -1 })).toBe(false)
    })
  })

  describe('strict comparison with lt/gt options', () => {
    test('should validate less than (lt) option', () => {
      expect(isFloat('9.9', { lt: 10 })).toBe(true)
      expect(isFloat('5.5', { lt: 10 })).toBe(true)
      expect(isFloat('10.0', { lt: 10 })).toBe(false)
      expect(isFloat('10.1', { lt: 10 })).toBe(false)
    })

    test('should validate greater than (gt) option', () => {
      expect(isFloat('10.1', { gt: 10 })).toBe(true)
      expect(isFloat('15.5', { gt: 10 })).toBe(true)
      expect(isFloat('10.0', { gt: 10 })).toBe(false)
      expect(isFloat('9.9', { gt: 10 })).toBe(false)
    })

    test('should validate with both lt and gt (range)', () => {
      expect(isFloat('7.5', { gt: 5, lt: 10 })).toBe(true)
      expect(isFloat('5.1', { gt: 5, lt: 10 })).toBe(true)
      expect(isFloat('9.9', { gt: 5, lt: 10 })).toBe(true)
      expect(isFloat('5.0', { gt: 5, lt: 10 })).toBe(false)
      expect(isFloat('10.0', { gt: 5, lt: 10 })).toBe(false)
      expect(isFloat('4.9', { gt: 5, lt: 10 })).toBe(false)
      expect(isFloat('10.1', { gt: 5, lt: 10 })).toBe(false)
    })
  })

  describe('combined options', () => {
    test('should validate with locale and range options', () => {
      expect(isFloat('7,5', { locale: 'de-DE', min: 5, max: 10 })).toBe(true)
      expect(isFloat('10,0', { locale: 'de-DE', min: 5, max: 10 })).toBe(true)
      expect(isFloat('4,9', { locale: 'de-DE', min: 5, max: 10 })).toBe(false)
      expect(isFloat('10,1', { locale: 'de-DE', min: 5, max: 10 })).toBe(false)
    })

    test('should validate with all options combined', () => {
      expect(isFloat('7,5', { locale: 'de-DE', min: 5, max: 15, gt: 6, lt: 12 })).toBe(true)
      expect(isFloat('8,0', { locale: 'de-DE', min: 5, max: 15, gt: 6, lt: 12 })).toBe(true)
      expect(isFloat('6,0', { locale: 'de-DE', min: 5, max: 15, gt: 6, lt: 12 })).toBe(false) // not > 6
      expect(isFloat('12,0', { locale: 'de-DE', min: 5, max: 15, gt: 6, lt: 12 })).toBe(false) // not < 12
    })
  })

  describe('edge cases', () => {
    test('should handle very large numbers', () => {
      expect(isFloat('999999999999999.999999')).toBe(true)
      expect(isFloat('1e308')).toBe(true)
      expect(isFloat('-1e308')).toBe(true)
    })

    test('should handle very small numbers', () => {
      expect(isFloat('0.000000000001')).toBe(true)
      expect(isFloat('1e-308')).toBe(true)
      expect(isFloat('-1e-308')).toBe(true)
    })

    test('should handle leading zeros', () => {
      expect(isFloat('00123.45')).toBe(true)
      expect(isFloat('0000.1')).toBe(true)
      expect(isFloat('000')).toBe(true)
    })

    test('should handle decimal-only numbers', () => {
      expect(isFloat('.5')).toBe(true)
      expect(isFloat('-.5')).toBe(true)
      expect(isFloat('+.5')).toBe(true)
      expect(isFloat('.123')).toBe(true)
    })

    test('should handle integer-only numbers with decimal point', () => {
      expect(isFloat('123.')).toBe(true)
      expect(isFloat('-123.')).toBe(true)
      expect(isFloat('+123.')).toBe(true)
    })

    test('should handle null/undefined min/max values', () => {
      expect(isFloat('5.5', { min: null as any })).toBe(true)
      expect(isFloat('5.5', { max: undefined as any })).toBe(true)
      expect(isFloat('5.5', { min: null as any, max: undefined as any })).toBe(true)
    })
  })

  describe('real-world use cases', () => {
    test('should validate currency amounts', () => {
      expect(isFloat('19.99', { min: 0 })).toBe(true)
      expect(isFloat('1234.56', { min: 0 })).toBe(true)
      expect(isFloat('0.01', { min: 0 })).toBe(true)
      expect(isFloat('-10.00', { min: 0 })).toBe(false)
    })

    test('should validate temperature readings', () => {
      expect(isFloat('23.5', { min: -50, max: 50 })).toBe(true)
      expect(isFloat('-10.2', { min: -50, max: 50 })).toBe(true)
      expect(isFloat('0.0', { min: -50, max: 50 })).toBe(true)
      expect(isFloat('51.0', { min: -50, max: 50 })).toBe(false)
      expect(isFloat('-51.0', { min: -50, max: 50 })).toBe(false)
    })

    test('should validate percentage values', () => {
      expect(isFloat('50.5', { min: 0, max: 100 })).toBe(true)
      expect(isFloat('0.0', { min: 0, max: 100 })).toBe(true)
      expect(isFloat('100.0', { min: 0, max: 100 })).toBe(true)
      expect(isFloat('101.0', { min: 0, max: 100 })).toBe(false)
      expect(isFloat('-1.0', { min: 0, max: 100 })).toBe(false)
    })

    test('should validate GPS coordinates', () => {
      // Latitude: -90 to 90
      expect(isFloat('40.7128', { min: -90, max: 90 })).toBe(true)
      expect(isFloat('-74.0060', { min: -180, max: 180 })).toBe(true)
      expect(isFloat('90.0', { min: -90, max: 90 })).toBe(true)
      expect(isFloat('-90.0', { min: -90, max: 90 })).toBe(true)
      expect(isFloat('91.0', { min: -90, max: 90 })).toBe(false)
      expect(isFloat('-91.0', { min: -90, max: 90 })).toBe(false)
    })

    test('should validate European number format', () => {
      expect(isFloat('1.234,56', { locale: 'de-DE' })).toBe(false) // This format not supported
      expect(isFloat('1234,56', { locale: 'de-DE' })).toBe(true)
      expect(isFloat('0,5', { locale: 'de-DE' })).toBe(true)
    })
  })

  describe('error handling', () => {
    test('should throw error for non-string input', () => {
      expect(() => isFloat(123 as any)).toThrow('Expected a string but received a number')
      expect(() => isFloat(null as any)).toThrow('Expected a string but received a null')
      expect(() => isFloat(undefined as any)).toThrow('Expected a string but received a undefined')
      expect(() => isFloat({} as any)).toThrow('Expected a string but received a Object')
      expect(() => isFloat([] as any)).toThrow('Expected a string but received a Array')
    })
  })
})
