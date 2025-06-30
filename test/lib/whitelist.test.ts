import { describe, expect, test } from 'bun:test'
import whitelist from '../../src/lib/whitelist'

describe('whitelist', () => {
  describe('Basic character filtering', () => {
    test('should keep only specified characters', () => {
      expect(whitelist('abc123', 'abc')).toBe('abc')
      expect(whitelist('hello world', 'helo')).toBe('hellool') // keeps all matching chars
      expect(whitelist('123abc456', '123')).toBe('123')
    })

    test('should remove all non-whitelisted characters', () => {
      expect(whitelist('abc123xyz', 'abc')).toBe('abc')
      expect(whitelist('Hello World!', 'Helo')).toBe('Hellool') // keeps all matching chars
      expect(whitelist('test@email.com', 'test')).toBe('teste') // keeps all matching chars
    })

    test('should handle single character whitelist', () => {
      expect(whitelist('aaabbbccc', 'a')).toBe('aaa')
      expect(whitelist('hello', 'l')).toBe('ll')
      expect(whitelist('123456', '3')).toBe('3')
    })
  })

  describe('Special characters and ranges', () => {
    test('should handle digit range', () => {
      expect(whitelist('abc123xyz789', '0-9')).toBe('123789')
      expect(whitelist('hello123world456', '0-9')).toBe('123456')
    })

    test('should handle letter ranges', () => {
      expect(whitelist('ABC123def', 'a-z')).toBe('def')
      expect(whitelist('hello123WORLD', 'A-Z')).toBe('WORLD')
      expect(whitelist('MixedCase123', 'a-zA-Z')).toBe('MixedCase')
    })

    test('should handle multiple ranges', () => {
      expect(whitelist('abc123XYZ!@#', 'a-zA-Z0-9')).toBe('abc123XYZ')
      expect(whitelist('Test_123-abc', 'a-zA-Z0-9_-')).toBe('Test_123-abc')
    })

    test('should handle special regex characters', () => {
      expect(whitelist('test.email@domain.com', '.')).toBe('..')
      expect(whitelist('price$100+tax', '$+')).toBe('$+')
      expect(whitelist('file(1).txt', '()')).toBe('()')
    })
  })

  describe('Edge cases', () => {
    test('should handle empty string', () => {
      expect(whitelist('', 'abc')).toBe('')
      expect(whitelist('abc', '')).toBe('')
      expect(whitelist('', '')).toBe('')
    })

    test('should handle string with no matching characters', () => {
      expect(whitelist('abc', 'xyz')).toBe('')
      expect(whitelist('123', 'abc')).toBe('')
      expect(whitelist('hello', '0-9')).toBe('')
    })

    test('should handle string where all characters match', () => {
      expect(whitelist('abc', 'abc')).toBe('abc')
      expect(whitelist('123', '0-9')).toBe('123')
      expect(whitelist('hello', 'a-z')).toBe('hello')
    })

    test('should handle whitespace', () => {
      expect(whitelist('hello world', ' ')).toBe(' ')
      expect(whitelist('a b c', 'abc ')).toBe('a b c')
      expect(whitelist('\t\n\r', '\t\n\r')).toBe('\t\n\r')
    })
  })

  describe('Unicode and international characters', () => {
    test('should handle unicode characters', () => {
      expect(whitelist('café123', 'é')).toBe('é')
      expect(whitelist('🚀🌟abc123', '🚀🌟')).toBe('🚀🌟')
      expect(whitelist('日本語english', '日本語')).toBe('日本語')
    })

    test('should handle accented characters', () => {
      expect(whitelist('résumé', 'é')).toBe('éé')
      expect(whitelist('naïve café', 'ï')).toBe('ï')
      expect(whitelist('piñata', 'ñ')).toBe('ñ')
    })
  })

  describe('Real-world use cases', () => {
    test('should extract only numbers from mixed content', () => {
      expect(whitelist('abc123def456', '0-9')).toBe('123456')
      expect(whitelist('Price: $29.99', '0-9.')).toBe('29.99')
      expect(whitelist('Phone: (555) 123-4567', '0-9')).toBe('5551234567')
    })

    test('should extract only letters from mixed content', () => {
      expect(whitelist('abc123def456', 'a-z')).toBe('abcdef')
      expect(whitelist('Hello123World456', 'a-zA-Z')).toBe('HelloWorld')
      expect(whitelist('test@email.com', 'a-z')).toBe('testemailcom') // keeps all matching chars
    })

    test('should sanitize filenames', () => {
      expect(whitelist('file<>name*.txt', 'a-zA-Z0-9._-')).toBe('filename.txt')
      expect(whitelist('document|file?.pdf', 'a-zA-Z0-9._-')).toBe('documentfile.pdf')
    })

    test('should create URL-safe strings', () => {
      expect(whitelist('Hello World!', 'a-zA-Z0-9-_')).toBe('HelloWorld')
      expect(whitelist('test string #1', 'a-zA-Z0-9-_')).toBe('teststring1')
    })

    test('should extract alphanumeric content', () => {
      expect(whitelist('user@domain.com', 'a-zA-Z0-9')).toBe('userdomaincom') // keeps all matching chars
      expect(whitelist('product-id: 12345', 'a-zA-Z0-9')).toBe('productid12345')
    })
  })

  describe('Complex whitelist patterns', () => {
    test('should handle complex character sets', () => {
      expect(whitelist('email@test.com', 'a-zA-Z0-9@.')).toBe('email@test.com')
      expect(whitelist('phone: +1-234-567-8900', '0-9+-')).toBe('+1-234-567-8900')
      expect(whitelist('price: $1,234.56', '0-9$,.')).toBe('$1,234.56')
    })

    test('should handle overlapping ranges', () => {
      expect(whitelist('Test123', 'a-zA-Z0-9')).toBe('Test123')
      expect(whitelist('MixedCase', 'A-Za-z')).toBe('MixedCase')
    })
  })

  describe('Input validation', () => {
    test('should throw error for non-string input', () => {
      expect(() => whitelist(null as any, 'abc')).toThrow()
      expect(() => whitelist(undefined as any, 'abc')).toThrow()
      expect(() => whitelist(123 as any, 'abc')).toThrow()
      expect(() => whitelist([] as any, 'abc')).toThrow()
      expect(() => whitelist({} as any, 'abc')).toThrow()
    })
  })

  describe('Performance', () => {
    test('should handle long strings efficiently', () => {
      const longString = 'a'.repeat(500) + '1'.repeat(500) + 'b'.repeat(500)
      const result = whitelist(longString, 'a1')
      expect(result).toBe('a'.repeat(500) + '1'.repeat(500))
      expect(result.length).toBe(1000)
    })

    test('should be consistent across multiple calls', () => {
      const input = 'test123string456'
      const chars = 'a-z0-9'
      const result1 = whitelist(input, chars)
      const result2 = whitelist(input, chars)
      expect(result1).toBe(result2)
    })
  })
})
