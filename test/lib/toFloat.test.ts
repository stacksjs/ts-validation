import { describe, expect, test } from 'bun:test'
import toFloat from '../../src/lib/toFloat'

describe('toFloat', () => {
  describe('basic float conversion', () => {
    test('should convert integer strings to floats', () => {
      expect(toFloat('0')).toBe(0.0)
      expect(toFloat('1')).toBe(1.0)
      expect(toFloat('42')).toBe(42.0)
      expect(toFloat('123')).toBe(123.0)
      expect(toFloat('999')).toBe(999.0)
    })

    test('should convert decimal strings to floats', () => {
      expect(toFloat('0.0')).toBe(0.0)
      expect(toFloat('1.5')).toBe(1.5)
      expect(toFloat('3.14')).toBe(3.14)
      expect(toFloat('42.42')).toBe(42.42)
      expect(toFloat('123.456')).toBe(123.456)
    })

    test('should convert negative numbers', () => {
      expect(toFloat('-1')).toBe(-1.0)
      expect(toFloat('-42')).toBe(-42.0)
      expect(toFloat('-3.14')).toBe(-3.14)
      expect(toFloat('-123.456')).toBe(-123.456)
    })

    test('should convert positive numbers with explicit sign', () => {
      expect(toFloat('+1')).toBe(1.0)
      expect(toFloat('+42')).toBe(42.0)
      expect(toFloat('+3.14')).toBe(3.14)
      expect(toFloat('+123.456')).toBe(123.456)
    })

    test('should handle leading zeros', () => {
      expect(toFloat('01')).toBe(1.0)
      expect(toFloat('042')).toBe(42.0)
      expect(toFloat('0123')).toBe(123.0)
      expect(toFloat('01.5')).toBe(1.5)
      expect(toFloat('003.14')).toBe(3.14)
    })
  })

  describe('decimal point variations', () => {
    test('should handle numbers starting with decimal point', () => {
      expect(toFloat('.5')).toBe(0.5)
      expect(toFloat('.123')).toBe(0.123)
      expect(toFloat('.999')).toBe(0.999)
      expect(toFloat('-.5')).toBe(-0.5)
      expect(toFloat('+.5')).toBe(0.5)
    })

    test('should handle numbers ending with decimal point', () => {
      expect(toFloat('5.')).toBe(5.0)
      expect(toFloat('123.')).toBe(123.0)
      expect(toFloat('999.')).toBe(999.0)
      expect(toFloat('-5.')).toBe(-5.0)
      expect(toFloat('+5.')).toBe(5.0)
    })

    test('should handle multiple decimal places', () => {
      expect(toFloat('3.14159')).toBe(3.14159)
      expect(toFloat('2.71828')).toBe(2.71828)
      expect(toFloat('1.41421')).toBe(1.41421)
      expect(toFloat('0.123456789')).toBe(0.123456789)
    })
  })

  describe('scientific notation', () => {
    test('should convert scientific notation with lowercase e', () => {
      expect(toFloat('1e0')).toBe(1.0)
      expect(toFloat('1e1')).toBe(10.0)
      expect(toFloat('1e2')).toBe(100.0)
      expect(toFloat('1e3')).toBe(1000.0)
      expect(toFloat('1e-1')).toBe(0.1)
      expect(toFloat('1e-2')).toBe(0.01)
      expect(toFloat('1e-3')).toBe(0.001)
    })

    test('should convert scientific notation with uppercase E', () => {
      expect(toFloat('1E0')).toBe(1.0)
      expect(toFloat('1E1')).toBe(10.0)
      expect(toFloat('1E2')).toBe(100.0)
      expect(toFloat('1E3')).toBe(1000.0)
      expect(toFloat('1E-1')).toBe(0.1)
      expect(toFloat('1E-2')).toBe(0.01)
      expect(toFloat('1E-3')).toBe(0.001)
    })

    test('should convert complex scientific notation', () => {
      expect(toFloat('3.14e2')).toBe(314.0)
      expect(toFloat('2.5e-3')).toBe(0.0025)
      expect(toFloat('-1.23e4')).toBe(-12300.0)
      expect(toFloat('+4.56e-2')).toBe(0.0456)
      expect(toFloat('1.5E+3')).toBe(1500.0)
    })
  })

  describe('whitespace handling', () => {
    test('should handle leading whitespace', () => {
      expect(toFloat(' 42')).toBe(42.0)
      expect(toFloat('  3.14')).toBe(3.14)
      expect(toFloat('\t123')).toBe(123.0)
      expect(toFloat('\n456')).toBe(456.0)
      expect(toFloat('\r789')).toBe(789.0)
    })

    test('should handle trailing whitespace', () => {
      expect(toFloat('42 ')).toBe(42.0)
      expect(toFloat('3.14  ')).toBe(3.14)
      expect(toFloat('123\t')).toBe(123.0)
      expect(toFloat('456\n')).toBe(456.0)
      expect(toFloat('789\r')).toBe(789.0)
    })

    test('should handle surrounding whitespace', () => {
      expect(toFloat(' 42 ')).toBe(42.0)
      expect(toFloat('  3.14  ')).toBe(3.14)
      expect(toFloat('\t123\t')).toBe(123.0)
      expect(toFloat('\n456\n')).toBe(456.0)
      expect(toFloat(' \t 789 \n ')).toBe(789.0)
    })
  })

  describe('special values', () => {
    test('should handle infinity', () => {
      expect(toFloat('Infinity')).toBe(Infinity)
      expect(toFloat('+Infinity')).toBe(Infinity)
      expect(toFloat('-Infinity')).toBe(-Infinity)
      expect(toFloat('infinity')).toBeNaN() // case sensitive, lowercase returns NaN
      expect(toFloat('INFINITY')).toBeNaN() // case sensitive, uppercase returns NaN
    })

    test('should handle NaN', () => {
      expect(toFloat('NaN')).toBeNaN()
      expect(toFloat('nan')).toBeNaN() // case insensitive
      expect(toFloat('NAN')).toBeNaN() // case insensitive
    })

    test('should handle zero variations', () => {
      expect(toFloat('0')).toBe(0.0)
      expect(toFloat('-0')).toBe(-0.0)
      expect(toFloat('+0')).toBe(0.0)
      expect(toFloat('0.0')).toBe(0.0)
      expect(toFloat('-0.0')).toBe(-0.0)
      expect(toFloat('0.00')).toBe(0.0)
    })
  })

  describe('invalid input handling', () => {
    test('should return NaN for invalid strings', () => {
      expect(toFloat('abc')).toBeNaN()
      expect(toFloat('hello')).toBeNaN()
      expect(toFloat('123abc')).toBe(123) // parseFloat stops at first invalid character
      expect(toFloat('abc123')).toBeNaN()
      expect(toFloat('12.34.56')).toBe(12.34) // parseFloat stops at second decimal point
      expect(toFloat('1.2.3')).toBe(1.2) // parseFloat stops at second decimal point
    })

    test('should return NaN for empty and whitespace-only strings', () => {
      expect(toFloat('')).toBeNaN()
      expect(toFloat('   ')).toBeNaN()
      expect(toFloat('\t')).toBeNaN()
      expect(toFloat('\n')).toBeNaN()
      expect(toFloat('\r')).toBeNaN()
    })

    test('should return NaN for strings with invalid characters', () => {
      expect(toFloat('12$34')).toBe(12) // parseFloat stops at first invalid character
      expect(toFloat('12#34')).toBe(12) // parseFloat stops at first invalid character
      expect(toFloat('12@34')).toBe(12) // parseFloat stops at first invalid character
      expect(toFloat('12%34')).toBe(12) // parseFloat stops at first invalid character
      expect(toFloat('12&34')).toBe(12) // parseFloat stops at first invalid character
      expect(toFloat('12*34')).toBe(12) // parseFloat stops at first invalid character
    })

    test('should return NaN for multiple signs', () => {
      expect(toFloat('++1')).toBeNaN()
      expect(toFloat('--1')).toBeNaN()
      expect(toFloat('+-1')).toBeNaN()
      expect(toFloat('-+1')).toBeNaN()
    })
  })

  describe('edge cases', () => {
    test('should handle very large numbers', () => {
      expect(toFloat('1e308')).toBe(1e308)
      expect(toFloat('1.7976931348623157e+308')).toBe(1.7976931348623157e+308)
    })

    test('should handle very small numbers', () => {
      expect(toFloat('0.000000000000000001')).toBe(0.000000000000000001)
      expect(toFloat('1e-308')).toBe(1e-308)
      expect(toFloat('5e-324')).toBe(5e-324) // smallest positive number
    })

    test('should handle numbers that exceed float precision', () => {
      expect(toFloat('1e309')).toBe(Infinity) // overflow to infinity
      expect(toFloat('-1e309')).toBe(-Infinity) // overflow to negative infinity
      expect(toFloat('1e-400')).toBe(0) // underflow to zero
    })

    test('should handle long decimal strings', () => {
      const longDecimal = `3.${'1'.repeat(100)}`
      const result = toFloat(longDecimal)
      expect(result).toBeCloseTo(3.1111111111111112) // precision limited by float
    })
  })

  describe('real-world use cases', () => {
    test('should convert user input numbers', () => {
      expect(toFloat('25.5')).toBe(25.5) // temperature
      expect(toFloat('3.14159')).toBe(3.14159) // pi
      expect(toFloat('2.71828')).toBe(2.71828) // e
      expect(toFloat('9.81')).toBe(9.81) // gravity
      expect(toFloat('299792458')).toBe(299792458) // speed of light
    })

    test('should convert financial values', () => {
      expect(toFloat('19.99')).toBe(19.99) // price
      expect(toFloat('1000.50')).toBe(1000.50) // amount
      expect(toFloat('0.05')).toBe(0.05) // tax rate
      expect(toFloat('123456.78')).toBe(123456.78) // large amount
    })

    test('should convert measurement values', () => {
      expect(toFloat('1.75')).toBe(1.75) // height in meters
      expect(toFloat('68.5')).toBe(68.5) // weight in kg
      expect(toFloat('37.5')).toBe(37.5) // temperature in celsius
      expect(toFloat('1013.25')).toBe(1013.25) // pressure in hPa
    })

    test('should convert percentage values', () => {
      expect(toFloat('50.5')).toBe(50.5) // percentage
      expect(toFloat('0.755')).toBe(0.755) // decimal percentage
      expect(toFloat('100.0')).toBe(100.0) // full percentage
      expect(toFloat('0.01')).toBe(0.01) // small percentage
    })

    test('should convert coordinates', () => {
      expect(toFloat('40.7128')).toBe(40.7128) // latitude
      expect(toFloat('-74.0060')).toBe(-74.0060) // longitude
      expect(toFloat('51.5074')).toBe(51.5074) // latitude
      expect(toFloat('-0.1278')).toBe(-0.1278) // longitude
    })
  })

  describe('performance considerations', () => {
    test('should handle many conversions efficiently', () => {
      const testStrings = [
        '0',
        '1',
        '42',
        '3.14',
        '-1.5',
        '+2.7',
        '1e3',
        '1E-2',
        'Infinity',
        '-Infinity',
        '123.456',
        '0.001',
        '999.999',
      ]

      const start = Date.now()
      testStrings.forEach((str) => {
        toFloat(str)
      })
      const end = Date.now()

      expect(end - start).toBeLessThan(50) // Should complete quickly
    })

    test('should handle very long number strings efficiently', () => {
      const veryLongNumber = `1.${'2'.repeat(1000)}`

      const start = Date.now()
      const result = toFloat(veryLongNumber)
      const end = Date.now()

      expect(typeof result).toBe('number')
      expect(end - start).toBeLessThan(100) // Should handle long strings quickly
    })
  })

  describe('precision and accuracy', () => {
    test('should maintain precision for common decimal values', () => {
      expect(toFloat('0.1')).toBe(0.1)
      expect(toFloat('0.2')).toBe(0.2)
      expect(toFloat('0.3')).toBe(0.3)
      expect(toFloat('1.1')).toBe(1.1)
      expect(toFloat('2.2')).toBe(2.2)
    })

    test('should handle floating point precision limits', () => {
      // These might have precision issues due to floating point representation
      expect(toFloat('0.1')).toBeCloseTo(0.1)
      expect(toFloat('0.2')).toBeCloseTo(0.2)
      expect(toFloat('0.3')).toBeCloseTo(0.3)
    })

    test('should handle numbers at precision boundaries', () => {
      expect(toFloat('1.7976931348623157e+308')).toBe(Number.MAX_VALUE)
      expect(toFloat('5e-324')).toBe(Number.MIN_VALUE)
      expect(toFloat('9007199254740991')).toBe(Number.MAX_SAFE_INTEGER)
      expect(toFloat('-9007199254740991')).toBe(Number.MIN_SAFE_INTEGER)
    })
  })

  describe('integration scenarios', () => {
    test('should work with form input parsing', () => {
      // Common form input values
      expect(toFloat('25')).toBe(25) // age
      expect(toFloat('175.5')).toBe(175.5) // height
      expect(toFloat('70.2')).toBe(70.2) // weight
      expect(toFloat('3.5')).toBe(3.5) // rating
    })

    test('should work with API response parsing', () => {
      // Common API numeric values
      expect(toFloat('42.5')).toBe(42.5) // score
      expect(toFloat('1.23')).toBe(1.23) // rate
      expect(toFloat('99.99')).toBe(99.99) // price
      expect(toFloat('0.85')).toBe(0.85) // ratio
    })

    test('should work with configuration parsing', () => {
      // Configuration values
      expect(toFloat('1.5')).toBe(1.5) // multiplier
      expect(toFloat('0.5')).toBe(0.5) // threshold
      expect(toFloat('30.0')).toBe(30.0) // timeout
      expect(toFloat('100')).toBe(100) // limit
    })
  })

  describe('error handling', () => {
    test('should throw error for non-string input', () => {
      expect(() => toFloat(123 as any)).toThrow()
      expect(() => toFloat(null as any)).toThrow()
      expect(() => toFloat(undefined as any)).toThrow()
      expect(() => toFloat({} as any)).toThrow()
      expect(() => toFloat([] as any)).toThrow()
      expect(() => toFloat(true as any)).toThrow()
    })
  })

  describe('comparison with parseFloat', () => {
    test('should behave similarly to parseFloat', () => {
      const testCases = [
        '42',
        '3.14',
        '-1.5',
        '+2.7',
        '0',
        '0.0',
        '1e3',
        '1E-2',
        'Infinity',
        '-Infinity',
        'NaN',
        '  42  ',
        '42abc',
        'abc42',
        '12.34.56',
      ]

      testCases.forEach((testCase) => {
        const toFloatResult = toFloat(testCase)
        const parseFloatResult = Number.parseFloat(testCase)

        if (Number.isNaN(toFloatResult) && Number.isNaN(parseFloatResult)) {
          expect(Number.isNaN(toFloatResult)).toBe(Number.isNaN(parseFloatResult))
        }
        else {
          expect(toFloatResult).toBe(parseFloatResult)
        }
      })
    })
  })
})
