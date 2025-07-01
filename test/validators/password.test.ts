import { describe, expect, test } from 'bun:test'
import { password } from '../../src/validators/password'

describe('PasswordValidator', () => {
  describe('basic validation', () => {
    test('should validate strings as passwords', () => {
      const validator = password()
      expect(validator.test('password123')).toBe(true)
      expect(validator.test('simple')).toBe(true)
      expect(validator.test('')).toBe(true)
      expect(validator.test('P@ssw0rd!')).toBe(true)
      expect(validator.test(123 as any)).toBe(false)
      expect(validator.test(null as any)).toBe(true) // null/undefined are valid when optional
      expect(validator.test(undefined as any)).toBe(true) // null/undefined are valid when optional
      expect(validator.test([] as any)).toBe(false)
      expect(validator.test({} as any)).toBe(false)
    })

    test('should have correct name', () => {
      const validator = password()
      expect(validator.name).toBe('password')
    })
  })

  describe('length validation', () => {
    test('min() should validate minimum length', () => {
      const validator = password().min(8)
      expect(validator.test('password')).toBe(true)
      expect(validator.test('password123')).toBe(true)
      expect(validator.test('short')).toBe(false)
      expect(validator.test('')).toBe(true) // empty string is valid when optional
    })

    test('max() should validate maximum length', () => {
      const validator = password().max(12)
      expect(validator.test('password')).toBe(true)
      expect(validator.test('short')).toBe(true)
      expect(validator.test('')).toBe(true)
      expect(validator.test('verylongpassword')).toBe(false)
    })

    test('length() should validate exact length', () => {
      const validator = password().length(8)
      expect(validator.test('password')).toBe(true)
      expect(validator.test('12345678')).toBe(true)
      expect(validator.test('short')).toBe(false)
      expect(validator.test('toolongpassword')).toBe(false)
      expect(validator.test('')).toBe(true) // empty string is valid when optional
    })
  })

  describe('character requirements', () => {
    test('hasUppercase() should require uppercase letters', () => {
      const validator = password().hasUppercase()
      expect(validator.test('Password')).toBe(true)
      expect(validator.test('PASSWORD')).toBe(true)
      expect(validator.test('Pass123')).toBe(true)
      expect(validator.test('password')).toBe(false)
      expect(validator.test('123456')).toBe(false)
      expect(validator.test('')).toBe(true) // empty string is valid when optional
    })

    test('hasLowercase() should require lowercase letters', () => {
      const validator = password().hasLowercase()
      expect(validator.test('password')).toBe(true)
      expect(validator.test('Password')).toBe(true)
      expect(validator.test('pass123')).toBe(true)
      expect(validator.test('PASSWORD')).toBe(false)
      expect(validator.test('123456')).toBe(false)
      expect(validator.test('')).toBe(true) // empty string is valid when optional
    })

    test('hasNumbers() should require numeric characters', () => {
      const validator = password().hasNumbers()
      expect(validator.test('password123')).toBe(true)
      expect(validator.test('123456')).toBe(true)
      expect(validator.test('Pass1')).toBe(true)
      expect(validator.test('password')).toBe(false)
      expect(validator.test('PASSWORD')).toBe(false)
      expect(validator.test('')).toBe(true) // empty string is valid when optional
    })

    test('hasSpecialCharacters() should require special characters', () => {
      const validator = password().hasSpecialCharacters()
      expect(validator.test('password!')).toBe(true)
      expect(validator.test('pass@word')).toBe(true)
      expect(validator.test('P@ss#123')).toBe(true)
      expect(validator.test('password123')).toBe(false)
      expect(validator.test('PASSWORD')).toBe(false)
      expect(validator.test('')).toBe(true) // empty string is valid when optional
    })
  })

  describe('matching validation', () => {
    test('matches() should validate password confirmation', () => {
      const originalPassword = 'MySecurePassword123'
      const validator = password().matches(originalPassword)

      expect(validator.test(originalPassword)).toBe(true)
      expect(validator.test('DifferentPassword123')).toBe(false)
      expect(validator.test('mysecurepassword123')).toBe(false) // case sensitive
      expect(validator.test('')).toBe(true) // empty string is valid when optional
    })

    test('should work with complex passwords', () => {
      const complexPassword = 'C0mpl3x!P@ssw0rd#2023'
      const validator = password().matches(complexPassword)

      expect(validator.test(complexPassword)).toBe(true)
      expect(validator.test('C0mpl3x!P@ssw0rd#2024')).toBe(false) // one char different
      expect(validator.test('c0mpl3x!p@ssw0rd#2023')).toBe(false) // case different
    })
  })

  describe('alphanumeric validation', () => {
    test('alphanumeric() should validate alphanumeric passwords', () => {
      const validator = password().alphanumeric()
      expect(validator.test('Password123')).toBe(true)
      expect(validator.test('abc123')).toBe(true)
      expect(validator.test('ABC123')).toBe(true)
      expect(validator.test('password')).toBe(false) // missing numbers
      expect(validator.test('123456')).toBe(false) // missing letters
      expect(validator.test('Password@123')).toBe(true) // allows special chars
      expect(validator.test('pass word')).toBe(false) // missing numbers
    })
  })

  describe('comprehensive password validation', () => {
    test('should validate strong password requirements', () => {
      const validator = password()
        .min(8)
        .max(20)
        .hasUppercase()
        .hasLowercase()
        .hasNumbers()
        .hasSpecialCharacters()

      // Valid strong passwords
      expect(validator.test('MySecure123!')).toBe(true)
      expect(validator.test('P@ssw0rd2023')).toBe(true)
      expect(validator.test('Str0ng#Pass')).toBe(true)

      // Invalid passwords
      expect(validator.test('weak')).toBe(false) // too short, missing requirements
      expect(validator.test('password123')).toBe(false) // no uppercase, no special
      expect(validator.test('PASSWORD123!')).toBe(false) // no lowercase
      expect(validator.test('Password!')).toBe(false) // no numbers
      expect(validator.test('Password123')).toBe(false) // no special characters
      expect(validator.test('VeryLongPasswordThatExceedsMaxLength123!')).toBe(false) // too long
    })

    test('should return detailed error messages', () => {
      const validator = password()
        .min(8)
        .hasUppercase()
        .hasNumbers()
        .hasSpecialCharacters()

      const result = validator.validate('weak')
      expect(result.valid).toBe(false)

      if (!result.valid && Array.isArray(result.errors)) {
        const errorMessages = result.errors.map(e => e.message)

        expect(errorMessages).toContain('Password must be at least 8 characters long')
        expect(errorMessages).toContain('Password must contain at least one uppercase letter')
        expect(errorMessages).toContain('Password must contain at least one number')
        expect(errorMessages).toContain('Password must contain at least one special character')
      }
    })
  })

  describe('chaining validations', () => {
    test('should chain length and character requirements', () => {
      const validator = password()
        .min(10)
        .max(15)
        .hasUppercase()
        .hasLowercase()
        .hasNumbers()

      expect(validator.test('MyPassword1')).toBe(true)
      expect(validator.test('ValidPass123')).toBe(true)
      expect(validator.test('short1')).toBe(false) // too short
      expect(validator.test('VeryLongPassword123')).toBe(false) // too long
      expect(validator.test('mypassword1')).toBe(false) // no uppercase
      expect(validator.test('MYPASSWORD1')).toBe(false) // no lowercase
      expect(validator.test('MyPassword')).toBe(false) // no numbers
    })

    test('should work with matching and requirements', () => {
      const originalPassword = 'SecurePass123!'
      const validator = password()
        .min(8)
        .hasUppercase()
        .hasNumbers()
        .hasSpecialCharacters()
        .matches(originalPassword)

      expect(validator.test(originalPassword)).toBe(true)
      expect(validator.test('DifferentPass123!')).toBe(false) // doesn't match
      expect(validator.test('securepass123!')).toBe(false) // matches but no uppercase
    })
  })

  describe('required and optional', () => {
    test('required() should reject empty values', () => {
      const validator = password().required()
      expect(validator.test('password')).toBe(true)
      expect(validator.test('')).toBe(false)
      expect(validator.test(null as any)).toBe(false)
      expect(validator.test(undefined as any)).toBe(false)
    })

    test('optional() should accept empty values', () => {
      const validator = password().optional()
      expect(validator.test('password')).toBe(true)
      expect(validator.test('')).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
    })

    test('should work with requirements when optional', () => {
      const validator = password().optional().min(8).hasUppercase()
      expect(validator.test('Password')).toBe(true)
      expect(validator.test('')).toBe(true) // optional
      expect(validator.test(null as any)).toBe(true) // optional
      expect(validator.test('short')).toBe(false) // too short
      expect(validator.test('password')).toBe(false) // no uppercase
    })
  })

  describe('edge cases', () => {
    test('should handle unicode characters', () => {
      const validator = password().min(8)
      expect(validator.test('pássword')).toBe(true)
      expect(validator.test('密码123456')).toBe(true)
      expect(validator.test('🔒secure')).toBe(true)
    })

    test('should handle special characters correctly', () => {
      const validator = password().hasSpecialCharacters()
      expect(validator.test('pass@word')).toBe(true)
      expect(validator.test('pass#word')).toBe(true)
      expect(validator.test('pass$word')).toBe(true)
      expect(validator.test('pass%word')).toBe(true)
      expect(validator.test('pass^word')).toBe(true)
      expect(validator.test('pass&word')).toBe(true)
      expect(validator.test('pass*word')).toBe(true)
      expect(validator.test('pass(word)')).toBe(true)
      expect(validator.test('pass-word')).toBe(false) // dash is not in the special character set
      expect(validator.test('pass_word')).toBe(false) // underscore is not in the special character set
      expect(validator.test('pass+word')).toBe(false) // + is not in the special character set
      expect(validator.test('pass=word')).toBe(false) // = is not in the special character set
      expect(validator.test('pass[word]')).toBe(false) // [ is not in the special character set
      expect(validator.test('pass{word}')).toBe(true)
      expect(validator.test('pass|word')).toBe(true)
      expect(validator.test('pass\\word')).toBe(false) // \ is not in the special character set
      expect(validator.test('pass:word')).toBe(true)
      expect(validator.test('pass;word')).toBe(false) // ; is not in the special character set
      expect(validator.test('pass"word"')).toBe(true)
      expect(validator.test('pass\'word\'')).toBe(false) // ' is not in the special character set
      expect(validator.test('pass<word>')).toBe(true)
      expect(validator.test('pass,word')).toBe(true)
      expect(validator.test('pass.word')).toBe(true)
      expect(validator.test('pass?word')).toBe(true)
      expect(validator.test('pass/word')).toBe(false) // / is not in the special character set
      expect(validator.test('pass~word')).toBe(false) // ~ is not in the special character set
      expect(validator.test('pass`word')).toBe(false) // ` is not in the special character set
      expect(validator.test('pass!word')).toBe(true)
    })

    test('should handle whitespace', () => {
      const validator = password().min(8)
      expect(validator.test('pass word')).toBe(true)
      expect(validator.test('  password  ')).toBe(true)
      expect(validator.test('pass\tword')).toBe(true)
      expect(validator.test('pass\nword')).toBe(true)
    })

    test('should handle empty requirements correctly', () => {
      const validator = password().matches('')
      expect(validator.test('')).toBe(true)
      expect(validator.test('anything')).toBe(false)
    })
  })

  describe('validation results', () => {
    test('should return detailed validation results', () => {
      const validator = password().min(10)
      const result = validator.validate('short')
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors[0].message).toContain('at least 10 characters')
      }
    })

    test('should return multiple errors for multiple failed validations', () => {
      const validator = password().min(10).hasUppercase().hasNumbers()
      const result = validator.validate('short')
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors.length).toBe(3) // min length + uppercase + numbers
      }
    })
  })
})
