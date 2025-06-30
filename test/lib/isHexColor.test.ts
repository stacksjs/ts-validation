import { describe, expect, test } from 'bun:test'
import isHexColor from '../../src/lib/isHexColor'

describe('isHexColor', () => {
  describe('basic hex color validation', () => {
    test('should validate 6-digit hex colors with #', () => {
      expect(isHexColor('#FF0000')).toBe(true) // red
      expect(isHexColor('#00FF00')).toBe(true) // green
      expect(isHexColor('#0000FF')).toBe(true) // blue
      expect(isHexColor('#FFFFFF')).toBe(true) // white
      expect(isHexColor('#000000')).toBe(true) // black
      expect(isHexColor('#FFA500')).toBe(true) // orange
      expect(isHexColor('#800080')).toBe(true) // purple
    })

    test('should validate 6-digit hex colors with lowercase', () => {
      expect(isHexColor('#ff0000')).toBe(true) // red
      expect(isHexColor('#00ff00')).toBe(true) // green
      expect(isHexColor('#0000ff')).toBe(true) // blue
      expect(isHexColor('#ffffff')).toBe(true) // white
      expect(isHexColor('#000000')).toBe(true) // black
      expect(isHexColor('#ffa500')).toBe(true) // orange
    })

    test('should validate 6-digit hex colors with mixed case', () => {
      expect(isHexColor('#Ff0000')).toBe(true)
      expect(isHexColor('#00Ff00')).toBe(true)
      expect(isHexColor('#0000Ff')).toBe(true)
      expect(isHexColor('#FfFfFf')).toBe(true)
      expect(isHexColor('#AbCdEf')).toBe(true)
    })

    test('should validate 3-digit hex colors (shorthand)', () => {
      expect(isHexColor('#F00')).toBe(true) // red
      expect(isHexColor('#0F0')).toBe(true) // green
      expect(isHexColor('#00F')).toBe(true) // blue
      expect(isHexColor('#FFF')).toBe(true) // white
      expect(isHexColor('#000')).toBe(true) // black
      expect(isHexColor('#ABC')).toBe(true)
      expect(isHexColor('#123')).toBe(true)
    })

    test('should validate 3-digit hex colors with lowercase', () => {
      expect(isHexColor('#f00')).toBe(true) // red
      expect(isHexColor('#0f0')).toBe(true) // green
      expect(isHexColor('#00f')).toBe(true) // blue
      expect(isHexColor('#fff')).toBe(true) // white
      expect(isHexColor('#abc')).toBe(true)
      expect(isHexColor('#def')).toBe(true)
    })

    test('should validate 3-digit hex colors with mixed case', () => {
      expect(isHexColor('#F0a')).toBe(true)
      expect(isHexColor('#aB2')).toBe(true)
      expect(isHexColor('#CdE')).toBe(true)
    })
  })

  describe('invalid hex color validation', () => {
    test('should accept hex colors without # (optional)', () => {
      expect(isHexColor('FF0000')).toBe(true)
      expect(isHexColor('00FF00')).toBe(true)
      expect(isHexColor('0000FF')).toBe(true)
      expect(isHexColor('FFF')).toBe(true)
      expect(isHexColor('000')).toBe(true)
    })

    test('should reject invalid hex characters', () => {
      expect(isHexColor('#GG0000')).toBe(false)
      expect(isHexColor('#FF00GG')).toBe(false)
      expect(isHexColor('#GGGGGG')).toBe(false)
      expect(isHexColor('#XYZ')).toBe(false)
      expect(isHexColor('#GHI')).toBe(false)
      expect(isHexColor('#12G')).toBe(false)
    })

    test('should reject wrong length hex colors', () => {
      expect(isHexColor('#F')).toBe(false) // too short
      expect(isHexColor('#FF')).toBe(false) // too short
      expect(isHexColor('#FFFF')).toBe(true) // 4 digits allowed (RGBA)
      expect(isHexColor('#FFFFF')).toBe(false) // 5 digits
      expect(isHexColor('#FFFFFFF')).toBe(false) // 7 digits
      expect(isHexColor('#FFFFFFFF')).toBe(true) // 8 digits allowed (RGBA)
    })

    test('should reject colors with special characters', () => {
      expect(isHexColor('#FF-000')).toBe(false)
      expect(isHexColor('#FF_000')).toBe(false)
      expect(isHexColor('#FF 000')).toBe(false)
      expect(isHexColor('#FF.000')).toBe(false)
      expect(isHexColor('#FF,000')).toBe(false)
      expect(isHexColor('#FF@000')).toBe(false)
    })

    test('should reject empty and whitespace strings', () => {
      expect(isHexColor('')).toBe(false)
      expect(isHexColor(' ')).toBe(false)
      expect(isHexColor('   ')).toBe(false)
      expect(isHexColor('\t')).toBe(false)
      expect(isHexColor('\n')).toBe(false)
    })

    test('should reject colors with whitespace', () => {
      expect(isHexColor(' #FF0000')).toBe(false)
      expect(isHexColor('#FF0000 ')).toBe(false)
      expect(isHexColor(' #FF0000 ')).toBe(false)
      expect(isHexColor('#FF 0000')).toBe(false)
      expect(isHexColor('#F F0000')).toBe(false)
    })
  })

  describe('edge cases', () => {
    test('should handle all valid hex digits', () => {
      expect(isHexColor('#0123456789ABCDEF')).toBe(false) // too long but valid chars
      expect(isHexColor('#012345')).toBe(true)
      expect(isHexColor('#6789AB')).toBe(true)
      expect(isHexColor('#CDEF01')).toBe(true)
      expect(isHexColor('#abcdef')).toBe(true)
    })

    test('should handle boundary hex values', () => {
      expect(isHexColor('#000000')).toBe(true) // minimum
      expect(isHexColor('#FFFFFF')).toBe(true) // maximum
      expect(isHexColor('#000')).toBe(true) // minimum short
      expect(isHexColor('#FFF')).toBe(true) // maximum short
    })

    test('should be case insensitive', () => {
      const colors = [
        ['#ABCDEF', '#abcdef'],
        ['#123ABC', '#123abc'],
        ['#DEF456', '#def456'],
        ['#ABC', '#abc'],
        ['#DEF', '#def'],
      ]

      colors.forEach(([upper, lower]) => {
        expect(isHexColor(upper)).toBe(true)
        expect(isHexColor(lower)).toBe(true)
      })
    })
  })

  describe('real-world color examples', () => {
    test('should validate common web colors', () => {
      expect(isHexColor('#FF0000')).toBe(true) // red
      expect(isHexColor('#008000')).toBe(true) // green
      expect(isHexColor('#0000FF')).toBe(true) // blue
      expect(isHexColor('#FFFF00')).toBe(true) // yellow
      expect(isHexColor('#FF00FF')).toBe(true) // magenta
      expect(isHexColor('#00FFFF')).toBe(true) // cyan
      expect(isHexColor('#FFA500')).toBe(true) // orange
      expect(isHexColor('#800080')).toBe(true) // purple
      expect(isHexColor('#FFC0CB')).toBe(true) // pink
      expect(isHexColor('#A52A2A')).toBe(true) // brown
    })

    test('should validate material design colors', () => {
      expect(isHexColor('#F44336')).toBe(true) // red 500
      expect(isHexColor('#E91E63')).toBe(true) // pink 500
      expect(isHexColor('#9C27B0')).toBe(true) // purple 500
      expect(isHexColor('#673AB7')).toBe(true) // deep purple 500
      expect(isHexColor('#3F51B5')).toBe(true) // indigo 500
      expect(isHexColor('#2196F3')).toBe(true) // blue 500
      expect(isHexColor('#03A9F4')).toBe(true) // light blue 500
      expect(isHexColor('#00BCD4')).toBe(true) // cyan 500
    })

    test('should validate grayscale colors', () => {
      expect(isHexColor('#000000')).toBe(true) // black
      expect(isHexColor('#111111')).toBe(true) // very dark gray
      expect(isHexColor('#333333')).toBe(true) // dark gray
      expect(isHexColor('#666666')).toBe(true) // medium gray
      expect(isHexColor('#999999')).toBe(true) // light gray
      expect(isHexColor('#CCCCCC')).toBe(true) // very light gray
      expect(isHexColor('#FFFFFF')).toBe(true) // white
    })

    test('should validate brand colors', () => {
      expect(isHexColor('#1DA1F2')).toBe(true) // Twitter blue
      expect(isHexColor('#4267B2')).toBe(true) // Facebook blue
      expect(isHexColor('#FF0000')).toBe(true) // YouTube red
      expect(isHexColor('#25D366')).toBe(true) // WhatsApp green
      expect(isHexColor('#E4405F')).toBe(true) // Instagram pink
      expect(isHexColor('#0077B5')).toBe(true) // LinkedIn blue
    })

    test('should validate short form colors', () => {
      expect(isHexColor('#F00')).toBe(true) // red
      expect(isHexColor('#0F0')).toBe(true) // lime
      expect(isHexColor('#00F')).toBe(true) // blue
      expect(isHexColor('#FF0')).toBe(true) // yellow
      expect(isHexColor('#F0F')).toBe(true) // magenta
      expect(isHexColor('#0FF')).toBe(true) // cyan
    })
  })

  describe('performance considerations', () => {
    test('should handle many color validations efficiently', () => {
      const colors = [
        '#FF0000',
        '#00FF00',
        '#0000FF',
        '#FFFFFF',
        '#000000',
        '#FFA500',
        '#800080',
        '#FFC0CB',
        '#A52A2A',
        '#008080',
        '#F00',
        '#0F0',
        '#00F',
        '#FFF',
        '#000',
        '#ABC',
        '#DEF',
        '#123',
        '#456',
        '#789',
      ]

      const start = Date.now()
      colors.forEach((color) => {
        isHexColor(color)
      })
      const end = Date.now()

      expect(end - start).toBeLessThan(50) // Should complete quickly
    })

    test('should validate colors quickly', () => {
      const start = Date.now()
      for (let i = 0; i < 1000; i++) {
        isHexColor('#FF0000')
        isHexColor('#F00')
        isHexColor('#INVALID')
        isHexColor('invalid')
      }
      const end = Date.now()

      expect(end - start).toBeLessThan(200) // Should handle many validations quickly
    })
  })

  describe('integration scenarios', () => {
    test('should work with CSS color validation', () => {
      const validCSSColors = [
        '#FF0000',
        '#00FF00',
        '#0000FF',
        '#F00',
        '#0F0',
        '#00F',
      ]

      validCSSColors.forEach((color) => {
        expect(isHexColor(color)).toBe(true)
      })
    })

    test('should complement RGB validation', () => {
      // These should be valid hex colors but not RGB strings
      expect(isHexColor('#FF0000')).toBe(true)
      expect(isHexColor('rgb(255, 0, 0)')).toBe(false)
      expect(isHexColor('rgba(255, 0, 0, 1)')).toBe(false)
      expect(isHexColor('hsl(0, 100%, 50%)')).toBe(false)
    })

    test('should work with color picker inputs', () => {
      // Common color picker outputs
      expect(isHexColor('#ff5733')).toBe(true)
      expect(isHexColor('#33ff57')).toBe(true)
      expect(isHexColor('#3357ff')).toBe(true)
      expect(isHexColor('#f39c12')).toBe(true)
      expect(isHexColor('#e74c3c')).toBe(true)
    })
  })

  describe('error handling', () => {
    test('should throw error for non-string input', () => {
      expect(() => isHexColor(123 as any)).toThrow()
      expect(() => isHexColor(null as any)).toThrow()
      expect(() => isHexColor(undefined as any)).toThrow()
      expect(() => isHexColor({} as any)).toThrow()
      expect(() => isHexColor([] as any)).toThrow()
      expect(() => isHexColor(true as any)).toThrow()
    })
  })

  describe('boundary validation', () => {
    test('should validate exact length requirements', () => {
      // 3-digit hex colors (4 chars total with #)
      expect(isHexColor('#ABC')).toBe(true)
      expect(isHexColor('#12')).toBe(false) // too short
      expect(isHexColor('#ABCD')).toBe(true) // 4-digit RGBA allowed

      // 6-digit hex colors (7 chars total with #)
      expect(isHexColor('#ABCDEF')).toBe(true)
      expect(isHexColor('#ABCDE')).toBe(false) // too short
      expect(isHexColor('#ABCDEFG')).toBe(false) // too long
    })

    test('should handle edge characters', () => {
      // Valid hex characters
      expect(isHexColor('#0123456789ABCDEF')).toBe(false) // too long but valid chars
      expect(isHexColor('#FEDCBA9876543210')).toBe(false) // too long but valid chars

      // Invalid characters at boundaries
      expect(isHexColor('#GGGGGG')).toBe(false)
      expect(isHexColor('#ZZZZZZ')).toBe(false)
    })
  })
})
