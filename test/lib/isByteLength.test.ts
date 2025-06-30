import { describe, expect, test } from 'bun:test'
import isByteLength from '../../src/lib/isByteLength'

describe('isByteLength', () => {
  describe('Basic byte length validation', () => {
    test('should validate strings within byte range using options object', () => {
      expect(isByteLength('hello', { min: 0, max: 10 })).toBe(true)
      expect(isByteLength('test', { min: 4, max: 4 })).toBe(true)
      expect(isByteLength('a', { min: 1, max: 5 })).toBe(true)
      expect(isByteLength('', { min: 0, max: 5 })).toBe(true)
    })

    test('should reject strings outside byte range', () => {
      expect(isByteLength('hello', { min: 10, max: 20 })).toBe(false)
      expect(isByteLength('test', { min: 0, max: 3 })).toBe(false)
      expect(isByteLength('a very long string', { min: 0, max: 5 })).toBe(false)
    })

    test('should handle minimum length only', () => {
      expect(isByteLength('hello', { min: 3 })).toBe(true)
      expect(isByteLength('hi', { min: 3 })).toBe(false)
      expect(isByteLength('test', { min: 4 })).toBe(true)
      expect(isByteLength('testing', { min: 4 })).toBe(true)
    })

    test('should handle maximum length only', () => {
      expect(isByteLength('hello', { max: 10 })).toBe(true)
      expect(isByteLength('a very long string that exceeds limit', { max: 10 })).toBe(false)
      expect(isByteLength('test', { max: 4 })).toBe(true)
      expect(isByteLength('', { max: 0 })).toBe(true)
    })

    test('should default min to 0 when not specified', () => {
      expect(isByteLength('', { max: 5 })).toBe(true)
      expect(isByteLength('hello', { max: 10 })).toBe(true)
    })
  })

  describe('Backwards compatibility (legacy function signature)', () => {
    test('should work with options object that emulates legacy behavior', () => {
      // Note: The function supports legacy arguments via arguments[1] and arguments[2]
      // but TypeScript typing only supports the options object
      expect(isByteLength('hello', { min: 0, max: 10 })).toBe(true)
      expect(isByteLength('test', { min: 4, max: 4 })).toBe(true)
      expect(isByteLength('a', { min: 1, max: 5 })).toBe(true)
      expect(isByteLength('', { min: 0, max: 5 })).toBe(true)
    })

    test('should reject strings outside range', () => {
      expect(isByteLength('hello', { min: 10, max: 20 })).toBe(false)
      expect(isByteLength('test', { min: 0, max: 3 })).toBe(false)
      expect(isByteLength('a very long string', { min: 0, max: 5 })).toBe(false)
    })

    test('should handle min only behavior', () => {
      expect(isByteLength('hello', { min: 3 })).toBe(true)
      expect(isByteLength('hi', { min: 3 })).toBe(false)
      expect(isByteLength('test', { min: 4 })).toBe(true)
    })

    test('should handle max only behavior', () => {
      expect(isByteLength('hello', { max: 10 })).toBe(true)
      expect(isByteLength('very long string', { max: 5 })).toBe(false)
      expect(isByteLength('hi', { max: 10 })).toBe(true)
    })
  })

  describe('Unicode and multi-byte characters', () => {
    test('should count Unicode characters correctly', () => {
      // Emoji takes 4 bytes in UTF-8
      expect(isByteLength('😀', { min: 4, max: 4 })).toBe(true)
      expect(isByteLength('😀', { min: 1, max: 1 })).toBe(false)

      // Multiple emojis
      expect(isByteLength('😀😁', { min: 8, max: 8 })).toBe(true)
      expect(isByteLength('😀😁😂', { min: 12, max: 12 })).toBe(true)
    })

    test('should handle accented characters', () => {
      // 'é' is 2 bytes in UTF-8
      expect(isByteLength('café', { min: 5, max: 5 })).toBe(true) // c(1) + a(1) + f(1) + é(2) = 5 bytes
      expect(isByteLength('café', { min: 4, max: 4 })).toBe(false)

      // 'ñ' is 2 bytes in UTF-8
      expect(isByteLength('niño', { min: 5, max: 5 })).toBe(true) // n(1) + i(1) + ñ(2) + o(1) = 5 bytes
    })

    test('should handle various Unicode ranges', () => {
      // Chinese characters (3 bytes each in UTF-8)
      expect(isByteLength('你好', { min: 6, max: 6 })).toBe(true) // 3 + 3 = 6 bytes

      // Japanese characters (3 bytes each in UTF-8)
      expect(isByteLength('こんにちは', { min: 15, max: 15 })).toBe(true) // 5 chars × 3 bytes = 15 bytes

      // Arabic characters (2 bytes each in UTF-8)
      expect(isByteLength('مرحبا', { min: 10, max: 10 })).toBe(true) // 5 chars × 2 bytes = 10 bytes
    })

    test('should handle mixed ASCII and Unicode', () => {
      expect(isByteLength('Hello 世界', { min: 12, max: 12 })).toBe(true) // Hello (5) + space (1) + 世(3) + 界(3) = 12 bytes
      expect(isByteLength('café ☕', { min: 9, max: 9 })).toBe(true) // café (5) + space (1) + ☕ (3) = 9 bytes
    })
  })

  describe('Special characters and encoding', () => {
    test('should handle control characters', () => {
      expect(isByteLength('hello\n', { min: 6, max: 6 })).toBe(true) // newline is 1 byte
      expect(isByteLength('hello\t', { min: 6, max: 6 })).toBe(true) // tab is 1 byte
      expect(isByteLength('hello\r\n', { min: 7, max: 7 })).toBe(true) // CRLF is 2 bytes
    })

    test('should handle URL-encoded sequences', () => {
      // Note: The function uses encodeURI, so spaces become %20
      const spaceString = 'hello world'
      const encodedLength = encodeURI(spaceString).split(/%..|./).length - 1
      expect(isByteLength(spaceString, { min: encodedLength, max: encodedLength })).toBe(true)
    })

    test('should handle HTML entities as regular characters', () => {
      // HTML entities are not decoded, so they count as their literal characters
      expect(isByteLength('&amp;', { min: 5, max: 5 })).toBe(true) // 5 ASCII characters
      expect(isByteLength('&lt;test&gt;', { min: 12, max: 12 })).toBe(true) // 12 ASCII characters
    })
  })

  describe('Edge cases', () => {
    test('should handle empty string', () => {
      expect(isByteLength('', { min: 0, max: 0 })).toBe(true)
      expect(isByteLength('', { min: 0, max: 10 })).toBe(true)
      expect(isByteLength('', { min: 1, max: 10 })).toBe(false)
    })

    test('should handle zero bounds', () => {
      expect(isByteLength('', { min: 0, max: 0 })).toBe(true)
      expect(isByteLength('a', { min: 0, max: 0 })).toBe(false)
    })

    test('should handle equal min and max', () => {
      expect(isByteLength('test', { min: 4, max: 4 })).toBe(true)
      expect(isByteLength('testing', { min: 4, max: 4 })).toBe(false)
      expect(isByteLength('hi', { min: 4, max: 4 })).toBe(false)
    })

    test('should handle very large strings', () => {
      const longString = 'a'.repeat(10000)
      expect(isByteLength(longString, { min: 10000, max: 10000 })).toBe(true)
      expect(isByteLength(longString, { min: 0, max: 5000 })).toBe(false)
      expect(isByteLength(longString, { min: 15000 })).toBe(false)
    })

    test('should handle negative bounds gracefully', () => {
      expect(isByteLength('test', { min: -5, max: 10 })).toBe(true) // negative min should work
      expect(isByteLength('test', { min: 0, max: -1 })).toBe(false) // negative max makes it impossible
    })
  })

  describe('Real-world use cases', () => {
    test('should validate file names', () => {
      expect(isByteLength('document.pdf', { min: 1, max: 255 })).toBe(true) // typical filesystem limit
      expect(isByteLength('', { min: 1, max: 255 })).toBe(false) // empty filename
      expect(isByteLength('a'.repeat(300), { min: 1, max: 255 })).toBe(false) // too long
    })

    test('should validate social media posts', () => {
      const tweet = 'This is a sample tweet with some content'
      expect(isByteLength(tweet, { min: 1, max: 280 })).toBe(true) // Twitter limit (characters, but good approximation)

      const longPost = 'a'.repeat(500)
      expect(isByteLength(longPost, { min: 1, max: 280 })).toBe(false)
    })

    test('should validate database field limits', () => {
      // VARCHAR(50) equivalent
      expect(isByteLength('John Doe', { min: 0, max: 50 })).toBe(true)
      expect(isByteLength('A very long name that exceeds the database field limit', { min: 0, max: 50 })).toBe(false)

      // TEXT field with reasonable limit
      const blogPost = 'This is a blog post with some content. '.repeat(10)
      expect(isByteLength(blogPost, { min: 0, max: 1000 })).toBe(true)
    })

    test('should validate form input fields', () => {
      // Email field
      expect(isByteLength('user@example.com', { min: 5, max: 254 })).toBe(true)
      expect(isByteLength('a@b.c', { min: 5, max: 254 })).toBe(true)
      expect(isByteLength(`${'a'.repeat(250)}@example.com`, { min: 5, max: 254 })).toBe(false)

      // Password field
      expect(isByteLength('mypassword123', { min: 8, max: 128 })).toBe(true)
      expect(isByteLength('short', { min: 8, max: 128 })).toBe(false)
    })

    test('should validate international content', () => {
      // Blog title in various languages
      expect(isByteLength('My English Title', { min: 1, max: 100 })).toBe(true)
      expect(isByteLength('Мой русский заголовок', { min: 1, max: 100 })).toBe(true) // Cyrillic
      expect(isByteLength('我的中文标题', { min: 1, max: 100 })).toBe(true) // Chinese
      expect(isByteLength('عنوان عربي', { min: 1, max: 100 })).toBe(true) // Arabic
    })
  })

  describe('Input validation', () => {
    test('should throw error for non-string input', () => {
      expect(() => isByteLength(null as any, { min: 0, max: 10 })).toThrow()
      expect(() => isByteLength(undefined as any, { min: 0, max: 10 })).toThrow()
      expect(() => isByteLength(123 as any, { min: 0, max: 10 })).toThrow()
      expect(() => isByteLength([] as any, { min: 0, max: 10 })).toThrow()
      expect(() => isByteLength({} as any, { min: 0, max: 10 })).toThrow()
    })
  })

  describe('Performance', () => {
    test('should be consistent across multiple calls', () => {
      const input = 'test string with émojis 😀'
      const options = { min: 20, max: 30 }

      const result1 = isByteLength(input, options)
      const result2 = isByteLength(input, options)
      expect(result1).toBe(result2)
    })

    test('should handle repeated validation efficiently', () => {
      const testCases = [
        'short',
        'medium length string',
        'very long string that contains multiple words and punctuation',
        '🌟✨🎉🎊🎈🎆🎇',
        'Mixed ASCII and 中文 content',
      ]

      testCases.forEach((testCase) => {
        const result1 = isByteLength(testCase, { min: 0, max: 100 })
        const result2 = isByteLength(testCase, { min: 0, max: 100 })
        expect(result1).toBe(result2)
      })
    })
  })
})
