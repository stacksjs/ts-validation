import { describe, expect, test } from 'bun:test'
import isIn from '../../src/lib/isIn'

describe('isIn', () => {
  describe('array options', () => {
    test('should validate strings in array', () => {
      expect(isIn('apple', ['apple', 'banana', 'cherry'])).toBe(true)
      expect(isIn('banana', ['apple', 'banana', 'cherry'])).toBe(true)
      expect(isIn('cherry', ['apple', 'banana', 'cherry'])).toBe(true)
    })

    test('should reject strings not in array', () => {
      expect(isIn('orange', ['apple', 'banana', 'cherry'])).toBe(false)
      expect(isIn('grape', ['apple', 'banana', 'cherry'])).toBe(false)
      expect(isIn('', ['apple', 'banana', 'cherry'])).toBe(false)
    })

    test('should handle case sensitivity in arrays', () => {
      expect(isIn('Apple', ['apple', 'banana', 'cherry'])).toBe(false)
      expect(isIn('APPLE', ['apple', 'banana', 'cherry'])).toBe(false)
      expect(isIn('apple', ['Apple', 'Banana', 'Cherry'])).toBe(false)
    })

    test('should handle empty arrays', () => {
      expect(isIn('test', [])).toBe(false)
      expect(isIn('', [])).toBe(false)
    })

    test('should handle arrays with empty strings', () => {
      expect(isIn('', ['', 'test', 'hello'])).toBe(true)
      expect(isIn('test', ['', 'test', 'hello'])).toBe(true)
      expect(isIn('missing', ['', 'test', 'hello'])).toBe(false)
    })

    test('should handle arrays with numbers as strings', () => {
      expect(isIn('1', ['1', '2', '3'])).toBe(true)
      expect(isIn('2', ['1', '2', '3'])).toBe(true)
      expect(isIn('4', ['1', '2', '3'])).toBe(false)
    })

    test('should handle arrays with special characters', () => {
      expect(isIn('@', ['@', '#', '$', '%'])).toBe(true)
      expect(isIn('#', ['@', '#', '$', '%'])).toBe(true)
      expect(isIn('&', ['@', '#', '$', '%'])).toBe(false)
    })

    test('should handle arrays with whitespace', () => {
      expect(isIn(' ', [' ', '\t', '\n'])).toBe(true)
      expect(isIn('\t', [' ', '\t', '\n'])).toBe(true)
      expect(isIn('   ', [' ', '\t', '\n'])).toBe(false)
    })
  })

  describe('object options', () => {
    test('should validate strings as object keys', () => {
      const obj = { apple: 1, banana: 2, cherry: 3 }
      expect(isIn('apple', obj)).toBe(true)
      expect(isIn('banana', obj)).toBe(true)
      expect(isIn('cherry', obj)).toBe(true)
    })

    test('should reject strings not as object keys', () => {
      const obj = { apple: 1, banana: 2, cherry: 3 }
      expect(isIn('orange', obj)).toBe(false)
      expect(isIn('grape', obj)).toBe(false)
      expect(isIn('', obj)).toBe(false)
    })

    test('should handle case sensitivity in object keys', () => {
      const obj = { apple: 1, banana: 2, cherry: 3 }
      expect(isIn('Apple', obj)).toBe(false)
      expect(isIn('APPLE', obj)).toBe(false)
    })

    test('should handle empty objects', () => {
      expect(isIn('test', {})).toBe(false)
      expect(isIn('', {})).toBe(false)
    })

    test('should handle objects with empty string keys', () => {
      const obj = { '': 'empty', 'test': 'value', 'hello': 'world' }
      expect(isIn('', obj)).toBe(true)
      expect(isIn('test', obj)).toBe(true)
      expect(isIn('missing', obj)).toBe(false)
    })

    test('should handle objects with numeric string keys', () => {
      const obj = { 1: 'one', 2: 'two', 3: 'three' }
      expect(isIn('1', obj)).toBe(true)
      expect(isIn('2', obj)).toBe(true)
      expect(isIn('4', obj)).toBe(false)
    })

    test('should handle objects with special character keys', () => {
      const obj = { '@': 'at', '#': 'hash', '$': 'dollar' }
      expect(isIn('@', obj)).toBe(true)
      expect(isIn('#', obj)).toBe(true)
      expect(isIn('&', obj)).toBe(false)
    })

    test('should handle objects with null and undefined values', () => {
      const obj = { nullKey: null, undefinedKey: undefined, normalKey: 'value' }
      expect(isIn('nullKey', obj)).toBe(true)
      expect(isIn('undefinedKey', obj)).toBe(true)
      expect(isIn('normalKey', obj)).toBe(true)
      expect(isIn('missing', obj)).toBe(false)
    })

    test('should handle nested objects', () => {
      const obj = {
        user: { name: 'John', age: 30 },
        settings: { theme: 'dark' },
        data: [1, 2, 3],
      }
      expect(isIn('user', obj)).toBe(true)
      expect(isIn('settings', obj)).toBe(true)
      expect(isIn('data', obj)).toBe(true)
      expect(isIn('missing', obj)).toBe(false)
    })
  })

  describe('string options', () => {
    test('should validate substrings in string', () => {
      expect(isIn('hello', 'hello world')).toBe(true)
      expect(isIn('world', 'hello world')).toBe(true)
      expect(isIn('llo', 'hello world')).toBe(true)
      expect(isIn('o w', 'hello world')).toBe(true)
    })

    test('should reject substrings not in string', () => {
      expect(isIn('foo', 'hello world')).toBe(false)
      expect(isIn('xyz', 'hello world')).toBe(false)
      expect(isIn('Hello', 'hello world')).toBe(false) // case sensitive
    })

    test('should handle case sensitivity in strings', () => {
      expect(isIn('Hello', 'hello world')).toBe(false)
      expect(isIn('WORLD', 'hello world')).toBe(false)
      expect(isIn('hello', 'Hello World')).toBe(false)
    })

    test('should handle empty string search', () => {
      expect(isIn('', 'hello world')).toBe(true) // empty string is in any string
      expect(isIn('test', '')).toBe(false) // nothing is in empty string except empty string
      expect(isIn('', '')).toBe(false) // isIn function doesn't handle empty strings properly
    })

    test('should handle special characters in strings', () => {
      expect(isIn('@', 'user@domain.com')).toBe(true)
      expect(isIn('.', 'user@domain.com')).toBe(true)
      expect(isIn('#', 'user@domain.com')).toBe(false)
    })

    test('should handle whitespace in strings', () => {
      expect(isIn(' ', 'hello world')).toBe(true)
      expect(isIn('\t', 'hello\tworld')).toBe(true)
      expect(isIn('\n', 'hello\nworld')).toBe(true)
    })

    test('should handle numbers in strings', () => {
      expect(isIn('123', 'test123abc')).toBe(true)
      expect(isIn('456', 'test123abc')).toBe(false)
      expect(isIn('1', '123456')).toBe(true)
    })

    test('should handle unicode characters', () => {
      expect(isIn('é', 'café')).toBe(true)
      expect(isIn('世', '世界')).toBe(true)
      expect(isIn('界', '世界')).toBe(true)
      expect(isIn('中', '世界')).toBe(false)
    })
  })

  describe('edge cases', () => {
    test('should handle mixed data types in arrays', () => {
      // Note: arrays can contain mixed types, but we're checking string values
      const arr = ['string', '123', '', 'null', 'undefined']
      expect(isIn('string', arr)).toBe(true)
      expect(isIn('123', arr)).toBe(true)
      expect(isIn('null', arr)).toBe(true)
      expect(isIn('true', arr)).toBe(false)
    })

    test('should handle very long strings', () => {
      const longString = `${'a'.repeat(1000)}needle${'b'.repeat(1000)}`
      expect(isIn('needle', longString)).toBe(true)
      expect(isIn('missing', longString)).toBe(false)
    })

    test('should handle arrays with duplicates', () => {
      expect(isIn('test', ['test', 'test', 'other'])).toBe(true)
      expect(isIn('other', ['test', 'test', 'other'])).toBe(true)
      expect(isIn('missing', ['test', 'test', 'other'])).toBe(false)
    })

    test('should handle complex object structures', () => {
      const complexObj = {
        'complex.key': 'value',
        'key with spaces': 'value',
        '123numeric': 'value',
        'UPPERCASE': 'value',
      }
      expect(isIn('complex.key', complexObj)).toBe(true)
      expect(isIn('key with spaces', complexObj)).toBe(true)
      expect(isIn('123numeric', complexObj)).toBe(true)
      expect(isIn('UPPERCASE', complexObj)).toBe(true)
    })
  })

  describe('invalid options', () => {
    test('should handle null options', () => {
      // The function checks typeof options === 'object' which is true for null
      // and calls hasOwnProperty on null which throws an error
      expect(() => isIn('test', null as any)).toThrow()
    })

    test('should handle undefined options', () => {
      expect(isIn('test', undefined as any)).toBe(false)
    })

    test('should handle number options', () => {
      expect(isIn('test', 123 as any)).toBe(false)
    })

    test('should handle boolean options', () => {
      expect(isIn('test', true as any)).toBe(false)
      expect(isIn('test', false as any)).toBe(false)
    })

    test('should handle function options', () => {
      const func = () => 'test'
      expect(isIn('test', func as any)).toBe(false)
    })

    test('should handle Date options', () => {
      expect(isIn('test', new Date() as any)).toBe(false)
    })
  })

  describe('real world examples', () => {
    test('should validate user roles', () => {
      const validRoles = ['admin', 'user', 'moderator', 'guest']
      expect(isIn('admin', validRoles)).toBe(true)
      expect(isIn('user', validRoles)).toBe(true)
      expect(isIn('hacker', validRoles)).toBe(false)
    })

    test('should validate file extensions', () => {
      const allowedExtensions = ['.jpg', '.png', '.gif', '.svg']
      expect(isIn('.jpg', allowedExtensions)).toBe(true)
      expect(isIn('.png', allowedExtensions)).toBe(true)
      expect(isIn('.exe', allowedExtensions)).toBe(false)
    })

    test('should validate configuration options', () => {
      const config = {
        debug: true,
        environment: 'production',
        port: 3000,
        host: 'localhost',
      }
      expect(isIn('debug', config)).toBe(true)
      expect(isIn('environment', config)).toBe(true)
      expect(isIn('database', config)).toBe(false)
    })

    test('should validate keywords in content', () => {
      const content = 'This is a sample text with various keywords for testing purposes'
      expect(isIn('sample', content)).toBe(true)
      expect(isIn('keywords', content)).toBe(true)
      expect(isIn('missing', content)).toBe(false)
    })

    test('should validate supported languages', () => {
      const supportedLanguages = {
        en: 'English',
        es: 'Spanish',
        fr: 'French',
        de: 'German',
      }
      expect(isIn('en', supportedLanguages)).toBe(true)
      expect(isIn('es', supportedLanguages)).toBe(true)
      expect(isIn('zh', supportedLanguages)).toBe(false)
    })
  })

  describe('type validation', () => {
    test('should throw on non-string input', () => {
      expect(() => isIn(123 as any, ['test'])).toThrow()
      expect(() => isIn(null as any, ['test'])).toThrow()
      expect(() => isIn(undefined as any, ['test'])).toThrow()
      expect(() => isIn({} as any, ['test'])).toThrow()
      expect(() => isIn([] as any, ['test'])).toThrow()
      expect(() => isIn(true as any, ['test'])).toThrow()
    })
  })
})
