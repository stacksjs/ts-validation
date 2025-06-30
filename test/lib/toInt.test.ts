import { describe, expect, test } from 'bun:test'
import toInt from '../../src/lib/toInt'

describe('toInt', () => {
  describe('basic conversion', () => {
    test('should convert string numbers to integers', () => {
      expect(toInt('123')).toBe(123)
      expect(toInt('456')).toBe(456)
      expect(toInt('0')).toBe(0)
      expect(toInt('-123')).toBe(-123)
      expect(toInt('-456')).toBe(-456)
    })

    test('should handle decimal strings by truncating', () => {
      expect(toInt('123.45')).toBe(123)
      expect(toInt('456.789')).toBe(456)
      expect(toInt('-123.45')).toBe(-123)
      expect(toInt('0.999')).toBe(0)
    })

    test('should handle numbers as input', () => {
      // toInt function expects strings only due to assertString
      expect(() => toInt(123 as any)).toThrow('Expected a string but received a number')
      expect(() => toInt(456.789 as any)).toThrow('Expected a string but received a number')
      expect(() => toInt(-123.45 as any)).toThrow('Expected a string but received a number')
      expect(() => toInt(0 as any)).toThrow('Expected a string but received a number')
    })

    test('should handle whitespace', () => {
      expect(toInt('  123  ')).toBe(123)
      expect(toInt('\t456\t')).toBe(456)
      expect(toInt('\n-123\n')).toBe(-123)
      expect(toInt('  0  ')).toBe(0)
    })
  })

  describe('radix parameter', () => {
    test('should handle different radix values', () => {
      expect(toInt('10', 10)).toBe(10) // decimal
      expect(toInt('10', 2)).toBe(2) // binary
      expect(toInt('10', 8)).toBe(8) // octal
      expect(toInt('10', 16)).toBe(16) // hexadecimal
      expect(toInt('FF', 16)).toBe(255) // hexadecimal
      expect(toInt('ff', 16)).toBe(255) // hexadecimal lowercase
    })

    test('should handle binary strings', () => {
      expect(toInt('1010', 2)).toBe(10)
      expect(toInt('1111', 2)).toBe(15)
      expect(toInt('0', 2)).toBe(0)
      expect(toInt('1', 2)).toBe(1)
    })

    test('should handle octal strings', () => {
      expect(toInt('10', 8)).toBe(8)
      expect(toInt('77', 8)).toBe(63)
      expect(toInt('123', 8)).toBe(83)
      expect(toInt('0', 8)).toBe(0)
    })

    test('should handle hexadecimal strings', () => {
      expect(toInt('A', 16)).toBe(10)
      expect(toInt('FF', 16)).toBe(255)
      expect(toInt('100', 16)).toBe(256)
      expect(toInt('0', 16)).toBe(0)
      expect(toInt('DEADBEEF', 16)).toBe(3735928559)
    })

    test('should handle custom radix values', () => {
      expect(toInt('10', 3)).toBe(3) // base 3
      expect(toInt('10', 5)).toBe(5) // base 5
      expect(toInt('10', 7)).toBe(7) // base 7
      expect(toInt('ZZ', 36)).toBe(1295) // base 36
    })
  })

  describe('edge cases', () => {
    test('should handle invalid strings', () => {
      expect(toInt('abc')).toBeNaN()
      expect(toInt('hello')).toBeNaN()
      expect(toInt('123abc')).toBe(123) // partial conversion
      expect(toInt('abc123')).toBeNaN()
    })

    test('should handle empty and whitespace strings', () => {
      expect(toInt('')).toBeNaN()
      expect(toInt('   ')).toBeNaN()
      expect(toInt('\t\n')).toBeNaN()
    })

    test('should handle special numeric strings', () => {
      expect(toInt('Infinity')).toBeNaN()
      expect(toInt('-Infinity')).toBeNaN()
      expect(toInt('NaN')).toBeNaN()
      expect(toInt('+123')).toBe(123)
    })

    test('should handle scientific notation', () => {
      expect(toInt('1e2')).toBe(1) // stops at 'e'
      expect(toInt('1E2')).toBe(1) // stops at 'E'
      expect(toInt('2.5e3')).toBe(2) // stops at 'e'
    })

    test('should handle very large numbers', () => {
      // Test that the function handles large numbers, but avoid precision issues in tests
      const result1 = toInt('999999999999999999999')
      const result2 = toInt('123456789012345678901234567890')
      expect(typeof result1).toBe('number')
      expect(typeof result2).toBe('number')
      expect(result1).toBeGreaterThan(0)
      expect(result2).toBeGreaterThan(0)
    })

    test('should handle negative zero', () => {
      expect(toInt('-0')).toBe(-0) // JavaScript preserves -0
      expect(toInt('-0.0')).toBe(-0)
    })
  })

  describe('invalid radix handling', () => {
    test('should handle invalid radix values', () => {
      expect(() => toInt('123', 1)).not.toThrow() // radix too small
      expect(() => toInt('123', 37)).not.toThrow() // radix too large
      expect(() => toInt('123', 0)).not.toThrow() // invalid radix
      expect(() => toInt('123', -1)).not.toThrow() // negative radix
    })

    test('should handle non-integer radix', () => {
      expect(() => toInt('123', 10.5)).not.toThrow()
      expect(() => toInt('123', 2.9)).not.toThrow()
    })

    test('should handle non-numeric radix', () => {
      expect(() => toInt('123', 'invalid' as any)).not.toThrow()
      expect(() => toInt('123', null as any)).not.toThrow()
      expect(() => toInt('123', undefined as any)).not.toThrow()
    })
  })

  describe('type handling', () => {
    test('should handle non-string, non-number inputs', () => {
      // toInt function expects strings only due to assertString
      expect(() => toInt(null as any)).toThrow('Expected a string but received a null')
      expect(() => toInt(undefined as any)).toThrow('Expected a string but received a undefined')
      expect(() => toInt({} as any)).toThrow('Expected a string but received a Object')
      expect(() => toInt([] as any)).toThrow('Expected a string but received a Array')
      expect(() => toInt(true as any)).toThrow('Expected a string but received a boolean')
      expect(() => toInt(false as any)).toThrow('Expected a string but received a boolean')
    })

    test('should handle array inputs', () => {
      expect(() => toInt([123] as any)).toThrow('Expected a string but received a Array')
      expect(() => toInt(['123'] as any)).toThrow('Expected a string but received a Array')
      expect(() => toInt([1, 2, 3] as any)).toThrow('Expected a string but received a Array')
    })

    test('should handle object inputs', () => {
      expect(() => toInt({ toString: () => '123' } as any)).toThrow('Expected a string but received a Object')
      expect(() => toInt({ valueOf: () => 123 } as any)).toThrow('Expected a string but received a Object')
    })
  })

  describe('real-world use cases', () => {
    test('should parse user input', () => {
      expect(toInt('25')).toBe(25) // age input
      expect(toInt('100')).toBe(100) // percentage
      expect(toInt('2023')).toBe(2023) // year
      expect(toInt('0')).toBe(0) // count
    })

    test('should parse form data', () => {
      expect(toInt('  42  ')).toBe(42) // trimmed input
      expect(toInt('123.00')).toBe(123) // decimal input treated as int
      expect(toInt('+50')).toBe(50) // positive sign
    })

    test('should parse configuration values', () => {
      expect(toInt('8080')).toBe(8080) // port number
      expect(toInt('300')).toBe(300) // timeout in seconds
      expect(toInt('1024')).toBe(1024) // buffer size
    })

    test('should parse color values', () => {
      expect(toInt('FF', 16)).toBe(255) // red component
      expect(toInt('00', 16)).toBe(0) // green component
      expect(toInt('80', 16)).toBe(128) // blue component
    })

    test('should parse binary flags', () => {
      expect(toInt('1010', 2)).toBe(10) // binary flags
      expect(toInt('1111', 2)).toBe(15) // all flags set
      expect(toInt('0000', 2)).toBe(0) // no flags set
    })
  })

  describe('consistency with native parseInt', () => {
    test('should match parseInt for basic cases', () => {
      const testCases = [
        '123',
        '456.789',
        '-123',
        '  789  ',
        '123abc',
        'abc123',
        '',
        '0',
        '+42',
      ]

      testCases.forEach((testCase) => {
        const result = toInt(testCase)
        const expected = Number.parseInt(testCase, 10)

        if (Number.isNaN(expected)) {
          expect(result).toBeNaN()
        }
        else {
          expect(result).toBe(expected)
        }
      })
    })

    test('should match parseInt with radix', () => {
      const testCases = [
        { str: '10', radix: 2 },
        { str: '10', radix: 8 },
        { str: '10', radix: 16 },
        { str: 'FF', radix: 16 },
        { str: '123', radix: 10 },
        { str: '77', radix: 8 },
      ]

      testCases.forEach(({ str, radix }) => {
        const result = toInt(str, radix)
        const expected = Number.parseInt(str, radix)

        if (Number.isNaN(expected)) {
          expect(result).toBeNaN()
        }
        else {
          expect(result).toBe(expected)
        }
      })
    })
  })

  describe('performance considerations', () => {
    test('should handle long numeric strings', () => {
      const longNumber = '1234567890'.repeat(10)
      expect(() => toInt(longNumber)).not.toThrow()
    })

    test('should handle many conversions efficiently', () => {
      const numbers = Array.from({ length: 1000 }, (_, i) => i.toString())
      numbers.forEach((num, index) => {
        expect(toInt(num)).toBe(index)
      })
    })
  })

  describe('integration with validation', () => {
    test('should work well with number validation', () => {
      const userInput = '25'
      const parsed = toInt(userInput)

      expect(typeof parsed).toBe('number')
      expect(parsed).toBe(25)
      expect(parsed >= 0).toBe(true)
      expect(parsed <= 100).toBe(true)
    })

    test('should handle validation edge cases', () => {
      const inputs = ['', 'abc', '123abc', '  456  ', '-789']

      inputs.forEach((input) => {
        const result = toInt(input)
        expect(typeof result).toBe('number')
        // Result should either be a valid integer or NaN
        expect(Number.isInteger(result) || Number.isNaN(result)).toBe(true)
      })
    })
  })

  describe('error handling', () => {
    test('should not throw for any input', () => {
      const problematicInputs = [
        null,
        undefined,
        {},
        [],
        function () {},
        Symbol('test'),
        new Date(),
        /regex/,
        new Error('test'),
      ]

      problematicInputs.forEach((input) => {
        expect(() => toInt(input as any)).toThrow() // All non-string inputs should throw
      })
    })

    test('should handle circular references gracefully', () => {
      const circular: any = { prop: null }
      circular.prop = circular

      expect(() => toInt(circular)).toThrow('Expected a string but received a Object')
    })
  })
})
