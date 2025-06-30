import { describe, expect, test } from 'bun:test'
import isLength from '../../src/lib/isLength'

describe('isLength', () => {
  describe('basic length validation', () => {
    test('should validate string length with min option', () => {
      expect(isLength('hello', { min: 5 })).toBe(true)
      expect(isLength('hello', { min: 3 })).toBe(true)
      expect(isLength('hello', { min: 6 })).toBe(false)
      expect(isLength('', { min: 0 })).toBe(true)
      expect(isLength('', { min: 1 })).toBe(false)
    })

    test('should validate string length with max option', () => {
      expect(isLength('hello', { max: 5 })).toBe(true)
      expect(isLength('hello', { max: 10 })).toBe(true)
      expect(isLength('hello', { max: 4 })).toBe(false)
      expect(isLength('', { max: 0 })).toBe(true)
      expect(isLength('a', { max: 0 })).toBe(false)
    })

    test('should validate string length with both min and max', () => {
      expect(isLength('hello', { min: 3, max: 10 })).toBe(true)
      expect(isLength('hello', { min: 5, max: 5 })).toBe(true)
      expect(isLength('hello', { min: 6, max: 10 })).toBe(false)
      expect(isLength('hello', { min: 1, max: 4 })).toBe(false)
    })

    test('should handle empty strings', () => {
      expect(isLength('', { min: 0, max: 0 })).toBe(true)
      expect(isLength('', { min: 0, max: 10 })).toBe(true)
      expect(isLength('', { min: 1, max: 10 })).toBe(false)
    })
  })

  describe('edge cases', () => {
    test('should handle unicode characters correctly', () => {
      expect(isLength('🚀', { min: 1, max: 1 })).toBe(true) // emoji counts as 1 character
      expect(isLength('café', { min: 4, max: 4 })).toBe(true) // accented characters
      expect(isLength('你好', { min: 2, max: 2 })).toBe(true) // Chinese characters
      expect(isLength('🚀🌟⭐', { min: 3, max: 3 })).toBe(true) // multiple emojis
    })

    test('should handle very long strings', () => {
      const longString = 'a'.repeat(10000)
      expect(isLength(longString, { min: 10000, max: 10000 })).toBe(true)
      expect(isLength(longString, { min: 9999, max: 10001 })).toBe(true)
      expect(isLength(longString, { min: 10001 })).toBe(false)
      expect(isLength(longString, { max: 9999 })).toBe(false)
    })

    test('should handle whitespace strings', () => {
      expect(isLength('   ', { min: 3, max: 3 })).toBe(true)
      expect(isLength('\t\n\r', { min: 3, max: 3 })).toBe(true)
      expect(isLength('  hello  ', { min: 9, max: 9 })).toBe(true)
    })

    test('should handle special characters', () => {
      expect(isLength('!@#$%^&*()', { min: 10, max: 10 })).toBe(true)
      expect(isLength('line1\nline2', { min: 11, max: 11 })).toBe(true)
      expect(isLength('tab\there', { min: 8, max: 8 })).toBe(true)
    })
  })

  describe('boundary conditions', () => {
    test('should handle zero length constraints', () => {
      expect(isLength('', { min: 0 })).toBe(true)
      expect(isLength('', { max: 0 })).toBe(true)
      expect(isLength('a', { max: 0 })).toBe(false)
    })

    test('should handle large length constraints', () => {
      const maxSafeInt = Number.MAX_SAFE_INTEGER
      expect(isLength('hello', { min: 0, max: maxSafeInt })).toBe(true)
      expect(isLength('hello', { min: maxSafeInt })).toBe(false)
    })

    test('should handle equal min and max (exact length)', () => {
      expect(isLength('hello', { min: 5, max: 5 })).toBe(true)
      expect(isLength('hello', { min: 4, max: 4 })).toBe(false)
      expect(isLength('hello', { min: 6, max: 6 })).toBe(false)
    })
  })

  describe('real-world use cases', () => {
    test('should validate usernames', () => {
      const usernameValidator = { min: 3, max: 20 }
      expect(isLength('john', usernameValidator)).toBe(true)
      expect(isLength('a', usernameValidator)).toBe(false) // too short
      expect(isLength('verylongusernamethatexceedslimit', usernameValidator)).toBe(false) // too long
      expect(isLength('user123', usernameValidator)).toBe(true)
    })

    test('should validate passwords', () => {
      const passwordValidator = { min: 8, max: 128 }
      expect(isLength('password123', passwordValidator)).toBe(true)
      expect(isLength('weak', passwordValidator)).toBe(false) // too short
      expect(isLength('StrongP@ssw0rd!', passwordValidator)).toBe(true)
    })

    test('should validate form inputs', () => {
      const nameValidator = { min: 1, max: 50 }
      expect(isLength('John Doe', nameValidator)).toBe(true)
      expect(isLength('', nameValidator)).toBe(false) // empty name
      expect(isLength('A'.repeat(51), nameValidator)).toBe(false) // too long
    })

    test('should validate text content', () => {
      const commentValidator = { min: 1, max: 500 }
      expect(isLength('Great article!', commentValidator)).toBe(true)
      expect(isLength('', commentValidator)).toBe(false) // empty comment
      expect(isLength('A'.repeat(501), commentValidator)).toBe(false) // too long
    })

    test('should validate social media posts', () => {
      const tweetValidator = { min: 1, max: 280 }
      expect(isLength('Hello Twitter!', tweetValidator)).toBe(true)
      expect(isLength('', tweetValidator)).toBe(false) // empty tweet
      expect(isLength('A'.repeat(281), tweetValidator)).toBe(false) // too long
    })
  })

  describe('options validation', () => {
    test('should handle missing options', () => {
      expect(isLength('hello', {})).toBe(true) // no constraints
      expect(isLength('', {})).toBe(true) // no constraints
    })

    test('should handle only min option', () => {
      expect(isLength('hello', { min: 3 })).toBe(true)
      expect(isLength('hi', { min: 3 })).toBe(false)
    })

    test('should handle only max option', () => {
      expect(isLength('hello', { max: 10 })).toBe(true)
      expect(isLength('verylongstring', { max: 10 })).toBe(false)
    })

    test('should handle invalid min/max values', () => {
      expect(isLength('hello', { min: -1 })).toBe(true) // negative min treated as 0
      expect(isLength('hello', { max: -1 })).toBe(false) // negative max
      expect(isLength('', { min: -1, max: -1 })).toBe(false) // both negative
    })
  })

  describe('performance considerations', () => {
    test('should handle many length validations efficiently', () => {
      const testStrings = [
        '',
        'a',
        'hello',
        'world',
        'javascript',
        'typescript',
        'verylongstringtotestperformance',
        'short',
        'medium length string',
      ]
      const validator = { min: 0, max: 100 }

      const start = Date.now()
      testStrings.forEach((str) => {
        isLength(str, validator)
      })
      const end = Date.now()

      expect(end - start).toBeLessThan(50) // Should complete quickly
    })

    test('should handle very long strings efficiently', () => {
      const veryLongString = 'a'.repeat(100000)
      const validator = { min: 50000, max: 150000 }

      const start = Date.now()
      expect(isLength(veryLongString, validator)).toBe(true)
      const end = Date.now()

      expect(end - start).toBeLessThan(100) // Should handle long strings quickly
    })
  })

  describe('error handling', () => {
    test('should throw error for non-string input', () => {
      expect(() => isLength(123 as any, { min: 1 })).toThrow()
      expect(() => isLength(null as any, { min: 1 })).toThrow()
      expect(() => isLength(undefined as any, { min: 1 })).toThrow()
      expect(() => isLength({} as any, { min: 1 })).toThrow()
      expect(() => isLength([] as any, { min: 1 })).toThrow()
      expect(() => isLength(true as any, { min: 1 })).toThrow()
    })

    test('should handle invalid options gracefully', () => {
      expect(isLength('hello', {} as any)).toBe(true) // empty options
      expect(isLength('hello', undefined as any)).toBe(true)
      expect(isLength('hello', { min: Number.NaN })).toBe(true) // NaN treated as no constraint
      expect(isLength('hello', { max: Number.NaN })).toBe(true) // NaN treated as no constraint
    })
  })
})
