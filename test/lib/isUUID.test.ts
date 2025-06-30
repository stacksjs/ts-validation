import { describe, expect, test } from 'bun:test'
import isUUID from '../../src/lib/isUUID'

describe('isUUID', () => {
  describe('Basic UUID validation', () => {
    test('should validate UUIDs without specifying version', () => {
      expect(isUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
      expect(isUUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(true)
      expect(isUUID('6ba7b811-9dad-11d1-80b4-00c04fd430c8')).toBe(true)
      expect(isUUID('550e8400-e29b-41d4-a716-446655440000'.toUpperCase())).toBe(true)
    })

    test('should reject invalid UUID formats', () => {
      expect(isUUID('not-a-uuid')).toBe(false)
      expect(isUUID('550e8400-e29b-41d4-a716')).toBe(false)
      expect(isUUID('550e8400-e29b-41d4-a716-446655440000-extra')).toBe(false)
      expect(isUUID('550e8400e29b41d4a716446655440000')).toBe(false) // missing hyphens
      expect(isUUID('550e8400-e29b-41d4-a716-44665544000g')).toBe(false) // invalid character
      expect(isUUID('')).toBe(false)
    })

    test('should handle case insensitivity', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000'
      expect(isUUID(uuid.toLowerCase())).toBe(true)
      expect(isUUID(uuid.toUpperCase())).toBe(true)
      expect(isUUID('550E8400-e29b-41D4-A716-446655440000')).toBe(true)
    })
  })

  describe('UUID version 1', () => {
    test('should validate valid UUID v1', () => {
      expect(isUUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8', '1')).toBe(true)
      expect(isUUID('6ba7b811-9dad-11d1-80b4-00c04fd430c8', '1')).toBe(true)
      expect(isUUID('12345678-1234-1234-8234-123456789012', '1')).toBe(true)
    })

    test('should reject invalid UUID v1', () => {
      expect(isUUID('6ba7b810-9dad-21d1-80b4-00c04fd430c8', '1')).toBe(false) // wrong version
      expect(isUUID('6ba7b810-9dad-31d1-80b4-00c04fd430c8', '1')).toBe(false) // wrong version
      expect(isUUID('6ba7b810-9dad-41d1-80b4-00c04fd430c8', '1')).toBe(false) // wrong version
    })
  })

  describe('UUID version 2', () => {
    test('should validate valid UUID v2', () => {
      expect(isUUID('6ba7b810-9dad-22d1-80b4-00c04fd430c8', '2')).toBe(true)
      expect(isUUID('12345678-1234-2234-8234-123456789012', '2')).toBe(true)
    })

    test('should reject invalid UUID v2', () => {
      expect(isUUID('6ba7b810-9dad-12d1-80b4-00c04fd430c8', '2')).toBe(false) // wrong version
      expect(isUUID('6ba7b810-9dad-32d1-80b4-00c04fd430c8', '2')).toBe(false) // wrong version
    })
  })

  describe('UUID version 3', () => {
    test('should validate valid UUID v3', () => {
      expect(isUUID('6ba7b810-9dad-32d1-80b4-00c04fd430c8', '3')).toBe(true)
      expect(isUUID('12345678-1234-3234-8234-123456789012', '3')).toBe(true)
    })

    test('should reject invalid UUID v3', () => {
      expect(isUUID('6ba7b810-9dad-12d1-80b4-00c04fd430c8', '3')).toBe(false) // wrong version
      expect(isUUID('6ba7b810-9dad-42d1-80b4-00c04fd430c8', '3')).toBe(false) // wrong version
    })
  })

  describe('UUID version 4', () => {
    test('should validate valid UUID v4', () => {
      expect(isUUID('550e8400-e29b-41d4-a716-446655440000', '4')).toBe(true)
      expect(isUUID('6ba7b810-9dad-42d1-80b4-00c04fd430c8', '4')).toBe(true)
      expect(isUUID('12345678-1234-4234-8234-123456789012', '4')).toBe(true)
    })

    test('should reject invalid UUID v4', () => {
      expect(isUUID('6ba7b810-9dad-12d1-80b4-00c04fd430c8', '4')).toBe(false) // wrong version
      expect(isUUID('6ba7b810-9dad-52d1-80b4-00c04fd430c8', '4')).toBe(false) // wrong version
    })
  })

  describe('UUID version 5', () => {
    test('should validate valid UUID v5', () => {
      expect(isUUID('6ba7b810-9dad-52d1-80b4-00c04fd430c8', '5')).toBe(true)
      expect(isUUID('12345678-1234-5234-8234-123456789012', '5')).toBe(true)
    })

    test('should reject invalid UUID v5', () => {
      expect(isUUID('6ba7b810-9dad-42d1-80b4-00c04fd430c8', '5')).toBe(false) // wrong version
      expect(isUUID('6ba7b810-9dad-62d1-80b4-00c04fd430c8', '5')).toBe(false) // wrong version
    })
  })

  describe('UUID version 6', () => {
    test('should validate valid UUID v6', () => {
      expect(isUUID('6ba7b810-9dad-62d1-80b4-00c04fd430c8', '6')).toBe(true)
      expect(isUUID('12345678-1234-6234-8234-123456789012', '6')).toBe(true)
    })

    test('should reject invalid UUID v6', () => {
      expect(isUUID('6ba7b810-9dad-52d1-80b4-00c04fd430c8', '6')).toBe(false) // wrong version
      expect(isUUID('6ba7b810-9dad-72d1-80b4-00c04fd430c8', '6')).toBe(false) // wrong version
    })
  })

  describe('UUID version 7', () => {
    test('should validate valid UUID v7', () => {
      expect(isUUID('6ba7b810-9dad-72d1-80b4-00c04fd430c8', '7')).toBe(true)
      expect(isUUID('12345678-1234-7234-8234-123456789012', '7')).toBe(true)
    })

    test('should reject invalid UUID v7', () => {
      expect(isUUID('6ba7b810-9dad-62d1-80b4-00c04fd430c8', '7')).toBe(false) // wrong version
      expect(isUUID('6ba7b810-9dad-82d1-80b4-00c04fd430c8', '7')).toBe(false) // wrong version
    })
  })

  describe('UUID version 8', () => {
    test('should validate valid UUID v8', () => {
      expect(isUUID('6ba7b810-9dad-82d1-80b4-00c04fd430c8', '8')).toBe(true)
      expect(isUUID('12345678-1234-8234-8234-123456789012', '8')).toBe(true)
    })

    test('should reject invalid UUID v8', () => {
      expect(isUUID('6ba7b810-9dad-72d1-80b4-00c04fd430c8', '8')).toBe(false) // wrong version
      expect(isUUID('6ba7b810-9dad-92d1-80b4-00c04fd430c8', '8')).toBe(false) // wrong version
    })
  })

  describe('Special UUID formats', () => {
    test('should validate nil UUID', () => {
      expect(isUUID('00000000-0000-0000-0000-000000000000', 'nil')).toBe(true)
      expect(isUUID('00000000-0000-0000-0000-000000000000')).toBe(true) // should work with 'all'
    })

    test('should validate max UUID', () => {
      expect(isUUID('ffffffff-ffff-ffff-ffff-ffffffffffff', 'max')).toBe(true)
      expect(isUUID('FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF', 'max')).toBe(true)
      expect(isUUID('ffffffff-ffff-ffff-ffff-ffffffffffff')).toBe(true) // should work with 'all'
    })

    test('should reject non-nil/max UUIDs for nil/max validation', () => {
      expect(isUUID('550e8400-e29b-41d4-a716-446655440000', 'nil')).toBe(false)
      expect(isUUID('550e8400-e29b-41d4-a716-446655440000', 'max')).toBe(false)
      expect(isUUID('00000000-0000-0000-0000-000000000001', 'nil')).toBe(false)
      expect(isUUID('fffffffe-ffff-ffff-ffff-ffffffffffff', 'max')).toBe(false)
    })
  })

  describe('Loose UUID validation', () => {
    test('should validate any format UUID with loose validation', () => {
      expect(isUUID('550e8400-e29b-41d4-a716-446655440000', 'loose')).toBe(true)
      expect(isUUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'loose')).toBe(true)
      expect(isUUID('12345678-1234-5234-a234-123456789012', 'loose')).toBe(true)
      expect(isUUID('87654321-4321-6789-b987-210987654321', 'loose')).toBe(true)
    })

    test('should reject invalid formats even with loose validation', () => {
      expect(isUUID('not-a-uuid', 'loose')).toBe(false)
      expect(isUUID('550e8400-e29b-41d4-a716', 'loose')).toBe(false)
      expect(isUUID('550e8400e29b41d4a716446655440000', 'loose')).toBe(false) // missing hyphens
    })
  })

  describe('Version parameter handling', () => {
    test('should handle null and undefined version parameters', () => {
      expect(isUUID('550e8400-e29b-41d4-a716-446655440000', null as any)).toBe(true)
      expect(isUUID('550e8400-e29b-41d4-a716-446655440000', undefined)).toBe(true)
      expect(isUUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(true) // no version parameter
    })

    test('should return false for invalid version parameters', () => {
      expect(isUUID('550e8400-e29b-41d4-a716-446655440000', '9')).toBe(false)
      expect(isUUID('550e8400-e29b-41d4-a716-446655440000', 'invalid')).toBe(false)
      expect(isUUID('550e8400-e29b-41d4-a716-446655440000', '0')).toBe(false)
    })
  })

  describe('Edge cases', () => {
    test('should handle mixed case UUIDs', () => {
      expect(isUUID('550E8400-e29b-41D4-A716-446655440000')).toBe(true)
      expect(isUUID('6BA7B810-9dad-11d1-80B4-00c04fd430c8', '1')).toBe(true)
      expect(isUUID('FFFFFFFF-ffff-FFFF-ffff-FFFFFFFFFFFF', 'max')).toBe(true)
    })

    test('should handle whitespace', () => {
      expect(isUUID(' 550e8400-e29b-41d4-a716-446655440000 ')).toBe(false)
      expect(isUUID('550e8400-e29b-41d4-a716-446655440000 ')).toBe(false)
      expect(isUUID(' 550e8400-e29b-41d4-a716-446655440000')).toBe(false)
    })

    test('should handle variant bits correctly', () => {
      // Valid variant bits (8, 9, A, B in 4th group)
      expect(isUUID('550e8400-e29b-41d4-8716-446655440000')).toBe(true)
      expect(isUUID('550e8400-e29b-41d4-9716-446655440000')).toBe(true)
      expect(isUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
      expect(isUUID('550e8400-e29b-41d4-b716-446655440000')).toBe(true)
    })

    test('should validate with different hyphen positions', () => {
      // All these should be invalid due to wrong hyphen positions
      expect(isUUID('550e8400e29b-41d4-a716-446655440000')).toBe(false)
      expect(isUUID('550e8400-e29b41d4-a716-446655440000')).toBe(false)
      expect(isUUID('550e8400-e29b-41d4a716-446655440000')).toBe(false)
      expect(isUUID('550e8400-e29b-41d4-a716446655440000')).toBe(false)
    })
  })

  describe('Real-world use cases', () => {
    test('should validate database primary keys', () => {
      // Common UUID v4 patterns used in databases
      expect(isUUID('f47ac10b-58cc-4372-a567-0e02b2c3d479', '4')).toBe(true)
      expect(isUUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8', '1')).toBe(true)
      expect(isUUID('6ba7b811-9dad-11d1-80b4-00c04fd430c8', '1')).toBe(true)
    })

    test('should validate API request IDs', () => {
      // UUIDs commonly used in API requests
      expect(isUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
      expect(isUUID('12345678-1234-4234-8234-123456789012', '4')).toBe(true)
    })

    test('should validate session IDs', () => {
      // Session IDs are typically UUID v4
      expect(isUUID('a1b2c3d4-e5f6-4789-8abc-123456789012', '4')).toBe(true)
      expect(isUUID('f1e2d3c4-b5a6-4978-8cba-210987654321', '4')).toBe(true)
    })

    test('should validate file identifiers', () => {
      // File systems often use UUIDs for unique identifiers
      expect(isUUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(true)
      expect(isUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
    })

    test('should validate namespace UUIDs', () => {
      // Namespace UUIDs are typically v3 or v5
      expect(isUUID('6ba7b810-9dad-32d1-80b4-00c04fd430c8', '3')).toBe(true)
      expect(isUUID('6ba7b810-9dad-52d1-80b4-00c04fd430c8', '5')).toBe(true)
    })
  })

  describe('Error handling', () => {
    test('should throw error for non-string input', () => {
      expect(() => isUUID(123 as any)).toThrow('Expected a string but received a number')
      expect(() => isUUID(null as any)).toThrow('Expected a string but received a null')
      expect(() => isUUID(undefined as any)).toThrow('Expected a string but received a undefined')
      expect(() => isUUID({} as any)).toThrow('Expected a string but received a Object')
      expect(() => isUUID([] as any)).toThrow('Expected a string but received a Array')
    })
  })
})
