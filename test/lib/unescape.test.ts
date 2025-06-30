import { describe, expect, test } from 'bun:test'
import unescape from '../../src/lib/unescape'

describe('unescape', () => {
  describe('Basic HTML entity unescaping', () => {
    test('should unescape ampersand', () => {
      expect(unescape('&amp')).toBe('&')
      expect(unescape('Tom &amp Jerry')).toBe('Tom & Jerry')
    })

    test('should unescape quotes', () => {
      expect(unescape('&quot')).toBe('"')
      expect(unescape('&#x27')).toBe('\'')
      expect(unescape('Say &quothello&quot')).toBe('Say "hello"')
      expect(unescape('It&#x27s working')).toBe('It\'s working')
    })

    test('should unescape angle brackets', () => {
      expect(unescape('&lt')).toBe('<')
      expect(unescape('&gt')).toBe('>')
      expect(unescape('&ltscript&gt')).toBe('<script>')
      expect(unescape('&ltdiv&gtcontent&lt/div&gt')).toBe('<div>content</div>')
    })

    test('should unescape slashes', () => {
      expect(unescape('&#x2F')).toBe('/')
      expect(unescape('&#x5C')).toBe('\\')
      expect(unescape('path&#x2Fto&#x2Ffile')).toBe('path/to/file')
      expect(unescape('C:&#x5CWindows')).toBe('C:\\Windows')
    })

    test('should unescape backticks', () => {
      expect(unescape('&#96')).toBe('`')
      expect(unescape('&#96code&#96')).toBe('`code`')
    })
  })

  describe('Input validation', () => {
    test('should throw error for non-string input', () => {
      expect(() => unescape(null as any)).toThrow()
      expect(() => unescape(undefined as any)).toThrow()
      expect(() => unescape(123 as any)).toThrow()
      expect(() => unescape([] as any)).toThrow()
      expect(() => unescape({} as any)).toThrow()
    })
  })
})
