import { describe, expect, test } from 'bun:test'
import ltrim from '../../src/lib/ltrim'

describe('ltrim', () => {
  describe('Basic whitespace trimming', () => {
    test('should trim leading whitespace', () => {
      expect(ltrim('   hello')).toBe('hello')
      expect(ltrim('\t\tworld')).toBe('world')
      expect(ltrim('\n\ntest')).toBe('test')
      expect(ltrim('\r\rtext')).toBe('text')
      expect(ltrim(' \t\n\rstring')).toBe('string')
    })

    test('should preserve trailing whitespace', () => {
      expect(ltrim('   hello   ')).toBe('hello   ')
      expect(ltrim('\t\tworld\t\t')).toBe('world\t\t')
      expect(ltrim(' test ')).toBe('test ')
    })

    test('should handle strings without leading whitespace', () => {
      expect(ltrim('hello')).toBe('hello')
      expect(ltrim('world   ')).toBe('world   ')
      expect(ltrim('test\t\t')).toBe('test\t\t')
    })

    test('should handle empty and whitespace-only strings', () => {
      expect(ltrim('')).toBe('')
      expect(ltrim('   ')).toBe('')
      expect(ltrim('\t\t\t')).toBe('')
      expect(ltrim('\n\n\n')).toBe('')
      expect(ltrim(' \t\n\r ')).toBe('')
    })
  })

  describe('Custom character trimming', () => {
    test('should trim specified characters from start', () => {
      expect(ltrim('aaahello', 'a')).toBe('hello')
      expect(ltrim('xxxworld', 'x')).toBe('world')
      expect(ltrim('...test', '.')).toBe('test')
      expect(ltrim('000123', '0')).toBe('123')
    })

    test('should trim multiple specified characters', () => {
      expect(ltrim('abcdefghello', 'abcdefg')).toBe('hello')
      expect(ltrim('xyzworld', 'xyz')).toBe('world')
      expect(ltrim('!@#test', '!@#')).toBe('test')
    })

    test('should preserve characters not in trim set', () => {
      expect(ltrim('aaahelloa', 'a')).toBe('helloa')
      expect(ltrim('xxxworldx', 'x')).toBe('worldx')
      expect(ltrim('...test.', '.')).toBe('test.')
    })

    test('should handle special regex characters', () => {
      expect(ltrim('***hello', '*')).toBe('hello')
      expect(ltrim('+++world', '+')).toBe('world')
      expect(ltrim('???test', '?')).toBe('test')
      expect(ltrim('^^^text', '^')).toBe('text')
      expect(ltrim('$$$money', '$')).toBe('money')
      expect(ltrim('|||pipe', '|')).toBe('pipe')
      expect(ltrim('(((paren', '(')).toBe('paren')
      expect(ltrim('[[[bracket', '[')).toBe('bracket')
      expect(ltrim('\\\\backslash', '\\')).toBe('backslash')
    })

    test('should handle character sets with special regex characters', () => {
      expect(ltrim('*+?hello', '*+?')).toBe('hello')
      expect(ltrim('^$|world', '^$|')).toBe('world')
      expect(ltrim('()[]test', '()[]')).toBe('test')
      expect(ltrim('{}\\text', '{}\\')).toBe('text')
    })
  })

  describe('Edge cases', () => {
    test('should handle unicode characters', () => {
      expect(ltrim('   🚀 hello')).toBe('🚀 hello')
      expect(ltrim('🚀🚀🚀hello', '🚀')).toBe('hello')
      expect(ltrim('αβγtest', 'αβγ')).toBe('test')
    })

    test('should handle repeated character patterns', () => {
      expect(ltrim('aaaaaahello', 'a')).toBe('hello')
      expect(ltrim('abababworld', 'ab')).toBe('world')
      expect(ltrim('xyzxyztest', 'xyz')).toBe('test')
    })

    test('should handle empty chars parameter', () => {
      expect(ltrim('   hello', '')).toBe('hello') // empty chars falls back to whitespace
      expect(ltrim('aaahello', '')).toBe('aaahello') // no whitespace to trim
    })

    test('should handle single character strings', () => {
      expect(ltrim('a', 'a')).toBe('')
      expect(ltrim('x')).toBe('x')
      expect(ltrim(' ')).toBe('')
    })

    test('should handle strings that are entirely trimmed', () => {
      expect(ltrim('aaa', 'a')).toBe('')
      expect(ltrim('xyz', 'xyz')).toBe('')
      expect(ltrim('abcabc', 'abc')).toBe('')
    })
  })

  describe('Real-world use cases', () => {
    test('should clean user input', () => {
      expect(ltrim('   user@example.com')).toBe('user@example.com')
      expect(ltrim('\t\tJohn Doe')).toBe('John Doe')
      expect(ltrim('\n\npassword123')).toBe('password123')
    })

    test('should clean file paths', () => {
      expect(ltrim('///path/to/file', '/')).toBe('path/to/file')
      expect(ltrim('...relative/path', '.')).toBe('relative/path')
      expect(ltrim('\\\\\\windows\\path', '\\')).toBe('windows\\path')
    })

    test('should clean URLs', () => {
      expect(ltrim('https://example.com', 'https://')).toBe('example.com')
      expect(ltrim('www.example.com', 'www.')).toBe('example.com')
      expect(ltrim('//cdn.example.com', '/')).toBe('cdn.example.com')
    })

    test('should clean quoted strings', () => {
      expect(ltrim('"hello world"', '"')).toBe('hello world"')
      expect(ltrim('\'single quoted\'', '\'')).toBe('single quoted\'')
      expect(ltrim('`backtick quoted`', '`')).toBe('backtick quoted`')
    })

    test('should clean formatted numbers', () => {
      expect(ltrim('000123.45', '0')).toBe('123.45')
      expect(ltrim('+++42', '+')).toBe('42')
      expect(ltrim('---negative', '-')).toBe('negative')
    })

    test('should clean markup', () => {
      expect(ltrim('<<<html>>>', '<')).toBe('html>>>')
      expect(ltrim('###heading', '#')).toBe('heading')
      expect(ltrim('***bold text***', '*')).toBe('bold text***')
    })
  })

  describe('Error handling', () => {
    test('should throw error for non-string input', () => {
      expect(() => ltrim(123 as any)).toThrow('Expected a string but received a number')
      expect(() => ltrim(null as any)).toThrow('Expected a string but received a null')
      expect(() => ltrim(undefined as any)).toThrow('Expected a string but received a undefined')
      expect(() => ltrim({} as any)).toThrow('Expected a string but received a Object')
      expect(() => ltrim([] as any)).toThrow('Expected a string but received a Array')
    })
  })
})
