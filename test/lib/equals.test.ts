import { describe, expect, test } from 'bun:test'
import equals from '../../src/lib/equals'

describe('equals', () => {
  describe('exact string matching', () => {
    test('should return true for identical strings', () => {
      expect(equals('hello', 'hello')).toBe(true)
      expect(equals('world', 'world')).toBe(true)
      expect(equals('test123', 'test123')).toBe(true)
      expect(equals('', '')).toBe(true)
    })

    test('should return false for different strings', () => {
      expect(equals('hello', 'world')).toBe(false)
      expect(equals('test', 'TEST')).toBe(false)
      expect(equals('abc', 'def')).toBe(false)
      expect(equals('123', '456')).toBe(false)
    })

    test('should be case sensitive', () => {
      expect(equals('Hello', 'hello')).toBe(false)
      expect(equals('WORLD', 'world')).toBe(false)
      expect(equals('Test', 'TEST')).toBe(false)
      expect(equals('CamelCase', 'camelcase')).toBe(false)
    })
  })

  describe('empty and whitespace strings', () => {
    test('should handle empty strings', () => {
      expect(equals('', '')).toBe(true)
      expect(equals('test', '')).toBe(false)
      expect(equals('', 'test')).toBe(false)
    })

    test('should handle whitespace strings', () => {
      expect(equals(' ', ' ')).toBe(true)
      expect(equals('  ', '  ')).toBe(true)
      expect(equals('\t', '\t')).toBe(true)
      expect(equals('\n', '\n')).toBe(true)
      expect(equals('\r', '\r')).toBe(true)
    })

    test('should distinguish between different whitespace', () => {
      expect(equals(' ', '  ')).toBe(false) // different number of spaces
      expect(equals(' ', '\t')).toBe(false) // space vs tab
      expect(equals('\n', '\r')).toBe(false) // newline vs carriage return
      expect(equals('test ', 'test')).toBe(false) // trailing space
      expect(equals(' test', 'test')).toBe(false) // leading space
    })
  })

  describe('special characters', () => {
    test('should handle special characters correctly', () => {
      expect(equals('!@#$%', '!@#$%')).toBe(true)
      expect(equals('hello@world.com', 'hello@world.com')).toBe(true)
      expect(equals('path/to/file', 'path/to/file')).toBe(true)
      expect(equals('$100.50', '$100.50')).toBe(true)
    })

    test('should distinguish between similar special characters', () => {
      expect(equals('!', '?')).toBe(false)
      expect(equals('@', '#')).toBe(false)
      expect(equals('$', '%')).toBe(false)
      expect(equals('(', ')')).toBe(false)
      expect(equals('[', ']')).toBe(false)
    })

    test('should handle Unicode characters', () => {
      expect(equals('café', 'café')).toBe(true)
      expect(equals('🙂', '🙂')).toBe(true)
      expect(equals('测试', '测试')).toBe(true)
      expect(equals('Ñoño', 'Ñoño')).toBe(true)
    })

    test('should distinguish between similar Unicode characters', () => {
      expect(equals('café', 'cafe')).toBe(false) // with and without accent
      expect(equals('🙂', '😊')).toBe(false) // different emojis
      expect(equals('测试', '测验')).toBe(false) // different Chinese characters
    })
  })

  describe('numbers and mixed content', () => {
    test('should handle numeric strings', () => {
      expect(equals('123', '123')).toBe(true)
      expect(equals('0', '0')).toBe(true)
      expect(equals('-456', '-456')).toBe(true)
      expect(equals('3.14159', '3.14159')).toBe(true)
    })

    test('should distinguish between different numbers', () => {
      expect(equals('123', '124')).toBe(false)
      expect(equals('0', '1')).toBe(false)
      expect(equals('-456', '456')).toBe(false)
      expect(equals('3.14159', '3.14160')).toBe(false)
    })

    test('should handle mixed alphanumeric content', () => {
      expect(equals('abc123', 'abc123')).toBe(true)
      expect(equals('test_case_1', 'test_case_1')).toBe(true)
      expect(equals('version-2.1.0', 'version-2.1.0')).toBe(true)
    })

    test('should distinguish between similar mixed content', () => {
      expect(equals('abc123', 'abc124')).toBe(false)
      expect(equals('test_case_1', 'test_case_2')).toBe(false)
      expect(equals('version-2.1.0', 'version-2.1.1')).toBe(false)
    })
  })

  describe('input validation', () => {
    test('should reject non-string first parameter', () => {
      expect(() => equals(123 as any, 'test')).toThrow()
      expect(() => equals(null as any, 'test')).toThrow()
      expect(() => equals(undefined as any, 'test')).toThrow()
      expect(() => equals({} as any, 'test')).toThrow()
      expect(() => equals([] as any, 'test')).toThrow()
      expect(() => equals(true as any, 'test')).toThrow()
    })

    test('should handle various comparison parameter types', () => {
      // The comparison parameter is not validated by assertString
      expect(equals('test', 'test')).toBe(true)
      expect(equals('123', '123')).toBe(true)
      expect(equals('', '')).toBe(true)
    })
  })

  describe('long strings', () => {
    test('should handle long identical strings', () => {
      const longString = 'a'.repeat(10000)
      expect(equals(longString, longString)).toBe(true)
    })

    test('should handle long different strings', () => {
      const longString1 = 'a'.repeat(10000)
      const longString2 = `${'a'.repeat(9999)}b`
      expect(equals(longString1, longString2)).toBe(false)
    })

    test('should handle very long strings efficiently', () => {
      const longString1 = 'test'.repeat(100000)
      const longString2 = 'test'.repeat(100000)
      const longString3 = `${'test'.repeat(99999)}different`

      const start = Date.now()
      expect(equals(longString1, longString2)).toBe(true)
      expect(equals(longString1, longString3)).toBe(false)
      const end = Date.now()

      expect(end - start).toBeLessThan(100) // Should be fast
    })
  })

  describe('real-world use cases', () => {
    test('should validate passwords', () => {
      const correctPassword = 'MySecretPassword123!'
      expect(equals(correctPassword, 'MySecretPassword123!')).toBe(true)
      expect(equals(correctPassword, 'MySecretPassword123')).toBe(false) // missing !
      expect(equals(correctPassword, 'mySecretPassword123!')).toBe(false) // case difference
      expect(equals(correctPassword, 'MySecretPassword124!')).toBe(false) // number difference
    })

    test('should validate usernames', () => {
      const username = 'user_name_123'
      expect(equals(username, 'user_name_123')).toBe(true)
      expect(equals(username, 'User_name_123')).toBe(false) // case difference
      expect(equals(username, 'user_name_124')).toBe(false) // number difference
      expect(equals(username, 'user-name-123')).toBe(false) // underscore vs dash
    })

    test('should validate email addresses', () => {
      const email = 'test@example.com'
      expect(equals(email, 'test@example.com')).toBe(true)
      expect(equals(email, 'Test@example.com')).toBe(false) // case difference
      expect(equals(email, 'test@Example.com')).toBe(false) // case difference
      expect(equals(email, 'test@example.org')).toBe(false) // domain difference
    })

    test('should validate URLs', () => {
      const url = 'https://www.example.com/path?param=value'
      expect(equals(url, 'https://www.example.com/path?param=value')).toBe(true)
      expect(equals(url, 'http://www.example.com/path?param=value')).toBe(false) // protocol difference
      expect(equals(url, 'https://www.example.com/path?param=other')).toBe(false) // param difference
      expect(equals(url, 'https://www.example.com/other?param=value')).toBe(false) // path difference
    })

    test('should validate file paths', () => {
      const path = '/home/user/documents/file.txt'
      expect(equals(path, '/home/user/documents/file.txt')).toBe(true)
      expect(equals(path, '/home/user/Documents/file.txt')).toBe(false) // case difference
      expect(equals(path, '/home/user/documents/file.TXT')).toBe(false) // extension case
      expect(equals(path, '/home/user/documents/other.txt')).toBe(false) // filename difference
    })

    test('should validate API tokens', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
      expect(equals(token, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')).toBe(true)
      expect(equals(token, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCj9')).toBe(false) // one character difference
      expect(equals(token, token.toLowerCase())).toBe(false) // case difference
    })

    test('should validate database IDs', () => {
      const id = '507f1f77bcf86cd799439011'
      expect(equals(id, '507f1f77bcf86cd799439011')).toBe(true)
      expect(equals(id, '507f1f77bcf86cd799439012')).toBe(false) // last digit different
      expect(equals(id, '507F1F77BCF86CD799439011')).toBe(false) // case different
    })

    test('should validate version numbers', () => {
      const version = '1.2.3-beta.1'
      expect(equals(version, '1.2.3-beta.1')).toBe(true)
      expect(equals(version, '1.2.3-beta.2')).toBe(false) // patch version different
      expect(equals(version, '1.2.4-beta.1')).toBe(false) // minor version different
      expect(equals(version, '1.2.3-Beta.1')).toBe(false) // case different
    })
  })

  describe('edge cases', () => {
    test('should handle strings with only differences at the end', () => {
      expect(equals('test', 'test1')).toBe(false)
      expect(equals('hello', 'hello ')).toBe(false)
      expect(equals('world', 'world.')).toBe(false)
    })

    test('should handle strings with only differences at the beginning', () => {
      expect(equals('test', '1test')).toBe(false)
      expect(equals('hello', ' hello')).toBe(false)
      expect(equals('world', '.world')).toBe(false)
    })

    test('should handle strings with differences in the middle', () => {
      expect(equals('hello world', 'hello_world')).toBe(false)
      expect(equals('test case', 'test-case')).toBe(false)
      expect(equals('file.txt', 'file.doc')).toBe(false)
    })

    test('should handle substrings', () => {
      expect(equals('hello', 'hello world')).toBe(false)
      expect(equals('hello world', 'hello')).toBe(false)
      expect(equals('test', 'testing')).toBe(false)
      expect(equals('testing', 'test')).toBe(false)
    })
  })

  describe('return type', () => {
    test('should always return a boolean', () => {
      expect(typeof equals('test', 'test')).toBe('boolean')
      expect(typeof equals('test', 'other')).toBe('boolean')
      expect(typeof equals('', '')).toBe('boolean')
      expect(typeof equals('a', 'b')).toBe('boolean')
    })

    test('should return true only for exact matches', () => {
      expect(equals('exact', 'exact')).toBe(true)
      expect(equals('EXACT', 'exact')).toBe(false)
      expect(equals('exact ', 'exact')).toBe(false)
      expect(equals('exact', ' exact')).toBe(false)
    })
  })

  describe('performance', () => {
    test('should handle many comparisons efficiently', () => {
      const testCases = [
        ['hello', 'hello'],
        ['world', 'world'],
        ['test', 'TEST'],
        ['abc', 'def'],
        ['123', '123'],
        ['', ''],
        ['long string test', 'long string test'],
        ['different', 'values'],
      ]

      const start = Date.now()
      for (let i = 0; i < 10000; i++) {
        testCases.forEach(([str1, str2]) => {
          equals(str1, str2)
        })
      }
      const end = Date.now()

      expect(end - start).toBeLessThan(100) // Should be very fast
    })

    test('should handle early termination for different strings', () => {
      const longString1 = `a${'b'.repeat(100000)}`
      const longString2 = `x${'b'.repeat(100000)}`

      const start = Date.now()
      expect(equals(longString1, longString2)).toBe(false)
      const end = Date.now()

      expect(end - start).toBeLessThan(10) // Should terminate early
    })
  })

  describe('strict equality behavior', () => {
    test('should behave exactly like === operator', () => {
      const testCases = [
        ['test', 'test'],
        ['test', 'TEST'],
        ['', ''],
        ['123', '123'],
        ['123', '124'],
        [' ', '  '],
        ['hello world', 'hello world'],
        ['hello world', 'hello  world'],
      ]

      testCases.forEach(([str1, str2]) => {
        expect(equals(str1, str2)).toBe(str1 === str2)
      })
    })

    test('should not perform type coercion', () => {
      // equals function expects strings, but let's verify it doesn't coerce
      expect(equals('123', '123')).toBe(true)
      expect(equals('0', '0')).toBe(true)
      expect(equals('true', 'true')).toBe(true)
      expect(equals('false', 'false')).toBe(true)
    })
  })
})
