import { describe, expect, test } from 'bun:test'
import stripLow from '../../src/lib/stripLow'

describe('stripLow', () => {
  describe('Basic low ASCII removal', () => {
    test('should remove control characters (0-31)', () => {
      expect(stripLow('hello\x00world')).toBe('helloworld')
      expect(stripLow('test\x01\x02\x03string')).toBe('teststring')
      expect(stripLow('data\x1Fend')).toBe('dataend')
    })

    test('should remove DEL character (127)', () => {
      expect(stripLow('hello\x7Fworld')).toBe('helloworld')
      expect(stripLow('test\x7F')).toBe('test')
      expect(stripLow('\x7Fstart')).toBe('start')
    })

    test('should preserve regular ASCII characters', () => {
      expect(stripLow('Hello World!')).toBe('Hello World!')
      expect(stripLow('123456789')).toBe('123456789')
      expect(stripLow('abcXYZ')).toBe('abcXYZ')
    })

    test('should preserve extended ASCII and Unicode', () => {
      expect(stripLow('café')).toBe('café')
      expect(stripLow('日本語')).toBe('日本語')
      expect(stripLow('🚀🌟')).toBe('🚀🌟')
    })
  })

  describe('Newline preservation option', () => {
    test('should remove newlines by default', () => {
      expect(stripLow('line1\nline2')).toBe('line1line2')
      expect(stripLow('text\r\nmore')).toBe('textmore')
      expect(stripLow('hello\rworld')).toBe('helloworld')
    })

    test('should preserve newlines when keep_new_lines is true', () => {
      expect(stripLow('line1\nline2', true)).toBe('line1\nline2')
      expect(stripLow('text\r\nmore', true)).toBe('text\r\nmore')
      expect(stripLow('hello\rworld', true)).toBe('hello\rworld')
    })

    test('should still remove other control characters when preserving newlines', () => {
      expect(stripLow('hello\x00\nworld\x01', true)).toBe('hello\nworld')
      expect(stripLow('test\x07\r\ndata\x1F', true)).toBe('test\r\ndata')
      expect(stripLow('line\x7F\nend', true)).toBe('line\nend')
    })
  })

  describe('Specific control characters', () => {
    test('should remove tab characters by default', () => {
      expect(stripLow('hello\tworld')).toBe('helloworld')
      expect(stripLow('\ttab')).toBe('tab')
      expect(stripLow('end\t')).toBe('end')
    })

    test('should still remove tab when keep_new_lines is true', () => {
      expect(stripLow('hello\tworld', true)).toBe('helloworld') // tab is still removed
      expect(stripLow('\ttab', true)).toBe('tab')
      expect(stripLow('end\t', true)).toBe('end')
    })

    test('should handle form feed and vertical tab', () => {
      expect(stripLow('page\x0Cbreak')).toBe('pagebreak') // form feed
      expect(stripLow('vert\x0Btab')).toBe('verttab') // vertical tab
    })

    test('should still remove form feed and vertical tab when keep_new_lines is true', () => {
      expect(stripLow('page\x0Cbreak', true)).toBe('pagebreak') // form feed still removed
      expect(stripLow('vert\x0Btab', true)).toBe('verttab') // vertical tab still removed
    })
  })

  describe('Edge cases', () => {
    test('should handle empty string', () => {
      expect(stripLow('')).toBe('')
      expect(stripLow('', true)).toBe('')
    })

    test('should handle string with only control characters', () => {
      expect(stripLow('\x00\x01\x02\x1F\x7F')).toBe('')
      expect(stripLow('\x00\x01\x02\x1F\x7F', true)).toBe('')
    })

    test('should handle string with only newlines', () => {
      expect(stripLow('\n\r\n')).toBe('')
      expect(stripLow('\n\r\n', true)).toBe('\n\r\n')
    })

    test('should handle mixed newlines and other control chars', () => {
      expect(stripLow('\x00\n\x01\r\x02\n\x1F')).toBe('')
      expect(stripLow('\x00\n\x01\r\x02\n\x1F', true)).toBe('\n\r\n')
    })
  })

  describe('Real-world use cases', () => {
    test('should clean user input', () => {
      const input = 'Hello\x00 World\x01!'
      expect(stripLow(input)).toBe('Hello World!')
    })

    test('should sanitize data for display', () => {
      const data = 'Product\x1FName:\x00Value\x7F'
      expect(stripLow(data)).toBe('ProductName:Value')
    })

    test('should clean CSV data while preserving newlines', () => {
      const csv = 'col1,col2\x00\ncol3,col4\x01\n'
      expect(stripLow(csv, true)).toBe('col1,col2\ncol3,col4\n')
    })

    test('should process log files', () => {
      const log = '2023-01-01\x00 INFO\x01 Message\nNext line\x7F'
      expect(stripLow(log, true)).toBe('2023-01-01 INFO Message\nNext line')
    })

    test('should handle binary-contaminated text', () => {
      const text = 'Text\x00\x01\x02with\x03\x04binary\x05\x06data'
      expect(stripLow(text)).toBe('Textwithbinarydata')
    })
  })

  describe('Unicode and extended characters', () => {
    test('should preserve Unicode characters', () => {
      expect(stripLow('Hello 世界\x00!')).toBe('Hello 世界!')
      expect(stripLow('Emoji\x01🎉\x02Test')).toBe('Emoji🎉Test')
    })

    test('should handle UTF-8 with control characters', () => {
      const input = 'Café\x00 München\x01 naïve\x7F'
      expect(stripLow(input)).toBe('Café München naïve')
    })
  })

  describe('Input validation', () => {
    test('should throw error for non-string input', () => {
      expect(() => stripLow(null as any)).toThrow()
      expect(() => stripLow(undefined as any)).toThrow()
      expect(() => stripLow(123 as any)).toThrow()
      expect(() => stripLow([] as any)).toThrow()
      expect(() => stripLow({} as any)).toThrow()
    })

    test('should handle boolean parameter correctly', () => {
      const input = 'test\nstring'
      expect(stripLow(input, false)).toBe('teststring')
      expect(stripLow(input, true)).toBe('test\nstring')
    })
  })

  describe('Performance and consistency', () => {
    test('should handle long strings efficiently', () => {
      const longString = `${'a'.repeat(1000)}\x00${'b'.repeat(1000)}\x01${'c'.repeat(1000)}`
      const result = stripLow(longString)
      expect(result).toBe('a'.repeat(1000) + 'b'.repeat(1000) + 'c'.repeat(1000))
      expect(result.length).toBe(3000)
    })

    test('should be consistent across multiple calls', () => {
      const input = 'test\x00string\x01'
      const result1 = stripLow(input)
      const result2 = stripLow(input)
      expect(result1).toBe(result2)
      expect(result1).toBe('teststring')
    })
  })
})
