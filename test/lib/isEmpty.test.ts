import { describe, expect, test } from 'bun:test'
import isEmpty from '../../src/lib/isEmpty'

describe('isEmpty', () => {
  describe('basic empty validation', () => {
    test('should validate empty strings', () => {
      expect(isEmpty('')).toBe(true)
      expect(isEmpty('   ', { ignoreWhitespace: true })).toBe(true) // whitespace only with option
      expect(isEmpty('\t', { ignoreWhitespace: true })).toBe(true) // tab with option
      expect(isEmpty('\n', { ignoreWhitespace: true })).toBe(true) // newline with option
      expect(isEmpty('\r', { ignoreWhitespace: true })).toBe(true) // carriage return with option
      expect(isEmpty(' \t\n\r ', { ignoreWhitespace: true })).toBe(true) // mixed whitespace with option
    })

    test('should reject non-empty strings', () => {
      expect(isEmpty('hello')).toBe(false)
      expect(isEmpty('a')).toBe(false)
      expect(isEmpty('0')).toBe(false) // string zero
      expect(isEmpty('false')).toBe(false) // string false
      expect(isEmpty(' a ')).toBe(false) // string with content and whitespace
    })
  })

  describe('options validation', () => {
    test('should handle ignoreWhitespace option', () => {
      expect(isEmpty('   ', { ignoreWhitespace: true })).toBe(true)
      expect(isEmpty('   ', { ignoreWhitespace: false })).toBe(false)
      expect(isEmpty('\t\n\r', { ignoreWhitespace: true })).toBe(true)
      expect(isEmpty('\t\n\r', { ignoreWhitespace: false })).toBe(false)
    })

    test('should handle default options', () => {
      // Default behavior should NOT ignore whitespace
      expect(isEmpty('   ')).toBe(false)
      expect(isEmpty('')).toBe(true)
      expect(isEmpty('a')).toBe(false)
    })
  })

  describe('edge cases', () => {
    test('should handle unicode whitespace', () => {
      expect(isEmpty('\u00A0', { ignoreWhitespace: true })).toBe(true) // non-breaking space
      expect(isEmpty('\u2000', { ignoreWhitespace: true })).toBe(true) // en quad
      expect(isEmpty('\u2001', { ignoreWhitespace: true })).toBe(true) // em quad
      expect(isEmpty('\u2002', { ignoreWhitespace: true })).toBe(true) // en space
      expect(isEmpty('\u2003', { ignoreWhitespace: true })).toBe(true) // em space
      expect(isEmpty('\u2009', { ignoreWhitespace: true })).toBe(true) // thin space
      expect(isEmpty('\u200A', { ignoreWhitespace: true })).toBe(true) // hair space
    })

    test('should handle very long whitespace strings', () => {
      const longWhitespace = ' '.repeat(1000)
      expect(isEmpty(longWhitespace, { ignoreWhitespace: true })).toBe(true)

      const longWhitespaceWithContent = `${' '.repeat(500)}a${' '.repeat(500)}`
      expect(isEmpty(longWhitespaceWithContent)).toBe(false)
    })

    test('should handle special characters', () => {
      expect(isEmpty('.')).toBe(false)
      expect(isEmpty(',')).toBe(false)
      expect(isEmpty('!')).toBe(false)
      expect(isEmpty('@')).toBe(false)
      expect(isEmpty('#')).toBe(false)
      expect(isEmpty('$')).toBe(false)
      expect(isEmpty('%')).toBe(false)
    })

    test('should handle numbers as strings', () => {
      expect(isEmpty('0')).toBe(false)
      expect(isEmpty('1')).toBe(false)
      expect(isEmpty('-1')).toBe(false)
      expect(isEmpty('3.14')).toBe(false)
      expect(isEmpty('1e10')).toBe(false)
    })
  })

  describe('real-world use cases', () => {
    test('should validate form input fields', () => {
      expect(isEmpty('')).toBe(true) // empty input
      expect(isEmpty('   ', { ignoreWhitespace: true })).toBe(true) // whitespace only input
      expect(isEmpty('John Doe')).toBe(false) // valid name
      expect(isEmpty(' valid@email.com ')).toBe(false) // email with whitespace
    })

    test('should validate text content', () => {
      expect(isEmpty('')).toBe(true) // empty content
      expect(isEmpty('\n\n\n', { ignoreWhitespace: true })).toBe(true) // newlines only
      expect(isEmpty('Hello World')).toBe(false) // actual content
      expect(isEmpty('  \n  Title  \n  ')).toBe(false) // content with whitespace
    })

    test('should validate search queries', () => {
      expect(isEmpty('')).toBe(true) // empty search
      expect(isEmpty('   ', { ignoreWhitespace: true })).toBe(true) // whitespace search
      expect(isEmpty('javascript')).toBe(false) // valid search
      expect(isEmpty(' react ')).toBe(false) // search with whitespace
    })

    test('should validate user comments', () => {
      expect(isEmpty('')).toBe(true) // empty comment
      expect(isEmpty('\t\t\t', { ignoreWhitespace: true })).toBe(true) // tabs only
      expect(isEmpty('Great article!')).toBe(false) // valid comment
      expect(isEmpty('  Thanks!  ')).toBe(false) // comment with whitespace
    })
  })

  describe('performance considerations', () => {
    test('should handle many empty checks efficiently', () => {
      const testStrings = [
        '',
        '   ',
        '\t',
        '\n',
        '\r',
        ' \t\n\r ',
        'a',
        'hello',
        'world',
        'test',
        '123',
        '   content   ',
        '\tcontent\t',
        '\ncontent\n',
      ]

      const start = Date.now()
      testStrings.forEach((str) => {
        isEmpty(str)
      })
      const end = Date.now()

      expect(end - start).toBeLessThan(50) // Should complete quickly
    })

    test('should handle very long strings efficiently', () => {
      const veryLongEmpty = ' '.repeat(10000)
      const veryLongNonEmpty = 'a'.repeat(10000)

      const start = Date.now()
      expect(isEmpty(veryLongEmpty, { ignoreWhitespace: true })).toBe(true)
      expect(isEmpty(veryLongNonEmpty)).toBe(false)
      const end = Date.now()

      expect(end - start).toBeLessThan(100) // Should handle long strings quickly
    })
  })

  describe('consistency with related functions', () => {
    test('should be consistent with string length checks', () => {
      const emptyStrings = ['']
      const whitespaceStrings = ['   ', '\t\n\r']
      const nonEmptyStrings = ['a', 'hello', '0', 'false']

      emptyStrings.forEach((str) => {
        expect(isEmpty(str)).toBe(true)
      })

      whitespaceStrings.forEach((str) => {
        expect(isEmpty(str, { ignoreWhitespace: true })).toBe(true)
      })

      nonEmptyStrings.forEach((str) => {
        expect(isEmpty(str)).toBe(false)
      })
    })

    test('should complement trim operations', () => {
      expect(isEmpty('   '.trim())).toBe(true)
      expect(isEmpty('  hello  '.trim())).toBe(false)
      expect(isEmpty('\t\n\r'.trim())).toBe(true)
      expect(isEmpty('\tworld\n'.trim())).toBe(false)
    })
  })

  describe('error handling', () => {
    test('should throw error for non-string input', () => {
      expect(() => isEmpty(123 as any)).toThrow()
      expect(() => isEmpty(null as any)).toThrow()
      expect(() => isEmpty(undefined as any)).toThrow()
      expect(() => isEmpty({} as any)).toThrow()
      expect(() => isEmpty([] as any)).toThrow()
      expect(() => isEmpty(true as any)).toThrow()
    })

    test('should handle invalid options gracefully', () => {
      expect(isEmpty('', {})).toBe(true)
      expect(isEmpty('', undefined as any)).toBe(true)
      expect(isEmpty('   ', { ignoreWhitespace: null as any })).toBe(false) // null is falsy, so whitespace not ignored
    })
  })
})
