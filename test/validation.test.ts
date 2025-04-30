import { describe, expect, test } from 'bun:test'
import { v } from '../src'

describe('Validation Library', () => {
  // String validation
  test('string validation', () => {
    const validator = v.string().min(3).max(10).alphanumeric()

    expect(validator.test('abc123')).toBe(true)
    expect(validator.test('ab')).toBe(false) // too short
    expect(validator.test('abcdefghijk')).toBe(false) // too long
    expect(validator.test('abc@123')).toBe(false) // not alphanumeric

    const result = validator.validate('ab')
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  // Email validation
  test('email validation', () => {
    const validator = v.string().email()

    expect(validator.test('test@example.com')).toBe(true)
    expect(validator.test('invalid-email')).toBe(false)
  })

  // Number validation
  test('number validation', () => {
    const validator = v.number().min(1).max(100).integer()

    expect(validator.test(50)).toBe(true)
    expect(validator.test(0)).toBe(false) // too small
    expect(validator.test(101)).toBe(false) // too large
    expect(validator.test(1.5)).toBe(false) // not an integer
  })

  // Boolean validation
  test('boolean validation', () => {
    const validator = v.boolean()

    expect(validator.test(true)).toBe(true)
    expect(validator.test(false)).toBe(true)
    expect(validator.test('true' as any)).toBe(false) // not a boolean
  })

  // Array validation
  test('array validation', () => {
    const validator = v.array<string>().min(1).max(3).each(v.string().min(2))

    expect(validator.test(['ab', 'cd'])).toBe(true)
    expect(validator.test([])).toBe(false) // empty array
    expect(validator.test(['a', 'bc'])).toBe(false) // first item too short
    expect(validator.test(['ab', 'cd', 'ef', 'gh'])).toBe(false) // too many items
  })

  // Object validation
  test('object validation', () => {
    const validator = v.object().shape({
      name: v.string().min(2).required(),
      age: v.number().min(18).integer().required(),
      email: v.string().email().optional(),
    })

    expect(validator.test({
      name: 'John',
      age: 25,
      email: 'john@example.com',
    })).toBe(true)

    expect(validator.test({
      name: 'J', // too short
      age: 20,
    })).toBe(false)

    expect(validator.test({
      name: 'John',
      age: 17, // too young
    })).toBe(false)

    expect(validator.test({
      name: 'John',
      age: 25,
      email: 'invalid-email', // invalid email
    })).toBe(false)
  })

  // Strict object validation
  test('strict object validation', () => {
    const validator = v.object().strict().shape({
      name: v.string(),
      age: v.number(),
    })

    expect(validator.test({
      name: 'John',
      age: 25,
    })).toBe(true)

    expect(validator.test({
      name: 'John',
      age: 25,
      extra: 'field', // extra field in strict mode
    })).toBe(false)
  })

  // Required vs Optional
  test('required vs optional validation', () => {
    const requiredValidator = v.string().email().required()
    const optionalValidator = v.string().email().optional()

    expect(requiredValidator.test('test@example.com')).toBe(true)
    expect(requiredValidator.test(undefined as any)).toBe(false) // required but undefined

    expect(optionalValidator.test('test@example.com')).toBe(true)
    expect(optionalValidator.test(undefined as any)).toBe(true) // optional so can be undefined
  })

  // Custom validation
  test('custom validation', () => {
    const isEven = (val: number) => val % 2 === 0
    const validator = v.custom(isEven, 'Number must be even')

    expect(validator.test(2)).toBe(true)
    expect(validator.test(3)).toBe(false)

    const result = validator.validate(3)

    console.log(result.errors)

    expect(result.valid).toBe(false)
    expect(result.errors[0].rule).toBe('Number must be even')
  })

  // Nested object validation
  test('nested object validation', () => {
    const addressValidator = v.object().shape({
      street: v.string().required(),
      city: v.string().required(),
      zip: v.string().matches(/^\d{5}$/).required(),
    })

    const userValidator = v.object().shape({
      name: v.string().required(),
      address: addressValidator,
    })

    expect(userValidator.test({
      name: 'John',
      address: {
        street: '123 Main St',
        city: 'New York',
        zip: '10001',
      },
    })).toBe(true)

    expect(userValidator.test({
      name: 'John',
      address: {
        street: '123 Main St',
        city: 'New York',
        zip: 'invalid', // invalid zip
      },
    })).toBe(false)
  })

  // Error messages
  test('validation error messages', () => {
    const validator = v.string().min(5).email()
    const result = validator.validate('test')

    expect(result.valid).toBe(false)
    expect(result.errors.length).toBe(2)
    // Error messages depend on the config but should mention the issues
    expect(result.errors[0].message).toContain('5')
    expect(result.errors[1].message).toContain('email')
  })

  // URL validation using regex
  test('URL validation', () => {
    const validator = v.string().url()

    expect(validator.test('https://example.com')).toBe(true)
    expect(validator.test('http://localhost:3000')).toBe(true)
    expect(validator.test('not-a-url')).toBe(false)
  })

  // Custom validation with multiple rules
  test('custom validation with multiple rules', () => {
    const isEven = (val: number) => val % 2 === 0
    const isPositive = (val: number) => val > 0
    const validator = v.custom((val: number) => isEven(val) && isPositive(val), 'Number must be even and positive')

    expect(validator.test(2)).toBe(true)
    expect(validator.test(-2)).toBe(false)
    expect(validator.test(3)).toBe(false)
  })

  // Object with optional fields
  test('object with optional fields', () => {
    const validator = v.object().shape({
      name: v.string().min(2).required(),
      age: v.number().min(0).optional(),
      email: v.string().email().optional(),
    })

    expect(validator.test({
      name: 'John',
      age: 25,
      email: 'john@example.com',
    })).toBe(true)

    expect(validator.test({
      name: 'John', // only required field
    })).toBe(true)

    expect(validator.test({
      name: 'J', // name too short
      email: 'invalid-email', // invalid email
    })).toBe(false)
  })

  // String length validation
  test('string length validation', () => {
    const validator = v.string().length(5)

    expect(validator.test('hello')).toBe(true)
    expect(validator.test('hi')).toBe(false) // too short
    expect(validator.test('world!')).toBe(false) // too long
  })

  // Array length validation
  test('array length validation', () => {
    const validator = v.array().length(3)

    expect(validator.test([1, 2, 3])).toBe(true)
    expect(validator.test([1, 2])).toBe(false) // too short
    expect(validator.test([1, 2, 3, 4])).toBe(false) // too long
  })

  // Number range validation
  test('number range validation', () => {
    const validator = v.number().min(1).max(10)

    expect(validator.test(5)).toBe(true)
    expect(validator.test(0)).toBe(false) // too small
    expect(validator.test(11)).toBe(false) // too large
  })

  // String pattern validation
  test('string pattern validation', () => {
    const validator = v.string().matches(/^[A-Z][a-z]+$/)

    expect(validator.test('Hello')).toBe(true)
    expect(validator.test('hello')).toBe(false) // doesn't start with uppercase
    expect(validator.test('H1')).toBe(false) // contains numbers
  })
})
