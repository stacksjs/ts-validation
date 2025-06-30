import { describe, expect, test } from 'bun:test'
import isAscii from '../../src/lib/isAscii'

describe('isAscii', () => {
  describe('basic ASCII validation', () => {
    test('should validate basic ASCII characters', () => {
      expect(isAscii('a')).toBe(true)
      expect(isAscii('A')).toBe(true)
      expect(isAscii('z')).toBe(true)
      expect(isAscii('Z')).toBe(true)
      expect(isAscii('0')).toBe(true)
      expect(isAscii('9')).toBe(true)
      expect(isAscii(' ')).toBe(true) // space
    })

    test('should validate ASCII strings', () => {
      expect(isAscii('hello')).toBe(true)
      expect(isAscii('Hello World')).toBe(true)
      expect(isAscii('123456789')).toBe(true)
      expect(isAscii('abcdefghijklmnopqrstuvwxyz')).toBe(true)
      expect(isAscii('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toBe(true)
      expect(isAscii('0123456789')).toBe(true)
    })

    test('should validate ASCII special characters', () => {
      expect(isAscii('!')).toBe(true)
      expect(isAscii('@')).toBe(true)
      expect(isAscii('#')).toBe(true)
      expect(isAscii('$')).toBe(true)
      expect(isAscii('%')).toBe(true)
      expect(isAscii('^')).toBe(true)
      expect(isAscii('&')).toBe(true)
      expect(isAscii('*')).toBe(true)
      expect(isAscii('(')).toBe(true)
      expect(isAscii(')')).toBe(true)
      expect(isAscii('-')).toBe(true)
      expect(isAscii('_')).toBe(true)
      expect(isAscii('+')).toBe(true)
      expect(isAscii('=')).toBe(true)
      expect(isAscii('[')).toBe(true)
      expect(isAscii(']')).toBe(true)
      expect(isAscii('{')).toBe(true)
      expect(isAscii('}')).toBe(true)
      expect(isAscii('\\')).toBe(true)
      expect(isAscii('|')).toBe(true)
      expect(isAscii(';')).toBe(true)
      expect(isAscii(':')).toBe(true)
      expect(isAscii('\'')).toBe(true)
      expect(isAscii('"')).toBe(true)
      expect(isAscii(',')).toBe(true)
      expect(isAscii('.')).toBe(true)
      expect(isAscii('<')).toBe(true)
      expect(isAscii('>')).toBe(true)
      expect(isAscii('/')).toBe(true)
      expect(isAscii('?')).toBe(true)
      expect(isAscii('`')).toBe(true)
      expect(isAscii('~')).toBe(true)
    })

    test('should validate ASCII control characters', () => {
      expect(isAscii('\t')).toBe(true) // tab
      expect(isAscii('\n')).toBe(true) // newline
      expect(isAscii('\r')).toBe(true) // carriage return
      expect(isAscii('\0')).toBe(true) // null character
      expect(isAscii('\x01')).toBe(true) // control character
      expect(isAscii('\x1F')).toBe(true) // unit separator
      expect(isAscii('\x7F')).toBe(true) // delete character
    })

    test('should handle empty strings', () => {
      expect(isAscii('')).toBe(false) // empty string doesn't match the ASCII regex
    })
  })

  describe('non-ASCII character validation', () => {
    test('should reject Unicode characters', () => {
      expect(isAscii('café')).toBe(false) // é is not ASCII
      expect(isAscii('naïve')).toBe(false) // ï is not ASCII
      expect(isAscii('résumé')).toBe(false) // é is not ASCII
      expect(isAscii('piñata')).toBe(false) // ñ is not ASCII
      expect(isAscii('Zürich')).toBe(false) // ü is not ASCII
    })

    test('should reject emoji characters', () => {
      expect(isAscii('🚀')).toBe(false)
      expect(isAscii('😀')).toBe(false)
      expect(isAscii('👍')).toBe(false)
      expect(isAscii('❤️')).toBe(false)
      expect(isAscii('🌟')).toBe(false)
      expect(isAscii('Hello 🌍')).toBe(false)
    })

    test('should reject non-Latin scripts', () => {
      expect(isAscii('你好')).toBe(false) // Chinese
      expect(isAscii('こんにちは')).toBe(false) // Japanese
      expect(isAscii('안녕하세요')).toBe(false) // Korean
      expect(isAscii('Здравствуйте')).toBe(false) // Russian
      expect(isAscii('مرحبا')).toBe(false) // Arabic
      expect(isAscii('שלום')).toBe(false) // Hebrew
      expect(isAscii('γεια σας')).toBe(false) // Greek
    })

    test('should reject extended Latin characters', () => {
      expect(isAscii('ñ')).toBe(false) // Spanish ñ
      expect(isAscii('ç')).toBe(false) // cedilla
      expect(isAscii('ß')).toBe(false) // German sharp s
      expect(isAscii('æ')).toBe(false) // ash
      expect(isAscii('ø')).toBe(false) // o with stroke
      expect(isAscii('å')).toBe(false) // a with ring
    })

    test('should reject mathematical symbols', () => {
      expect(isAscii('∞')).toBe(false) // infinity
      expect(isAscii('π')).toBe(false) // pi
      expect(isAscii('∑')).toBe(false) // summation
      expect(isAscii('∆')).toBe(false) // delta
      expect(isAscii('±')).toBe(false) // plus-minus
      expect(isAscii('≤')).toBe(false) // less than or equal
      expect(isAscii('≥')).toBe(false) // greater than or equal
    })

    test('should reject currency symbols', () => {
      expect(isAscii('€')).toBe(false) // euro
      expect(isAscii('£')).toBe(false) // pound
      expect(isAscii('¥')).toBe(false) // yen
      expect(isAscii('¢')).toBe(false) // cent
      expect(isAscii('₹')).toBe(false) // rupee
      expect(isAscii('₽')).toBe(false) // ruble
    })
  })

  describe('edge cases', () => {
    test('should handle very long ASCII strings', () => {
      const longAsciiString = 'a'.repeat(10000)
      expect(isAscii(longAsciiString)).toBe(true)

      const longMixedString = `${'a'.repeat(9999)}é`
      expect(isAscii(longMixedString)).toBe(false)
    })

    test('should handle mixed ASCII and non-ASCII', () => {
      expect(isAscii('Hello café')).toBe(false) // contains é
      expect(isAscii('Test 🚀 rocket')).toBe(false) // contains emoji
      expect(isAscii('Price: €100')).toBe(false) // contains euro symbol
      expect(isAscii('Temperature: 25°C')).toBe(false) // contains degree symbol
    })

    test('should validate all ASCII printable characters', () => {
      let printableAscii = ''
      for (let i = 32; i <= 126; i++) {
        printableAscii += String.fromCharCode(i)
      }
      expect(isAscii(printableAscii)).toBe(true)
    })

    test('should validate all ASCII control characters', () => {
      let controlChars = ''
      for (let i = 0; i <= 31; i++) {
        controlChars += String.fromCharCode(i)
      }
      controlChars += String.fromCharCode(127) // DEL character
      expect(isAscii(controlChars)).toBe(true)
    })

    test('should reject characters above ASCII range', () => {
      expect(isAscii(String.fromCharCode(128))).toBe(false) // first non-ASCII
      expect(isAscii(String.fromCharCode(255))).toBe(false) // extended ASCII
      expect(isAscii(String.fromCharCode(256))).toBe(false) // Unicode
      expect(isAscii(String.fromCharCode(1000))).toBe(false) // Unicode
    })
  })

  describe('real-world use cases', () => {
    test('should validate programming code', () => {
      expect(isAscii('function hello() {')).toBe(true)
      expect(isAscii('  return "Hello World";')).toBe(true)
      expect(isAscii('}')).toBe(true)
      expect(isAscii('const x = 42;')).toBe(true)
      expect(isAscii('if (x > 0) {')).toBe(true)
      expect(isAscii('  console.log("positive");')).toBe(true)
    })

    test('should validate email addresses', () => {
      expect(isAscii('user@example.com')).toBe(true)
      expect(isAscii('john.doe+test@company.org')).toBe(true)
      expect(isAscii('admin@sub.domain.co.uk')).toBe(true)
      expect(isAscii('test_user123@example-site.net')).toBe(true)

      // Non-ASCII email addresses should be rejected
      expect(isAscii('用户@example.com')).toBe(false) // Chinese characters
      expect(isAscii('user@exämple.com')).toBe(false) // umlaut in domain
    })

    test('should validate URLs', () => {
      expect(isAscii('https://www.example.com')).toBe(true)
      expect(isAscii('http://subdomain.example.org/path')).toBe(true)
      expect(isAscii('ftp://files.example.net:21/folder/file.txt')).toBe(true)
      expect(isAscii('https://api.example.com/v1/users?id=123&name=john')).toBe(true)

      // Non-ASCII URLs should be rejected
      expect(isAscii('https://例え.テスト')).toBe(false) // Japanese domain
      expect(isAscii('https://example.com/café')).toBe(false) // non-ASCII path
    })

    test('should validate file paths', () => {
      expect(isAscii('/home/user/documents/file.txt')).toBe(true)
      expect(isAscii('C:\\Users\\John\\Desktop\\report.pdf')).toBe(true)
      expect(isAscii('./src/components/Header.js')).toBe(true)
      expect(isAscii('../assets/images/logo.png')).toBe(true)

      // Non-ASCII file paths should be rejected
      expect(isAscii('/home/user/文档/file.txt')).toBe(false) // Chinese characters
      expect(isAscii('C:\\Users\\José\\Desktop\\résumé.pdf')).toBe(false) // accented characters
    })

    test('should validate configuration values', () => {
      expect(isAscii('production')).toBe(true)
      expect(isAscii('localhost:3000')).toBe(true)
      expect(isAscii('database_connection_string')).toBe(true)
      expect(isAscii('api_key_12345')).toBe(true)
      expect(isAscii('true')).toBe(true)
      expect(isAscii('false')).toBe(true)
    })

    test('should validate user input sanitization', () => {
      expect(isAscii('John Doe')).toBe(true)
      expect(isAscii('john.doe@example.com')).toBe(true)
      expect(isAscii('(555) 123-4567')).toBe(true)
      expect(isAscii('123 Main St, Apt 4B')).toBe(true)

      // Potentially malicious or non-ASCII input should be rejected
      expect(isAscii('José García')).toBe(false) // accented characters
      expect(isAscii('<script>alert("xss")</script>')).toBe(true) // ASCII but potentially malicious
    })
  })

  describe('performance considerations', () => {
    test('should handle many ASCII validations efficiently', () => {
      const asciiStrings = [
        'hello',
        'world',
        'test',
        'ascii',
        'validation',
        'Hello World!',
        '123456789',
        'special@chars#',
        'UPPERCASE',
        'lowercase',
        'MiXeD cAsE',
        'programming_code',
        'email@domain.com',
      ]

      const start = Date.now()
      asciiStrings.forEach((str) => {
        isAscii(str)
      })
      const end = Date.now()

      expect(end - start).toBeLessThan(50) // Should complete quickly
    })

    test('should handle very long strings efficiently', () => {
      const veryLongAscii = 'Hello World! '.repeat(10000)
      const veryLongNonAscii = `${'Hello World! '.repeat(9999)}café`

      const start = Date.now()
      expect(isAscii(veryLongAscii)).toBe(true)
      expect(isAscii(veryLongNonAscii)).toBe(false)
      const end = Date.now()

      expect(end - start).toBeLessThan(200) // Should handle long strings efficiently
    })
  })

  describe('boundary conditions', () => {
    test('should validate ASCII character boundaries', () => {
      expect(isAscii(String.fromCharCode(0))).toBe(true) // first ASCII (null)
      expect(isAscii(String.fromCharCode(127))).toBe(true) // last ASCII (DEL)
      expect(isAscii(String.fromCharCode(128))).toBe(false) // first non-ASCII
    })

    test('should handle all ASCII character codes', () => {
      for (let i = 0; i <= 127; i++) {
        expect(isAscii(String.fromCharCode(i))).toBe(true)
      }

      for (let i = 128; i <= 255; i++) {
        expect(isAscii(String.fromCharCode(i))).toBe(false)
      }
    })

    test('should handle surrogate pairs correctly', () => {
      expect(isAscii('𝕳𝖊𝖑𝖑𝖔')).toBe(false) // mathematical alphanumeric symbols
      expect(isAscii('🅰🅱🅲')).toBe(false) // enclosed alphanumeric supplement
      expect(isAscii('𝟏𝟐𝟑')).toBe(false) // mathematical alphanumeric symbols
    })
  })

  describe('integration scenarios', () => {
    test('should work with form validation', () => {
      // Valid ASCII form inputs
      expect(isAscii('John')).toBe(true) // first name
      expect(isAscii('Doe')).toBe(true) // last name
      expect(isAscii('john.doe@example.com')).toBe(true) // email
      expect(isAscii('(555) 123-4567')).toBe(true) // phone

      // Invalid non-ASCII form inputs
      expect(isAscii('José')).toBe(false) // name with accent
      expect(isAscii('müller@example.com')).toBe(false) // email with umlaut
    })

    test('should complement other string validators', () => {
      // ASCII strings that are also valid for other validations
      expect(isAscii('hello@example.com')).toBe(true) // could be valid email
      expect(isAscii('https://example.com')).toBe(true) // could be valid URL
      expect(isAscii('123456789')).toBe(true) // could be valid numeric
      expect(isAscii('ABCDEF123')).toBe(true) // could be valid hex
    })

    test('should work with encoding validation', () => {
      // These should be ASCII and could be safely encoded
      expect(isAscii('Hello World')).toBe(true)
      expect(isAscii('user=john&pass=secret')).toBe(true)
      expect(isAscii('{"name":"John","age":30}')).toBe(true)

      // These contain non-ASCII and might need special encoding
      expect(isAscii('{"name":"José","age":30}')).toBe(false)
      expect(isAscii('user=josé&pass=sécret')).toBe(false)
    })
  })

  describe('error handling', () => {
    test('should throw error for non-string input', () => {
      expect(() => isAscii(123 as any)).toThrow()
      expect(() => isAscii(null as any)).toThrow()
      expect(() => isAscii(undefined as any)).toThrow()
      expect(() => isAscii({} as any)).toThrow()
      expect(() => isAscii([] as any)).toThrow()
      expect(() => isAscii(true as any)).toThrow()
    })
  })
})
