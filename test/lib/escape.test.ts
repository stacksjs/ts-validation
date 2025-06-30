import { describe, expect, test } from 'bun:test'
import escape from '../../src/lib/escape'

describe('escape', () => {
  describe('basic HTML entity escaping', () => {
    test('should escape ampersand', () => {
      expect(escape('&')).toBe('&amp')
      expect(escape('Tom & Jerry')).toBe('Tom &amp Jerry')
    })

    test('should escape quotes', () => {
      expect(escape('"')).toBe('&quot')
      expect(escape('\'')).toBe('&#x27')
      expect(escape('Say "hello"')).toBe('Say &quothello&quot')
      expect(escape('It\'s working')).toBe('It&#x27s working')
    })

    test('should escape angle brackets', () => {
      expect(escape('<')).toBe('&lt')
      expect(escape('>')).toBe('&gt')
      expect(escape('<script>')).toBe('&ltscript&gt')
      expect(escape('<div>content</div>')).toBe('&ltdiv&gtcontent&lt&#x2Fdiv&gt')
    })

    test('should escape slashes', () => {
      expect(escape('/')).toBe('&#x2F')
      expect(escape('\\')).toBe('&#x5C')
      expect(escape('path/to/file')).toBe('path&#x2Fto&#x2Ffile')
      expect(escape('C:\\Windows')).toBe('C:&#x5CWindows')
    })

    test('should escape backticks', () => {
      expect(escape('`')).toBe('&#96')
      expect(escape('`code`')).toBe('&#96code&#96')
    })
  })

  describe('multiple characters', () => {
    test('should escape multiple different characters', () => {
      expect(escape('<script>alert("XSS")</script>')).toBe('&ltscript&gtalert(&quotXSS&quot)&lt&#x2Fscript&gt')
      expect(escape('Tom & Jerry\'s "Adventure"')).toBe('Tom &amp Jerry&#x27s &quotAdventure&quot')
    })

    test('should handle complex HTML strings', () => {
      const input = '<div class="container" onclick="alert(\'Hello & Goodbye\')">Content</div>'
      const expected = '&ltdiv class=&quotcontainer&quot onclick=&quotalert(&#x27Hello &amp Goodbye&#x27)&quot&gtContent&lt&#x2Fdiv&gt'
      expect(escape(input)).toBe(expected)
    })

    test('should handle mixed quotes and slashes', () => {
      expect(escape('"path/to/file"')).toBe('&quotpath&#x2Fto&#x2Ffile&quot')
      expect(escape('\'C:\\folder\\file.txt\'')).toBe('&#x27C:&#x5Cfolder&#x5Cfile.txt&#x27')
    })
  })

  describe('edge cases', () => {
    test('should handle empty string', () => {
      expect(escape('')).toBe('')
    })

    test('should handle string with no special characters', () => {
      expect(escape('Hello World')).toBe('Hello World')
      expect(escape('123456789')).toBe('123456789')
      expect(escape('abc XYZ')).toBe('abc XYZ')
    })

    test('should handle whitespace', () => {
      expect(escape(' ')).toBe(' ')
      expect(escape('\n')).toBe('\n')
      expect(escape('\t')).toBe('\t')
      expect(escape('\r')).toBe('\r')
    })

    test('should handle unicode characters', () => {
      expect(escape('🚀')).toBe('🚀')
      expect(escape('café')).toBe('café')
      expect(escape('日本語')).toBe('日本語')
    })
  })

  describe('real-world scenarios', () => {
    test('should handle JavaScript code injection attempts', () => {
      const maliciousScript = '<script>document.cookie="evil=true"</script>'
      const expected = '&ltscript&gtdocument.cookie=&quotevil=true&quot&lt&#x2Fscript&gt'
      expect(escape(maliciousScript)).toBe(expected)
    })

    test('should handle HTML attributes with quotes', () => {
      const html = '<img src="image.jpg" alt=\'A "quoted" description\'>'
      const expected = '&ltimg src=&quotimage.jpg&quot alt=&#x27A &quotquoted&quot description&#x27&gt'
      expect(escape(html)).toBe(expected)
    })

    test('should handle file paths', () => {
      expect(escape('/usr/local/bin')).toBe('&#x2Fusr&#x2Flocal&#x2Fbin')
      expect(escape('C:\\Program Files\\App')).toBe('C:&#x5CProgram Files&#x5CApp')
    })

    test('should handle template literals', () => {
      const template = '`Hello \${name}, your score is \${score > 100 ? "excellent" : "good"}`'
      const expected = '&#96Hello \${name}, your score is \${score &gt 100 ? &quotexcellent&quot : &quotgood&quot}&#96'
      expect(escape(template)).toBe(expected)
    })
  })

  describe('input validation', () => {
    test('should throw error for non-string input', () => {
      expect(() => escape(null as any)).toThrow()
      expect(() => escape(undefined as any)).toThrow()
      expect(() => escape(123 as any)).toThrow()
      expect(() => escape([] as any)).toThrow()
      expect(() => escape({} as any)).toThrow()
    })
  })

  describe('performance and consistency', () => {
    test('should handle long strings', () => {
      const longString = `${'a'.repeat(1000)}<script>${'b'.repeat(1000)}`
      const result = escape(longString)
      expect(result).toContain('&ltscript&gt')
      expect(result.length).toBeGreaterThan(longString.length)
    })

    test('should be consistent across multiple calls', () => {
      const input = '<div>"test"</div>'
      const result1 = escape(input)
      const result2 = escape(input)
      expect(result1).toBe(result2)
    })
  })
})
