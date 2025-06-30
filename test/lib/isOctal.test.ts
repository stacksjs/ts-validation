import { describe, expect, test } from 'bun:test'
import isOctal from '../../src/lib/isOctal'

describe('isOctal', () => {
  describe('basic octal validation', () => {
    test('should validate valid octal digits', () => {
      expect(isOctal('0')).toBe(true)
      expect(isOctal('1')).toBe(true)
      expect(isOctal('2')).toBe(true)
      expect(isOctal('3')).toBe(true)
      expect(isOctal('4')).toBe(true)
      expect(isOctal('5')).toBe(true)
      expect(isOctal('6')).toBe(true)
      expect(isOctal('7')).toBe(true)
    })

    test('should validate multi-digit octal numbers', () => {
      expect(isOctal('01')).toBe(true)
      expect(isOctal('12')).toBe(true)
      expect(isOctal('123')).toBe(true)
      expect(isOctal('1234')).toBe(true)
      expect(isOctal('12345')).toBe(true)
      expect(isOctal('123456')).toBe(true)
      expect(isOctal('1234567')).toBe(true)
      expect(isOctal('01234567')).toBe(true)
    })

    test('should reject invalid octal digits', () => {
      expect(isOctal('8')).toBe(false)
      expect(isOctal('9')).toBe(false)
      expect(isOctal('A')).toBe(false)
      expect(isOctal('F')).toBe(false)
      expect(isOctal('a')).toBe(false)
      expect(isOctal('f')).toBe(false)
    })

    test('should reject strings with invalid octal digits', () => {
      expect(isOctal('128')).toBe(false) // contains 8
      expect(isOctal('129')).toBe(false) // contains 9
      expect(isOctal('1238')).toBe(false) // contains 8
      expect(isOctal('789')).toBe(false) // contains 8 and 9
      expect(isOctal('12A')).toBe(false) // contains A
      expect(isOctal('ABC')).toBe(false) // all invalid
    })

    test('should handle empty strings', () => {
      expect(isOctal('')).toBe(false)
    })
  })

  describe('edge cases', () => {
    test('should handle very long octal numbers', () => {
      const longOctal = '01234567'.repeat(100)
      expect(isOctal(longOctal)).toBe(true)

      const longOctalWithInvalid = `${'01234567'.repeat(100)}8`
      expect(isOctal(longOctalWithInvalid)).toBe(false)
    })

    test('should reject strings with special characters', () => {
      expect(isOctal('123-456')).toBe(false)
      expect(isOctal('123_456')).toBe(false)
      expect(isOctal('123 456')).toBe(false)
      expect(isOctal('123.456')).toBe(false)
      expect(isOctal('123,456')).toBe(false)
      expect(isOctal('123#456')).toBe(false)
      expect(isOctal('123+456')).toBe(false)
      expect(isOctal('123*456')).toBe(false)
    })

    test('should reject strings with whitespace', () => {
      expect(isOctal(' 123')).toBe(false)
      expect(isOctal('123 ')).toBe(false)
      expect(isOctal(' 123 ')).toBe(false)
      expect(isOctal('12 34')).toBe(false)
      expect(isOctal('\t123')).toBe(false)
      expect(isOctal('123\n')).toBe(false)
      expect(isOctal('123\r')).toBe(false)
    })

    test('should handle single characters', () => {
      '01234567'.split('').forEach((char) => {
        expect(isOctal(char)).toBe(true)
      })

      '89ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('').forEach((char) => {
        expect(isOctal(char)).toBe(false)
      })
    })

    test('should handle leading zeros', () => {
      expect(isOctal('0')).toBe(true)
      expect(isOctal('00')).toBe(true)
      expect(isOctal('000')).toBe(true)
      expect(isOctal('0123')).toBe(true)
      expect(isOctal('00123')).toBe(true)
      expect(isOctal('000123')).toBe(true)
    })
  })

  describe('real-world use cases', () => {
    test('should validate file permissions (Unix)', () => {
      expect(isOctal('755')).toBe(true) // rwxr-xr-x
      expect(isOctal('644')).toBe(true) // rw-r--r--
      expect(isOctal('777')).toBe(true) // rwxrwxrwx
      expect(isOctal('000')).toBe(true) // ---------
      expect(isOctal('600')).toBe(true) // rw-------
      expect(isOctal('700')).toBe(true) // rwx------
      expect(isOctal('555')).toBe(true) // r-xr-xr-x
    })

    test('should validate extended file permissions', () => {
      expect(isOctal('0755')).toBe(true) // with leading zero
      expect(isOctal('1755')).toBe(true) // with sticky bit
      expect(isOctal('2755')).toBe(true) // with setgid bit
      expect(isOctal('4755')).toBe(true) // with setuid bit
      expect(isOctal('6755')).toBe(true) // with setuid and setgid
      expect(isOctal('7755')).toBe(true) // with all special bits
    })

    test('should validate octal escape sequences', () => {
      expect(isOctal('101')).toBe(true) // 'A' in ASCII
      expect(isOctal('141')).toBe(true) // 'a' in ASCII
      expect(isOctal('040')).toBe(true) // space character
      expect(isOctal('012')).toBe(true) // newline character
      expect(isOctal('015')).toBe(true) // carriage return
      expect(isOctal('011')).toBe(true) // tab character
      expect(isOctal('000')).toBe(true) // null character
    })

    test('should validate octal color values', () => {
      expect(isOctal('377')).toBe(true) // 255 in decimal (max 8-bit)
      expect(isOctal('200')).toBe(true) // 128 in decimal
      expect(isOctal('100')).toBe(true) // 64 in decimal
      expect(isOctal('077')).toBe(true) // 63 in decimal
      expect(isOctal('037')).toBe(true) // 31 in decimal
    })

    test('should validate memory addresses (octal)', () => {
      expect(isOctal('177777')).toBe(true) // 65535 in decimal
      expect(isOctal('100000')).toBe(true) // 32768 in decimal
      expect(isOctal('040000')).toBe(true) // 16384 in decimal
      expect(isOctal('020000')).toBe(true) // 8192 in decimal
    })
  })

  describe('boundary conditions', () => {
    test('should handle all valid octal digits', () => {
      const validOctal = '01234567'
      expect(isOctal(validOctal)).toBe(true)
    })

    test('should reject any invalid digits', () => {
      const invalidDigits = '89'
      expect(isOctal(invalidDigits)).toBe(false)
    })

    test('should handle mixed valid and invalid digits', () => {
      expect(isOctal('1238')).toBe(false) // valid + invalid
      expect(isOctal('8123')).toBe(false) // invalid + valid
      expect(isOctal('12834')).toBe(false) // valid + invalid + valid
      expect(isOctal('89')).toBe(false) // all invalid
    })

    test('should handle maximum octal values', () => {
      expect(isOctal('7')).toBe(true) // max single digit
      expect(isOctal('77')).toBe(true) // max two digits
      expect(isOctal('777')).toBe(true) // max three digits
      expect(isOctal('7777')).toBe(true) // max four digits
      expect(isOctal('77777')).toBe(true) // max five digits
    })
  })

  describe('performance considerations', () => {
    test('should handle many octal validations efficiently', () => {
      const octalStrings = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '01',
        '12',
        '23',
        '34',
        '45',
        '56',
        '67',
        '123',
        '456',
        '701',
        '234',
        '567',
        '755',
        '644',
        '777',
        '000',
        '600',
      ]

      const start = Date.now()
      octalStrings.forEach((octal) => {
        isOctal(octal)
      })
      const end = Date.now()

      expect(end - start).toBeLessThan(50) // Should complete quickly
    })

    test('should handle very long octal strings efficiently', () => {
      const veryLongOctal = '01234567'.repeat(1000)

      const start = Date.now()
      expect(isOctal(veryLongOctal)).toBe(true)
      const end = Date.now()

      expect(end - start).toBeLessThan(100) // Should handle long strings quickly
    })
  })

  describe('integration with other number systems', () => {
    test('should complement binary validation', () => {
      // Valid octal that would be invalid binary (contains 2-7)
      expect(isOctal('234567')).toBe(true)
      // Valid binary that would be valid octal (only 0-1)
      expect(isOctal('01010101')).toBe(true)
    })

    test('should complement decimal validation', () => {
      // Valid octal that would be invalid decimal (no 8-9)
      expect(isOctal('01234567')).toBe(true)
      // Invalid octal that would be valid decimal (contains 8-9)
      expect(isOctal('0123456789')).toBe(false)
    })

    test('should complement hexadecimal validation', () => {
      // Valid octal that would be valid hex (0-7 subset)
      expect(isOctal('01234567')).toBe(true)
      // Invalid octal that would be valid hex (contains 8-9, A-F)
      expect(isOctal('0123456789ABCDEF')).toBe(false)
    })
  })

  describe('error handling', () => {
    test('should throw error for non-string input', () => {
      expect(() => isOctal(123 as any)).toThrow()
      expect(() => isOctal(null as any)).toThrow()
      expect(() => isOctal(undefined as any)).toThrow()
      expect(() => isOctal({} as any)).toThrow()
      expect(() => isOctal([] as any)).toThrow()
      expect(() => isOctal(true as any)).toThrow()
    })
  })

  describe('conversion scenarios', () => {
    test('should validate octal representations of common numbers', () => {
      // Decimal -> Octal mappings
      expect(isOctal('0')).toBe(true) // 0 decimal
      expect(isOctal('1')).toBe(true) // 1 decimal
      expect(isOctal('10')).toBe(true) // 8 decimal
      expect(isOctal('20')).toBe(true) // 16 decimal
      expect(isOctal('100')).toBe(true) // 64 decimal
      expect(isOctal('200')).toBe(true) // 128 decimal
      expect(isOctal('377')).toBe(true) // 255 decimal
    })

    test('should work with programming language octal literals', () => {
      // Common octal literals (without language-specific prefixes)
      expect(isOctal('755')).toBe(true) // chmod 755
      expect(isOctal('644')).toBe(true) // chmod 644
      expect(isOctal('1777')).toBe(true) // chmod 1777
      expect(isOctal('0755')).toBe(true) // with leading zero
    })
  })

  describe('string format validation', () => {
    test('should only accept pure octal digit strings', () => {
      expect(isOctal('01234567')).toBe(true)
      expect(isOctal('0o755')).toBe(true) // JavaScript octal prefix contains valid octal digits
      expect(isOctal('0755')).toBe(true) // Traditional octal (leading zero)
      expect(isOctal('755o')).toBe(false) // Invalid suffix
      expect(isOctal('o755')).toBe(false) // Invalid prefix
    })

    test('should handle case sensitivity correctly', () => {
      // Octal should only contain digits 0-7, no letters
      expect(isOctal('01234567')).toBe(true)
      expect(isOctal('0123456A')).toBe(false) // uppercase letter
      expect(isOctal('0123456a')).toBe(false) // lowercase letter
      expect(isOctal('ABCDEF')).toBe(false) // all letters
    })
  })
})
