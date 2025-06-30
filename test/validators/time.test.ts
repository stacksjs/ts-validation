import { time } from '../../src/validators/time'

describe('timeValidator', () => {
  it('should validate 24-hour times', () => {
    const validator = time()
    expect(validator.test('00:00')).toBe(true)
    expect(validator.test('23:59')).toBe(true)
    expect(validator.test('12:34')).toBe(true)
    expect(validator.test('24:00')).toBe(false)
    expect(validator.test('12:60')).toBe(false)
  })

  it('should reject non-string values', () => {
    const validator = time()
    expect(validator.test(123)).toBe(false)
    expect(validator.test(null)).toBe(false)
    expect(validator.test(undefined)).toBe(false)
  })

  it('should handle edge cases', () => {
    const validator = time()
    expect(validator.test('')).toBe(false)
    expect(validator.test('25:00')).toBe(false)
    expect(validator.test('12:60')).toBe(false)
  })
})
