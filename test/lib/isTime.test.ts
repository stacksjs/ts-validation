import { describe, expect, test } from 'bun:test'
import isTime from '../../src/lib/isTime'

describe('isTime', () => {
  describe('24-hour format (default)', () => {
    test('should validate basic 24-hour times', () => {
      expect(isTime('00:00')).toBe(true)
      expect(isTime('12:30')).toBe(true)
      expect(isTime('23:59')).toBe(true)
      expect(isTime('01:23')).toBe(true)
      expect(isTime('9:45')).toBe(true) // single digit hour
      expect(isTime('15:30')).toBe(true)
    })

    test('should reject invalid 24-hour times', () => {
      expect(isTime('24:00')).toBe(false) // hour too high
      expect(isTime('12:60')).toBe(false) // minute too high
      expect(isTime('25:30')).toBe(false) // hour too high
      expect(isTime('12:99')).toBe(false) // minute too high
      expect(isTime('-1:30')).toBe(false) // negative hour
      expect(isTime('12:-5')).toBe(false) // negative minute
    })

    test('should validate edge cases for 24-hour format', () => {
      expect(isTime('0:00')).toBe(true) // minimal format with padded minute
      expect(isTime('00:00')).toBe(true) // padded zeros
      expect(isTime('23:59')).toBe(true) // maximum valid time
      expect(isTime('12:00')).toBe(true) // noon
      expect(isTime('6:30')).toBe(true) // single digit hour
    })
  })

  describe('12-hour format', () => {
    test('should validate basic 12-hour times', () => {
      expect(isTime('12:00 AM', { hourFormat: 'hour12', mode: 'default' })).toBe(true)
      expect(isTime('12:30 PM', { hourFormat: 'hour12', mode: 'default' })).toBe(true)
      expect(isTime('1:23 AM', { hourFormat: 'hour12', mode: 'default' })).toBe(true)
      expect(isTime('11:59 PM', { hourFormat: 'hour12', mode: 'default' })).toBe(true)
      expect(isTime('6:45 AM', { hourFormat: 'hour12', mode: 'default' })).toBe(true)
      expect(isTime('9:15 PM', { hourFormat: 'hour12', mode: 'default' })).toBe(true)
    })

    test('should reject invalid 12-hour times', () => {
      expect(isTime('13:00 AM', { hourFormat: 'hour12', mode: 'default' })).toBe(false) // hour too high
      expect(isTime('0:30 PM', { hourFormat: 'hour12', mode: 'default' })).toBe(false) // hour too low
      expect(isTime('12:60 AM', { hourFormat: 'hour12', mode: 'default' })).toBe(false) // minute too high
      expect(isTime('12:30 XM', { hourFormat: 'hour12', mode: 'default' })).toBe(false) // invalid meridiem
      expect(isTime('12:30 am', { hourFormat: 'hour12', mode: 'default' })).toBe(false) // lowercase meridiem
      expect(isTime('12:30PM', { hourFormat: 'hour12', mode: 'default' })).toBe(false) // missing space
    })

    test('should validate edge cases for 12-hour format', () => {
      expect(isTime('12:00 AM', { hourFormat: 'hour12', mode: 'default' })).toBe(true) // midnight
      expect(isTime('12:00 PM', { hourFormat: 'hour12', mode: 'default' })).toBe(true) // noon
      expect(isTime('1:00 AM', { hourFormat: 'hour12', mode: 'default' })).toBe(true) // 1 AM
      expect(isTime('1:00 PM', { hourFormat: 'hour12', mode: 'default' })).toBe(true) // 1 PM
    })
  })

  describe('with seconds modes', () => {
    test('should validate times with seconds', () => {
      expect(isTime('00:00:00', { hourFormat: 'hour24', mode: 'withSeconds' })).toBe(true)
      expect(isTime('12:30:45', { hourFormat: 'hour24', mode: 'withSeconds' })).toBe(true)
      expect(isTime('23:59:59', { hourFormat: 'hour24', mode: 'withSeconds' })).toBe(true)
      expect(isTime('12:00:00 AM', { hourFormat: 'hour12', mode: 'withSeconds' })).toBe(true)
      expect(isTime('1:23:45 PM', { hourFormat: 'hour12', mode: 'withSeconds' })).toBe(true)
    })

    test('should validate times with optional seconds', () => {
      expect(isTime('12:30', { hourFormat: 'hour24', mode: 'withOptionalSeconds' })).toBe(true)
      expect(isTime('12:30:45', { hourFormat: 'hour24', mode: 'withOptionalSeconds' })).toBe(true)
      expect(isTime('12:30 AM', { hourFormat: 'hour12', mode: 'withOptionalSeconds' })).toBe(true)
      expect(isTime('12:30:45 AM', { hourFormat: 'hour12', mode: 'withOptionalSeconds' })).toBe(true)
    })

    test('should reject invalid seconds', () => {
      expect(isTime('12:30:60', { hourFormat: 'hour24', mode: 'withSeconds' })).toBe(false)
      expect(isTime('12:30:99', { hourFormat: 'hour24', mode: 'withSeconds' })).toBe(false)
      expect(isTime('12:30', { hourFormat: 'hour24', mode: 'withSeconds' })).toBe(false) // missing seconds
    })
  })

  describe('input validation', () => {
    test('should reject non-string inputs', () => {
      expect(isTime(123 as any)).toBe(false)
      expect(isTime(null as any)).toBe(false)
      expect(isTime(undefined as any)).toBe(false)
      expect(isTime({} as any)).toBe(false)
      expect(isTime([] as any)).toBe(false)
      expect(isTime(true as any)).toBe(false)
    })

    test('should reject empty and whitespace strings', () => {
      expect(isTime('')).toBe(false)
      expect(isTime('   ')).toBe(false)
      expect(isTime('\t')).toBe(false)
      expect(isTime('\n')).toBe(false)
    })

    test('should reject malformed time strings', () => {
      expect(isTime('12')).toBe(false) // missing minute
      expect(isTime(':30')).toBe(false) // missing hour
      expect(isTime('12:')).toBe(false) // missing minute after colon
      expect(isTime('12.30')).toBe(false) // wrong separator
      expect(isTime('12-30')).toBe(false) // wrong separator
      expect(isTime('12 30')).toBe(false) // space separator
    })
  })

  describe('boundary times', () => {
    test('should validate start and end of day', () => {
      expect(isTime('00:00')).toBe(true) // start of day
      expect(isTime('23:59')).toBe(true) // end of day
      expect(isTime('12:00')).toBe(true) // noon
    })

    test('should validate 12-hour boundaries', () => {
      expect(isTime('12:00 AM', { hourFormat: 'hour12', mode: 'default' })).toBe(true) // midnight
      expect(isTime('12:00 PM', { hourFormat: 'hour12', mode: 'default' })).toBe(true) // noon
      expect(isTime('11:59 PM', { hourFormat: 'hour12', mode: 'default' })).toBe(true) // late night
    })
  })

  describe('whitespace handling', () => {
    test('should reject times with incorrect whitespace', () => {
      expect(isTime(' 12:30')).toBe(false) // leading space
      expect(isTime('12:30 ')).toBe(false) // trailing space
      expect(isTime(' 12:30 ')).toBe(false) // surrounding spaces
      expect(isTime('12: 30')).toBe(false) // space in time
      expect(isTime('12 :30')).toBe(false) // space before colon
    })

    test('should handle 12-hour format whitespace correctly', () => {
      expect(isTime('12:30  AM', { hourFormat: 'hour12', mode: 'default' })).toBe(false) // double space
      expect(isTime('12:30AM', { hourFormat: 'hour12', mode: 'default' })).toBe(false) // no space
      expect(isTime(' 12:30 AM', { hourFormat: 'hour12', mode: 'default' })).toBe(false) // leading space
    })
  })

  describe('real-world use cases', () => {
    test('should validate common business hours', () => {
      expect(isTime('9:00')).toBe(true) // 9 AM
      expect(isTime('17:00')).toBe(true) // 5 PM
      expect(isTime('9:00 AM', { hourFormat: 'hour12', mode: 'default' })).toBe(true)
      expect(isTime('5:00 PM', { hourFormat: 'hour12', mode: 'default' })).toBe(true)
      expect(isTime('12:00 PM', { hourFormat: 'hour12', mode: 'default' })).toBe(true) // lunch time
    })

    test('should validate appointment times', () => {
      expect(isTime('10:30')).toBe(true)
      expect(isTime('14:15')).toBe(true)
      expect(isTime('16:45')).toBe(true)
      expect(isTime('10:30 AM', { hourFormat: 'hour12', mode: 'default' })).toBe(true)
      expect(isTime('2:15 PM', { hourFormat: 'hour12', mode: 'default' })).toBe(true)
      expect(isTime('4:45 PM', { hourFormat: 'hour12', mode: 'default' })).toBe(true)
    })

    test('should validate times with seconds for precision', () => {
      expect(isTime('9:30:00', { hourFormat: 'hour24', mode: 'withSeconds' })).toBe(true)
      expect(isTime('13:45:30', { hourFormat: 'hour24', mode: 'withSeconds' })).toBe(true)
      expect(isTime('9:30:00 AM', { hourFormat: 'hour12', mode: 'withSeconds' })).toBe(true)
      expect(isTime('1:45:30 PM', { hourFormat: 'hour12', mode: 'withSeconds' })).toBe(true)
    })

    test('should validate form time inputs', () => {
      // HTML time input format (24-hour)
      expect(isTime('08:30')).toBe(true)
      expect(isTime('20:45')).toBe(true)
      expect(isTime('00:00')).toBe(true)
      expect(isTime('23:59')).toBe(true)
    })
  })

  describe('options handling', () => {
    test('should use default options when none provided', () => {
      expect(isTime('12:30')).toBe(true) // defaults to 24-hour, default mode
      expect(isTime('12:30:45')).toBe(false) // seconds not allowed in default mode
    })

    test('should handle complete option objects', () => {
      expect(isTime('12:30 AM', { hourFormat: 'hour12', mode: 'default' })).toBe(true)
      expect(isTime('12:30:45', { hourFormat: 'hour24', mode: 'withSeconds' })).toBe(true)
      expect(isTime('12:30', { hourFormat: 'hour24', mode: 'withOptionalSeconds' })).toBe(true)
      expect(isTime('12:30:45', { hourFormat: 'hour24', mode: 'withOptionalSeconds' })).toBe(true)
    })
  })

  describe('edge cases', () => {
    test('should handle leading zeros correctly', () => {
      expect(isTime('09:05')).toBe(true)
      expect(isTime('01:01')).toBe(true)
      expect(isTime('00:00')).toBe(true)
      expect(isTime('9:05')).toBe(true) // without leading zero
      expect(isTime('1:01')).toBe(true) // without leading zero
    })

    test('should reject times outside valid ranges', () => {
      expect(isTime('24:00')).toBe(false)
      expect(isTime('12:60')).toBe(false)
      expect(isTime('25:30')).toBe(false)
      expect(isTime('12:99')).toBe(false)
    })

    test('should handle 12-hour edge cases', () => {
      expect(isTime('13:00 AM', { hourFormat: 'hour12', mode: 'default' })).toBe(false) // invalid hour
      expect(isTime('0:30 PM', { hourFormat: 'hour12', mode: 'default' })).toBe(false) // invalid hour
      expect(isTime('12:30 XM', { hourFormat: 'hour12', mode: 'default' })).toBe(false) // invalid meridiem
    })
  })

  describe('performance', () => {
    test('should validate many times efficiently', () => {
      const times = [
        '00:00',
        '06:30',
        '12:00',
        '18:45',
        '23:59',
        '09:15:30',
        '14:22:45',
        '20:33:12',
      ]

      const start = Date.now()
      times.forEach((time) => {
        if (time.includes(':') && time.split(':').length === 3) {
          isTime(time, { hourFormat: 'hour24', mode: 'withSeconds' })
        }
        else {
          isTime(time)
        }
      })
      const end = Date.now()

      expect(end - start).toBeLessThan(50) // Should complete quickly
    })
  })
})
