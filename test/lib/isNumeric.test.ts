import { describe, expect, test } from 'bun:test'
import isNumeric from '../../src/lib/isNumeric'

describe('isNumeric', () => {
  describe('Basic numeric validation', () => {
    test('should validate basic integers', () => {
      expect(isNumeric('123')).toBe(true)
      expect(isNumeric('0')).toBe(true)
      expect(isNumeric('999')).toBe(true)
    })

    test('should validate signed integers', () => {
      expect(isNumeric('+123')).toBe(true)
      expect(isNumeric('-123')).toBe(true)
      expect(isNumeric('+0')).toBe(true)
      expect(isNumeric('-0')).toBe(true)
    })

    test('should validate decimal numbers', () => {
      expect(isNumeric('123.45')).toBe(true)
      expect(isNumeric('0.1')).toBe(true)
      expect(isNumeric('.5')).toBe(true)
      expect(isNumeric('123.')).toBe(false) // trailing decimal not supported by this implementation
    })

    test('should validate signed decimal numbers', () => {
      expect(isNumeric('+123.45')).toBe(true)
      expect(isNumeric('-123.45')).toBe(true)
      expect(isNumeric('+.5')).toBe(true)
      expect(isNumeric('-.5')).toBe(true)
    })

    test('should reject non-numeric strings', () => {
      expect(isNumeric('abc')).toBe(false)
      expect(isNumeric('123abc')).toBe(false)
      expect(isNumeric('abc123')).toBe(false)
      expect(isNumeric('')).toBe(false)
      expect(isNumeric(' ')).toBe(false)
    })
  })

  describe('no_symbols option', () => {
    test('should reject signed numbers when no_symbols is true', () => {
      expect(isNumeric('+123', { no_symbols: true })).toBe(false)
      expect(isNumeric('-123', { no_symbols: true })).toBe(false)
      expect(isNumeric('+0', { no_symbols: true })).toBe(false)
      expect(isNumeric('-0', { no_symbols: true })).toBe(false)
    })

    test('should reject decimal numbers when no_symbols is true', () => {
      expect(isNumeric('123.45', { no_symbols: true })).toBe(false)
      expect(isNumeric('0.1', { no_symbols: true })).toBe(false)
      expect(isNumeric('.5', { no_symbols: true })).toBe(false)
      expect(isNumeric('123.', { no_symbols: true })).toBe(false)
    })

    test('should only accept plain digits when no_symbols is true', () => {
      expect(isNumeric('123', { no_symbols: true })).toBe(true)
      expect(isNumeric('0', { no_symbols: true })).toBe(true)
      expect(isNumeric('999', { no_symbols: true })).toBe(true)
    })
  })

  describe('Locale-specific decimal separators', () => {
    test('should validate German locale with comma separator', () => {
      expect(isNumeric('123,45', { locale: 'de-DE' })).toBe(true)
      expect(isNumeric('0,1', { locale: 'de-DE' })).toBe(true)
      expect(isNumeric(',5', { locale: 'de-DE' })).toBe(true)
      expect(isNumeric('123,', { locale: 'de-DE' })).toBe(false) // trailing decimal not supported
    })

    test('should validate signed numbers with German locale', () => {
      expect(isNumeric('+123,45', { locale: 'de-DE' })).toBe(true)
      expect(isNumeric('-123,45', { locale: 'de-DE' })).toBe(true)
      expect(isNumeric('+,5', { locale: 'de-DE' })).toBe(true)
      expect(isNumeric('-,5', { locale: 'de-DE' })).toBe(true)
    })

    test('should fallback to dot separator for unknown locale', () => {
      expect(isNumeric('123.45', { locale: 'unknown' })).toBe(true)
      expect(isNumeric('123,45', { locale: 'unknown' })).toBe(false)
    })

    test('should reject wrong separator for locale', () => {
      expect(isNumeric('123.45', { locale: 'de-DE' })).toBe(false)
      expect(isNumeric('123,45', { locale: 'en-US' })).toBe(false)
    })
  })

  describe('Combined options', () => {
    test('should handle no_symbols with locale', () => {
      expect(isNumeric('123', { no_symbols: true, locale: 'de-DE' })).toBe(true)
      expect(isNumeric('123,45', { no_symbols: true, locale: 'de-DE' })).toBe(false)
      expect(isNumeric('+123', { no_symbols: true, locale: 'de-DE' })).toBe(false)
    })
  })

  describe('Edge cases', () => {
    test('should handle leading zeros', () => {
      expect(isNumeric('00123')).toBe(true)
      expect(isNumeric('000')).toBe(true)
      expect(isNumeric('00123.45')).toBe(true)
    })

    test('should handle very large numbers', () => {
      expect(isNumeric('999999999999999')).toBe(true)
      expect(isNumeric('123456789012345.67890')).toBe(true)
    })

    test('should reject multiple decimal separators', () => {
      expect(isNumeric('12.34.56')).toBe(false)
      expect(isNumeric('12,34,56', { locale: 'de-DE' })).toBe(false)
    })

    test('should reject multiple signs', () => {
      expect(isNumeric('++123')).toBe(false)
      expect(isNumeric('--123')).toBe(false)
      expect(isNumeric('+-123')).toBe(false)
    })
  })

  describe('Real-world use cases', () => {
    test('should validate user input for quantities', () => {
      expect(isNumeric('1')).toBe(true)
      expect(isNumeric('100')).toBe(true)
      expect(isNumeric('0')).toBe(true)
    })

    test('should validate prices', () => {
      expect(isNumeric('19.99')).toBe(true)
      expect(isNumeric('1234.56')).toBe(true)
      expect(isNumeric('0.01')).toBe(true)
    })

    test('should validate European prices', () => {
      expect(isNumeric('19,99', { locale: 'de-DE' })).toBe(true)
      expect(isNumeric('1234,56', { locale: 'de-DE' })).toBe(true)
      expect(isNumeric('0,01', { locale: 'de-DE' })).toBe(true)
    })

    test('should validate ID numbers', () => {
      expect(isNumeric('12345', { no_symbols: true })).toBe(true)
      expect(isNumeric('0001', { no_symbols: true })).toBe(true)
      expect(isNumeric('999999', { no_symbols: true })).toBe(true)
    })
  })

  describe('Error handling', () => {
    test('should throw error for non-string input', () => {
      expect(() => isNumeric(123 as any)).toThrow('Expected a string but received a number')
      expect(() => isNumeric(null as any)).toThrow('Expected a string but received a null')
      expect(() => isNumeric(undefined as any)).toThrow('Expected a string but received a undefined')
      expect(() => isNumeric({} as any)).toThrow('Expected a string but received a Object')
      expect(() => isNumeric([] as any)).toThrow('Expected a string but received a Array')
    })
  })
})
