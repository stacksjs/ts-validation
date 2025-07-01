import { beforeEach, describe, expect, test } from 'bun:test'
import { MessageProvider, setCustomMessages, v } from '../src'

describe('Custom Messages', () => {
  beforeEach(() => {
    // Reset to default messages provider before each test
    setCustomMessages(new MessageProvider())
  })

  test('should use global custom messages', () => {
    setCustomMessages(new MessageProvider({
      required: 'This field is required',
      min: 'Must be at least {min} characters',
      email: 'Please provide a valid email address',
    }))

    const validator = v.string().min(3).email().required()
    const result = validator.validate('ab')

    expect(result.valid).toBe(false)
    if (Array.isArray(result.errors)) {
      expect(result.errors[0].message).toBe('Must be at least 3 characters')
    }
  })

  test('should use field-specific messages', () => {
    setCustomMessages(new MessageProvider({
      'username.required': 'Please choose a username',
      'username.min': 'Username must be at least {min} characters',
      'email.required': 'Email is required for your account',
    }))

    const validator = v.object().shape({
      username: v.string().min(3).required(),
      email: v.string().email().required(),
    })

    const result = validator.validate({
      username: 'ab',
      email: 'invalid-email',
    })

    expect(result.valid).toBe(false)
    if (!Array.isArray(result.errors)) {
      expect(result.errors.username[0].message).toBe('Username must be at least 3 characters')
    }
  })

  test('should format parameters correctly', () => {
    setCustomMessages(new MessageProvider({
      min: 'Minimum {min} characters required',
      max: 'Maximum {max} characters allowed',
      equals: 'Must be equal to {param}',
    }))

    const validator = v.string().min(5).max(10).equals('test')
    const result = validator.validate('abc')

    expect(result.valid).toBe(false)
    if (Array.isArray(result.errors)) {
      expect(result.errors[0].message).toBe('Minimum 5 characters required')
    }
  })

  test('should fall back to default messages when custom message not found', () => {
    const validator = v.string().min(3).email().required()
    const result = validator.validate('ab')

    expect(result.valid).toBe(false)
    // Should use default messages from the provider
    if (Array.isArray(result.errors)) {
      expect(result.errors[0].message).toContain('at least')
    }
  })
})
