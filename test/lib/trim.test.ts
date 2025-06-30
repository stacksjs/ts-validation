import { describe, expect, test } from 'bun:test'
import trim from '../../src/lib/trim'

describe('trim', () => {
  describe('basic trimming', () => {
    test('should trim whitespace from both ends', () => {
      expect(trim('  hello  ')).toBe('hello')
      expect(trim('\thello\t')).toBe('hello')
      expect(trim('\nhello\n')).toBe('hello')
      expect(trim('\rhello\r')).toBe('hello')
      expect(trim('  \t\n\r hello \t\n\r  ')).toBe('hello')
    })

    test('should handle strings with no whitespace', () => {
      expect(trim('hello')).toBe('hello')
      expect(trim('world')).toBe('world')
      expect(trim('test123')).toBe('test123')
    })

    test('should handle empty and whitespace-only strings', () => {
      expect(trim('')).toBe('')
      expect(trim('   ')).toBe('')
      expect(trim('\t\t\t')).toBe('')
      expect(trim('\n\n\n')).toBe('')
      expect(trim('\r\r\r')).toBe('')
      expect(trim('  \t\n\r  ')).toBe('')
    })

    test('should preserve internal whitespace', () => {
      expect(trim('  hello world  ')).toBe('hello world')
      expect(trim('\thello\tworld\t')).toBe('hello\tworld')
      expect(trim('  multiple   spaces   inside  ')).toBe('multiple   spaces   inside')
    })
  })

  describe('custom character trimming', () => {
    test('should trim custom characters', () => {
      expect(trim('***hello***', '*')).toBe('hello')
      expect(trim('...hello...', '.')).toBe('hello')
      expect(trim('---hello---', '-')).toBe('hello')
      expect(trim('___hello___', '_')).toBe('hello')
    })

    test('should trim multiple custom characters', () => {
      expect(trim('*-*hello*-*', '*-')).toBe('hello')
      expect(trim('.,;hello.,;', '.;,')).toBe('hello')
      expect(trim('123hello321', '123')).toBe('hello')
    })

    test('should handle mixed whitespace and custom characters', () => {
      expect(trim('  ***hello***  ', '* ')).toBe('hello')
      expect(trim('\t...hello...\t', '. \t')).toBe('hello')
    })

    test('should handle custom characters not present', () => {
      expect(trim('hello', '*')).toBe('hello')
      expect(trim('  hello  ', '*')).toBe('  hello  ')
      expect(trim('***hello***', '.')).toBe('***hello***')
    })
  })

  describe('edge cases', () => {
    test('should handle single characters', () => {
      expect(trim(' a ')).toBe('a')
      expect(trim('*b*', '*')).toBe('b')
      expect(trim('c')).toBe('c')
    })

    test('should handle strings that are entirely trimmed', () => {
      expect(trim('***', '*')).toBe('')
      expect(trim('...', '.')).toBe('')
      expect(trim('---', '-')).toBe('')
      expect(trim('123', '123')).toBe('')
    })

    test('should handle repeated trim characters', () => {
      expect(trim('****hello****', '*')).toBe('hello')
      expect(trim('........hello........', '.')).toBe('hello')
      expect(trim('--------hello--------', '-')).toBe('hello')
    })

    test('should handle asymmetric trimming', () => {
      expect(trim('***hello**', '*')).toBe('hello')
      expect(trim('**hello***', '*')).toBe('hello')
      expect(trim('   hello  ')).toBe('hello')
      expect(trim('  hello   ')).toBe('hello')
    })

    test('should handle unicode characters', () => {
      expect(trim('  café  ')).toBe('café')
      expect(trim('  naïve  ')).toBe('naïve')
      expect(trim('  résumé  ')).toBe('résumé')
      expect(trim('🌟hello🌟', '🌟')).toBe('hello')
    })

    test('should handle special regex characters', () => {
      expect(trim('[hello]', '[]')).toBe('hello')
      expect(trim('(hello)', '()')).toBe('hello')
      expect(trim('{hello}', '{}')).toBe('hello')
      expect(trim('^hello$', '^$')).toBe('hello')
      expect(trim('|hello|', '|')).toBe('hello')
      expect(trim('+hello+', '+')).toBe('hello')
      expect(trim('?hello?', '?')).toBe('hello')
    })
  })

  describe('real-world use cases', () => {
    test('should clean user input', () => {
      expect(trim('  john.doe@example.com  ')).toBe('john.doe@example.com')
      expect(trim('\t\tJohn Doe\t\t')).toBe('John Doe')
      expect(trim('  +1234567890  ')).toBe('+1234567890')
    })

    test('should clean file paths', () => {
      expect(trim('  /path/to/file.txt  ')).toBe('/path/to/file.txt')
      expect(trim('\t./relative/path\t')).toBe('./relative/path')
      expect(trim('  C:\\Windows\\System32  ')).toBe('C:\\Windows\\System32')
    })

    test('should clean URLs', () => {
      expect(trim('  https://example.com  ')).toBe('https://example.com')
      expect(trim('\thttps://api.example.com/v1/users\t')).toBe('https://api.example.com/v1/users')
    })

    test('should clean code snippets', () => {
      expect(trim('  function hello() {}  ')).toBe('function hello() {}')
      expect(trim('\tconst x = 42;\t')).toBe('const x = 42;')
      expect(trim('  <div>Hello World</div>  ')).toBe('<div>Hello World</div>')
    })

    test('should clean quoted strings', () => {
      expect(trim('"hello"', '"')).toBe('hello')
      expect(trim('\'world\'', '\'')).toBe('world')
      expect(trim('`template`', '`')).toBe('template')
      expect(trim('"""hello"""', '"')).toBe('hello')
    })

    test('should clean bracketed content', () => {
      expect(trim('[hello]', '[]')).toBe('hello')
      expect(trim('(world)', '()')).toBe('world')
      expect(trim('{test}', '{}')).toBe('test')
      expect(trim('<tag>', '<>')).toBe('tag')
    })
  })

  describe('parameter validation', () => {
    test('should handle non-string input gracefully', () => {
      // trim function expects strings for both parameters
      expect(() => trim(null as any, ' ')).toThrow('Expected a string but received a null')
      expect(() => trim(undefined as any, ' ')).toThrow('Expected a string but received a undefined')
      expect(() => trim(123 as any, ' ')).toThrow('Expected a string but received a number')
      expect(() => trim({} as any, ' ')).toThrow('Expected a string but received a Object')
      expect(() => trim([] as any, ' ')).toThrow('Expected a string but received a Array')
    })

    test('should handle invalid chars parameter', () => {
      // null is handled by the logic and doesn't throw
      expect(() => trim('hello', null as any)).not.toThrow()
      expect(() => trim('hello', undefined as any)).not.toThrow() // undefined is handled
      expect(() => trim('hello', 123 as any)).toThrow() // number is not valid
      expect(() => trim('hello', {} as any)).toThrow() // object is not valid
    })
  })

  describe('performance considerations', () => {
    test('should handle long strings efficiently', () => {
      const longString = `  ${'a'.repeat(10000)}  `
      expect(trim(longString)).toBe('a'.repeat(10000))
    })

    test('should handle strings with many trim characters', () => {
      const manyStars = '*'.repeat(1000)
      const stringWithManyStars = `${manyStars}hello${manyStars}`
      expect(trim(stringWithManyStars, '*')).toBe('hello')
    })

    test('should handle unicode-heavy strings', () => {
      const unicodeString = `  ${'🌟'.repeat(100)}  `
      expect(trim(unicodeString)).toBe('🌟'.repeat(100))
    })
  })

  describe('consistency with native String.trim()', () => {
    test('should match native trim for whitespace', () => {
      const testStrings = [
        '  hello  ',
        '\thello\t',
        '\nhello\n',
        '\rhello\r',
        '  \t\n\r hello \t\n\r  ',
        'hello',
        '',
        '   ',
        'hello world',
        '  hello world  ',
      ]

      testStrings.forEach((str) => {
        expect(trim(str)).toBe(str.trim())
      })
    })

    test('should extend native functionality with custom characters', () => {
      // These cases go beyond what native trim() can do
      expect(trim('***hello***', '*')).toBe('hello')
      expect(trim('...hello...', '.')).toBe('hello')
      expect(trim('123hello321', '123')).toBe('hello')

      // Native trim wouldn't handle these
      expect('***hello***'.trim()).toBe('***hello***')
      expect('...hello...'.trim()).toBe('...hello...')
    })
  })

  describe('integration with other string functions', () => {
    test('should work well with other string operations', () => {
      const input = '  Hello World  '
      const trimmed = trim(input)

      expect(trimmed.toLowerCase()).toBe('hello world')
      expect(trimmed.toUpperCase()).toBe('HELLO WORLD')
      expect(trimmed.split(' ')).toEqual(['Hello', 'World'])
      expect(trimmed.replace('Hello', 'Hi')).toBe('Hi World')
    })

    test('should be useful in data processing pipelines', () => {
      const data = [
        '  john@example.com  ',
        '\tjane@example.com\t',
        '  bob@example.com  ',
        '\talice@example.com\t',
      ]

      const cleaned = data.map(email => trim(email))
      expect(cleaned).toEqual([
        'john@example.com',
        'jane@example.com',
        'bob@example.com',
        'alice@example.com',
      ])
    })
  })
})
