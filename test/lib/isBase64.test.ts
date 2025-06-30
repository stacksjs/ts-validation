import { describe, expect, test } from 'bun:test'
import isBase64 from '../../src/lib/isBase64'

describe('isBase64', () => {
  describe('Standard Base64 with padding', () => {
    test('should validate standard Base64 strings', () => {
      expect(isBase64('SGVsbG8gV29ybGQ=', { urlSafe: false, padding: true })).toBe(true)
      expect(isBase64('VGVzdCBzdHJpbmc=', { urlSafe: false, padding: true })).toBe(true)
      expect(isBase64('QmFzZTY0IHRlc3Q=', { urlSafe: false, padding: true })).toBe(true)
    })

    test('should validate Base64 with proper padding', () => {
      expect(isBase64('YWJj', { urlSafe: false, padding: true })).toBe(true) // 'abc'
      expect(isBase64('YWJjZA==', { urlSafe: false, padding: true })).toBe(true) // 'abcd'
      expect(isBase64('YWJjZGU=', { urlSafe: false, padding: true })).toBe(true) // 'abcde'
    })

    test('should reject Base64 with incorrect padding', () => {
      expect(isBase64('YWJj=', { urlSafe: false, padding: true })).toBe(false) // wrong padding
      expect(isBase64('YWJjZA=', { urlSafe: false, padding: true })).toBe(false) // wrong padding
      expect(isBase64('YWJjZGU==', { urlSafe: false, padding: true })).toBe(false) // wrong padding
    })

    test('should handle long Base64 strings', () => {
      const longBase64 = 'TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdC4='
      expect(isBase64(longBase64, { urlSafe: false, padding: true })).toBe(true)
    })
  })

  describe('Standard Base64 without padding', () => {
    test('should validate Base64 strings without padding', () => {
      expect(isBase64('SGVsbG8gV29ybGQ', { urlSafe: false, padding: false })).toBe(true)
      expect(isBase64('VGVzdCBzdHJpbmc', { urlSafe: false, padding: false })).toBe(true)
      expect(isBase64('QmFzZTY0IHRlc3Q', { urlSafe: false, padding: false })).toBe(true)
    })

    test('should reject padded strings when padding is false', () => {
      expect(isBase64('SGVsbG8gV29ybGQ=', { urlSafe: false, padding: false })).toBe(false)
      expect(isBase64('YWJjZA==', { urlSafe: false, padding: false })).toBe(false)
    })
  })

  describe('URL-safe Base64 with padding', () => {
    test('should validate URL-safe Base64 strings', () => {
      expect(isBase64('SGVsbG8gV29ybGQ=', { urlSafe: true, padding: true })).toBe(true)
      expect(isBase64('aGVsbG8td29ybGQ=', { urlSafe: true, padding: true })).toBe(true)
      expect(isBase64('dGVzdF9zdHJpbmc=', { urlSafe: true, padding: true })).toBe(true)
    })

    test('should accept hyphens and underscores in URL-safe mode', () => {
      expect(isBase64('test-string_data', { urlSafe: true, padding: false })).toBe(true)
      expect(isBase64('abc_def-ghi', { urlSafe: true, padding: false })).toBe(true)
    })

    test('should reject + and / in URL-safe mode', () => {
      expect(isBase64('test+string', { urlSafe: true, padding: false })).toBe(false)
      expect(isBase64('test/string', { urlSafe: true, padding: false })).toBe(false)
    })
  })

  describe('URL-safe Base64 without padding', () => {
    test('should validate URL-safe Base64 without padding', () => {
      expect(isBase64('SGVsbG8gV29ybGQ', { urlSafe: true, padding: false })).toBe(true)
      expect(isBase64('aGVsbG8td29ybGQ', { urlSafe: true, padding: false })).toBe(true)
      expect(isBase64('dGVzdF9zdHJpbmc', { urlSafe: true, padding: false })).toBe(true)
    })
  })

  describe('Edge cases', () => {
    test('should handle empty string', () => {
      expect(isBase64('', { urlSafe: false, padding: true })).toBe(true)
      expect(isBase64('', { urlSafe: true, padding: true })).toBe(true)
      expect(isBase64('', { urlSafe: false, padding: false })).toBe(true)
      expect(isBase64('', { urlSafe: true, padding: false })).toBe(true)
    })

    test('should reject invalid characters', () => {
      expect(isBase64('SGVsbG8gV29ybGQ!', { urlSafe: false, padding: false })).toBe(false)
      expect(isBase64('SGVsbG8@V29ybGQ=', { urlSafe: false, padding: true })).toBe(false)
      expect(isBase64('SGVsbG8#V29ybGQ=', { urlSafe: false, padding: true })).toBe(false)
    })

    test('should reject strings with wrong length for padding', () => {
      expect(isBase64('SGVsbG8', { urlSafe: false, padding: true })).toBe(false) // length not multiple of 4
      expect(isBase64('SGVsbG8g', { urlSafe: false, padding: true })).toBe(true) // length 8, valid
    })

    test('should handle whitespace', () => {
      expect(isBase64('SGVs bG8=', { urlSafe: false, padding: true })).toBe(false) // space not allowed
      expect(isBase64('SGVs\nbG8=', { urlSafe: false, padding: true })).toBe(false) // newline not allowed
    })
  })

  describe('Real-world examples', () => {
    test('should validate common Base64 encoded data', () => {
      // "Hello, World!" in Base64
      expect(isBase64('SGVsbG8sIFdvcmxkIQ==', { urlSafe: false, padding: true })).toBe(true)

      // JSON data in Base64
      expect(isBase64('eyJuYW1lIjoiSm9obiIsImFnZSI6MzB9', { urlSafe: false, padding: false })).toBe(true)

      // Image data (typical Base64 format)
      expect(isBase64('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', { urlSafe: false, padding: true })).toBe(true)
    })

    test('should validate JWT tokens (URL-safe)', () => {
      // JWT header
      expect(isBase64('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9', { urlSafe: true, padding: false })).toBe(true)

      // JWT payload
      expect(isBase64('eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ', { urlSafe: true, padding: false })).toBe(true)
    })

    test('should validate file uploads', () => {
      // PDF header in Base64
      expect(isBase64('JVBERi0xLjQK', { urlSafe: false, padding: false })).toBe(true)

      // ZIP header in Base64
      expect(isBase64('UEsDBAoAAAAAAA==', { urlSafe: false, padding: true })).toBe(true)
    })
  })

  describe('Option variations', () => {
    test('should handle default options correctly', () => {
      // Testing with minimal options
      expect(isBase64('SGVsbG8=', {})).toBe(true)
      expect(isBase64('SGVsbG8', {})).toBe(false) // padding expected by default
    })

    test('should handle mixed option scenarios', () => {
      const validBase64 = 'SGVsbG8gV29ybGQ='

      expect(isBase64(validBase64, { urlSafe: false })).toBe(true)
      expect(isBase64(validBase64, { padding: true })).toBe(true)
      expect(isBase64(validBase64, { urlSafe: true })).toBe(false) // different regex for URL-safe mode
    })
  })

  describe('Input validation', () => {
    test('should throw error for non-string input', () => {
      expect(() => isBase64(null as any, {})).toThrow()
      expect(() => isBase64(undefined as any, {})).toThrow()
      expect(() => isBase64(123 as any, {})).toThrow()
      expect(() => isBase64([] as any, {})).toThrow()
      expect(() => isBase64({} as any, {})).toThrow()
    })
  })

  describe('Performance', () => {
    test('should handle very long Base64 strings', () => {
      const longString = 'a'.repeat(1000)
      const longBase64 = btoa(longString) // Create valid Base64
      expect(isBase64(longBase64, { urlSafe: false, padding: true })).toBe(true)
    })

    test('should be consistent across multiple calls', () => {
      const input = 'SGVsbG8gV29ybGQ='
      const options = { urlSafe: false, padding: true }

      const result1 = isBase64(input, options)
      const result2 = isBase64(input, options)
      expect(result1).toBe(result2)
      expect(result1).toBe(true)
    })
  })
})
