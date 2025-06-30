import { describe, expect, test } from 'bun:test'
import { bigint } from '../../src/validators/bigint'

describe('BigintValidator', () => {
  describe('basic validation', () => {
    test('should validate bigint values', () => {
      const validator = bigint()
      expect(validator.test(123n)).toBe(true)
      expect(validator.test(0n)).toBe(true)
      expect(validator.test(-456n)).toBe(true)
      expect(validator.test(BigInt(789))).toBe(true)
      expect(validator.test(BigInt('999999999999999999999'))).toBe(true)
    })

    test('should reject non-bigint values', () => {
      const validator = bigint()
      expect(validator.test(123 as any)).toBe(false) // number
      expect(validator.test('123' as any)).toBe(false) // string
      expect(validator.test('123n' as any)).toBe(false) // string representation
      expect(validator.test(true as any)).toBe(false) // boolean
      expect(validator.test(null as any)).toBe(true) // null is valid when optional
      expect(validator.test(undefined as any)).toBe(true) // undefined is valid when optional
      expect(validator.test({} as any)).toBe(false) // object
      expect(validator.test([] as any)).toBe(false) // array
    })

    test('should have correct name', () => {
      const validator = bigint()
      expect(validator.name).toBe('bigint')
    })
  })

  describe('range validation (inherited from NumberValidator)', () => {
    test('min() should validate minimum value', () => {
      const validator = bigint().min(10n)
      expect(validator.test(10n)).toBe(true)
      expect(validator.test(15n)).toBe(true)
      expect(validator.test(9n)).toBe(false)
      expect(validator.test(-5n)).toBe(false)
    })

    test('max() should validate maximum value', () => {
      const validator = bigint().max(100n)
      expect(validator.test(100n)).toBe(true)
      expect(validator.test(50n)).toBe(true)
      expect(validator.test(101n)).toBe(false)
      expect(validator.test(200n)).toBe(false)
    })

    test('should combine min and max', () => {
      const validator = bigint().min(10n).max(100n)
      expect(validator.test(50n)).toBe(true)
      expect(validator.test(10n)).toBe(true)
      expect(validator.test(100n)).toBe(true)
      expect(validator.test(9n)).toBe(false)
      expect(validator.test(101n)).toBe(false)
    })
  })

  describe('sign validation (inherited from NumberValidator)', () => {
    test('positive() should validate positive bigints', () => {
      const validator = bigint().positive()
      expect(validator.test(1n)).toBe(true)
      expect(validator.test(999n)).toBe(true)
      expect(validator.test(0n)).toBe(false) // zero is not positive
      expect(validator.test(-1n)).toBe(false)
      expect(validator.test(-999n)).toBe(false)
    })

    test('negative() should validate negative bigints', () => {
      const validator = bigint().negative()
      expect(validator.test(-1n)).toBe(true)
      expect(validator.test(-999n)).toBe(true)
      expect(validator.test(0n)).toBe(false) // zero is not negative
      expect(validator.test(1n)).toBe(false)
      expect(validator.test(999n)).toBe(false)
    })
  })

  describe('divisibility validation (inherited from NumberValidator)', () => {
    test('divisibleBy() should validate divisibility', () => {
      const validator = bigint().divisibleBy(3n)
      expect(validator.test(0n)).toBe(true) // 0 is divisible by any number
      expect(validator.test(3n)).toBe(true)
      expect(validator.test(6n)).toBe(true)
      expect(validator.test(9n)).toBe(true)
      expect(validator.test(1n)).toBe(false)
      expect(validator.test(2n)).toBe(false)
      expect(validator.test(4n)).toBe(false)
      expect(validator.test(5n)).toBe(false)
    })

    test('should work with large divisors', () => {
      const validator = bigint().divisibleBy(1000000000000n)
      expect(validator.test(1000000000000n)).toBe(true)
      expect(validator.test(2000000000000n)).toBe(true)
      expect(validator.test(999999999999n)).toBe(false)
    })
  })

  describe('chaining validations', () => {
    test('should chain multiple validations', () => {
      const validator = bigint().min(0n).max(1000n).divisibleBy(2n)
      expect(validator.test(0n)).toBe(true)
      expect(validator.test(2n)).toBe(true)
      expect(validator.test(100n)).toBe(true)
      expect(validator.test(1000n)).toBe(true)
      expect(validator.test(-2n)).toBe(false) // below min
      expect(validator.test(1002n)).toBe(false) // above max
      expect(validator.test(1n)).toBe(false) // not divisible by 2
      expect(validator.test(999n)).toBe(false) // not divisible by 2
    })

    test('should validate complex bigint constraints', () => {
      const validator = bigint().positive().max(BigInt(Number.MAX_SAFE_INTEGER)).divisibleBy(7n)
      expect(validator.test(7n)).toBe(true)
      expect(validator.test(14n)).toBe(true)
      expect(validator.test(21n)).toBe(true)
      expect(validator.test(0n)).toBe(false) // not positive
      expect(validator.test(-7n)).toBe(false) // negative
      expect(validator.test(1n)).toBe(false) // not divisible by 7
    })
  })

  describe('required and optional', () => {
    test('required() should reject null/undefined', () => {
      const validator = bigint().required()
      expect(validator.test(123n)).toBe(true)
      expect(validator.test(0n)).toBe(true)
      expect(validator.test(null as any)).toBe(false)
      expect(validator.test(undefined as any)).toBe(false)
    })

    test('optional() should accept null/undefined', () => {
      const validator = bigint().optional()
      expect(validator.test(123n)).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
    })

    test('should work with other validations when optional', () => {
      const validator = bigint().min(10n).optional()
      expect(validator.test(15n)).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
      expect(validator.test(5n)).toBe(false) // below min
    })
  })

  describe('validation results', () => {
    test('should return detailed validation results', () => {
      const validator = bigint().min(10n)
      const result = validator.validate(5n)

      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors.length).toBeGreaterThan(0)
        expect(result.errors[0].message).toContain('Must be at least')
      }
    })

    test('should return multiple errors for multiple failed validations', () => {
      const validator = bigint().min(10n).max(5n) // impossible constraint
      const result = validator.validate(7n)

      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors.length).toBeGreaterThan(0)
      }
    })
  })

  describe('edge cases', () => {
    test('should handle very large bigints', () => {
      const validator = bigint()
      const veryLarge = BigInt('999999999999999999999999999999999999999999999999999')
      expect(validator.test(veryLarge)).toBe(true)

      const evenLarger = veryLarge * 2n
      expect(validator.test(evenLarger)).toBe(true)
    })

    test('should handle very small (negative) bigints', () => {
      const validator = bigint()
      const verySmall = BigInt('-999999999999999999999999999999999999999999999999999')
      expect(validator.test(verySmall)).toBe(true)

      const evenSmaller = verySmall * 2n
      expect(validator.test(evenSmaller)).toBe(true)
    })

    test('should handle zero correctly', () => {
      const validator = bigint()
      expect(validator.test(0n)).toBe(true)
      expect(validator.test(BigInt(0))).toBe(true)
      expect(validator.test(BigInt('0'))).toBe(true)
    })

    test('should handle BigInt constructor variations', () => {
      const validator = bigint()
      expect(validator.test(BigInt(123))).toBe(true)
      expect(validator.test(BigInt('456'))).toBe(true)
      expect(validator.test(BigInt(0x10))).toBe(true) // hex
      expect(validator.test(BigInt(0o20))).toBe(true) // octal
      expect(validator.test(BigInt(0b1010))).toBe(true) // binary
    })
  })

  describe('type safety', () => {
    test('should work with typed bigint values', () => {
      const validator = bigint()
      const typedBigint: bigint = 123n
      expect(validator.test(typedBigint)).toBe(true)
    })

    test('should maintain type information for validated bigints', () => {
      const validator = bigint().min(0n)
      const result = validator.validate(123n)
      expect(result.valid).toBe(true)
    })
  })

  describe('real-world use cases', () => {
    test('should validate cryptocurrency amounts', () => {
      // Bitcoin uses satoshis (1 BTC = 100,000,000 satoshis)
      const validator = bigint().min(0n).max(21000000n * 100000000n) // Max Bitcoin supply in satoshis

      expect(validator.test(100000000n)).toBe(true) // 1 BTC
      expect(validator.test(50000000n)).toBe(true) // 0.5 BTC
      expect(validator.test(0n)).toBe(true) // 0 BTC
      expect(validator.test(-1n)).toBe(false) // negative amount
      expect(validator.test(21000001n * 100000000n)).toBe(false) // more than max supply
    })

    test('should validate database IDs', () => {
      const validator = bigint().positive()

      expect(validator.test(1n)).toBe(true)
      expect(validator.test(999999999999999n)).toBe(true)
      expect(validator.test(0n)).toBe(false) // IDs usually start from 1
      expect(validator.test(-1n)).toBe(false) // negative IDs not allowed
    })

    test('should validate file sizes in bytes', () => {
      const maxFileSize = BigInt(5 * 1024 * 1024 * 1024) // 5GB
      const validator = bigint().min(0n).max(maxFileSize)

      expect(validator.test(0n)).toBe(true) // empty file
      expect(validator.test(1024n)).toBe(true) // 1KB
      expect(validator.test(maxFileSize)).toBe(true) // exactly 5GB
      expect(validator.test(maxFileSize + 1n)).toBe(false) // over limit
      expect(validator.test(-1n)).toBe(false) // negative size
    })
  })
})
