import { describe, expect, test } from 'bun:test'
import matches from '../../src/lib/matches'

describe('matches', () => {
  describe('string patterns', () => {
    test('should match simple string patterns', () => {
      expect(matches('hello world', 'hello', '')).toBe(true)
      expect(matches('hello world', 'world', '')).toBe(true)
      expect(matches('hello world', 'hello world', '')).toBe(true)
    })

    test('should reject non-matching string patterns', () => {
      expect(matches('hello world', 'foo', '')).toBe(false)
      expect(matches('hello world', 'HELLO', '')).toBe(false) // case sensitive by default
      expect(matches('hello world', 'goodbye', '')).toBe(false)
    })

    test('should handle empty patterns', () => {
      expect(matches('hello', '', '')).toBe(true) // empty pattern matches
      expect(matches('', '', '')).toBe(true) // empty string with empty pattern
    })

    test('should handle partial matches', () => {
      expect(matches('hello world', 'ell', '')).toBe(true) // substring match
      expect(matches('hello world', 'orl', '')).toBe(true) // substring match
      expect(matches('hello world', 'o w', '')).toBe(true) // substring match with space
    })
  })

  describe('RegExp patterns', () => {
    test('should match with RegExp objects', () => {
      expect(matches('hello123', /\d+/, '')).toBe(true)
      expect(matches('abc123def', /\d+/, '')).toBe(true)
      expect(matches('test@example.com', /@/, '')).toBe(true)
    })

    test('should reject non-matching RegExp patterns', () => {
      expect(matches('hello', /\d+/, '')).toBe(false)
      expect(matches('abc', /\d+/, '')).toBe(false)
      expect(matches('test.example.com', /@/, '')).toBe(false)
    })

    test('should handle complex RegExp patterns', () => {
      expect(matches('hello@example.com', /^[a-z]+@[a-z]+\.[a-z]+$/i, '')).toBe(true)
      expect(matches('123-456-7890', /^\d{3}-\d{3}-\d{4}$/, '')).toBe(true)
      expect(matches('abc123', /^[a-z]+\d+$/, '')).toBe(true)
    })
  })

  describe('modifiers', () => {
    test('should handle case insensitive modifier', () => {
      expect(matches('HELLO', 'hello', 'i')).toBe(true)
      expect(matches('Hello World', 'HELLO', 'i')).toBe(true)
      expect(matches('MiXeD cAsE', 'mixed case', 'i')).toBe(true)
    })

    test('should handle global modifier', () => {
      expect(matches('hello hello hello', 'hello', 'g')).toBe(true)
      expect(matches('test test test', 'test', 'g')).toBe(true)
    })

    test('should handle multiline modifier', () => {
      expect(matches('line1\nline2', '^line2', 'm')).toBe(true)
      expect(matches('start\nend', '^end', 'm')).toBe(true)
    })

    test('should handle combined modifiers', () => {
      expect(matches('HELLO\nWORLD', 'hello', 'i')).toBe(true)
      expect(matches('Test\nTEST', '^test', 'im')).toBe(true)
      expect(matches('Multiple\nLINES', 'multiple.*lines', 'is')).toBe(true)
    })

    test('should handle no modifiers', () => {
      expect(matches('hello', 'hello', '')).toBe(true)
      expect(matches('Hello', 'hello', '')).toBe(false) // case sensitive
    })
  })

  describe('special characters', () => {
    test('should handle escaped special characters', () => {
      expect(matches('test.com', '\\.', '')).toBe(true)
      expect(matches('price: $10', '\\$', '')).toBe(true)
      expect(matches('hello (world)', '\\(', '')).toBe(true)
    })

    test('should handle regex metacharacters', () => {
      expect(matches('any character', '.', '')).toBe(true)
      expect(matches('start of line', '^start', '')).toBe(true)
      expect(matches('end of line', 'line$', '')).toBe(true)
    })

    test('should handle quantifiers', () => {
      expect(matches('color', 'colou?r', '')).toBe(true) // optional u
      expect(matches('colour', 'colou?r', '')).toBe(true) // optional u
      expect(matches('aaa', 'a+', '')).toBe(true) // one or more a
      expect(matches('', 'a*', '')).toBe(true) // zero or more a
    })
  })

  describe('input validation', () => {
    test('should reject non-string inputs', () => {
      expect(() => matches(123 as any, 'pattern', '')).toThrow()
      expect(() => matches(null as any, 'pattern', '')).toThrow()
      expect(() => matches(undefined as any, 'pattern', '')).toThrow()
      expect(() => matches({} as any, 'pattern', '')).toThrow()
      expect(() => matches([] as any, 'pattern', '')).toThrow()
    })

    test('should handle empty strings', () => {
      expect(matches('', 'test', '')).toBe(false)
      expect(matches('', '', '')).toBe(true)
      expect(matches('', '.*', '')).toBe(true) // matches any character zero or more times
    })

    test('should handle whitespace strings', () => {
      expect(matches('   ', '\\s+', '')).toBe(true)
      expect(matches('\t\n', '\\s+', '')).toBe(true)
      expect(matches(' ', ' ', '')).toBe(true)
    })
  })

  describe('edge cases', () => {
    test('should handle very long strings', () => {
      const longString = 'a'.repeat(10000)
      expect(matches(longString, 'a+', '')).toBe(true)
      expect(matches(longString, 'b', '')).toBe(false)
    })

    test('should handle special Unicode characters', () => {
      expect(matches('café', 'café', '')).toBe(true)
      expect(matches('🙂😊', '🙂', '')).toBe(true)
      expect(matches('测试', '测试', '')).toBe(true)
    })

    test('should handle newlines and tabs', () => {
      expect(matches('line1\nline2', '\\n', '')).toBe(true)
      expect(matches('tab\there', '\\t', '')).toBe(true)
      expect(matches('carriage\rreturn', '\\r', '')).toBe(true)
    })

    test('should handle complex patterns', () => {
      const emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
      expect(matches('test@example.com', emailPattern, '')).toBe(true)
      expect(matches('invalid.email', emailPattern, '')).toBe(false)

      const phonePattern = '^\\+?[1-9]\\d{1,14}$'
      expect(matches('+1234567890', phonePattern, '')).toBe(true)
      expect(matches('invalid-phone', phonePattern, '')).toBe(false)
    })
  })

  describe('real-world use cases', () => {
    test('should validate email patterns', () => {
      const emailPattern = '^[\\w\\.-]+@[\\w\\.-]+\\.[a-zA-Z]{2,}$'
      expect(matches('user@domain.com', emailPattern, '')).toBe(true)
      expect(matches('test.email@example.org', emailPattern, '')).toBe(true)
      expect(matches('invalid.email', emailPattern, '')).toBe(false)
    })

    test('should validate phone number patterns', () => {
      const phonePattern = '^\\d{3}-\\d{3}-\\d{4}$'
      expect(matches('123-456-7890', phonePattern, '')).toBe(true)
      expect(matches('987-654-3210', phonePattern, '')).toBe(true)
      expect(matches('invalid-phone', phonePattern, '')).toBe(false)
    })

    test('should validate URL patterns', () => {
      const urlPattern = '^https?:\\/\\/.+'
      expect(matches('http://example.com', urlPattern, '')).toBe(true)
      expect(matches('https://secure.example.com', urlPattern, '')).toBe(true)
      expect(matches('ftp://example.com', urlPattern, '')).toBe(false)
    })

    test('should validate password patterns', () => {
      const strongPasswordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
      expect(matches('StrongPass1!', strongPasswordPattern, '')).toBe(true)
      expect(matches('weakpass', strongPasswordPattern, '')).toBe(false)
      expect(matches('12345678', strongPasswordPattern, '')).toBe(false)
    })

    test('should validate date patterns', () => {
      const datePattern = '^\\d{4}-\\d{2}-\\d{2}$'
      expect(matches('2023-12-25', datePattern, '')).toBe(true)
      expect(matches('2000-01-01', datePattern, '')).toBe(true)
      expect(matches('invalid-date', datePattern, '')).toBe(false)
    })

    test('should validate postal code patterns', () => {
      const usZipPattern = '^\\d{5}(-\\d{4})?$'
      expect(matches('12345', usZipPattern, '')).toBe(true)
      expect(matches('12345-6789', usZipPattern, '')).toBe(true)
      expect(matches('invalid-zip', usZipPattern, '')).toBe(false)

      const canadaPostalPattern = '^[A-Za-z]\\d[A-Za-z] \\d[A-Za-z]\\d$'
      expect(matches('K1A 0A6', canadaPostalPattern, '')).toBe(true)
      expect(matches('M5V 3L9', canadaPostalPattern, '')).toBe(true)
      expect(matches('invalid-postal', canadaPostalPattern, '')).toBe(false)
    })

    test('should validate credit card patterns', () => {
      const visaPattern = '^4\\d{15}$'
      expect(matches('4111111111111111', visaPattern, '')).toBe(true)
      expect(matches('4000000000000000', visaPattern, '')).toBe(true)
      expect(matches('5111111111111111', visaPattern, '')).toBe(false) // Mastercard starts with 5

      const mastercardPattern = '^5[1-5]\\d{14}$'
      expect(matches('5555555555554444', mastercardPattern, '')).toBe(true)
      expect(matches('5111111111111111', mastercardPattern, '')).toBe(true)
      expect(matches('4111111111111111', mastercardPattern, '')).toBe(false) // Visa starts with 4
    })

    test('should validate username patterns', () => {
      const usernamePattern = '^[a-zA-Z0-9_]{3,20}$'
      expect(matches('user123', usernamePattern, '')).toBe(true)
      expect(matches('test_user', usernamePattern, '')).toBe(true)
      expect(matches('ab', usernamePattern, '')).toBe(false) // too short
      expect(matches('user@name', usernamePattern, '')).toBe(false) // invalid character
    })
  })

  describe('pattern conversion', () => {
    test('should convert string patterns to RegExp', () => {
      // String patterns should be converted to RegExp internally
      expect(matches('test123', '\\d+', '')).toBe(true)
      expect(matches('hello', '^h', '')).toBe(true)
      expect(matches('world', 'd$', '')).toBe(true)
    })

    test('should preserve RegExp patterns', () => {
      // RegExp patterns should be used as-is
      expect(matches('test123', /\d+/, '')).toBe(true)
      expect(matches('hello', /^h/, '')).toBe(true)
      expect(matches('world', /d$/, '')).toBe(true)
    })

    test('should apply modifiers to string patterns', () => {
      expect(matches('HELLO', 'hello', 'i')).toBe(true)
      expect(matches('HELLO', /hello/, '')).toBe(false) // RegExp without modifier
      expect(matches('HELLO', /hello/i, '')).toBe(true) // RegExp with modifier
    })
  })

  describe('boolean return values', () => {
    test('should return boolean true for matches', () => {
      const result = matches('test', 'test', '')
      expect(result).toBe(true)
      expect(typeof result).toBe('boolean')
    })

    test('should return boolean false for non-matches', () => {
      const result = matches('test', 'no-match', '')
      expect(result).toBe(false)
      expect(typeof result).toBe('boolean')
    })

    test('should handle truthy/falsy return from match', () => {
      // match() returns array or null, function should convert to boolean
      expect(matches('test', 'test', '')).toBe(true) // array -> true
      expect(matches('test', 'no-match', '')).toBe(false) // null -> false
    })
  })

  describe('performance', () => {
    test('should handle many matches efficiently', () => {
      const patterns = [
        'hello',
        'world',
        '\\d+',
        '[a-z]+',
        '^test',
        'end$',
      ]
      const strings = [
        'hello world',
        'test123',
        'abc',
        'test case',
        'end',
      ]

      const start = Date.now()
      patterns.forEach((pattern) => {
        strings.forEach((str) => {
          matches(str, pattern, '')
        })
      })
      const end = Date.now()

      expect(end - start).toBeLessThan(50) // Should complete quickly
    })

    test('should handle complex patterns efficiently', () => {
      const complexPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
      const passwords = [
        'StrongPass1!',
        'weakpass',
        'UPPERCASE123!',
        'lowercase123!',
        'NoNumber!',
        'NoSpecial123',
        'TooShort1!',
      ]

      const start = Date.now()
      for (let i = 0; i < 100; i++) {
        passwords.forEach((password) => {
          matches(password, complexPattern, '')
        })
      }
      const end = Date.now()

      expect(end - start).toBeLessThan(100) // Should handle complex patterns efficiently
    })
  })
})
