import { describe, expect, test } from 'bun:test'
import isBoolean from '../../src/lib/isBoolean'

describe('isBoolean', () => {
  describe('Strict boolean validation (default)', () => {
    test('should validate strict boolean strings', () => {
      expect(isBoolean('true')).toBe(true)
      expect(isBoolean('false')).toBe(true)
      expect(isBoolean('1')).toBe(true)
      expect(isBoolean('0')).toBe(true)
    })

    test('should reject non-strict boolean strings', () => {
      expect(isBoolean('yes')).toBe(false)
      expect(isBoolean('no')).toBe(false)
      expect(isBoolean('TRUE')).toBe(false)
      expect(isBoolean('FALSE')).toBe(false)
      expect(isBoolean('True')).toBe(false)
      expect(isBoolean('False')).toBe(false)
    })

    test('should reject invalid strings', () => {
      expect(isBoolean('not-boolean')).toBe(false)
      expect(isBoolean('2')).toBe(false)
      expect(isBoolean('-1')).toBe(false)
      expect(isBoolean('')).toBe(false)
      expect(isBoolean(' ')).toBe(false)
    })
  })

  describe('Loose boolean validation', () => {
    test('should validate loose boolean strings', () => {
      const options = { loose: true }
      expect(isBoolean('true', options)).toBe(true)
      expect(isBoolean('false', options)).toBe(true)
      expect(isBoolean('1', options)).toBe(true)
      expect(isBoolean('0', options)).toBe(true)
      expect(isBoolean('yes', options)).toBe(true)
      expect(isBoolean('no', options)).toBe(true)
    })

    test('should handle case insensitivity in loose mode', () => {
      const options = { loose: true }
      expect(isBoolean('TRUE', options)).toBe(true)
      expect(isBoolean('FALSE', options)).toBe(true)
      expect(isBoolean('True', options)).toBe(true)
      expect(isBoolean('False', options)).toBe(true)
      expect(isBoolean('YES', options)).toBe(true)
      expect(isBoolean('NO', options)).toBe(true)
      expect(isBoolean('Yes', options)).toBe(true)
      expect(isBoolean('No', options)).toBe(true)
    })

    test('should reject invalid strings even in loose mode', () => {
      const options = { loose: true }
      expect(isBoolean('maybe', options)).toBe(false)
      expect(isBoolean('2', options)).toBe(false)
      expect(isBoolean('-1', options)).toBe(false)
      expect(isBoolean('on', options)).toBe(false)
      expect(isBoolean('off', options)).toBe(false)
      expect(isBoolean('', options)).toBe(false)
    })
  })

  describe('Default options handling', () => {
    test('should use strict mode by default', () => {
      expect(isBoolean('yes')).toBe(false)
      expect(isBoolean('no')).toBe(false)
      expect(isBoolean('TRUE')).toBe(false)
      expect(isBoolean('FALSE')).toBe(false)
    })

    test('should handle undefined options', () => {
      expect(isBoolean('true', undefined)).toBe(true)
      expect(isBoolean('false', undefined)).toBe(true)
      expect(isBoolean('yes', undefined)).toBe(false)
    })

    test('should handle empty options object', () => {
      expect(isBoolean('true', {})).toBe(true)
      expect(isBoolean('false', {})).toBe(true)
      expect(isBoolean('yes', {})).toBe(false)
    })
  })

  describe('Edge cases', () => {
    test('should handle whitespace', () => {
      expect(isBoolean(' true ')).toBe(false)
      expect(isBoolean('true ')).toBe(false)
      expect(isBoolean(' true')).toBe(false)
      expect(isBoolean('\ttrue\t')).toBe(false)
    })

    test('should be case sensitive in strict mode', () => {
      expect(isBoolean('True')).toBe(false)
      expect(isBoolean('TRUE')).toBe(false)
      expect(isBoolean('tRuE')).toBe(false)
      expect(isBoolean('False')).toBe(false)
      expect(isBoolean('FALSE')).toBe(false)
      expect(isBoolean('fAlSe')).toBe(false)
    })

    test('should handle numeric strings', () => {
      expect(isBoolean('1')).toBe(true)
      expect(isBoolean('0')).toBe(true)
      expect(isBoolean('2')).toBe(false)
      expect(isBoolean('-1')).toBe(false)
      expect(isBoolean('1.0')).toBe(false)
      expect(isBoolean('0.0')).toBe(false)
    })
  })

  describe('Real-world use cases', () => {
    test('should validate form input values', () => {
      // Checkbox values
      expect(isBoolean('1')).toBe(true) // checked
      expect(isBoolean('0')).toBe(true) // unchecked

      // Boolean strings from JSON
      expect(isBoolean('true')).toBe(true)
      expect(isBoolean('false')).toBe(true)
    })

    test('should validate user preferences', () => {
      const options = { loose: true }
      // User-friendly boolean values
      expect(isBoolean('yes', options)).toBe(true) // enable feature
      expect(isBoolean('no', options)).toBe(true) // disable feature
      expect(isBoolean('true', options)).toBe(true) // enable
      expect(isBoolean('false', options)).toBe(true) // disable
    })

    test('should validate configuration values', () => {
      // Config file boolean values
      expect(isBoolean('true')).toBe(true)
      expect(isBoolean('false')).toBe(true)
      expect(isBoolean('1')).toBe(true)
      expect(isBoolean('0')).toBe(true)
    })

    test('should validate API parameters', () => {
      // Query parameters
      expect(isBoolean('true')).toBe(true) // ?active=true
      expect(isBoolean('false')).toBe(true) // ?active=false
      expect(isBoolean('1')).toBe(true) // ?enabled=1
      expect(isBoolean('0')).toBe(true) // ?enabled=0
    })

    test('should validate database boolean representations', () => {
      // Database boolean values
      expect(isBoolean('1')).toBe(true) // MySQL true
      expect(isBoolean('0')).toBe(true) // MySQL false
      expect(isBoolean('true')).toBe(true) // PostgreSQL true
      expect(isBoolean('false')).toBe(true) // PostgreSQL false
    })
  })

  describe('Error handling', () => {
    test('should throw error for non-string input', () => {
      expect(() => isBoolean(123 as any)).toThrow('Expected a string but received a number')
      expect(() => isBoolean(null as any)).toThrow('Expected a string but received a null')
      expect(() => isBoolean(undefined as any)).toThrow('Expected a string but received a undefined')
      expect(() => isBoolean({} as any)).toThrow('Expected a string but received a Object')
      expect(() => isBoolean([] as any)).toThrow('Expected a string but received a Array')
      expect(() => isBoolean(true as any)).toThrow('Expected a string but received a boolean')
    })
  })
})
