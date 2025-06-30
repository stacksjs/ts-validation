import { describe, expect, test } from 'bun:test'
import isHexadecimal from '../../src/lib/isHexadecimal'

describe('isHexadecimal', () => {
  describe('basic hexadecimal validation', () => {
    test('should validate valid hexadecimal strings', () => {
      expect(isHexadecimal('0')).toBe(true)
      expect(isHexadecimal('1')).toBe(true)
      expect(isHexadecimal('9')).toBe(true)
      expect(isHexadecimal('A')).toBe(true)
      expect(isHexadecimal('F')).toBe(true)
      expect(isHexadecimal('a')).toBe(true)
      expect(isHexadecimal('f')).toBe(true)
    })

    test('should validate multi-character hexadecimal strings', () => {
      expect(isHexadecimal('123')).toBe(true)
      expect(isHexadecimal('ABC')).toBe(true)
      expect(isHexadecimal('abc')).toBe(true)
      expect(isHexadecimal('123ABC')).toBe(true)
      expect(isHexadecimal('123abc')).toBe(true)
      expect(isHexadecimal('0123456789ABCDEF')).toBe(true)
      expect(isHexadecimal('0123456789abcdef')).toBe(true)
    })

    test('should reject invalid hexadecimal strings', () => {
      expect(isHexadecimal('G')).toBe(false)
      expect(isHexadecimal('Z')).toBe(false)
      expect(isHexadecimal('g')).toBe(false)
      expect(isHexadecimal('z')).toBe(false)
      expect(isHexadecimal('123G')).toBe(false)
      expect(isHexadecimal('XYZ')).toBe(false)
      expect(isHexadecimal('Hello')).toBe(false)
    })

    test('should handle empty strings', () => {
      expect(isHexadecimal('')).toBe(false)
    })
  })

  describe('case sensitivity', () => {
    test('should accept both uppercase and lowercase', () => {
      expect(isHexadecimal('ABCDEF')).toBe(true)
      expect(isHexadecimal('abcdef')).toBe(true)
      expect(isHexadecimal('AbCdEf')).toBe(true)
      expect(isHexadecimal('aBcDeF')).toBe(true)
      expect(isHexadecimal('123ABC')).toBe(true)
      expect(isHexadecimal('123abc')).toBe(true)
      expect(isHexadecimal('123aBc')).toBe(true)
    })
  })

  describe('edge cases', () => {
    test('should handle very long hexadecimal strings', () => {
      const longHex = '0123456789ABCDEF'.repeat(100)
      expect(isHexadecimal(longHex)).toBe(true)

      const longHexLower = '0123456789abcdef'.repeat(100)
      expect(isHexadecimal(longHexLower)).toBe(true)

      const longHexMixed = '0123456789AbCdEf'.repeat(100)
      expect(isHexadecimal(longHexMixed)).toBe(true)
    })

    test('should reject strings with special characters', () => {
      expect(isHexadecimal('123-ABC')).toBe(false)
      expect(isHexadecimal('123_ABC')).toBe(false)
      expect(isHexadecimal('123 ABC')).toBe(false)
      expect(isHexadecimal('123.ABC')).toBe(false)
      expect(isHexadecimal('123,ABC')).toBe(false)
      expect(isHexadecimal('123#ABC')).toBe(false)
    })

    test('should reject strings with whitespace', () => {
      expect(isHexadecimal(' 123')).toBe(false)
      expect(isHexadecimal('123 ')).toBe(false)
      expect(isHexadecimal(' 123 ')).toBe(false)
      expect(isHexadecimal('12 34')).toBe(false)
      expect(isHexadecimal('\t123')).toBe(false)
      expect(isHexadecimal('123\n')).toBe(false)
    })

    test('should handle single characters', () => {
      '0123456789ABCDEFabcdef'.split('').forEach((char) => {
        expect(isHexadecimal(char)).toBe(true)
      })

      'GHIJKLMNOPQRSTUVWXYZghijklmnopqrstuvwxyz'.split('').forEach((char) => {
        expect(isHexadecimal(char)).toBe(false)
      })
    })
  })

  describe('real-world use cases', () => {
    test('should validate color hex codes (without #)', () => {
      expect(isHexadecimal('FF0000')).toBe(true) // red
      expect(isHexadecimal('00FF00')).toBe(true) // green
      expect(isHexadecimal('0000FF')).toBe(true) // blue
      expect(isHexadecimal('FFFFFF')).toBe(true) // white
      expect(isHexadecimal('000000')).toBe(true) // black
      expect(isHexadecimal('ff0000')).toBe(true) // red lowercase
      expect(isHexadecimal('FfA500')).toBe(true) // orange mixed case
    })

    test('should validate short color hex codes', () => {
      expect(isHexadecimal('F00')).toBe(true) // red short
      expect(isHexadecimal('0F0')).toBe(true) // green short
      expect(isHexadecimal('00F')).toBe(true) // blue short
      expect(isHexadecimal('FFF')).toBe(true) // white short
      expect(isHexadecimal('000')).toBe(true) // black short
    })

    test('should validate memory addresses', () => {
      expect(isHexadecimal('7FFF0000')).toBe(true)
      expect(isHexadecimal('DEADBEEF')).toBe(true)
      expect(isHexadecimal('CAFEBABE')).toBe(true)
      expect(isHexadecimal('12345678')).toBe(true)
      expect(isHexadecimal('ABCDEF01')).toBe(true)
    })

    test('should validate hash values', () => {
      expect(isHexadecimal('a1b2c3d4e5f6')).toBe(true) // MD5-like
      expect(isHexadecimal('A1B2C3D4E5F67890ABCDEF1234567890ABCDEF12')).toBe(true) // SHA1-like
      expect(isHexadecimal('1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF')).toBe(true) // SHA256-like
    })

    test('should validate UUID parts', () => {
      expect(isHexadecimal('550e8400')).toBe(true)
      expect(isHexadecimal('e29b')).toBe(true)
      expect(isHexadecimal('41d4')).toBe(true)
      expect(isHexadecimal('a716')).toBe(true)
      expect(isHexadecimal('446655440000')).toBe(true)
    })

    test('should validate cryptocurrency addresses (hex parts)', () => {
      expect(isHexadecimal('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')).toBe(false) // Bitcoin (base58)
      expect(isHexadecimal('0x742d35Cc6634C0532925a3b8D404e6d2e')).toBe(true) // Ethereum (0x prefix is allowed)
      expect(isHexadecimal('742d35Cc6634C0532925a3b8D404e6d2e')).toBe(true) // Ethereum without prefix
    })
  })

  describe('performance considerations', () => {
    test('should handle many hex validations efficiently', () => {
      const hexStrings = [
        '0',
        '1',
        '9',
        'A',
        'F',
        'a',
        'f',
        '123',
        'ABC',
        'abc',
        '123ABC',
        '123abc',
        'FF0000',
        '00FF00',
        '0000FF',
        'FFFFFF',
        '000000',
        'DEADBEEF',
        'CAFEBABE',
        'a1b2c3d4e5f6',
      ]

      const start = Date.now()
      hexStrings.forEach((hex) => {
        isHexadecimal(hex)
      })
      const end = Date.now()

      expect(end - start).toBeLessThan(50) // Should complete quickly
    })

    test('should handle very long hex strings efficiently', () => {
      const veryLongHex = '0123456789ABCDEF'.repeat(1000)

      const start = Date.now()
      expect(isHexadecimal(veryLongHex)).toBe(true)
      const end = Date.now()

      expect(end - start).toBeLessThan(100) // Should handle long strings quickly
    })
  })

  describe('boundary conditions', () => {
    test('should handle all valid hex characters', () => {
      const validChars = '0123456789ABCDEFabcdef'
      expect(isHexadecimal(validChars)).toBe(true)
    })

    test('should reject any invalid characters', () => {
      const invalidChars = 'GHIJKLMNOPQRSTUVWXYZghijklmnopqrstuvwxyz'
      expect(isHexadecimal(invalidChars)).toBe(false)
    })

    test('should handle mixed valid and invalid characters', () => {
      expect(isHexadecimal('123G')).toBe(false)
      expect(isHexadecimal('G123')).toBe(false)
      expect(isHexadecimal('12G3')).toBe(false)
      expect(isHexadecimal('ABCG')).toBe(false)
      expect(isHexadecimal('GaBC')).toBe(false)
    })
  })

  describe('error handling', () => {
    test('should throw error for non-string input', () => {
      expect(() => isHexadecimal(123 as any)).toThrow()
      expect(() => isHexadecimal(null as any)).toThrow()
      expect(() => isHexadecimal(undefined as any)).toThrow()
      expect(() => isHexadecimal({} as any)).toThrow()
      expect(() => isHexadecimal([] as any)).toThrow()
      expect(() => isHexadecimal(true as any)).toThrow()
    })
  })

  describe('integration with other validators', () => {
    test('should work well with length validation', () => {
      // Valid hex strings of specific lengths
      expect(isHexadecimal('FF') && 'FF'.length === 2).toBe(true) // 2 chars
      expect(isHexadecimal('FFFF') && 'FFFF'.length === 4).toBe(true) // 4 chars
      expect(isHexadecimal('FFFFFF') && 'FFFFFF'.length === 6).toBe(true) // 6 chars
      expect(isHexadecimal('FFFFFFFF') && 'FFFFFFFF'.length === 8).toBe(true) // 8 chars
    })

    test('should complement base64 and other encoding validations', () => {
      // Hex strings should not be valid base64 (usually)
      expect(isHexadecimal('DEADBEEF')).toBe(true)
      expect(isHexadecimal('SGVsbG8gV29ybGQ=')).toBe(false) // base64
    })
  })
})
