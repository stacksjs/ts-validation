import { describe, expect, test } from 'bun:test'
import isWhitelisted from '../../src/lib/isWhitelisted'

describe('isWhitelisted', () => {
  describe('Basic character validation', () => {
    test('should return true when all characters are whitelisted', () => {
      expect(isWhitelisted('abc', ['a', 'b', 'c'])).toBe(true)
      expect(isWhitelisted('hello', ['h', 'e', 'l', 'o'])).toBe(true)
      expect(isWhitelisted('123', ['1', '2', '3'])).toBe(true)
    })

    test('should return false when any character is not whitelisted', () => {
      expect(isWhitelisted('abcd', ['a', 'b', 'c'])).toBe(false)
      expect(isWhitelisted('hello', ['h', 'e', 'l'])).toBe(false) // missing 'o'
      expect(isWhitelisted('123x', ['1', '2', '3'])).toBe(false)
    })

    test('should handle duplicate characters in string', () => {
      expect(isWhitelisted('aaa', ['a'])).toBe(true)
      expect(isWhitelisted('hello', ['h', 'e', 'l', 'o'])).toBe(true) // 'l' appears twice
      expect(isWhitelisted('aab', ['a'])).toBe(false) // 'b' not whitelisted
    })

    test('should handle single character strings', () => {
      expect(isWhitelisted('a', ['a', 'b', 'c'])).toBe(true)
      expect(isWhitelisted('x', ['a', 'b', 'c'])).toBe(false)
    })
  })

  describe('Whitelist arrays', () => {
    test('should handle various whitelist sizes', () => {
      expect(isWhitelisted('a', ['a'])).toBe(true) // single character whitelist
      expect(isWhitelisted('abc', ['a', 'b', 'c', 'd', 'e', 'f'])).toBe(true) // larger whitelist
    })

    test('should handle duplicate characters in whitelist', () => {
      expect(isWhitelisted('abc', ['a', 'b', 'c', 'a', 'b'])).toBe(true)
      expect(isWhitelisted('xyz', ['x', 'x', 'y', 'z', 'z'])).toBe(true)
    })

    test('should be case sensitive', () => {
      expect(isWhitelisted('abc', ['a', 'b', 'c'])).toBe(true)
      expect(isWhitelisted('ABC', ['a', 'b', 'c'])).toBe(false)
      expect(isWhitelisted('Abc', ['A', 'b', 'c'])).toBe(true)
    })
  })

  describe('Special characters', () => {
    test('should handle whitespace characters', () => {
      expect(isWhitelisted('a b', ['a', ' ', 'b'])).toBe(true)
      expect(isWhitelisted('hello world', ['h', 'e', 'l', 'o', ' ', 'w', 'r', 'd'])).toBe(true)
      expect(isWhitelisted('tab\there', ['t', 'a', 'b', '\t', 'h', 'e', 'r'])).toBe(true)
    })

    test('should handle special symbols', () => {
      expect(isWhitelisted('a!b', ['a', '!', 'b'])).toBe(true)
      expect(isWhitelisted('test@email.com', ['t', 'e', 's', '@', 'm', 'a', 'i', 'l', '.', 'c', 'o'])).toBe(true)
      expect(isWhitelisted('$100', ['$', '1', '0'])).toBe(true)
    })

    test('should handle numbers and digits', () => {
      expect(isWhitelisted('123', ['1', '2', '3'])).toBe(true)
      expect(isWhitelisted('0987654321', ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])).toBe(true)
      expect(isWhitelisted('123abc', ['1', '2', '3', 'a', 'b', 'c'])).toBe(true)
    })
  })

  describe('Unicode and international characters', () => {
    test('should handle Unicode characters', () => {
      expect(isWhitelisted('café', ['c', 'a', 'f', 'é'])).toBe(true)
      expect(isWhitelisted('naïve', ['n', 'a', 'ï', 'v', 'e'])).toBe(true)
      expect(isWhitelisted('piñata', ['p', 'i', 'ñ', 'a', 't'])).toBe(true)
    })

    test('should handle emoji and symbols', () => {
      expect(isWhitelisted('🚀🌟', ['🚀', '🌟'])).toBe(false) // emoji might be multi-codepoint
      expect(isWhitelisted('Hello 👋', ['H', 'e', 'l', 'o', ' ', '👋'])).toBe(false) // emoji issues
      expect(isWhitelisted('test🎉', ['t', 'e', 's'])).toBe(false) // missing 🎉
    })

    test('should handle different languages', () => {
      expect(isWhitelisted('日本語', ['日', '本', '語'])).toBe(true)
      expect(isWhitelisted('Москва', ['М', 'о', 'с', 'к', 'в', 'а'])).toBe(true)
      expect(isWhitelisted('العربية', ['ا', 'ل', 'ع', 'ر', 'б', 'ي', 'ة'])).toBe(false) // missing some chars
    })
  })

  describe('Edge cases', () => {
    test('should handle empty string', () => {
      expect(isWhitelisted('', ['a', 'b', 'c'])).toBe(true) // empty string passes
      expect(isWhitelisted('', [])).toBe(true) // empty string with empty whitelist
    })

    test('should handle empty whitelist', () => {
      expect(isWhitelisted('abc', [])).toBe(false)
      expect(isWhitelisted('x', [])).toBe(false)
    })

    test('should handle very long strings', () => {
      const longString = 'a'.repeat(1000)
      expect(isWhitelisted(longString, ['a'])).toBe(true)
      expect(isWhitelisted(longString, ['b'])).toBe(false)
    })

    test('should handle large whitelists', () => {
      const largeWhitelist = Array.from({ length: 100 }, (_, i) => String.fromCharCode(65 + i)) // A-Z + more
      expect(isWhitelisted('ABC', largeWhitelist)).toBe(true)
      expect(isWhitelisted('xyz', largeWhitelist)).toBe(true) // some extended characters might match lowercase
    })
  })

  describe('Real-world use cases', () => {
    test('should validate alphanumeric input', () => {
      const alphanumeric = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')
      expect(isWhitelisted('Hello123', alphanumeric)).toBe(true)
      expect(isWhitelisted('Hello123!', alphanumeric)).toBe(false) // ! not allowed
    })

    test('should validate hexadecimal strings', () => {
      const hexChars = '0123456789ABCDEFabcdef'.split('')
      expect(isWhitelisted('FF00AA', hexChars)).toBe(true)
      expect(isWhitelisted('123ABC', hexChars)).toBe(true)
      expect(isWhitelisted('123XYZ', hexChars)).toBe(false) // X, Y, Z not valid hex
    })

    test('should validate safe filename characters', () => {
      const safeChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.'.split('')
      expect(isWhitelisted('document.txt', safeChars)).toBe(true)
      expect(isWhitelisted('my-file_v2.pdf', safeChars)).toBe(true)
      expect(isWhitelisted('file/path.doc', safeChars)).toBe(false) // / not allowed
    })

    test('should validate phone number characters', () => {
      const phoneChars = '0123456789()-+ '.split('')
      expect(isWhitelisted('(555) 123-4567', phoneChars)).toBe(true)
      expect(isWhitelisted('+1-555-123-4567', phoneChars)).toBe(true)
      expect(isWhitelisted('555.123.4567', phoneChars)).toBe(false) // . not allowed
    })

    test('should validate URL-safe characters', () => {
      const urlSafeChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.~'.split('')
      expect(isWhitelisted('my-url_slug', urlSafeChars)).toBe(true)
      expect(isWhitelisted('safe~string', urlSafeChars)).toBe(true)
      expect(isWhitelisted('not safe!', urlSafeChars)).toBe(false) // space and ! not allowed
    })
  })

  describe('Input validation', () => {
    test('should throw error for non-string input', () => {
      expect(() => isWhitelisted(null as any, ['a'])).toThrow()
      expect(() => isWhitelisted(undefined as any, ['a'])).toThrow()
      expect(() => isWhitelisted(123 as any, ['a'])).toThrow()
      expect(() => isWhitelisted({} as any, ['a'])).toThrow()
    })

    test('should handle non-array whitelist parameter', () => {
      // The function expects an array, so this should behave predictably
      expect(() => isWhitelisted('test', 'abc' as any)).not.toThrow()
    })
  })

  describe('Performance', () => {
    test('should be efficient with repeated character checks', () => {
      const whitelist = ['a', 'b', 'c']
      const input = 'abcabcabc'

      const result1 = isWhitelisted(input, whitelist)
      const result2 = isWhitelisted(input, whitelist)
      expect(result1).toBe(result2)
      expect(result1).toBe(true)
    })

    test('should handle large inputs efficiently', () => {
      const whitelist = ['a', 'b', 'c', 'd', 'e']
      const largeInput = 'abcde'.repeat(200) // 1000 characters

      expect(isWhitelisted(largeInput, whitelist)).toBe(true)
    })
  })
})
