import { describe, expect, test } from 'bun:test'
import contains from '../../src/lib/contains'

describe('contains', () => {
  describe('basic functionality', () => {
    test('should find substring in string', () => {
      expect(contains('hello world', 'world', {})).toBe(true)
      expect(contains('hello world', 'hello', {})).toBe(true)
      expect(contains('hello world', 'llo', {})).toBe(true)
      expect(contains('hello world', 'o w', {})).toBe(true)
    })

    test('should return false when substring not found', () => {
      expect(contains('hello world', 'xyz', {})).toBe(false)
      expect(contains('hello world', 'Hello', {})).toBe(false) // case sensitive
      expect(contains('hello world', 'world!', {})).toBe(false)
    })

    test('should handle empty strings', () => {
      expect(contains('hello', '', {})).toBe(true) // empty string is always found
      expect(contains('', 'hello', {})).toBe(false) // can't find in empty string
      expect(contains('', '', {})).toBe(false) // empty in empty splits to single element
    })

    test('should handle single characters', () => {
      expect(contains('hello', 'h', {})).toBe(true)
      expect(contains('hello', 'e', {})).toBe(true)
      expect(contains('hello', 'o', {})).toBe(true)
      expect(contains('hello', 'x', {})).toBe(false)
    })
  })

  describe('case sensitivity options', () => {
    test('should be case sensitive by default', () => {
      expect(contains('Hello World', 'hello', {})).toBe(false)
      expect(contains('Hello World', 'WORLD', {})).toBe(false)
      expect(contains('Hello World', 'Hello', {})).toBe(true)
      expect(contains('Hello World', 'World', {})).toBe(true)
    })

    test('should ignore case when ignoreCase is true', () => {
      expect(contains('Hello World', 'hello', { ignoreCase: true })).toBe(true)
      expect(contains('Hello World', 'WORLD', { ignoreCase: true })).toBe(true)
      expect(contains('Hello World', 'hELLo', { ignoreCase: true })).toBe(true)
      expect(contains('Hello World', 'WoRlD', { ignoreCase: true })).toBe(true)
    })

    test('should handle mixed case with ignoreCase', () => {
      expect(contains('ThE QuIcK bRoWn FoX', 'the quick', { ignoreCase: true })).toBe(true)
      expect(contains('ThE QuIcK bRoWn FoX', 'BROWN FOX', { ignoreCase: true })).toBe(true)
      expect(contains('ThE QuIcK bRoWn FoX', 'QuIcK bRoWn', { ignoreCase: true })).toBe(true)
    })
  })

  describe('minimum occurrences option', () => {
    test('should find single occurrence by default', () => {
      expect(contains('hello world', 'l', {})).toBe(true) // 'l' appears 3 times
      expect(contains('hello world', 'o', {})).toBe(true) // 'o' appears 2 times
      expect(contains('hello world', 'h', {})).toBe(true) // 'h' appears 1 time
    })

    test('should respect minOccurrences setting', () => {
      expect(contains('hello world', 'l', { minOccurrences: 1 })).toBe(true) // 3 >= 1
      expect(contains('hello world', 'l', { minOccurrences: 2 })).toBe(true) // 3 >= 2
      expect(contains('hello world', 'l', { minOccurrences: 3 })).toBe(true) // 3 >= 3
      expect(contains('hello world', 'l', { minOccurrences: 4 })).toBe(false) // 3 < 4
    })

    test('should work with repeated substrings', () => {
      expect(contains('abcabcabc', 'abc', { minOccurrences: 1 })).toBe(true)
      expect(contains('abcabcabc', 'abc', { minOccurrences: 2 })).toBe(true)
      expect(contains('abcabcabc', 'abc', { minOccurrences: 3 })).toBe(true)
      expect(contains('abcabcabc', 'abc', { minOccurrences: 4 })).toBe(false)
    })

    test('should handle overlapping patterns', () => {
      expect(contains('aaa', 'aa', { minOccurrences: 1 })).toBe(true)
      expect(contains('aaa', 'aa', { minOccurrences: 2 })).toBe(false) // non-overlapping count
      expect(contains('aaaa', 'aa', { minOccurrences: 2 })).toBe(true)
    })
  })

  describe('combined options', () => {
    test('should combine ignoreCase and minOccurrences', () => {
      expect(contains('Hello Hello HELLO', 'hello', {
        ignoreCase: true,
        minOccurrences: 2,
      })).toBe(true)

      expect(contains('Hello Hello HELLO', 'hello', {
        ignoreCase: true,
        minOccurrences: 3,
      })).toBe(true)

      expect(contains('Hello Hello HELLO', 'hello', {
        ignoreCase: true,
        minOccurrences: 4,
      })).toBe(false)
    })

    test('should handle case-sensitive counting with multiple occurrences', () => {
      expect(contains('Hello hello HELLO', 'hello', {
        ignoreCase: false,
        minOccurrences: 1,
      })).toBe(true)

      expect(contains('Hello hello HELLO', 'hello', {
        ignoreCase: false,
        minOccurrences: 2,
      })).toBe(false)
    })
  })

  describe('edge cases', () => {
    test('should handle special characters', () => {
      expect(contains('hello@world.com', '@', {})).toBe(true)
      expect(contains('hello@world.com', '.com', {})).toBe(true)
      expect(contains('price: $10.99', '$', {})).toBe(true)
      expect(contains('path/to/file', '/', {})).toBe(true)
    })

    test('should handle unicode characters', () => {
      expect(contains('café', 'é', {})).toBe(true)
      expect(contains('🎉 party 🎉', '🎉', {})).toBe(true)
      expect(contains('こんにちは', 'こん', {})).toBe(true)
      expect(contains('🎉 party 🎉', '🎉', { minOccurrences: 2 })).toBe(true)
    })

    test('should handle numbers as strings', () => {
      expect(contains('123.456', '123', {})).toBe(true)
      expect(contains('123.456', '.', {})).toBe(true)
      expect(contains('123.456', '456', {})).toBe(true)
      expect(contains('version 1.2.3', '1.2', {})).toBe(true)
    })

    test('should handle whitespace', () => {
      expect(contains('hello world', ' ', {})).toBe(true)
      expect(contains('hello\\tworld', '\\t', {})).toBe(true)
      expect(contains('hello\\nworld', '\\n', {})).toBe(true)
      expect(contains('  spaced  ', '  ', { minOccurrences: 2 })).toBe(true)
    })

    test('should handle very long strings', () => {
      const longString = `${'a'.repeat(10000)}needle${'b'.repeat(10000)}`
      expect(contains(longString, 'needle', {})).toBe(true)
      expect(contains(longString, 'haystack', {})).toBe(false)
    })

    test('should handle substring longer than string', () => {
      expect(contains('hi', 'hello', {})).toBe(false)
      expect(contains('test', 'testing', {})).toBe(false)
    })
  })

  describe('real-world use cases', () => {
    test('should validate email contains domain', () => {
      expect(contains('user@example.com', '@example.com', {})).toBe(true)
      expect(contains('user@example.com', '@gmail.com', {})).toBe(false)
      expect(contains('user@example.com', '.com', {})).toBe(true)
    })

    test('should check if text contains keywords', () => {
      const text = 'The quick brown fox jumps over the lazy dog'
      expect(contains(text, 'fox', {})).toBe(true)
      expect(contains(text, 'cat', {})).toBe(false)
      expect(contains(text, 'the', { ignoreCase: true, minOccurrences: 2 })).toBe(true)
    })

    test('should validate URLs contain protocol', () => {
      expect(contains('https://example.com', 'https://', {})).toBe(true)
      expect(contains('http://example.com', 'https://', {})).toBe(false)
      expect(contains('ftp://files.example.com', 'ftp://', {})).toBe(true)
    })

    test('should check file extensions', () => {
      expect(contains('document.pdf', '.pdf', {})).toBe(true)
      expect(contains('image.jpg', '.jpg', {})).toBe(true)
      expect(contains('script.js', '.js', {})).toBe(true)
      expect(contains('document.pdf', '.doc', {})).toBe(false)
    })

    test('should validate phone numbers contain area code', () => {
      expect(contains('+1-555-123-4567', '555', {})).toBe(true)
      expect(contains('(555) 123-4567', '555', {})).toBe(true)
      expect(contains('555.123.4567', '555', {})).toBe(true)
    })
  })

  describe('parameter validation', () => {
    test('should handle non-string inputs gracefully', () => {
      expect(() => contains(123 as any, 'test', {})).toThrow()
      expect(() => contains(null as any, 'test', {})).toThrow()
      expect(() => contains(undefined as any, 'test', {})).toThrow()
    })

    test('should handle different types for search element', () => {
      expect(contains('123', 1 as any, {})).toBe(true) // number converted to string
      expect(contains('true', true as any, {})).toBe(true) // boolean converted to string
      expect(contains('null', null as any, {})).toBe(true) // null converted to string
    })
  })

  describe('performance considerations', () => {
    test('should handle many contains checks efficiently', () => {
      const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
      const searches = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur']

      const start = Date.now()
      for (let i = 0; i < 1000; i++) {
        searches.forEach(search => contains(text, search, {}))
      }
      const end = Date.now()

      expect(end - start).toBeLessThan(100) // Should complete in under 100ms
    })

    test('should handle large strings efficiently', () => {
      const largeString = `${'test '.repeat(10000)}needle`

      const start = Date.now()
      contains(largeString, 'needle', {})
      const end = Date.now()

      expect(end - start).toBeLessThan(50) // Should complete quickly
    })
  })

  describe('options object handling', () => {
    test('should work with empty options object', () => {
      expect(contains('hello world', 'world', {})).toBe(true)
    })

    test('should use default values for missing options', () => {
      expect(contains('Hello World', 'hello', {})).toBe(false) // case sensitive by default
      expect(contains('hello hello', 'hello', {})).toBe(true) // minOccurrences 1 by default
    })

    test('should handle partial options objects', () => {
      expect(contains('Hello World', 'hello', { ignoreCase: true })).toBe(true)
      expect(contains('hello hello', 'hello', { minOccurrences: 2 })).toBe(true)
    })
  })
})
