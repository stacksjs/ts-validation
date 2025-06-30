import { describe, expect, test } from 'bun:test'
import rtrim from '../../src/lib/rtrim'

describe('rtrim', () => {
  describe('Basic whitespace trimming', () => {
    test('should trim trailing whitespace', () => {
      expect(rtrim('hello   ')).toBe('hello')
      expect(rtrim('world\t\t')).toBe('world')
      expect(rtrim('test\n\n')).toBe('test')
      expect(rtrim('text\r\r')).toBe('text')
      expect(rtrim('string \t\n\r')).toBe('string')
    })

    test('should preserve leading whitespace', () => {
      expect(rtrim('   hello   ')).toBe('   hello')
      expect(rtrim('\t\tworld\t\t')).toBe('\t\tworld')
      expect(rtrim(' test ')).toBe(' test')
    })

    test('should handle strings without trailing whitespace', () => {
      expect(rtrim('hello')).toBe('hello')
      expect(rtrim('   world')).toBe('   world')
      expect(rtrim('\t\ttest')).toBe('\t\ttest')
    })

    test('should handle empty and whitespace-only strings', () => {
      expect(rtrim('')).toBe('')
      expect(rtrim('   ')).toBe('')
      expect(rtrim('\t\t\t')).toBe('')
      expect(rtrim('\n\n\n')).toBe('')
      expect(rtrim(' \t\n\r ')).toBe('')
    })
  })

  describe('Custom character trimming', () => {
    test('should trim specified characters from end', () => {
      expect(rtrim('helloaaa', 'a')).toBe('hello')
      expect(rtrim('worldxxx', 'x')).toBe('world')
      expect(rtrim('test...', '.')).toBe('test')
      expect(rtrim('123000', '0')).toBe('123')
    })

    test('should trim multiple specified characters', () => {
      expect(rtrim('helloabcdefg', 'abcdefg')).toBe('hello')
      expect(rtrim('worldxyz', 'xyz')).toBe('world')
      expect(rtrim('test!@#', '!@#')).toBe('test')
    })

    test('should preserve characters not in trim set', () => {
      expect(rtrim('ahelloaaa', 'a')).toBe('ahello')
      expect(rtrim('xworldxxx', 'x')).toBe('xworld')
      expect(rtrim('.test...', '.')).toBe('.test')
    })

    test('should handle special regex characters', () => {
      expect(rtrim('hello***', '*')).toBe('hello')
      expect(rtrim('world+++', '+')).toBe('world')
      expect(rtrim('test???', '?')).toBe('test')
      expect(rtrim('text^^^', '^')).toBe('text')
      expect(rtrim('money$$$', '$')).toBe('money')
      expect(rtrim('pipe|||', '|')).toBe('pipe')
      expect(rtrim('paren)))', ')')).toBe('paren')
      expect(rtrim('bracket]]]', ']')).toBe('bracket')
      expect(rtrim('backslash\\\\', '\\')).toBe('backslash')
    })

    test('should handle character sets with special regex characters', () => {
      expect(rtrim('hello*+?', '*+?')).toBe('hello')
      expect(rtrim('world^$|', '^$|')).toBe('world')
      expect(rtrim('test()[]', '()[]')).toBe('test')
      expect(rtrim('text{}\\', '{}\\')).toBe('text')
    })
  })

  describe('Edge cases', () => {
    test('should handle unicode characters', () => {
      expect(rtrim('hello 🚀   ')).toBe('hello 🚀')
      expect(rtrim('hello🚀🚀🚀', '🚀')).toBe('hello')
      expect(rtrim('testαβγ', 'αβγ')).toBe('test')
    })

    test('should handle repeated character patterns', () => {
      expect(rtrim('helloaaaaaa', 'a')).toBe('hello')
      expect(rtrim('worldababab', 'ab')).toBe('world')
      expect(rtrim('testxyzxyz', 'xyz')).toBe('test')
    })

    test('should handle empty chars parameter', () => {
      expect(rtrim('hello   ', '')).toBe('hello') // empty chars falls back to whitespace
      expect(rtrim('helloaaa', '')).toBe('helloaaa') // no whitespace to trim
    })

    test('should handle single character strings', () => {
      expect(rtrim('a', 'a')).toBe('')
      expect(rtrim('x')).toBe('x')
      expect(rtrim(' ')).toBe('')
    })

    test('should handle strings that are entirely trimmed', () => {
      expect(rtrim('aaa', 'a')).toBe('')
      expect(rtrim('xyz', 'xyz')).toBe('')
      expect(rtrim('abcabc', 'abc')).toBe('')
    })
  })

  describe('Real-world use cases', () => {
    test('should clean user input', () => {
      expect(rtrim('user@example.com   ')).toBe('user@example.com')
      expect(rtrim('John Doe\t\t')).toBe('John Doe')
      expect(rtrim('password123\n\n')).toBe('password123')
    })

    test('should clean file paths', () => {
      expect(rtrim('path/to/file///', '/')).toBe('path/to/file')
      expect(rtrim('relative/path...', '.')).toBe('relative/path')
      expect(rtrim('windows\\path\\\\\\', '\\')).toBe('windows\\path')
    })

    test('should clean URLs', () => {
      expect(rtrim('example.com///', '/')).toBe('example.com')
      expect(rtrim('api.example.com???', '?')).toBe('api.example.com')
      expect(rtrim('cdn.example.com&&&', '&')).toBe('cdn.example.com')
    })

    test('should clean quoted strings', () => {
      expect(rtrim('"hello world"', '"')).toBe('"hello world')
      expect(rtrim('\'single quoted\'', '\'')).toBe('\'single quoted')
      expect(rtrim('`backtick quoted`', '`')).toBe('`backtick quoted')
    })

    test('should clean formatted numbers', () => {
      expect(rtrim('123.45000', '0')).toBe('123.45')
      expect(rtrim('42+++', '+')).toBe('42')
      expect(rtrim('negative---', '-')).toBe('negative')
    })

    test('should clean markup', () => {
      expect(rtrim('<<<html>>>', '>')).toBe('<<<html')
      expect(rtrim('heading###', '#')).toBe('heading')
      expect(rtrim('***bold text***', '*')).toBe('***bold text')
    })

    test('should clean punctuation', () => {
      expect(rtrim('Hello, world!!!', '!')).toBe('Hello, world')
      expect(rtrim('What???', '?')).toBe('What')
      expect(rtrim('End...', '.')).toBe('End')
    })
  })

  describe('Error handling', () => {
    test('should throw error for non-string input', () => {
      expect(() => rtrim(123 as any)).toThrow('Expected a string but received a number')
      expect(() => rtrim(null as any)).toThrow('Expected a string but received a null')
      expect(() => rtrim(undefined as any)).toThrow('Expected a string but received a undefined')
      expect(() => rtrim({} as any)).toThrow('Expected a string but received a Object')
      expect(() => rtrim([] as any)).toThrow('Expected a string but received a Array')
    })
  })
})
