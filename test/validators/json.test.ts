import { json } from '../../src/validators/json'

describe('jsonValidator', () => {
  it('should validate JSON strings', () => {
    const validator = json()
    expect(validator.test('{"a":1}')).toBe(true)
    expect(validator.test('[1,2,3]')).toBe(true)
    expect(validator.test('123')).toBe(false)
    expect(validator.test('not json')).toBe(false)
  })

  it('should reject non-string values', () => {
    const validator = json().required()
    expect(validator.test(123)).toBe(false)
    expect(validator.test(null)).toBe(false)
    expect(validator.test(undefined)).toBe(false)
  })

  it('should handle edge cases', () => {
    const validator = json().required()
    expect(validator.test('')).toBe(false)
    expect(validator.test('null')).toBe(false)
    expect(validator.test('true')).toBe(false)
    expect(validator.test('false')).toBe(false)
  })
})
